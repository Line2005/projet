import React, {useEffect, useState} from 'react';
import {
    FileText, HelpCircle, Info, Users, Settings, LogOut,
    Menu, X, Search, MessageSquare, Send, ChevronLeft, Bell, ClipboardCheck
} from 'lucide-react';
import { logoutUser } from "../../../Services/auth.js";
import {NotificationDropdown} from "./components/NotificationDropdown.jsx";
import {SidebarLink} from "./components/SideBarLink.jsx";
import {ConversationItem} from "./components/ConversationItem.jsx";
import {ChatMessage} from "./components/ChatMessage.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import api from "../../../Services/api.js";

const ChatPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have an incoming conversation from help request
        if (location.state?.selectedConversation) {
            const incomingConversation = location.state.selectedConversation;
            setSelectedChat(incomingConversation);
            handleSelectChat(incomingConversation);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    useEffect(() => {
        fetchConversations();
        // Set up polling for new conversations/messages
        const pollInterval = setInterval(fetchConversations, 30000); // Poll every 30 seconds
        return () => clearInterval(pollInterval);
    }, []);

    // Add console log to debug the selected chat data structure
    useEffect(() => {
        if (selectedChat) {
            console.log('Selected Chat Data:', selectedChat);
        }
    }, [selectedChat]);

    useEffect(() => {
        // Calculate total notifications whenever conversations change
        const total = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
        setTotalNotifications(total);
    }, [conversations]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await api.get('/conversations/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.status === 401) {
                // Handle unauthorized access
                navigate('/login');
                return;
            }

            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', {
                error,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });

            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleSelectChat = async (conversation) => {
        if (!conversation?.id) {
            console.error('Invalid conversation object:', conversation);
            return;
        }

        // Close existing WebSocket before changing the selected chat
        if (socket) {
            socket.close();
            setSocket(null);
        }

        setSelectedChat(conversation);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await api.get(`/conversations/${conversation.id}/messages/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            setMessages(response.data);

            const newSocket = setupWebSocket(conversation);
            setSocket(newSocket);
        } catch (error) {
            console.error('Error fetching messages:', {
                error,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });

            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const setupWebSocket = (conversation) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No authentication token found');
            return null;
        }
        // Determine WebSocket protocol based on HTTP protocol
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // Get the backend host
        // This uses the current host, assuming your WebSocket server is on the same host
        // Adjust if your WebSocket server is on a different host or port
        const host = window.location.host;

        // For development with React's dev server, we need to specify the backend port
        const isDevMode = process.env.NODE_ENV === 'development';
        const backendHost = isDevMode ? '127.0.0.1:8000' : host;

        // Construct WebSocket URL
        const wsUrl = `${wsProtocol}//${backendHost}/ws/chat/${conversation.id}/?token=${token}`;

        console.log('Connecting to WebSocket:', wsUrl);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log(`WebSocket connected for conversation ${conversation.id}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Handle different message types
                if (data.error) {
                    console.error('WebSocket error message:', data.error);
                    return;
                }

                if (data.type === 'user_joined' || data.type === 'user_left') {
                    console.log(`User ${data.username} ${data.type}`);
                    return;
                }

                // Handle regular chat messages
                setMessages(prevMessages => [...prevMessages, {
                    id: data.id || Date.now(), // Use timestamp as fallback ID
                    content: data.message,
                    timestamp: data.timestamp,
                    is_sender: data.is_sender
                }]);

                fetchConversations();
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        ws.onclose = (event) => {
            console.log(`WebSocket disconnected for conversation ${conversation.id}`, event);
            console.log(`Close code: ${event.code}, reason: ${event.reason || 'No reason provided'}`);

        };

        // Add more comprehensive reconnection logic
        ws.onclose = (event) => {
            console.log(`WebSocket disconnected for conversation ${conversation.id}`, event);

            if (event.code === 1006) {
                console.log("Abnormal closure - server might be down or network issue");
            } else if (event.code === 4003) {
                console.log("Authentication required");
                navigate('/login');
                return; // Don't attempt reconnect if auth failed
            }

            // Only attempt reconnection for certain codes
            if (![1000, 1001].includes(event.code)) {
                attemptReconnect(conversation, 0);
            }
        };

        return ws;
    };

    const attemptReconnect = (conversation, attempt = 0) => {
        const maxAttempts = 5;
        const backoff = Math.min(30, Math.pow(2, attempt)) * 1000; // Exponential backoff with max 30 seconds

        if (attempt >= maxAttempts) {
            console.log(`Maximum reconnection attempts (${maxAttempts}) reached for conversation ${conversation.id}`);
            return;
        }

        console.log(`Attempting to reconnect (attempt ${attempt + 1}/${maxAttempts}) in ${backoff/1000} seconds...`);

        setTimeout(() => {
            // Only reconnect if this is still the selected chat
            if (selectedChat && selectedChat.id === conversation.id) {
                handleSelectChat(conversation);
            }
        }, backoff);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat || !socket) return;

        try {
            socket.send(JSON.stringify({
                message: newMessage,
                conversation_id: selectedChat.id,
            }));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message through WebSocket:', error);
        }
    };

    // Helper function to safely get entrepreneur name
    const getEntrepreneurName = (chat) => {
        if (!chat?.help_request) {
            return 'Unknown User';
        }

        // Case 1: Path from API response structure as seen in screenshots
        if (chat.help_request.entrepreneur_details?.name) {
            return chat.help_request.entrepreneur_details.name;
        }

        // Case 2: Original expected path (might not exist)
        const entrepreneur = chat.help_request.entrepreneur;
        if (typeof entrepreneur === 'object' && entrepreneur?.first_name && entrepreneur?.last_name) {
            return `${entrepreneur.first_name} ${entrepreneur.last_name}`;
        }

        // Case 3: User object path (might not exist)
        if (entrepreneur?.user?.first_name && entrepreneur?.user?.last_name) {
            return `${entrepreneur.user.first_name} ${entrepreneur.user.last_name}`;
        }

        // Fallback
        return 'Unknown User';
    };

// Helper function to safely get project name
    const getProjectName = (chat) => {
        if (!chat?.help_request) {
            return 'Untitled Project';
        }

        // Case 1: From project_details in API response
        if (chat.help_request.project_details?.project_name) {
            return chat.help_request.project_details.project_name;
        }

        // Case 2: Original expected path
        if (chat.help_request.project?.name) {
            return chat.help_request.project.name;
        }

        // Case 3: Project object directly in help_request
        if (chat.help_request.project?.project_name) {
            return chat.help_request.project.project_name;
        }

        // Fallback
        return 'Untitled Project';
    };

    const getFilteredConversations = () => {
        return conversations.filter(conversation => {
            try {
                const searchLower = searchQuery.toLowerCase();

                // Safely get entrepreneur name
                let entrepreneurName = '';
                if (conversation?.help_request?.entrepreneur) {
                    const entrepreneur = conversation.help_request.entrepreneur;
                    entrepreneurName = `${entrepreneur.first_name || ''} ${entrepreneur.last_name || ''}`;

                    // If that's empty, try the user property
                    if (!entrepreneurName.trim() && entrepreneur.user) {
                        entrepreneurName = `${entrepreneur.user.first_name || ''} ${entrepreneur.user.last_name || ''}`;
                    }
                }

                // Safely get project name
                let projectName = '';
                if (conversation?.help_request?.project?.name) {
                    projectName = conversation.help_request.project.name;
                }

                // Only filter if we have a search query
                if (!searchLower) return true;

                return (
                    entrepreneurName.toLowerCase().includes(searchLower) ||
                    projectName.toLowerCase().includes(searchLower)
                );
            } catch (err) {
                console.error("Error filtering conversation:", err, conversation);
                return false; // Skip this conversation if there's an error
            }
        });
    };
    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logoutUser();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Header */}
            <div
                className="lg:pl-64 fixed top-0 right-0 left-0 z-40 bg-white border-b h-16 flex items-center justify-between px-4 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
                        >
                            <Bell className="h-6 w-6 text-gray-600"/>
                            {totalNotifications > 0 && (
                                <span
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalNotifications}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <NotificationDropdown
                                notifications={conversations.filter(conv => conv.unread_count > 0)}
                                onClose={() => setShowNotifications(false)}
                                onConversationClick={handleSelectChat}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 shadow-xl`}>
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8 flex items-center">
                        <FileText className="h-6 w-6 mr-2"/>
                        EcoCommunity
                    </h2>
                    <nav className="space-y-2">
                        <SidebarLink href="/investors/project" icon={FileText}>Projets</SidebarLink>
                        <SidebarLink href="/investors/messages" icon={MessageSquare} isActive>Messages</SidebarLink>
                        <SidebarLink href="/investors/proposals" icon={HelpCircle}>Proposition d'aide</SidebarLink>
                        <SidebarLink href="/investors/opportunity" icon={Info}>Annonces</SidebarLink>
                        <SidebarLink href="/investors/registration-info" icon={ClipboardCheck}>Info Inscription</SidebarLink>
                        <SidebarLink href="/investors/collaborators" icon={Users}>Collaborateurs</SidebarLink>
                        <SidebarLink href="/investors/settings" icon={Settings}>Paramètres</SidebarLink>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center space-x-3 text-emerald-100 hover:bg-red-500/20 w-full px-4 py-3 rounded-lg transition-colors duration-200"
                    >
                        <LogOut className="h-5 w-5"/>
                        <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64 pt-16">
                <div className="h-[calc(100vh-64px)] flex">
                    {/* Conversations List */}
                    <div className={`w-full lg:w-1/3 bg-white border-r ${selectedChat ? 'hidden lg:block' : ''}`}>
                        <div className="p-4 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher une conversation..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                        </div>

                        <div className="overflow-y-auto h-[calc(100vh-180px)]">
                            {getFilteredConversations().map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    isSelected={selectedChat?.id === conversation.id}
                                    onClick={() => handleSelectChat(conversation)}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    {selectedChat ? (
                        <div className="w-full lg:w-2/3 flex flex-col">
                            {/* Chat Header */}
                            <div className="p-4 border-b bg-white flex items-center shadow-sm">
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="lg:hidden mr-4 hover:bg-gray-100 p-1 rounded-full transition-colors duration-200"
                                >
                                    <ChevronLeft className="h-6 w-6"/>
                                </button>
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        {getEntrepreneurName(selectedChat)}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {getProjectName(selectedChat)}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((message, index) => (
                                    <ChatMessage
                                        key={`${message.id}-${index}`} // Use index as part of the key
                                        message={message}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 bg-white border-t shadow-lg">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrivez votre message..."
                                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                                            newMessage.trim()
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Send className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:flex w-2/3 items-center justify-center bg-gray-50">
                            <div className="text-center p-8 rounded-lg bg-white shadow-sm">
                                <MessageSquare className="h-16 w-16 text-emerald-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Sélectionnez une conversation
                                </h3>
                                <p className="text-gray-600">
                                    Choisissez une conversation pour commencer à discuter
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default ChatPage;
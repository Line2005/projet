import React, { useState } from 'react';
import {
    FileText, HelpCircle, Info, Users, Settings, LogOut,
    Menu, X, Search, MessageSquare, Send, ChevronLeft, Bell
} from 'lucide-react';
import { logoutUser } from "../../../Services/auth.js";
import {NotificationDropdown} from "./components/NotificationDropdown.jsx";
import {SidebarLink} from "./components/SideBarLink.jsx";
import {ConversationItem} from "./components/ConversationItem.jsx";
import {ChatMessage} from "./components/ChatMessage.jsx";

const ChatPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const totalNotifications = MOCK_CONVERSATIONS.reduce(
        (sum, conv) => sum + conv.entrepreneur.unreadCount,
        0
    );

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        const newMsg = {
            id: messages.length + 1,
            content: newMessage,
            timestamp: new Date().toISOString(),
            is_sender: true
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const handleSelectChat = (conversation) => {
        setSelectedChat(conversation);
        setMessages(MOCK_MESSAGES[conversation.id] || []);
        setIsMobileMenuOpen(false);
    };

    const getFilteredConversations = () => {
        return MOCK_CONVERSATIONS.filter(conversation => {
            const searchLower = searchQuery.toLowerCase();
            return (
                conversation.entrepreneur.name.toLowerCase().includes(searchLower) ||
                conversation.project.name.toLowerCase().includes(searchLower)
            );
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
            <div className="lg:pl-64 fixed top-0 right-0 left-0 z-40 bg-white border-b h-16 flex items-center justify-between px-4 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
                        >
                            <Bell className="h-6 w-6 text-gray-600" />
                            {totalNotifications > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalNotifications}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <NotificationDropdown
                                notifications={MOCK_CONVERSATIONS.filter(conv => conv.entrepreneur.unreadCount > 0)}
                                onClose={() => setShowNotifications(false)}
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
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
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
                                        {selectedChat.entrepreneur.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {selectedChat.project.name}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
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

// Mock data
const MOCK_CONVERSATIONS = [
    {
        id: 1,
        entrepreneur: {
            name: "Marie Durant",
            avatar: "/api/placeholder/40/40",
            unreadCount: 2
        },
        project: { name: "Eco-Friendly Packaging" },
        last_message: "Je vous envoie les derniers prototypes demain matin.",
        last_message_date: "2025-02-14T10:30:00",
        online: true
    },
    {
        id: 2,
        entrepreneur: {
            name: "Thomas Bernard",
            avatar: "/api/placeholder/40/40",
            unreadCount: 0
        },
        project: { name: "Solar Energy Solutions" },
        last_message: "Merci pour vos conseils sur le business plan.",
        last_message_date: "2025-02-14T09:15:00",
        online: false
    },
    {
        id: 3,
        entrepreneur: {
            name: "Sophie Martin",
            avatar: "/api/placeholder/40/40",
            unreadCount: 3
        },
        project: { name: "Bio Food Market" },
        last_message: "Pouvons-nous organiser une réunion la semaine prochaine?",
        last_message_date: "2025-02-13T16:45:00",
        online: true
    }
];

const MOCK_MESSAGES = {
    1: [
        {
            id: 1,
            content: "Bonjour, j'ai terminé les nouveaux designs d'emballage.",
            timestamp: "2025-02-14T10:15:00",
            is_sender: false
        },
        {
            id: 2,
            content: "Excellent! J'ai hâte de les voir.",
            timestamp: "2025-02-14T10:20:00",
            is_sender: true
        },
        {
            id: 3,
            content: "Je vous envoie les derniers prototypes demain matin.",
            timestamp: "2025-02-14T10:30:00",
            is_sender: false
        }
    ],
    2: [
        {
            id: 1,
            content: "J'ai quelques questions sur le financement du projet.",
            timestamp: "2025-02-14T09:00:00",
            is_sender: false
        },
        {
            id: 2,
            content: "Je peux vous aider avec ça. Quelles sont vos questions?",
            timestamp: "2025-02-14T09:10:00",
            is_sender: true
        },
        {
            id: 3,
            content: "Merci pour vos conseils sur le business plan.",
            timestamp: "2025-02-14T09:15:00",
            is_sender: false
        }
    ]
};

export default ChatPage;
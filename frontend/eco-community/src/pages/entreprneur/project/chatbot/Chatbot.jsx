import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Loader, AlertTriangle, Info, FileText, HelpCircle } from 'lucide-react';
import api from "../../../../Services/api.js";

// Enhanced Gemini Chatbot Component for Project Creation Guidance
const GeminiChatbot = ({ projectData, onClose, isOpen }) => {
    // Determine if we're in global mode (no specific project) or project-specific mode
    const isGlobalMode = projectData === null;

    // Set appropriate initial welcome message based on mode
    const getInitialMessage = () => {
        if (isGlobalMode) {
            return "Bonjour ! Je suis votre assistant de projets EcoCommunity. Je peux vous aider à comprendre les exigences pour créer un projet, les documents nécessaires, et vous offrir des conseils d'entrepreneuriat. Que souhaitez-vous savoir aujourd'hui ?";
        } else if (Array.isArray(projectData) && projectData.length > 1) {
            return "Bonjour ! Je suis prêt à vous aider avec vos projets. Veuillez sélectionner un projet spécifique dans le menu déroulant ci-dessus pour obtenir une assistance personnalisée.";
        } else if (projectData && (Array.isArray(projectData) ? projectData[0] : projectData)) {
            const project = Array.isArray(projectData) ? projectData[0] : projectData;
            return `Bonjour ! Je suis prêt à vous aider avec votre projet "${project.project_name}". Que voulez-vous savoir à propos de ce projet ?`;
        } else {
            return "Bonjour ! Je suis prêt à vous aider avec votre projet. Que voulez-vous savoir ?";
        }
    };

    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: getInitialMessage()
        }
    ]);

    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    // Added state for mobile view handling
    const [isMobileView, setIsMobileView] = useState(false);
    const [internalMessages, setInternalMessages] = useState([]);

    // Set initial suggested questions based on mode
    const getInitialSuggestedQuestions = () => {
        if (isGlobalMode) {
            return [
                "Quelles informations sont requises pour créer un projet ?",
                "Quels documents dois-je préparer pour mon projet ?",
                "Comment améliorer les chances d'approbation de mon projet ?",
                "Quelles sont les étapes de création d'un projet ?"
            ];
        } else {
            return [
                "Quelles sont les exigences pour mon projet ?",
                "Comment puis-je améliorer mon dossier ?",
                "Quels conseils pour augmenter mes chances d'approbation ?",
                "Comment puis-je suivre la progression de mon projet ?"
            ];
        }
    };

    const [suggestedQuestions, setSuggestedQuestions] = useState(getInitialSuggestedQuestions());

    // Check for mobile view on component mount and window resize
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobileView(window.innerWidth < 640);
        };

        checkIsMobile(); // Initial check
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Only initialize messages if none are provided from parent
    useEffect(() => {
        if (isOpen) {
            const initialMessage = getInitialMessage();
            setMessages([{ sender: 'bot', text: initialMessage }]);
            setSuggestedQuestions(getInitialSuggestedQuestions());
        }
    }, [projectData, isOpen]);


    useEffect(() => {
        if (!projectData) return;

        if (Array.isArray(projectData) && projectData.length > 0) {
            setSelectedProject(projectData[0]);
            updateSuggestedQuestions(projectData[0]);
        } else if (projectData && !Array.isArray(projectData)) {
            setSelectedProject(projectData);
            updateSuggestedQuestions(projectData);
        }
    }, [projectData]);

    const updateSuggestedQuestions = (project) => {
        if (!project) {
            setSuggestedQuestions(getInitialSuggestedQuestions());
            return;
        }

        const status = project.status || 'pending';
        const newQuestions = [];

        // Basic questions always available
        newQuestions.push("Quelles sont les exigences pour mon projet ?");

        // Status-specific questions
        if (status === 'pending') {
            newQuestions.push("Quels documents manquent pour mon projet ?");
            newQuestions.push("Comment puis-je améliorer mon dossier ?");
        } else if (status === 'approved') {
            newQuestions.push("Quelles sont les prochaines étapes après approbation ?");
            newQuestions.push("Comment puis-je suivre la progression de mon projet ?");
        } else if (status === 'rejected') {
            newQuestions.push("Pourquoi mon projet a été refusé ?");
            newQuestions.push("Comment puis-je soumettre à nouveau mon projet ?");
        }

        // Sector-specific question if sector is available
        if (project.sector) {
            newQuestions.push(`Quels conseils pour un projet dans le secteur ${project.sector} ?`);
        }

        setSuggestedQuestions(newQuestions);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = { sender: 'user', text: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setError(null);

        try {
            // Prepare context about the selected project if one exists
            let projectContext = '';
            if (selectedProject) {
                projectContext = `
            Information sur le projet discuté:
            - Nom: ${selectedProject.project_name}
            - Secteur: ${selectedProject.sector}
            - Budget estimé: ${selectedProject.estimated_budget} FCFA
            - Status: ${selectedProject.status_display || selectedProject.status}
            - Description: ${selectedProject.description || "Non fournie"}
            - Objectifs spécifiques: ${selectedProject.specific_objectives || "Non fournis"}
            - Public cible: ${selectedProject.target_audience || "Non fourni"}
            - Plan de financement: ${selectedProject.financing_plan || "Non fourni"}
            `;
            } else {
                projectContext = 'Aucun projet spécifique sélectionné. Discussion générale sur la création de projets.';
            }

            // First try the main Gemini API endpoint
            let response;
            try {
                response = await api.post('/chatbot/gemini/', {
                    message: inputMessage,
                    projectContext: projectContext,
                    conversation_history: messages.map(m => ({
                        role: m.sender === 'bot' ? 'assistant' : 'user',
                        content: m.text
                    }))
                });
            } catch (primaryError) {
                console.error('Primary Gemini API error, trying fallback:', primaryError);

                // If main endpoint fails, try the fallback endpoint
                response = await api.post('/chatbot/fallback/', {
                    message: inputMessage,
                    projectContext: projectContext
                });
            }

            // Add a small delay to make the interaction feel more natural
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
                setIsLoading(false);

                // Update suggested questions based on the conversation context
                updateContextualSuggestions(inputMessage, response.data.response);
            }, 500);
        } catch (err) {
            console.error('All chatbot endpoints failed:', err);
            setError('Désolé, je ne peux pas vous répondre pour le moment. Veuillez réessayer plus tard ou contacter le support.');
            setIsLoading(false);
        }
    };

    const updateContextualSuggestions = (userMessage, botResponse) => {
        // Skip contextual updates if project is selected (use project-specific suggestions)
        if (selectedProject) return;

        // Simple contextual suggestion logic based on user's last message and bot's response
        const lowerUserMsg = userMessage.toLowerCase();
        const lowerBotResp = botResponse.toLowerCase();

        if (lowerUserMsg.includes('document') || lowerBotResp.includes('document')) {
            setSuggestedQuestions([
                "Comment télécharger mes documents ?",
                "Quels formats de documents sont acceptés ?",
                "Quels documents sont obligatoires ?",
                "Comment préparer mon étude de faisabilité ?"
            ]);
        } else if (lowerUserMsg.includes('budget') || lowerBotResp.includes('budget') ||
            lowerUserMsg.includes('financ') || lowerBotResp.includes('financ')) {
            setSuggestedQuestions([
                "Comment estimer mon budget correctement ?",
                "Quelles sources de financement sont disponibles ?",
                "Comment rédiger un bon plan de financement ?",
                "Quels coûts dois-je inclure dans mon budget ?"
            ]);
        } else if (lowerUserMsg.includes('secteur') || lowerBotResp.includes('secteur') ||
            lowerUserMsg.includes('domaine') || lowerBotResp.includes('domaine')) {
            setSuggestedQuestions([
                "Quels sont les secteurs les plus prometteurs ?",
                "Quelles spécificités pour mon secteur d'activité ?",
                "Comment analyser la concurrence dans mon secteur ?",
                "Quelles réglementations s'appliquent à mon secteur ?"
            ]);
        } else if (lowerUserMsg.includes('creat') || lowerBotResp.includes('creat') ||
            lowerUserMsg.includes('nouveau') || lowerBotResp.includes('nouveau')) {
            setSuggestedQuestions([
                "Quelles sont les étapes pour créer un projet ?",
                "Comment rédiger une description efficace ?",
                "Quelles sont les erreurs à éviter pour un nouveau projet ?",
                "Comment définir clairement mes objectifs ?"
            ]);
        }
    };

    const handleProjectSelect = (project) => {
        if (!project) return;

        setSelectedProject(project);
        updateSuggestedQuestions(project);
        setMessages(prev => [
            ...prev,
            {
                sender: 'bot',
                text: `Je vais vous aider avec votre projet "${project.project_name}". Que voulez-vous savoir à propos de ce projet ? J'ai des informations sur les documents requis, les étapes d'approbation, et je peux vous conseiller sur l'amélioration de votre dossier.`
            }
        ]);
    };

    const handleSuggestedQuestionClick = (question) => {
        setInputMessage(question);
        // Automatically send after a short delay to feel more natural
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            handleSendMessage(fakeEvent);
        }, 300);
    };

    const handleQuickAction = (action) => {
        switch(action) {
            case 'requirements':
                setInputMessage("Quelles sont les informations et documents requis pour créer un projet ?");
                break;
            case 'steps':
                setInputMessage("Quelles sont les étapes pour créer et soumettre un projet ?");
                break;
            case 'tips':
                setInputMessage("Quels conseils pour augmenter les chances d'approbation de mon projet ?");
                break;
            default:
                return;
        }
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            handleSendMessage(fakeEvent);
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed ${isMobileView ? 'inset-0' : 'bottom-6 right-6'} z-50 ${isMobileView ? 'w-full h-full' : 'w-full sm:w-96 max-w-full h-full sm:h-[550px] max-h-[80vh]'} bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-emerald-200`}>
            {/* Chatbot Header */}
            <div className="bg-emerald-600 text-white px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">
                        {isGlobalMode
                            ? "Assistant de Création de Projets"
                            : "Assistant Projet"}
                    </h3>
                </div>
                <button onClick={onClose} className="text-white hover:text-emerald-100">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-100 flex space-x-2 overflow-x-auto">
                <button
                    onClick={() => handleQuickAction('requirements')}
                    className="px-3 py-1 bg-white text-emerald-700 text-sm rounded-full border border-emerald-200 hover:bg-emerald-100 flex items-center whitespace-nowrap"
                >
                    <FileText className="h-3 w-3 mr-1" />
                    Exigences
                </button>
                <button
                    onClick={() => handleQuickAction('steps')}
                    className="px-3 py-1 bg-white text-emerald-700 text-sm rounded-full border border-emerald-200 hover:bg-emerald-100 flex items-center whitespace-nowrap"
                >
                    <Info className="h-3 w-3 mr-1" />
                    Étapes
                </button>
                <button
                    onClick={() => handleQuickAction('tips')}
                    className="px-3 py-1 bg-white text-emerald-700 text-sm rounded-full border border-emerald-200 hover:bg-emerald-100 flex items-center whitespace-nowrap"
                >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Conseils
                </button>
            </div>

            {/* Project Selection (if multiple projects) */}
            {Array.isArray(projectData) && projectData.length > 1 && (
                <div className="p-2 bg-emerald-50 border-b border-emerald-100">
                    <select
                        className="w-full p-2 rounded border border-emerald-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={selectedProject?.id || ''}
                        onChange={(e) => {
                            const selected = projectData.find(p => p.id.toString() === e.target.value);
                            if (selected) handleProjectSelect(selected);
                        }}
                    >
                        <option value="" disabled>Sélectionnez un projet</option>
                        {projectData.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.project_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Messages Container */}
            <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender === 'user'
                                    ? 'bg-emerald-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm flex items-center">
                            <Loader className="h-4 w-4 mr-2 animate-spin text-emerald-500" />
                            Réflexion en cours...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 rounded-tl-none shadow-sm flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                            {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions - with responsive design */}
            {suggestedQuestions.length > 0 && !isLoading && (
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Questions suggérées :</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestedQuestionClick(question)}
                                className="px-3 py-1 bg-white text-emerald-700 text-xs rounded-full border border-emerald-200 hover:bg-emerald-100 whitespace-normal text-left"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={isGlobalMode
                            ? "Posez une question sur la création de projet..."
                            : "Posez une question sur ce projet..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        disabled={isLoading || !inputMessage.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GeminiChatbot;
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";

import {
    Search,
    Plus,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Calendar,
    Users,
    DollarSign,
    HelpCircle,
    Trash2,
    Eye,
    Info,
    FolderX,
    MessageSquare,
    ClipboardCheck,
    HelpingHand,
    MessageCircle
} from 'lucide-react';

import api from "../../../Services/api.js";
import {ProjectDetailsCard} from "./detail/ProjectModal.jsx";
import SectorDisplay from "./Sector.jsx";
import GeminiChatbot from "./chatbot/Chatbot.jsx";


const ProjectsPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatbotContext, setChatbotContext] = useState(null);

    // Fonction de navigation flexible
    const handleCreateProject = (path) => {
        navigate(path);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Add this console log in the frontend
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            console.log('API Response:', response.data);
            setProjects(response.data || []);
        } catch (error) {
            console.error('Error response:', error.response);
            setProjects([]);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                // Fix the string template syntax
                const response = await api.delete(`/projects/${projectId}/`);
                // Refresh projects list after deletion
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleProjectDetails = (project) => {
        setSelectedProject(project);
    };

    // Chatbot management
    const toggleChatbot = (project = null) => {
        // If no project is passed (global floating button), set context to null
        if (project === null) {
            setChatbotContext(null); // Force global mode
        } else {
            setChatbotContext(project); // Set project-specific context
        }
        setIsChatbotOpen(!isChatbotOpen);
    };



    // Add this function to handle media URLs
    const getImageUrl = (project) => {
        try {
            // First try project_image field
            if (project.project_image) {
                // Ensure we have a valid URL by removing any undefined prefixes
                return project.project_image.startsWith('http')
                    ? project.project_image
                    : `${import.meta.env.VITE_API_URL || ''}${project.project_image}`;
            }

            // Then try documents array
            const projectImage = project.documents?.find(doc => doc.document_type === 'project_photos');
            if (projectImage?.file) {
                // If the file URL is already absolute (starts with http:// or https://)
                if (projectImage.file.startsWith('http')) {
                    return projectImage.file;
                }
                // Otherwise, append it to the API URL, ensuring no undefined prefix
                return `${import.meta.env.VITE_API_URL || ''}${projectImage.file}`;
            }

            // Return placeholder if no valid image is found
            return "/api/placeholder/400/250";
        } catch (error) {
            console.error('Error getting image URL:', error);
            return "/api/placeholder/400/250";
        }
    };

    const filteredProjects = Array.isArray(projects) ? projects.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'En cours':
                return 'bg-green-100 text-green-800';
            case 'En attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'Terminé':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg bg-emerald-600 text-white"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-[16vw] min-w-48 max-w-72 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:block shadow-xl`}
            >
                <div className="p-4 xl:p-6">
                    <h2 className="text-white text-xl xl:text-2xl font-bold mb-6 xl:mb-8 flex items-center">
                        <FileText className="h-5 w-5 xl:h-6 xl:w-6 mr-2"/>
                        EcoCommunity
                    </h2>
                    <nav className="space-y-1 xl:space-y-2">
                        <a href="/entrepreneur/project"
                           className="flex items-center space-x-2 xl:space-x-3 bg-emerald-600/50 text-white px-3 xl:px-4 py-2 xl:py-3 rounded-lg shadow-md">
                            <FileText className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Mes Projets</span>
                        </a>
                        <a href="/entrepreneur/messages"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <MessageSquare className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Messages</span>
                        </a>
                        <a href="/entrepreneur/demandes"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <HelpCircle className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Demande d'aide</span>
                        </a>
                        <a href="/entrepreneur/help"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <HelpingHand className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Proposition d'aide</span>
                        </a>
                        <a href="/entrepreneur/opportunity"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <Info className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Annonces</span>
                        </a>
                        <a href="/entrepreneur/registration-info"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <ClipboardCheck className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Info Inscription</span>
                        </a>
                        <a href="/entrepreneur/collaborators"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <Users className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Collaborateurs</span>
                        </a>
                        <a href="/entrepreneur/settings"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <Settings className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Paramètres</span>
                        </a>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 xl:p-6">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-red-500/20 w-full px-3 xl:px-4 py-2 xl:py-3 rounded-lg"
                    >
                        <LogOut className="h-4 w-4 xl:h-5 xl:w-5"/>
                        <span className="text-sm xl:text-base">{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Projets</h1>
                            <p className="text-gray-600">Gérez et suivez vos projets communautaires</p>
                        </div>
                        <button
                            onClick={() => handleCreateProject("/entrepreneur/create-project")}
                            className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-5 w-5 mr-2"/>
                            Nouveau Projet
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6 backdrop-blur-lg bg-opacity-90">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher dans mes projets..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex flex-col"
                                    aria-label={`Project: ${project.project_name}`}
                                >
                                    <div className="relative">
                                        <img
                                            src={getImageUrl(project)}
                                            alt={`Project cover for ${project.project_name}`}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = "/api/placeholder/400/250";
                                                e.target.alt = "Project image placeholder";
                                            }}
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
                                                aria-label={`Status: ${project.status_display}`}
                                            >
                                                {project.status_display}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <SectorDisplay sector={project.sector}/>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">
                                            {project.project_name}
                                        </h3>

                                        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                                        <div className="space-y-3 mb-4 mt-auto">
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-2 text-emerald-500"
                                                            aria-hidden="true"/>
                                                <span
                                                    className="text-sm">{project.estimated_budget.toLocaleString()} FCFA</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2 text-emerald-500" aria-hidden="true"/>
                                                <span className="text-sm">
                                                    {new Date(project.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="flex items-center justify-center px-3 py-2.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                                                aria-label={`Delete ${project.project_name}`}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true"/>
                                                Supprimer
                                            </button>

                                            <button
                                                onClick={() => handleProjectDetails(project)}
                                                className="flex items-center justify-center px-3 py-2.5 border-2 border-emerald-600 text-emerald-600 text-sm rounded-lg hover:bg-emerald-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                aria-label={`View details for ${project.project_name}`}
                                            >
                                                <Eye className="h-4 w-4 mr-1.5" aria-hidden="true"/>
                                                Voir détails
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                            {project.status === 'approved' ? (
                                                <>
                                                    <button
                                                        className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                        onClick={() => navigate(`/entrepreneur/request?projectId=${project.id}`)}
                                                        aria-label={`Request help for ${project.project_name}`}
                                                    >
                                                        <HelpCircle className="h-4 w-4 mr-1.5" aria-hidden="true"/>
                                                        Aide
                                                    </button>

                                                    <button
                                                        className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                        onClick={() => toggleChatbot(project)}
                                                        aria-label={`Chat about ${project.project_name}`}
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-1.5" aria-hidden="true"/>
                                                        Discuter
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="col-span-2 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    onClick={() => toggleChatbot(project)}  // Pass the project for project-specific mode
                                                    aria-label={`Chat about ${project.project_name}`}
                                                >
                                                    <MessageCircle className="h-4 w-4 mr-1.5" aria-hidden="true"/>
                                                    Discuter
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center">
                                <FolderX className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                                <h3 className="text-lg font-medium text-gray-900">Aucun projet trouvé</h3>
                                <p className="text-gray-500 mt-2">Aucun projet ne correspond à vos critères de recherche.</p>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-12">
                            <div
                                className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto backdrop-blur-lg bg-opacity-90">
                                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun projet pour le moment</h3>
                                <p className="text-gray-600 mb-6">Commencez par créer votre premier projet
                                    communautaire</p>
                                <button
                                    onClick={() => handleCreateProject("/entrepreneur/create-project")}
                                    className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <Plus className="h-5 w-5 mr-2"/>
                                    Créer un Projet
                                </button>
                            </div>
                        </div>
                    )}

                    <ProjectDetailsCard
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />

                    {/* Gemini Chatbot Component */}
                    <GeminiChatbot
                        isOpen={isChatbotOpen}
                        onClose={() => setIsChatbotOpen(false)}
                        projectData={chatbotContext}
                    />

                </div>
            </div>

            {/* Floating Chatbot Button - Global Assistant */}
            {!isChatbotOpen && (
                <button
                    onClick={() => toggleChatbot(null)}  // Always pass null for global mode
                    className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center"
                >
                    <MessageCircle className="h-6 w-6"/>
                </button>
            )}
        </div>
    );
};

export default ProjectsPage;
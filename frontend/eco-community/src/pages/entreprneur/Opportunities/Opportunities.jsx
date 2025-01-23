import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";
import { Search, Plus, BarChart2, FileText, Settings, LogOut, Menu, X, Calendar, MapPin, Users, DollarSign, HelpCircle, Info, Bell, Tag, HandHelping } from 'lucide-react';

const OpportunityPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleCreateAnnouncement = () => {
        navigate('/entrepreneur/create-announcement');
    };

    const announcementTypes = [
        { id: 'all', label: 'Tous' },
        { id: 'funding', label: 'Financement' },
        { id: 'training', label: 'Formation' },
        { id: 'partnership', label: 'Partenariat' },
        { id: 'event', label: 'Événement' },
        { id: 'opportunity', label: 'Opportunité' }
    ];

    const announcements = [
        {
            id: 1,
            title: "Subvention pour projets agricoles",
            type: "funding",
            description: "Programme de financement pour les projets agricoles innovants. Budget disponible jusqu'à 10 millions FCFA par projet.",
            deadline: "2024-03-30",
            organization: "Ministère de l'Agriculture",
            location: "National",
            requirements: ["Plan d'affaires", "Licence agricole", "2 ans d'expérience minimum"],
            status: "Actif",
            imageUrl: "/api/placeholder/400/250"
        },
        {
            id: 2,
            title: "Formation en Entrepreneuriat Digital",
            type: "training",
            description: "Programme de formation gratuit sur le marketing digital et la gestion d'entreprise en ligne.",
            deadline: "2024-02-28",
            organization: "Tech Hub Cameroun",
            location: "Douala",
            requirements: ["18-35 ans", "Niveau Bac minimum", "Ordinateur portable"],
            status: "Actif",
            imageUrl: "/api/placeholder/400/250"
        },
        {
            id: 3,
            title: "Recherche Partenaires Locaux",
            type: "partnership",
            description: "ONG internationale cherche partenaires locaux pour programme d'autonomisation des femmes entrepreneurs.",
            deadline: "2024-04-15",
            organization: "Women Empowerment International",
            location: "Yaoundé",
            requirements: ["3 ans d'existence", "Experience en genre", "Présence locale"],
            status: "Actif",
            imageUrl: "/api/placeholder/400/250"
        }
    ];

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

    const getTypeColor = (type) => {
        switch (type) {
            case 'funding':
                return 'bg-green-100 text-green-800';
            case 'training':
                return 'bg-blue-100 text-blue-800';
            case 'partnership':
                return 'bg-purple-100 text-purple-800';
            case 'event':
                return 'bg-yellow-100 text-yellow-800';
            case 'opportunity':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'funding':
                return 'Financement';
            case 'training':
                return 'Formation';
            case 'partnership':
                return 'Partenariat';
            case 'event':
                return 'Événement';
            case 'opportunity':
                return 'Opportunité';
            default:
                return type;
        }
    };

    const filteredAnnouncements = selectedType === 'all'
        ? announcements
        : announcements.filter(ann => ann.type === selectedType);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Side Navigation - Same as ProjectsPage */}
            <aside
                className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 hidden lg:block shadow-xl">
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8 flex items-center">
                        <FileText className="h-6 w-6 mr-2"/>
                        EcoCommunity
                    </h2>
                    <nav className="space-y-2">
                        <a href="/entrepreneur/project"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <FileText className="h-5 w-5"/>
                            <span>Mes Projets</span>
                        </a>
                        <a href="/entrepreneur/demandes"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <HelpCircle className="h-5 w-5"/>
                            <span>Demande d'aide</span>
                        </a>
                        <a href="/entrepreneur/help"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <HandHelping className="h-5 w-5"/>
                            <span>Proposition d'aide</span>
                        </a>
                        <a href="/entrepreneur/opportunity"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
                            <Info className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/entrepreneur/collaborators"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <Users className="h-5 w-5"/>
                            <span>Collaborateurs</span>
                        </a>
                        <a href="#"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <BarChart2 className="h-5 w-5"/>
                            <span>Tableau de bord</span>
                        </a>
                        <a href="/entrepreneur/settings"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <Settings className="h-5 w-5"/>
                            <span>Paramètres</span>
                        </a>
                    </nav>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center space-x-3 text-emerald-100 hover:bg-red-500/20 w-full px-4 py-3 rounded-lg"
                    >
                        <LogOut className="h-5 w-5"/>
                        {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                </div>
            </aside>


            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Annonces</h1>
                            <p className="text-gray-600">Découvrez les dernières opportunités pour votre projet</p>
                        </div>
                    </div>

                    {/* Type Filters */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {announcementTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    selectedType === type.id
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-emerald-50'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6 backdrop-blur-lg bg-opacity-90">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher dans les annonces..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            />
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                    {/* Announcements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAnnouncements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <div className="relative">
                                    <img
                                        src={announcement.imageUrl}
                                        alt={announcement.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(announcement.type)}`}>
                                            {getTypeLabel(announcement.type)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">
                                        {announcement.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{announcement.description}</p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{announcement.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">Date limite: {announcement.deadline}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{announcement.organization}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Conditions requises:</h4>
                                        <ul className="space-y-1">
                                            {announcement.requirements.map((req, index) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                                    <Tag className="h-3 w-3 mr-2 text-emerald-500"/>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md">
                                            Postuler
                                        </button>
                                        <button
                                            className="flex-1 border-2 border-emerald-600 text-emerald-600 py-2.5 rounded-lg hover:bg-emerald-50 transition-all duration-200">
                                            Voir détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredAnnouncements.length === 0 && (
                        <div className="text-center py-12">
                            <div
                                className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto backdrop-blur-lg bg-opacity-90">
                                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune annonce disponible</h3>
                                <p className="text-gray-600 mb-6">Aucune annonce ne correspond à vos critères pour le
                                    moment</p>
                                <button
                                    onClick={() => setSelectedType('all')}
                                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Voir toutes les annonces
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpportunityPage;
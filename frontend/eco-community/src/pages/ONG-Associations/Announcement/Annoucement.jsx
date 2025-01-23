import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";
import {Search, Plus, FileText, Calendar, Users, Edit, Trash2, Eye, Bell, Filter, LogOut, Settings} from 'lucide-react';

const NGOAnnouncementsPage = () => {
    const [selectedType, setSelectedType] = useState('all');
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleCreateAnnouncement = () => {
        navigate('/association/create-announcement');
    };

    const handleCreateEvent = () => {
        navigate('/association/create-events');
    };

    const announcementTypes = [
        { id: 'all', label: 'Tous' },
        { id: 'funding', label: 'Financement' },
        { id: 'training', label: 'Formation' },
        { id: 'partnership', label: 'Partenariat' },
        { id: 'opportunity', label: 'Opportunité' }
    ];

    // Sample data for NGO's announcements
    const myAnnouncements = [
        {
            id: 1,
            title: "Programme de Financement Agricole 2024",
            type: "funding",
            description: "Financement disponible pour les projets agricoles innovants dans la région du Centre.",
            deadline: "2024-03-30",
            status: "active",
            applicants: 12,
            imageUrl: "/api/placeholder/400/250",
            requirements: ["Plan d'affaires", "Licence agricole", "2 ans d'expérience"]
        },
        {
            id: 2,
            title: "Formation en Entrepreneuriat",
            type: "training",
            description: "Programme de renforcement des capacités pour jeunes entrepreneurs.",
            deadline: "2024-04-15",
            status: "draft",
            applicants: 0,
            imageUrl: "/api/placeholder/400/250",
            requirements: ["18-35 ans", "Niveau Bac", "Motivation"]
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

    const getStatusBadge = (status) => {
        const statusStyles = {
            active: "bg-green-100 text-green-800",
            draft: "bg-gray-100 text-gray-800",
            closed: "bg-red-100 text-red-800"
        };
        const statusLabels = {
            active: "Actif",
            draft: "Brouillon",
            closed: "Clôturé"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Side Navigation will be shared across pages */}
            <aside
                className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 hidden lg:block shadow-xl">
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8">
                        EcoCommunity
                    </h2>
                    <nav className="space-y-2">
                        <a href="/ngo/dashboard"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <FileText className="h-5 w-5"/>
                            <span>Tableau de bord</span>
                        </a>
                        <a href="/association/announce"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg">
                            <Bell className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/association/events"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Calendar className="h-5 w-5"/>
                            <span>Événements</span>
                        </a>
                        <a href="#"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
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
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Annonces</h1>
                            <p className="text-gray-600">Gérez vos annonces et suivez les candidatures</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCreateEvent}
                                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                <Calendar className="h-5 w-5 mr-2" />
                                Créer un Événement
                            </button>
                            <button
                                onClick={handleCreateAnnouncement}
                                className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Nouvelle Annonce
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher dans vos annonces..."
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex gap-2">
                                <select className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500">
                                    <option>Tous les statuts</option>
                                    <option>Actif</option>
                                    <option>Brouillon</option>
                                    <option>Clôturé</option>
                                </select>
                                <button className="p-3 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-4">
                        {myAnnouncements.map((announcement) => (
                            <div key={announcement.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64">
                                        <img
                                            src={announcement.imageUrl}
                                            alt={announcement.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {announcement.title}
                                                </h3>
                                                {getStatusBadge(announcement.status)}
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Eye className="h-5 w-5 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Edit className="h-5 w-5 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Trash2 className="h-5 w-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mt-2 mb-4">{announcement.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">Date limite: {announcement.deadline}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">{announcement.applicants} candidatures</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {announcement.requirements.map((req, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {myAnnouncements.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune annonce</h3>
                                <p className="text-gray-600 mb-6">Vous n'avez pas encore créé d'annonces</p>
                                <button
                                    onClick={handleCreateAnnouncement}
                                    className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Créer une annonce
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOAnnouncementsPage;
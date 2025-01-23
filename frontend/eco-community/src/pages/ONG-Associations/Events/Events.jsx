import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";
import {
    Search,
    Plus,
    FileText,
    Calendar,
    MapPin,
    Users,
    Bell,
    Filter,
    Edit,
    Trash2,
    Eye,
    Clock,
    LogOut,
    Settings
} from 'lucide-react';

const NGOEventsPage = () => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleCreateEvent = () => {
        navigate('/association/create-events');
    };

    // Sample events data
    const myEvents = [
        {
            id: 1,
            title: "Forum de l'Entrepreneuriat 2024",
            type: "forum",
            description: "Grand rassemblement des entrepreneurs et des structures d'accompagnement.",
            date: "2024-03-15",
            time: "09:00",
            location: "Palais des Congrès, Yaoundé",
            status: "upcoming",
            participants: 45,
            capacity: 100,
            imageUrl: "/api/placeholder/400/250"
        },
        {
            id: 2,
            title: "Atelier Formation Business Plan",
            type: "workshop",
            description: "Formation pratique sur l'élaboration d'un business plan efficace.",
            date: "2024-04-01",
            time: "14:00",
            location: "Tech Hub Douala",
            status: "draft",
            participants: 0,
            capacity: 30,
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

    const getStatusBadge = (status) => {
        const statusStyles = {
            upcoming: "bg-blue-100 text-blue-800",
            ongoing: "bg-green-100 text-green-800",
            completed: "bg-gray-100 text-gray-800",
            draft: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800"
        };
        const statusLabels = {
            upcoming: "À venir",
            ongoing: "En cours",
            completed: "Terminé",
            draft: "Brouillon",
            cancelled: "Annulé"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Side Navigation */}
            <aside
                className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 hidden lg:block shadow-xl">
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8">
                        Eco Community
                    </h2>
                    <nav className="space-y-2">
                        <a href="/ngo/dashboard"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <FileText className="h-5 w-5"/>
                            <span>Tableau de bord</span>
                        </a>
                        <a href="/association/announce"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Bell className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/association/events"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg">
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Événements</h1>
                            <p className="text-gray-600">Organisez et gérez vos événements communautaires</p>
                        </div>
                        <button
                            onClick={handleCreateEvent}
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Créer un Événement
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un événement..."
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex gap-2">
                                <select className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500">
                                    <option>Tous les statuts</option>
                                    <option>À venir</option>
                                    <option>En cours</option>
                                    <option>Terminé</option>
                                    <option>Brouillon</option>
                                </select>
                                <button className="p-3 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-4">
                        {myEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {event.title}
                                                </h3>
                                                {getStatusBadge(event.status)}
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

                                        <p className="text-gray-600 mt-2 mb-4">{event.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">{event.date}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">{event.time}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">{event.location}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">{event.participants}/{event.capacity} participants</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-emerald-600 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-700">
                                                Gérer les inscriptions
                                            </button>
                                            <button className="flex-1 border border-emerald-600 text-emerald-600 py-2.5 px-4 rounded-lg hover:bg-emerald-50">
                                                Modifier l'événement
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {myEvents.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun événement</h3>
                                <p className="text-gray-600 mb-6">Vous n'avez pas encore créé d'événements</p>
                                <button
                                    onClick={handleCreateEvent}
                                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Créer un événement
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOEventsPage;
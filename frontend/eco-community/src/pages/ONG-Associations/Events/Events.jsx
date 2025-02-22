import React, {useEffect, useState} from 'react';
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
    ClipboardList,
    Trash2,
    Eye,
    Clock,
    LogOut,
    Settings, X, CheckCircle, Menu
} from 'lucide-react';
import api from "../../../Services/api.js";
import {Card} from "../../../components/ui/card.jsx";
import EventImage from "./EventImage.jsx";
import EventDetailsModal from "./EventDetails.jsx";
import EditEventModal from "./editing/EditingEvents.jsx";

const NGOEventsPage = () => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleCreateEvent = () => {
        navigate('/association/create-events');
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events/');
            setEvents(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.response?.data?.detail || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

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

    const handleUpdateEvent = async (updatedEventData) => {
        try {
            const response = await api.put(`/events/${updatedEventData.id}/`, updatedEventData);

            // Update the events list with the new data
            setEvents(events.map(event =>
                event.id === updatedEventData.id ? response.data : event
            ));

            // Close the edit modal
            setEditingEvent(null);
        } catch (error) {
            console.error('Error updating event:', error);
            // You might want to show an error message to the user
        }
    };

    const handlePublishEvent = async (id) => {
        try {
            const response = await api.patch(`/events/${id}/`, {
                status: 'published'
            });

            // Update local state with the response data
            setEvents(events.map(event =>
                event.id === id ? response.data : event
            ));

            // Optional: Show success message
            // You might want to add a toast or notification system
        } catch (err) {
            console.error('Error publishing announcement:', err.response?.data?.detail || err.message);
            // Optional: Show error message to user
            alert(err.response?.data?.detail || "Une erreur s'est produite lors de la publication de l'annonce");
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            return;
        }

        try {
            // Delete announcement using Axios
            await api.delete(`/events/${id}/`);

            // Refresh the announcements list
            fetchEvents();
        } catch (err) {
            console.error('Error deleting announcement:', err.response?.data?.message || err.message);
            // Optional: Display an error message to the user
        }
    };

    // In NGOAnnouncementsPage component
    const handleEditEvent = (event) => {
        setEditingEvent(event); // Pass the entire announcement object, not just the ID
    };

    const handleManageRegistrations = (eventId) => {
        navigate(`/association/registrations/${eventId}`);
    };


    const getStatusBadge = (status) => {
        const statusStyles = {
            draft: "bg-yellow-100 text-yellow-800",
            published: "bg-green-100 text-green-800",
        };
        const statusLabels = {
            draft: "Brouillon",
            published: "Publié"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    const getEventTypeLabel = (type) => {
        const typeLabels = {
            forum: "Forum",
            workshop: "Atelier",
            webinars: "Webinaire",
            conference: "Conférence"
        };
        return typeLabels[type] || type;
    };

    const filteredEvents = events
        .filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(event => statusFilter === 'all' || event.status === statusFilter);

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
            {/* Side Navigation */}
            <aside
                className={`fixed top-0 left-0 h-full w-[16vw] min-w-48 max-w-72 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 shadow-xl`}>
                <div className="p-4 xl:p-6">
                    <h2 className="text-white text-xl xl:text-2xl font-bold mb-6 xl:mb-8 flex items-center">
                        <FileText className="h-5 w-5 xl:h-6 xl:w-6 mr-2"/>
                        EcoCommunity
                    </h2>
                    <nav className="space-y-1 xl:space-y-2">
                        <a href="/association/announce"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <Bell className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Annonces</span>
                        </a>
                        <a href="/association/events"
                           className="flex items-center space-x-2 xl:space-x-3 bg-emerald-600/50 text-white px-3 xl:px-4 py-2 xl:py-3 rounded-lg">
                            <Calendar className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Événements</span>
                        </a>
                        <a href="/association/registrations"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <ClipboardList className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Inscriptions</span>
                        </a>
                        <a href="/association/settings"
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
                        className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-red-500/20 w-full px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200"
                    >
                        <LogOut className="h-4 w-4 xl:h-5 xl:w-5"/>
                        <span className="text-sm xl:text-base">{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
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

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : error ? (
                        <Card className="p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <X className="h-16 w-16 text-red-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur</h3>
                                <p className="text-gray-600">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </Card>
                    ) : (
                        <>

                            {/* Search and Filter Bar */}
                            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Rechercher un événement..."
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="all">Tous les statuts</option>
                                            <option value="draft">Brouillon</option>
                                            <option value="published">Publié</option>
                                        </select>
                                        <button className="p-3 border rounded-lg hover:bg-gray-50">
                                            <Filter className="h-5 w-5 text-gray-600"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Events List */}
                            <div className="space-y-4">
                                {filteredEvents.map((event) => (
                                    <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="md:w-64 h-48 md:h-auto">
                                                {event.image ? (
                                                    <div className="h-full w-full">
                                                        <EventImage
                                                            image={event.image}
                                                            title={event.title}
                                                            className="h-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="h-full w-full bg-gray-200 flex items-center justify-center">
                                                        <Calendar className="h-12 w-12 text-gray-400"/>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                            {event.title}
                                                        </h3>
                                                        <div className="flex gap-2 items-center">
                                                            {getStatusBadge(event.status)}
                                                            <span className="text-sm text-gray-600">
                                                        {getEventTypeLabel(event.type)}
                                                    </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                            onClick={() => setSelectedEvent(event)}
                                                        >
                                                            <Eye className="h-5 w-5 text-gray-600"/>
                                                        </button>
                                                        {event.status === 'draft' && (
                                                            <button
                                                                className="p-2 hover:bg-emerald-100 rounded-lg"
                                                                onClick={() => handlePublishEvent(event.id)}
                                                            >
                                                                <CheckCircle className="h-5 w-5 text-emerald-600"/>
                                                            </button>
                                                        )}
                                                        <button
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                        >
                                                            <Trash2 className="h-5 w-5 text-red-600"/>
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mt-2 mb-4">{event.description}</p>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                                        <span
                                                            className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Clock className="h-4 w-4 mr-2 text-emerald-500"/>
                                                        <span className="text-sm">{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2 text-emerald-500"/>
                                                        <span className="text-sm">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                                        <span className="text-sm">{event.capacity} places</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleManageRegistrations(event.id)}
                                                        className="flex-1 bg-emerald-600 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-700">
                                                        Gérer les inscriptions
                                                    </button>
                                                    <button
                                                        className="flex-1 border border-emerald-600 text-emerald-600 py-2.5 px-4 rounded-lg hover:bg-emerald-50"
                                                        onClick={() => handleEditEvent(event)}
                                                    >
                                                        Modifier l'événement
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredEvents.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun événement</h3>
                                        <p className="text-gray-600 mb-6">
                                            {searchTerm || statusFilter !== 'all'
                                                ? "Aucun événement ne correspond à vos critères de recherche"
                                                : "Vous n'avez pas encore créé d'événements"}
                                        </p>
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
                            {selectedEvent && (
                                <EventDetailsModal
                                    event={selectedEvent}
                                    onClose={() => setSelectedEvent(null)}
                                />
                            )}
                            {editingEvent && (
                                <EditEventModal
                                    event={editingEvent}
                                    onClose={() => setEditingEvent(null)}
                                    onUpdate={handleUpdateEvent}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOEventsPage;
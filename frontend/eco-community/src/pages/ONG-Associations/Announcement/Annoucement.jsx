import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";
import {
    Search,
    Plus,
    ClipboardList,
    Calendar,
    Users,
    Edit,
    Trash2,
    Eye,
    Bell,
    Filter,
    LogOut,
    Settings,
    CheckCircle, X, Menu
} from 'lucide-react';
import api from "../../../Services/api.js";
import AnnouncementImage from "./AnnouncementImage.jsx";
import AnnouncementDetailsModal from "./AnnouncementDetails.jsx";
import EditAnnouncementModal from "./AnnouncementEdit.jsx";
import {Card} from "../../../components/ui/card.jsx";
import RequirementsList from "./Components/Requirements.jsx";

const NGOAnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);

            // Fetch announcements using the Axios API instance
            const response = await api.get('/announcements/');

            // Set the announcements state with the fetched data
            setAnnouncements(response.data);
            setError(null); // Clear any previous error
        } catch (err) {
            setError(err.response?.data?.message || err.message); // Handle server or client errors
        } finally {
            setLoading(false); // Ensure loading state is updated
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            return;
        }

        try {
            // Delete announcement using Axios
            await api.delete(`/announcements/${id}/`);

            // Refresh the announcements list
            fetchAnnouncements();
        } catch (err) {
            console.error('Error deleting announcement:', err.response?.data?.message || err.message);
            // Optional: Display an error message to the user
        }
    };

    const handlePublishAnnouncement = async (id) => {
        try {
            const response = await api.patch(`/announcements/${id}/`, {
                status: 'published'
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update local state with the response data
            setAnnouncements(announcements.map(announcement =>
                announcement.id === id ? response.data : announcement
            ));

            // Optional: Show success message
            // You might want to add a toast or notification system
        } catch (err) {
            console.error('Error publishing announcement:', err.response?.data?.detail || err.message);
            // Optional: Show error message to user
            alert(err.response?.data?.detail || "Une erreur s'est produite lors de la publication de l'annonce");
        }
    };

    // In NGOAnnouncementsPage component
    const handleEditAnnouncement = (announcement) => {
        setEditingAnnouncement(announcement); // Pass the entire announcement object, not just the ID
    };

    // Add the handleUpdateAnnouncement function:
    const handleUpdateAnnouncement = (updatedAnnouncement) => {
        setAnnouncements(announcements.map(announcement =>
            announcement.id === updatedAnnouncement.id
                ? updatedAnnouncement
                : announcement
        ));
    };

    const handleCreateAnnouncement = () => {
        navigate('/association/create-announcement');
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

    const getStatusBadge = (status) => {
        const statusStyles = {
            published: "bg-green-100 text-green-800",
            draft: "bg-gray-100 text-gray-800"
        };
        const statusLabels = {
            published: "Publié",
            draft: "Brouillon"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    const filteredAnnouncements = announcements
        .filter(announcement =>
            announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === 'all' || announcement.status === statusFilter)
        );

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
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:block shadow-xl`}>
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8">
                        EcoCommunity
                    </h2>
                    <nav className="space-y-2">
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
                        <a href="/association/registrations"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <ClipboardList className="h-5 w-5"/>
                            <span>Inscriptions</span>
                        </a>
                        <a href="/association/settings"
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
                        <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
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
                                onClick={handleCreateAnnouncement}
                                className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Nouvelle Annonce
                            </button>
                        </div>
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
                                            placeholder="Rechercher dans vos annonces..."
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="all">Tous les statuts</option>
                                            <option value="published">Publié</option>
                                            <option value="draft">Brouillon</option>
                                        </select>
                                        <button className="p-3 border rounded-lg hover:bg-gray-50">
                                            <Filter className="h-5 w-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Announcements List */}
                            <div className="space-y-4">
                                {filteredAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="md:w-64">
                                                <AnnouncementImage
                                                    image={announcement.image}
                                                    title={announcement.title}
                                                    className="h-full"
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
                                                        <button
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                            onClick={() => setSelectedAnnouncement(announcement)}
                                                        >
                                                            <Eye className="h-5 w-5 text-gray-600"/>
                                                        </button>
                                                        <button className="p-2 hover:bg-gray-100 rounded-lg"
                                                                onClick={() => handleEditAnnouncement(announcement)}
                                                        >
                                                            <Edit className="h-5 w-5 text-gray-600"/>
                                                        </button>
                                                        {announcement.status === 'draft' && (
                                                            <button
                                                                className="p-2 hover:bg-emerald-100 rounded-lg"
                                                                onClick={() => handlePublishAnnouncement(announcement.id)}
                                                            >
                                                                <CheckCircle className="h-5 w-5 text-emerald-600"/>
                                                            </button>
                                                        )}
                                                        <button
                                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                        >
                                                            <Trash2 className="h-5 w-5 text-red-600"/>
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mt-2 mb-4">{announcement.description}</p>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                                        <span className="text-sm">Date limite: {announcement.deadline}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                                        <span className="text-sm">Type: {announcement.type}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {/* Replace the existing requirements mapping with: */}
                                                    <RequirementsList requirements={announcement.requirements} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredAnnouncements.length === 0 && (
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

                            {selectedAnnouncement && (
                                <AnnouncementDetailsModal
                                    announcement={selectedAnnouncement}
                                    onClose={() => setSelectedAnnouncement(null)}
                                />
                            )}
                            {editingAnnouncement && (
                                <EditAnnouncementModal
                                    announcement={editingAnnouncement}
                                    onClose={() => setEditingAnnouncement(null)}
                                    onUpdate={handleUpdateAnnouncement}
                                />
                            )}
                        </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default NGOAnnouncementsPage;
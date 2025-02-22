import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";
import {
    Search,
    Calendar,
    Users,
    CheckCircle,
    X,
    Eye,
    Menu,
    LogOut,
    Settings,
    Bell,
    Filter,
    ArrowLeft,
    Download,
    Mail,
    UserCheck,
    UserMinus,
    User,
    Clock,
    Calendar as CalendarIcon,
    ClipboardList, FileText
} from 'lucide-react';
import api from "../../../Services/api.js";
import { Card } from "../../../components/ui/card.jsx";
import EventImage from "../Events/EventImage.jsx";


const EventRegistrationsPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [pendingRegistrations, setPendingRegistrations] = useState(0);
    const [approvedRegistrations, setApprovedRegistrations] = useState(0);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    useEffect(() => {
        fetchEventDetails();
        fetchRegistrations();
    }, [eventId]);

    useEffect(() => {
        // Calculate stats whenever registrations change
        setTotalRegistrations(registrations.length);
        setPendingRegistrations(registrations.filter(reg => reg.status === 'pending').length);
        setApprovedRegistrations(registrations.filter(reg => reg.status === 'approved').length);
    }, [registrations]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/${eventId}/`);
            setEvent(response.data);
        } catch (err) {
            console.error('Error fetching event details:', err);
            setError('Failed to load event details. Please try again later.');
        }
    };

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/events/${eventId}/registrations/`);
            setRegistrations(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setError('Failed to load registrations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (registrationId, newStatus) => {
        try {
            const response = await api.patch(`/events/${eventId}/registrations/${registrationId}/`, {
                status: newStatus
            });

            // Update the registrations list with the updated registration
            setRegistrations(registrations.map(reg =>
                reg.id === registrationId ? response.data : reg
            ));

            // Close the details modal if open
            if (selectedRegistration && selectedRegistration.id === registrationId) {
                setSelectedRegistration(null);
            }

        } catch (err) {
            console.error('Error updating registration status:', err);
            alert('Failed to update registration status. Please try again.');
        }
    };

    const handleExportAttendees = () => {
        const approvedAttendees = registrations.filter(reg => reg.status === 'approved');

        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Name,Email,Phone,Registration Date,Type\n";

        approvedAttendees.forEach(attendee => {
            const row = [
                `"${attendee.user_name}"`,  // Changed from user.username
                `"${attendee.user_email}"`, // Changed from user.email
                `"${attendee.user_phone || 'N/A'}"`, // Changed from user.phone
                `"${new Date(attendee.registration_date).toLocaleDateString()}"`,
                `"${attendee.user_type}"` // Changed from user.role
            ].join(",");
            csvContent += row + "\n";
        });

        // Create download link and trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${event?.title || 'Event'}_Attendees.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendReminderEmails = async () => {
        try {
            await api.post(`/events/${eventId}/send-reminders/`);
            alert('Reminder emails have been sent to all approved attendees.');
        } catch (err) {
            console.error('Error sending reminders:', err);
            alert('Failed to send reminder emails. Please try again later.');
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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            waitlist: "bg-blue-100 text-blue-800",
        };
        const statusLabels = {
            pending: "En attente",
            approved: "Approuvé",
            rejected: "Refusé",
            waitlist: "Liste d'attente"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
                {statusLabels[status]}
            </span>
        );
    };

    const filteredRegistrations = registrations
        .filter(reg => {
            // Apply search filter
            const searchLower = searchTerm.toLowerCase();
            return reg.user_name.toLowerCase().includes(searchLower) ||
                reg.user_email.toLowerCase().includes(searchLower);
        })
        .filter(reg => statusFilter === 'all' || reg.status === statusFilter);

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
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <Calendar className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Événements</span>
                        </a>
                        <a href="/association/registrations"
                           className="flex items-center space-x-2 xl:space-x-3 bg-emerald-600/50 text-white px-3 xl:px-4 py-2 xl:py-3 rounded-lg">
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
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/association/events')}
                        className="flex items-center text-emerald-700 hover:text-emerald-800 mb-6"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Retour aux événements
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        {event ? (
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-64 h-48 md:h-auto rounded-lg overflow-hidden">
                                    {event.image ? (
                                        <div className="h-full w-full">
                                            <EventImage
                                                image={event.image}
                                                title={event.title}
                                                className="h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                            <Calendar className="h-12 w-12 text-gray-400"/>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        <div className="flex items-center text-gray-600">
                                            <CalendarIcon className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{event.time}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{approvedRegistrations} / {event.capacity} places</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{event.description.substring(0, 200)}...</p>
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600">Unable to load event details. Please try again.</p>
                            </div>
                        )}
                    </div>

                    {/* Registration Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Total Inscriptions</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{totalRegistrations}</h3>
                                </div>
                                <div className="bg-emerald-100 p-3 rounded-full">
                                    <Users className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">En attente</p>
                                    <h3 className="text-3xl font-bold text-yellow-600">{pendingRegistrations}</h3>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-full">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Approuvés</p>
                                    <h3 className="text-3xl font-bold text-green-600">{approvedRegistrations}</h3>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                        <button
                            onClick={handleExportAttendees}
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Exporter les participants
                        </button>
                        <button
                            onClick={handleSendReminderEmails}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Mail className="h-5 w-5 mr-2" />
                            Envoyer des rappels
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Rechercher par nom ou email..."
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
                                    <option value="pending">En attente</option>
                                    <option value="approved">Approuvé</option>
                                    <option value="rejected">Refusé</option>
                                    <option value="waitlist">Liste d'attente</option>
                                </select>
                                <button className="p-3 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5 text-gray-600"/>
                                </button>
                            </div>
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
                                    onClick={fetchRegistrations}
                                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </Card>
                    ) : (
                        <>
                            {/* Registrations List */}
                            <div className="space-y-4">
                                {filteredRegistrations.length > 0 ? (
                                    filteredRegistrations.map((registration) => (
                                        <div key={registration.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                            <div className="p-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-gray-100 p-3 rounded-full">
                                                            <User className="h-6 w-6 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {registration.user.username}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">{registration.user.email}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {getStatusBadge(registration.status)}
                                                                <span className="text-xs text-gray-500">
                                                                     {registration.user.role} • Inscrit le {new Date(registration.registration_date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-2 md:mt-0">
                                                        {registration.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(registration.id, 'approved')}
                                                                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                                >
                                                                    <UserCheck className="h-4 w-4 mr-1" />
                                                                    Approuver
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(registration.id, 'rejected')}
                                                                    className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                                                                >
                                                                    <UserMinus className="h-4 w-4 mr-1" />
                                                                    Refuser
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => setSelectedRegistration(registration)}
                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Détails
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune inscription</h3>
                                            <p className="text-gray-600 mb-6">
                                                {searchTerm || statusFilter !== 'all'
                                                    ? "Aucune inscription ne correspond à vos critères de recherche"
                                                    : "Vous n'avez pas encore reçu d'inscriptions pour cet événement"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Registration Details Modal */}
            {selectedRegistration && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Détails de l'inscription</h2>
                                <button
                                    onClick={() => setSelectedRegistration(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Informations personnelles</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Nom</p>
                                            <p className="font-medium">{selectedRegistration.user_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Type</p>
                                            <p className="font-medium">{selectedRegistration.user_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedRegistration.user_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Téléphone</p>
                                            <p className="font-medium">{selectedRegistration.user_phone || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Détails de l'inscription</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Date d'inscription</p>
                                            <p className="font-medium">{new Date(selectedRegistration.registration_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Statut actuel</p>
                                            <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                                        </div>
                                    </div>
                                </div>

                                {selectedRegistration.message && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-2">Message</h3>
                                        <p className="text-gray-700">{selectedRegistration.message}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold text-lg mb-3">Actions</h3>
                                    <div className="flex gap-3">
                                        {selectedRegistration.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(selectedRegistration.id, 'approved')}
                                                    className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700"
                                                >
                                                    Approuver l'inscription
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(selectedRegistration.id, 'rejected')}
                                                    className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700"
                                                >
                                                    Refuser l'inscription
                                                </button>
                                            </>
                                        )}
                                        {selectedRegistration.status === 'approved' && (
                                            <button
                                                onClick={() => handleStatusChange(selectedRegistration.id, 'rejected')}
                                                className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg hover:bg-red-700"
                                            >
                                                Annuler l'inscription
                                            </button>
                                        )}
                                        {selectedRegistration.status === 'rejected' && (
                                            <button
                                                onClick={() => handleStatusChange(selectedRegistration.id, 'approved')}
                                                className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700"
                                            >
                                                Approuver l'inscription
                                            </button>
                                        )}
                                        {selectedRegistration.status === 'waitlist' && (
                                            <button
                                                onClick={() => handleStatusChange(selectedRegistration.id, 'approved')}
                                                className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700"
                                            >
                                                Approuver depuis la liste d'attente
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedRegistration(null)}
                                            className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventRegistrationsPage;
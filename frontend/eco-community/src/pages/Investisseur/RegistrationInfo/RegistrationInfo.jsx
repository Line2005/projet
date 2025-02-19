import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    AlertCircle,
    Check,
    XCircle,
    Clock,
    X,
    Menu,
    FileText,
    MessageSquare,
    HelpCircle, Info, Users, Settings, LogOut, ClipboardCheck, Mail, Badge
} from 'lucide-react';
import {logoutUser} from "../../../Services/auth.js";
import api from "../../../Services/api.js";
import {Card, CardContent, CardHeader, CardTitle} from "../../../components/ui/card.jsx";


const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await api.get('/event-registrations-info/');
            setRegistrations(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch your registrations');
            console.error('Error fetching registrations:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            waitlist: 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <Check className="h-5 w-5 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'waitlist':
                return <Clock className="h-5 w-5 text-blue-600" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-600" />;
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

    const filteredRegistrations = selectedStatus === 'all'
        ? registrations
        : registrations.filter(reg => reg.status === selectedStatus);

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
                    {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
            </div>
            {/* Side Navigation - Same as ProjectsPage */}
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
                        <a href="/investors/project"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <FileText className="h-5 w-5"/>
                            <span>Projets</span>
                        </a>
                        <a href="/investors/messages"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <MessageSquare className="h-5 w-5"/>
                            <span>Messages</span>
                        </a>
                        <a href="/investors/proposals"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <HelpCircle className="h-5 w-5"/>
                            <span>Proposition d'aide</span>
                        </a>
                        <a href="/investors/opportunity"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Info className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/investors/registration-info"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
                            <ClipboardCheck className="h-5 w-5"/>
                            <span>Info Inscription</span>
                        </a>
                        <a href="/investors/collaborators"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <Users className="h-5 w-5"/>
                            <span>Collaborateurs</span>
                        </a>
                        <a href="/investors/settings"
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
                        <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Card className="w-full">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl font-bold">Mes Inscriptions aux
                                            Événements</CardTitle>
                                        <div className="flex gap-2">
                                            {['all', 'pending', 'approved', 'rejected', 'waitlist'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setSelectedStatus(status)}
                                                    className={`px-4 py-2 rounded-lg transition-all ${
                                                        selectedStatus === status
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {filteredRegistrations.length === 0 ? (
                                        <div className="text-center py-6">
                                            <p className="text-gray-600">Vous n'êtes inscrit à aucun événement pour le
                                                moment.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {filteredRegistrations.map((registration) => (
                                                <div
                                                    key={registration.id}
                                                    className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-2">{registration.event_details?.title}</h3>
                                                            <div className="flex items-center gap-4 text-gray-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-emerald-500"/>
                                                                    <span>{registration.event_details?.date}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-emerald-500"/>
                                                                    <span>{registration.event_details?.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-emerald-500"/>
                                                                    <span>{registration.user_email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline"
                                                               className={`flex items-center gap-2 px-3 py-1 ${getStatusColor(registration.status)}`}>
                                                            {getStatusIcon(registration.status)}
                                                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    {registration.message && (
                                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                            <p className="text-sm text-gray-600">{registration.message}</p>
                                                        </div>
                                                    )}
                                                    <div className="mt-4 pt-4 border-t">
                                                        <div
                                                            className="flex justify-between items-center text-sm text-gray-500">
                                                            <span>Inscrit(e) le: {new Date(registration.registration_date).toLocaleDateString()}</span>
                                                            {/*<span>Type: {registration.user_type}</span>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRegistrations;
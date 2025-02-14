import React, {useEffect, useState} from 'react';
import { logoutUser } from "../../../../Services/auth.js";
import {
    FileText,
    HelpCircle,
    Info,
    Users,
    Calendar,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    X,
    DollarSign,
    Search,
    CheckCircle,
    XCircle,
    Eye,
    Wrench,
    HelpingHand,
    Trash
} from 'lucide-react';
import HelpRequestDetails from "../details/RequestModal.jsx";
import api from "../../../../Services/api.js";
import {Card} from "../../../../components/ui/card.jsx";

const HelpRequestsListPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [helpRequests, setHelpRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingRequestId, setUpdatingRequestId] = useState(null);

    // Fetch help requests from the API
    useEffect(() => {
        fetchHelpRequests();
    }, []);

    const fetchHelpRequests = async () => {
        try {
            const response = await api.get('/help-requests/');
            setHelpRequests(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching help requests:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    // Handle request status update
    const handleUpdateRequest = async (requestId, updateData) => {
        try {
            const response = await api.put(`/help-requests/${requestId}/`, updateData);

            // Update of the local data
            setHelpRequests(prevRequests =>
                prevRequests.map(request =>
                    request.id === requestId ? response.data : request
                )
            );

            // Add a success notification
            fetchHelpRequests();

        } catch (error) {
            console.error('Error updating request:', error);

        }
    };

    const handleDeleteRequest = async (requestId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                // Fix the string template syntax
                const response = await api.delete(`/help-requests/${requestId}/`);
                // Refresh projects list after deletion
                fetchHelpRequests();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    // Handle request status update
    const handleUpdateRequestStatus = async (requestId, newStatus) => {
        if (updatingRequestId) return; // Prevent multiple simultaneous updates

        setUpdatingRequestId(requestId);
        try {
            // Make API call to update status
            await api.post(`/help-requests/${requestId}/update-status/`, {
                status: newStatus
            });

            // Update only the specific request in local state
            setHelpRequests(prevRequests =>
                prevRequests.map(request =>
                    request.id === requestId
                        ? { ...request, status: newStatus }
                        : request
                )
            );

            console.log(`Request ${requestId} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating request status:', error);
            // You could add an error notification here
        } finally {
            setUpdatingRequestId(null);
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

    // Filter help requests based on active filter and search query
    const getFilteredRequests = () => {
        return helpRequests.filter(request => {
            // Filter by request_type (matches backend model)
            if (activeFilter !== 'all' && request.request_type !== activeFilter) {
                return false;
            }

            // Filter by search query
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    request.project_details.project_name.toLowerCase().includes(searchLower) ||
                    request.specific_need.toLowerCase().includes(searchLower) ||
                    request.description.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    };

    const filteredRequests = getFilteredRequests();

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'Résolu';
            case 'pending':
                return 'En attente';
            default:
                return status;
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

            {/* Mobile Navigation */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:block shadow-xl`}>
                {/* Same sidebar content as before */}
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
                        <a href="/entrepreneur/announce"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
                            <HelpCircle className="h-5 w-5"/>
                            <span>Demandes d'aide</span>
                        </a>
                        <a href="/entrepreneur/help"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <HelpingHand className="h-5 w-5"/>
                            <span>Proposition d'aide</span>
                        </a>
                        <a href="/entrepreneur/opportunity"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <Info className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/entrepreneur/collaborators"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <Users className="h-5 w-5"/>
                            <span>Collaborateurs</span>
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demandes d'aide</h1>
                            <p className="text-gray-600">Gérez et suivez toutes les demandes d'aide des projets</p>
                        </div>
                    </div>

                    {/* Content Rendering Logic */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : error ? (
                        <Card className="p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <X className="h-16 w-16 text-red-400 mx-auto mb-4"/>
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

                        {/* Filters and Search */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6 backdrop-blur-lg bg-opacity-90">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`px-4 py-2 rounded-lg ${
                                            activeFilter === 'all'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } transition-all duration-200`}
                                    >
                                        Toutes
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('financial')}
                                        className={`px-4 py-2 rounded-lg flex items-center ${
                                            activeFilter === 'financial'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } transition-all duration-200`}
                                    >
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Financière
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('technical')}
                                        className={`px-4 py-2 rounded-lg flex items-center ${
                                            activeFilter === 'technical'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } transition-all duration-200`}
                                    >
                                        <Wrench className="h-4 w-4 mr-2" />
                                        Technique
                                    </button>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Help Requests Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                request.request_type === 'financial'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {request.request_type === 'financial' ? (
                                                    <span className="flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                        Aide Financière
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <Wrench className="h-4 w-4 mr-1" />
                                                        Aide Technique
                                                    </span>
                                                )}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                                {getStatusText(request.status)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {request.project.project_name}
                                        </h3>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {request.specific_need}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                                <span className="text-sm">{new Date(request.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {request.type === 'financial' && (
                                                <div className="flex items-center text-gray-600">
                                                    <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                                                    <span className="text-sm">{request.financial_details.amount_requested.toLocaleString()} FCFA</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUpdateRequestStatus(request.id, 'completed')}
                                                    disabled={request.status === 'completed' || updatingRequestId === request.id}
                                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 ${
                                                        request.status === 'completed' || updatingRequestId === request.id
                                                            ? 'bg-gray-300 cursor-not-allowed'
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    }`}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2"/>
                                                    {updatingRequestId === request.id ? 'Mise à jour...' : 'Résolu'}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateRequestStatus(request.id, 'pending')}
                                                    disabled={request.status === 'pending' || updatingRequestId === request.id}
                                                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 ${
                                                        request.status === 'pending' || updatingRequestId === request.id
                                                            ? 'bg-gray-300 cursor-not-allowed'
                                                            : 'bg-red-600 text-white hover:bg-red-700'
                                                    }`}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2"/>
                                                    {updatingRequestId === request.id ? 'Mise à jour...' : 'Non Résolu'}
                                                </button>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="w-full flex items-center justify-center px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                                                        onClick={() => {
                                                            setSelectedRequest(request);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2"/>
                                                        Voir Détails
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center justify-center px-4 py-2 border-2 border-red-400 text-red-600 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                                                        onClick={() => {
                                                            handleDeleteRequest(request?.id);
                                                        }}
                                                    >
                                                        <Trash className="h-4 w-4 mr-2"/>
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
                    )}

                    {/* Empty State */}
                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune demande trouvée</h3>
                                <p className="text-gray-600">
                                    {searchQuery
                                        ? "Aucune demande ne correspond à votre recherche"
                                        : "Il n'y a pas encore de demandes d'aide"}
                                </p>
                            </div>
                        </div>
                    )}
                    <HelpRequestDetails
                        request={selectedRequest}
                        isOpen={isDetailsOpen}
                        onClose={() => {
                            setIsDetailsOpen(false);
                            setSelectedRequest(null);
                        }}
                        onUpdate={handleUpdateRequest}
                        onRefresh={fetchHelpRequests}
                    />
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleMobileMenu}
                />
            )}
        </div>
    );
};

export default HelpRequestsListPage;
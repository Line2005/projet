import React, {useEffect, useState} from 'react';
import { logoutUser } from "../../../Services/auth.js";
import { FileText, HelpCircle, Info, Users, Calendar, BarChart2, Settings, LogOut, Menu, X, DollarSign, Search, Wrench, MessageCircle, AlertCircle, Eye } from 'lucide-react';
import api from "../../../Services/api.js";
import RequestDetails from "../Requests/details/RequestModal.jsx";
import {useNavigate} from "react-router-dom";

const ProjectRequestsInvestorPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [helpRequests, setHelpRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for project requests
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

    const handleProposeHelp = (request) => {
        // Navigate to the appropriate help proposal page based on request type
        if (request.request_type === 'technical') {
            navigate('/investors/technicalHelp', { state: { project: request } });
        } else if (request.request_type === 'financial') {
            navigate('/investors/financialHelp', { state: { project: request } });
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

    const getFilteredRequests = () => {
        return helpRequests.filter(request => {
            if (activeFilter !== 'all' && request.request_type !== activeFilter) {
                return false;
            }

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    request.project.name?.toLowerCase().includes(searchLower) ||
                    request.description?.toLowerCase().includes(searchLower) ||
                    request.specific_need?.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const handleStartDiscussion = (requestId) => {
        console.log(`Starting discussion for request ${requestId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-emerald-600 text-white"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar */}
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
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg">
                            <FileText className="h-5 w-5"/>
                            <span>Projets</span>
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
                        <a href="/collaborators"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Users className="h-5 w-5"/>
                            <span>Collaborateurs</span>
                        </a>
                        <a href="/dashboard"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <BarChart2 className="h-5 w-5"/>
                            <span>Tableau de bord</span>
                        </a>
                        <a href="/settings"
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projets à Soutenir</h1>
                            <p className="text-gray-600">Découvrez des projets innovants à soutenir financièrement ou techniquement</p>
                        </div>
                    </div>
                    {/* Loading State */}
                    {isLoading ? (
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
                            {/* Filters and Search */}
                            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setActiveFilter('all')}
                                            className={`px-4 py-2 rounded-lg ${
                                                activeFilter === 'all'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Tous les projets
                                        </button>
                                        <button
                                            onClick={() => setActiveFilter('financial')}
                                            className={`px-4 py-2 rounded-lg flex items-center ${
                                                activeFilter === 'financial'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            Besoin Financier
                                        </button>
                                        <button
                                            onClick={() => setActiveFilter('technical')}
                                            className={`px-4 py-2 rounded-lg flex items-center ${
                                                activeFilter === 'technical'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Wrench className="h-4 w-4 mr-2" />
                                            Support Technique
                                        </button>
                                    </div>
                                    <div className="relative w-full md:w-64">
                                        <input
                                            type="text"
                                            placeholder="Rechercher un projet..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Project Requests Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {getFilteredRequests().map((request) => (
                                    <div key={request.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
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
                                                            Financier
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <Wrench className="h-4 w-4 mr-1" />
                                                            Technique
                                                        </span>
                                                    )}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    request.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {request.status === 'pending' ? 'En attente' : 'Complété'}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {request.specific_need}
                                            </h3>

                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {request.description}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                                    <span className="text-sm">{formatDate(request.created_at)}</span>
                                                </div>
                                                {request.request_type === 'financial' && request.financial_details && (
                                                    <div className="flex items-center text-gray-600">
                                                        <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                                                        <span className="text-sm">
                                                            {formatAmount(request.financial_details.amount_requested)}
                                                        </span>
                                                    </div>
                                                )}
                                                {request.request_type === 'technical' && request.technical_details && (
                                                    <div className="flex items-center text-gray-600">
                                                        <AlertCircle className="h-4 w-4 mr-2 text-emerald-500" />
                                                        <span className="text-sm">{request.technical_details.expertise_needed}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                                    onClick={() => handleProposeHelp(request)}
                                                >
                                                    <Wrench className="h-4 w-4 mr-2" />
                                                    Proposer mon aide
                                                </button>
                                                <button
                                                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
                                                >
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                    Discuter du projet
                                                </button>
                                                <button
                                                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir les détails
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {getFilteredRequests().length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun projet trouvé</h3>
                                        <p className="text-gray-600">
                                            {searchQuery
                                                ? "Aucun projet ne correspond à votre recherche"
                                                : "Il n'y a pas encore de projets à soutenir"}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <RequestDetails
                                request={selectedRequest}
                                onClose={() => {
                                    setSelectedRequest(null);
                                }}

                            />
                        </>
                    )}
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectRequestsInvestorPage;
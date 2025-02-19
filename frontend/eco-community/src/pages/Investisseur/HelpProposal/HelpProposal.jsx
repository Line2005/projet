import React, {useEffect, useState} from 'react';
import { logoutUser } from "../../../Services/auth.js";
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
    Wrench,
    MessageCircle,
    Check,
    Clock,
    X as XMark,
    AlertCircle,
    Trash2, MessageSquare, ClipboardCheck
} from 'lucide-react';
import api from "../../../Services/api.js";
import {Card} from "../../../components/ui/card.jsx";
import {ProposalDetailModal} from "./Details/ProposalModal.jsx";

const HelpProposalsPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [isDeletingProposal, setIsDeletingProposal] = useState(false);

    // Mock data for proposals
    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const [financialResponse, technicalResponse] = await Promise.all([
                    api.get('/proposals/financial'),
                    api.get('/proposals/technical')
                ]);

                // Format the proposals from both responses
                const formattedProposals = [
                    ...financialResponse.data.map(fp => ({
                        ...fp,
                        type: 'financial',
                        formattedAmount: new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XAF'
                        }).format(fp.investment_amount)
                    })),
                    ...technicalResponse.data.map(tp => ({
                        ...tp,
                        type: 'technical'
                    }))
                ];

                setProposals(formattedProposals);
                setError(null);
            } catch (err) {
                setError('Erreur lors du chargement des propositions');
                console.error('Error fetching proposals:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, []);

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'refused':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <Check className="h-4 w-4 mr-1" />;
            case 'refused':
                return <XMark className="h-4 w-4 mr-1" />;
            default:
                return <Clock className="h-4 w-4 mr-1" />;
        }
    };

    const handleDeleteProposal = async (proposal, event) => {
        event.stopPropagation(); // Prevent opening details modal

        if (isDeletingProposal) return;

        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette proposition ? Cette action est irréversible.')) {
            return;
        }

        setIsDeletingProposal(true);
        try {
            // Updated API endpoint to match the URL pattern
            await api.delete(`/proposals/${proposal.type}/${proposal.id}/`);

            setProposals(prevProposals =>
                prevProposals.filter(p => !(p.id === proposal.id && p.type === proposal.type))
            );
        } catch (error) {
            console.error('Error deleting proposal:', error);
            alert('Erreur lors de la suppression de la proposition');
        } finally {
            setIsDeletingProposal(false);
        }
    };

    const handleViewDetails = (proposal) => {
        setSelectedProposal(proposal);
        setIsDetailModalOpen(true);
    };

    const getFilteredProposals = () => {
        return proposals.filter(proposal => {
            if (activeFilter !== 'all' && proposal.type !== activeFilter) {
                return false;
            }

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    proposal.help_request_details?.specific_need?.toLowerCase().includes(searchLower) ||
                    proposal.expertise?.toLowerCase().includes(searchLower) ||
                    proposal.proposed_approach?.toLowerCase().includes(searchLower)
                );
            }

            return true;
        });
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Sidebar (reused from ProjectRequestsInvestorPage) */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 shadow-xl ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8 flex items-center">
                        <FileText className="h-6 w-6 mr-2"/>
                        EcoCommunity
                    </h2>
                    <nav className="space-y-2">
                        <a href="/investors/project"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <FileText className="h-5 w-5"/>
                            <span>Projets</span>
                        </a>
                        <a href="/investors/messages"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <MessageSquare className="h-5 w-5"/>
                            <span>Messages</span>
                        </a>
                        <a href="/investors/proposals"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg">
                            <HelpCircle className="h-5 w-5"/>
                            <span>Proposition d'aide</span>
                        </a>
                        <a href="/investors/opportunity"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Info className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/investors/registration-info"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <ClipboardCheck className="h-5 w-5"/>
                            <span>Info Inscription</span>
                        </a>
                        <a href="/investors/collaborators"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Users className="h-5 w-5"/>
                            <span>Collaborateurs</span>
                        </a>
                        <a href="/investors/settings"
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Propositions d'Aide</h1>
                            <p className="text-gray-600">Suivez l'état de vos propositions de soutien aux projets</p>
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
                                    Toutes les propositions
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
                                    Soutien Financier
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
                                    placeholder="Rechercher une proposition..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Proposals Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {getFilteredProposals().map((proposal) => (
                            <div key={`${proposal.type}-${proposal.id}`}
                                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            proposal.type === 'financial'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {proposal.type === 'financial' ? (
                                                <span className="flex items-center">
                                                    <DollarSign className="h-4 w-4 mr-1"/>
                                                    Financier
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Wrench className="h-4 w-4 mr-1"/>
                                                    Technique
                                                </span>
                                            )}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusStyle(proposal.status)}`}>
                                            {getStatusIcon(proposal.status)}
                                            {proposal.status === 'accepted' ? 'Acceptée' :
                                                proposal.status === 'refused' ? 'Refusée' : 'En attente'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {proposal.help_request_details?.specific_need || 'Untitled Proposal'}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{proposal.investor_name}</span>
                                        </div>
                                        {proposal.type === 'financial' && (
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">{proposal.formattedAmount}</span>
                                            </div>
                                        )}
                                        {proposal.type === 'technical' && (
                                            <div className="flex items-center text-gray-600">
                                                <Info className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">{proposal.expertise}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">
                                            {new Date(proposal.created_at).toLocaleDateString()}
                                          </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewDetails(proposal)}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                        >
                                            <MessageCircle className="h-4 w-4 mr-2"/>
                                            Voir les détails
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteProposal(proposal, e)}
                                            disabled={isDeletingProposal}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2"/>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                            {/* Empty State */}
                            {getFilteredProposals().length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune proposition trouvée</h3>
                                <p className="text-gray-600">
                                    {searchQuery
                                        ? "Aucune proposition ne correspond à votre recherche"
                                        : "Vous n'avez pas encore fait de propositions d'aide"}
                                </p>
                            </div>
                        </div>
                    )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile menu button and overlay */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-emerald-600 text-white"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <ProposalDetailModal
                proposal={selectedProposal}
                onClose={() => {
                    setSelectedProposal(null);
                }}
            />
        </div>
    );
};

export default HelpProposalsPage;
import React, {useEffect, useState} from 'react';
import { logoutUser } from "../../../Services/auth.js";
import { FileText, HelpCircle, Info, Users, Calendar, BarChart2, Settings, LogOut, Menu, X, DollarSign, Search, Wrench, MessageCircle, Check, Clock, HelpingHand, X as XMark } from 'lucide-react';
import {proposalService} from "../../../Services/entrepreneur/proposalService.js";
import {Card} from "../../../components/ui/card.jsx";
import toast from "react-hot-toast";
import Progress from "../../../components/ui/progress.jsx";
import ProposalProgress from "./progressBar.jsx";

const HelpPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestAmounts, setRequestAmounts] = useState({});

    // Mock data for received help proposals
    useEffect(() => {
        fetchProposals();
    }, [activeFilter]);

    const transformProposal = (proposal, type) => {

        // Extract help request details more safely
        const helpRequest = proposal.help_request || {};
        const helpRequestDetails = proposal.help_request_details || {};        const projectDetails = helpRequest.project || {};

        return {
            id: proposal.id,
            type: type,
            helpRequestId: helpRequest.id,
            projectName: helpRequestDetails.project_name || "Projet sans nom", // Fallback if name is missing
            description: helpRequestDetails.specific_need || proposal.proposed_approach || "Aucune description",
            investor: proposal.investor_name || "Investisseur anonyme",
            mentor: proposal.investor_name || "Mentor anonyme",
            status: proposal.status || 'pending',
            submissionDate: new Date(proposal.created_at).toLocaleDateString(),
            // Add additional fields based on proposal type
            ...(type === 'financial' ? {
                amount: parseFloat(proposal.investment_amount) || 0,
                investmentType: proposal.investment_type,
                requestedAmount: parseFloat(helpRequestDetails.amount_requested) || 0,
            } : {
                // Technical specific fields
                expertise: proposal.expertise,
                duration: proposal.support_duration,
            })
        };
    };

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const type = activeFilter === 'all' ? null : activeFilter;
            const response = await proposalService.getProposals(type);

            let transformedProposals = [];
            if (type === null) {
                transformedProposals = [
                    ...response.financial_proposals.map(p => transformProposal(p, 'financial')),
                    ...response.technical_proposals.map(p => transformProposal(p, 'technical'))
                ];
            } else {
                transformedProposals = response.map(p => transformProposal(p, type));
            }

            // Get unique help request IDs for financial proposals only
            const uniqueHelpRequests = [...new Set(transformedProposals
                .filter(p => p.type === 'financial')
                .map(p => p.helpRequestId))];

            // Fetch amounts for each help request
            const amounts = {};
            for (const helpRequestId of uniqueHelpRequests) {
                if (helpRequestId) {  // Only fetch if helpRequestId exists
                    const amountData = await proposalService.getAcceptedAmount(helpRequestId);
                    amounts[helpRequestId] = amountData;
                }
            }

            setRequestAmounts(amounts);
            setProposals(transformedProposals);
            setError(null);
        } catch (err) {
            console.error('Error fetching proposals:', err);
            setError('Failed to fetch proposals');
        } finally {
            setLoading(false);
        }
    };

    // Example usage in your React component:
    const handleProposalAction = async (proposalId, type, action) => {
        try {
            const status = action === 'accept' ? 'accepted' : 'refused';
            await proposalService.updateProposalStatus(proposalId, type, status);
            await fetchProposals(); // Refresh proposals and amounts
            toast.success(`Proposition ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`);
        } catch (error) {
            toast.error(error.message);
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

    const getFilteredProposals = () => {
        return proposals.filter(proposal => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    proposal.description.toLowerCase().includes(searchLower) ||
                    proposal.projectName.toLowerCase().includes(searchLower) ||
                    (proposal.type === 'financial' ? proposal.investor : proposal.mentor).toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    };

    const renderProgressBar = (proposal) => {
        return <ProposalProgress proposal={proposal} requestAmounts={requestAmounts} />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Sidebar */}
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
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
                            <HelpingHand className="h-5 w-5"/>
                            <span>Propositions d'aide</span>
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
                        <a href="#"
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

            {/* Main Content */
            }
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Propositions d'aide reçues</h1>
                            <p className="text-gray-600">Gérez les propositions d'aide pour vos projets</p>
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
                                            <DollarSign className="h-4 w-4 mr-2"/>
                                            Aide Financière
                                        </button>
                                        <button
                                            onClick={() => setActiveFilter('technical')}
                                            className={`px-4 py-2 rounded-lg flex items-center ${
                                                activeFilter === 'technical'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Wrench className="h-4 w-4 mr-2"/>
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
                                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                                    </div>
                                </div>
                            </div>

                            {/* Proposals Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {getFilteredProposals().map((proposal) => (
                                    <div key={proposal.id}
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
                                                {proposal.projectName}
                                            </h3>

                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {proposal.description}
                                            </p>

                                            {proposal.type === 'financial' && renderProgressBar(proposal)}
                                            {/*)}*/}

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-gray-600">
                                                    <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                                    <span className="text-sm">
                                                {proposal.type === 'financial' ? proposal.investor : proposal.mentor}
                                            </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                                    <span className="text-sm">Reçue le {proposal.submissionDate}</span>
                                                </div>
                                            </div>

                                            {proposal.status === 'pending' && (
                                                <div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleProposalAction(proposal.id, proposal.type, 'accept')}
                                                            className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                                        >
                                                            <Check className="h-4 w-4 mr-2"/>
                                                            Accepter
                                                        </button>
                                                        <button
                                                            onClick={() => handleProposalAction(proposal.id, proposal.type, 'refuse')}
                                                            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                                        >
                                                            <XMark className="h-4 w-4 mr-2"/>
                                                            Refuser
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="w-full mt-3 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                                    >
                                                        <MessageCircle className="h-4 w-4 mr-2"/>
                                                        Voir les détails
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {getFilteredProposals().length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune proposition
                                            trouvée</h3>
                                        <p className="text-gray-600">
                                            {searchQuery
                                                ? "Aucune proposition ne correspond à votre recherche"
                                                : "Vous n'avez pas encore reçu de propositions d'aide"}
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
                    {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default HelpPage;
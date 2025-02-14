import React, {useEffect, useState} from 'react';
import { logoutUser } from "../../../Services/auth.js";
import {FileText, HelpCircle, Info, Users, Calendar, BarChart2, Settings, LogOut, Menu, X, DollarSign, Search, Wrench, Mail, Phone, Building, Filter, HelpingHand, Download, ChevronDown, ChevronUp, Eye, MessageCircle } from 'lucide-react';
import {Card} from "../../../components/ui/card.jsx";
import api from "../../../Services/api.js";
import InvestorStats from "./stats.jsx";
import EntrepreneurGroupedCollaborations from "./GroupCollaboration.jsx";

const CollaboratorPage = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiStats, setApiStats] = useState(null);
    const [groupedCollabs, setGroupedCollabs] = useState({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/collaborations/');

            // Set the API stats
            setApiStats(response.data.stats);

            // Group the collaborations
            const grouped = response.data.collaborations.reduce((acc, collab) => {
                const entrepreneurId = collab.entrepreneur_details.id;

                if (!acc[entrepreneurId]) {
                    acc[entrepreneurId] = {
                        entrepreneur: collab.entrepreneur_details,
                        collaborations: [],
                        totalInvestment: 0
                    };
                }

                acc[entrepreneurId].collaborations.push(collab);
                if (collab.collaboration_type === 'financial' && collab.contract_details?.investment_amount) {
                    acc[entrepreneurId].totalInvestment += parseFloat(collab.contract_details.investment_amount);
                }

                return acc;
            }, {});

            setGroupedCollabs(grouped);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:block shadow-xl`}>
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
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
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
            <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Collaborateurs</h1>
                        <p className="text-gray-600">Gérez vos partenaires financiers et techniques</p>
                    </div>
                </div>

                {/* Content Rendering Logic */}
                {loading ? (
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
                        {/* Stats Component */}
                        <InvestorStats
                            collaborationsData={groupedCollabs}
                            apiStats={apiStats}
                        />

                        {/* Grouped Collaborations Component */}
                        <EntrepreneurGroupedCollaborations
                            groupedCollabs={groupedCollabs}
                            onRefresh={fetchData}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default CollaboratorPage;
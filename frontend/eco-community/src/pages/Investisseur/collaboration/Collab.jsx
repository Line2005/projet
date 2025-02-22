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
    Mail,
    Phone,
    MessageCircle,
    Filter,
    ChevronDown,
    ChevronUp,
    Eye,
    Download,
    MessageSquare, ClipboardCheck
} from 'lucide-react';
import {Card} from "../../../components/ui/card.jsx";
import api from "../../../Services/api.js";
import CollaborationStats from "./stats.jsx";
import GroupedCollaborations from "./GroupCollab.jsx";

const InvestorCollaboratorsPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [apiStats, setApiStats] = useState(null);
    const [groupedCollabs, setGroupedCollabs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
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
            setLoading(false);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                className={`fixed top-0 left-0 h-full w-[16vw] min-w-48 max-w-72 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 shadow-xl`}>
                <div className="p-4 xl:p-6">
                    <h2 className="text-white text-xl xl:text-2xl font-bold mb-6 xl:mb-8 flex items-center">
                        <FileText className="h-5 w-5 xl:h-6 xl:w-6 mr-2"/>
                        EcoCommunity
                    </h2>
                    <nav className="space-y-1 xl:space-y-2">
                        <a href="/investors/project"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <FileText className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Projets</span>
                        </a>
                        <a href="/investors/messages"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <MessageSquare className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Messages</span>
                        </a>
                        <a href="/investors/proposals"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <HelpCircle className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Proposition d'aide</span>
                        </a>
                        <a href="/investors/opportunity"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <Info className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Annonces</span>
                        </a>
                        <a href="/investors/registration-info"
                           className="flex items-center space-x-2 xl:space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-3 xl:px-4 py-2 xl:py-3 rounded-lg transition-all duration-200">
                            <ClipboardCheck className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Info Inscription</span>
                        </a>
                        <a href="/investors/collaborators"
                           className="flex items-center space-x-2 xl:space-x-3 bg-emerald-600/50 text-white px-3 xl:px-4 py-2 xl:py-3 rounded-lg">
                            <Users className="h-4 w-4 xl:h-5 xl:w-5"/>
                            <span className="text-sm xl:text-base">Collaborateurs</span>
                        </a>
                        <a href="/investors/settings"
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Collaborations Actives</h1>
                            <p className="text-gray-600">Suivez vos investissements et mentorats en cours</p>
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
                            <CollaborationStats
                                collaborationsData={groupedCollabs}
                                apiStats={apiStats}
                            />

                            {/* Grouped Collaborations Component */}
                            <GroupedCollaborations
                                groupedCollabs={groupedCollabs}
                                onRefresh={fetchData}
                            />

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default InvestorCollaboratorsPage;
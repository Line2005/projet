import React, { useState } from 'react';
import { logoutUser } from "../../../Services/auth.js";
import {FileText, HelpCircle, Info, Users, Calendar, BarChart2, Settings, LogOut, Menu, X, DollarSign, Search, Building, MapPin, Mail, Phone, MessageCircle, ArrowUpRight, Filter } from 'lucide-react';

const InvestorCollaboratorsPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Mock data for accepted collaborations
    const collaborations = [
        {
            id: 1,
            entrepreneur: "Sophie Kamga",
            project: "Ferme Agricole Bio",
            type: "financial",
            amount: "5,000,000 FCFA",
            status: "active",
            startDate: "2024-02-01",
            duration: "24 mois",
            location: "Bafoussam, Cameroun",
            description: "Projet d'agriculture biologique avec production de légumes et fruits",
            progress: 65,
            avatar: "/api/placeholder/40/40",
            companyDetails: {
                name: "Eco Farms SARL",
                sector: "Agriculture",
                employees: "8-12"
            }
        },
        {
            id: 2,
            entrepreneur: "Marc Tendo",
            project: "Tech Innovation Hub",
            type: "technical",
            expertise: "Mentorat en développement logiciel",
            status: "active",
            startDate: "2024-01-15",
            duration: "6 mois",
            location: "Douala, Cameroun",
            description: "Incubateur technologique pour startups locales",
            progress: 40,
            avatar: "/api/placeholder/40/40",
            companyDetails: {
                name: "TechStart Cameroun",
                sector: "Technologie",
                employees: "4-6"
            }
        }
    ];

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

    const getFilteredCollaborations = () => {
        return collaborations.filter(collab => {
            if (activeFilter !== 'all' && collab.type !== activeFilter) {
                return false;
            }
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    collab.entrepreneur.toLowerCase().includes(searchLower) ||
                    collab.project.toLowerCase().includes(searchLower) ||
                    collab.companyDetails.name.toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
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
                        <a href="/investors/collaborators"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg">
                            <Users className="h-5 w-5"/>
                            <span>Collaborateurs</span>
                        </a>
                        <a href="/Dashboard/Dashboard"
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

            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 right-4 z-20">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white rounded-lg shadow-md"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6 text-gray-600"/>
                    ) : (
                        <Menu className="h-6 w-6 text-gray-600"/>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-blue-800 z-10 p-6">
                    <nav className="space-y-4">
                        <a href="/investor/dashboard"
                           className="flex items-center space-x-3 text-blue-100 hover:bg-blue-600/50 px-4 py-3 rounded-lg">
                            <BarChart2 className="h-5 w-5"/>
                            <span>Tableau de bord</span>
                        </a>
                        <a href="/investor/collaborators"
                           className="flex items-center space-x-3 bg-blue-600/50 text-white px-4 py-3 rounded-lg">
                            <Users className="h-5 w-5"/>
                            <span>Mes Collaborations</span>
                        </a>
                        <a href="/investor/opportunities"
                           className="flex items-center space-x-3 text-blue-100 hover:bg-blue-600/50 px-4 py-3 rounded-lg">
                            <Info className="h-5 w-5"/>
                            <span>Opportunités</span>
                        </a>
                        <a href="/investor/settings"
                           className="flex items-center space-x-3 text-blue-100 hover:bg-blue-600/50 px-4 py-3 rounded-lg">
                            <Settings className="h-5 w-5"/>
                            <span>Paramètres</span>
                        </a>
                    </nav>
                </div>
            )}

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

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Collaborations</p>
                                    <p className="text-2xl font-bold text-gray-900">{collaborations.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Investissements</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {collaborations.filter(c => c.type === 'financial').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-600"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Mentorats</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {collaborations.filter(c => c.type === 'technical').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-600"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Montant Total Investi</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {collaborations
                                            .filter(c => c.type === 'financial')
                                            .reduce((sum, c) => sum + parseInt(c.amount.replace(/[^0-9]/g, '')), 0)
                                            .toLocaleString()} FCFA
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-yellow-600"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-4 py-2 rounded-lg ${
                                        activeFilter === 'all'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Filter className="h-4 w-4 inline-block mr-2"/>
                                    Toutes les collaborations
                                </button>
                                <button
                                    onClick={() => setActiveFilter('financial')}
                                    className={`px-4 py-2 rounded-lg ${
                                        activeFilter === 'financial'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <DollarSign className="h-4 w-4 inline-block mr-2"/>
                                    Investissements
                                </button>
                                <button
                                    onClick={() => setActiveFilter('technical')}
                                    className={`px-4 py-2 rounded-lg ${
                                        activeFilter === 'technical'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Users className="h-4 w-4 inline-block mr-2"/>
                                    Mentorat
                                </button>
                            </div>
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Rechercher une collaboration..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                        </div>
                    </div>

                    {/* Collaborations Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {getFilteredCollaborations().map((collab) => (
                            <div key={collab.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src={collab.avatar}
                                                alt={collab.entrepreneur}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{collab.entrepreneur}</h3>
                                                <p className="text-gray-600">{collab.companyDetails.name}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            collab.type === 'financial' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            {collab.type === 'financial' ? 'Investissement' : 'Mentorat'}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <p className="text-gray-600 text-sm">{collab.description}</p>

                                        <div className="flex items-center text-gray-600">
                                            <FileText className="h-4 w-4 mr-2 text-blue-500"/>
                                            <span className="text-sm">Projet: {collab.project}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Building className="h-4 w-4 mr-2 text-blue-500"/>
                                            <span className="text-sm">Secteur: {collab.companyDetails.sector}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-blue-500"/>
                                            <span className="text-sm">{collab.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-blue-500"/>
                                            <span className="text-sm">Début: {collab.startDate} ({collab.duration})</span>
                                        </div>
                                        {collab.type === 'financial' ? (
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-2 text-blue-500"/>
                                                <span className="text-sm">Montant: {collab.amount}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-2 text-blue-500"/>
                                                <span className="text-sm">Expertise: {collab.expertise}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">Progression</span>
                                            <span className="text-sm font-medium text-gray-900">{collab.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${getProgressColor(collab.progress)} h-2 rounded-full transition-all duration-300`}
                                                style={{ width: `${collab.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex justify-between items-center">
                                        <button className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors">
                                            <MessageCircle className="h-4 w-4 mr-2"/>
                                            Contacter
                                        </button>
                                        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                                            <ArrowUpRight className="h-4 w-4 mr-2"/>
                                            Voir les détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorCollaboratorsPage;
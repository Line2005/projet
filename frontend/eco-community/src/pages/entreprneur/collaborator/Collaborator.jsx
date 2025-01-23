import React, { useState } from 'react';
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
    Mail,
    Phone,
    MapPin,
    Building,
    ExternalLink,
    Filter,
    HelpingHand
} from 'lucide-react';

const CollaboratorPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Mock data for collaborators
    const collaborators = [
        {
            id: 1,
            name: "Jean Dupont",
            type: "financial",
            project: "Ferme Agricole Durable",
            role: "Investisseur",
            contribution: "3,000,000 FCFA",
            startDate: "2024-01-20",
            duration: "12 mois",
            status: "active",
            email: "jean.dupont@email.com",
            phone: "+237 123456789",
            location: "Douala, Cameroun",
            organization: "Investment Corp",
            avatar: "/api/placeholder/40/40"
        },
        {
            id: 2,
            name: "Marie Kouam",
            type: "technical",
            project: "Ferme Agricole Durable",
            role: "Mentor Agriculture",
            expertise: "Agriculture durable, Gestion d'exploitation",
            startDate: "2024-01-25",
            duration: "6 mois",
            status: "active",
            email: "marie.k@email.com",
            phone: "+237 987654321",
            location: "Yaoundé, Cameroun",
            organization: "AgriTech Solutions",
            avatar: "/api/placeholder/40/40"
        },
        {
            id: 3,
            name: "Paul Biya",
            type: "technical",
            project: "Tech Hub Innovation",
            role: "Conseiller Marketing",
            expertise: "Marketing digital, Stratégie de croissance",
            startDate: "2024-01-15",
            duration: "3 mois",
            status: "completed",
            email: "paul.b@email.com",
            phone: "+237 456789123",
            location: "Bafoussam, Cameroun",
            organization: "Digital Marketing Pro",
            avatar: "/api/placeholder/40/40"
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getTypeStyle = (type) => {
        return type === 'financial'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800';
    };

    const getFilteredCollaborators = () => {
        return collaborators.filter(collaborator => {
            if (activeFilter !== 'all' && collaborator.type !== activeFilter) {
                return false;
            }

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    collaborator.name.toLowerCase().includes(searchLower) ||
                    collaborator.project.toLowerCase().includes(searchLower) ||
                    collaborator.role.toLowerCase().includes(searchLower) ||
                    (collaborator.expertise && collaborator.expertise.toLowerCase().includes(searchLower))
                );
            }

            return true;
        });
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
                        <a href="#"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                            <BarChart2 className="h-5 w-5"/>
                            <span>Tableau de bord</span>
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
                        {isLoggingOut ? 'Déconnexion...' : ' Déconnexion'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Collaborateurs</h1>
                            <p className="text-gray-600">Gérez vos partenaires financiers et techniques</p>
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
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Filter className="h-4 w-4 inline-block mr-2" />
                                    Tous les collaborateurs
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
                                    Partenaires Financiers
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
                                    placeholder="Rechercher un collaborateur..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                        </div>
                    </div>

                    {/* Collaborators Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {getFilteredCollaborators().map((collaborator) => (
                            <div key={collaborator.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src={collaborator.avatar}
                                                alt={collaborator.name}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {collaborator.name}
                                                </h3>
                                                <p className="text-gray-600">{collaborator.role}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeStyle(collaborator.type)}`}>
                                            {collaborator.type === 'financial' ? (
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
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <FileText className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">Projet: {collaborator.project}</span>
                                        </div>
                                        {collaborator.type === 'financial' ? (
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">Contribution: {collaborator.contribution}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-gray-600">
                                                <Wrench className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">Expertise: {collaborator.expertise}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">Début: {collaborator.startDate} ({collaborator.duration})</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Building className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{collaborator.organization}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{collaborator.location}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex gap-2">
                                            <a href={`mailto:${collaborator.email}`} className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                                                <Mail className="h-4 w-4 mr-2"/>
                                                Email
                                            </a>
                                            <a href={`tel:${collaborator.phone}`} className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                                                <Phone className="h-4 w-4 mr-2"/>
                                                Appeler
                                            </a>
                                            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                                                <MessageCircle className="h-4 w-4 mr-2"/>
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {getFilteredCollaborators().length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun collaborateur trouvé</h3>
                                <p className="text-gray-600">
                                    {searchQuery
                                        ? "Aucun collaborateur ne correspond à votre recherche"
                                        : "Vous n'avez pas encore de collaborateurs actifs"}
                                </p>
                                <div className="mt-4">
                                    <a
                                        href="/entrepreneur/help"
                                        className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                    >
                                        <HelpCircle className="h-4 w-4 mr-2"/>
                                        Voir les propositions d'aide
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Collaborateurs Actifs</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {collaborators.filter(c => c.status === 'active').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <Users className="h-6 w-6 text-emerald-600"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Soutien Financier Total</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {collaborators
                                            .filter(c => c.type === 'financial')
                                            .reduce((sum, c) => sum + parseInt(c.contribution.replace(/[^0-9]/g, '')), 0)
                                            .toLocaleString()} FCFA
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-yellow-600"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Support Technique</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {collaborators.filter(c => c.type === 'technical').length} Mentors
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Wrench className="h-6 w-6 text-blue-600"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-emerald-600 text-white"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-64 bg-emerald-700 z-50 lg:hidden transform transition-transform duration-200 ease-in-out">
                        <div className="p-6">
                            <h2 className="text-white text-2xl font-bold mb-8 flex items-center">
                                <FileText className="h-6 w-6 mr-2"/>
                                EcoCommunity
                            </h2>
                            <nav className="space-y-2">
                                <a href="/entrepreneur/project" className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                                    <FileText className="h-5 w-5"/>
                                    <span>Mes Projets</span>
                                </a>
                                <a href="/entrepreneur/help" className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                                    <HelpCircle className="h-5 w-5"/>
                                    <span>Aide</span>
                                </a>
                                <a href="/entrepreneur/collaborators" className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
                                    <Users className="h-5 w-5"/>
                                    <span>Collaborateurs</span>
                                </a>
                                <a href="/entrepreneur/opportunity" className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                                    <Info className="h-5 w-5"/>
                                    <span>Annonces</span>
                                </a>
                            </nav>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <button className="flex items-center space-x-3 text-emerald-100 hover:bg-red-500/20 w-full px-4 py-3 rounded-lg transition-all duration-200">
                                <LogOut className="h-5 w-5"/>
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CollaboratorPage;
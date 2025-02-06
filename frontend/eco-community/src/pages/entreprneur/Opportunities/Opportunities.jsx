import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../../Services/auth.js";
import { Search, Plus, BarChart2, FileText, Settings, LogOut, Menu, X, Calendar, MapPin, Users, DollarSign, HelpCircle, Info, Bell, Tag, HandHelping, Clock } from 'lucide-react';

const OpportunityPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const categories = [
        { id: 'all', label: 'Tout' },
        { id: 'announcements', label: 'Annonces' },
        { id: 'events', label: 'Événements' }
    ];

    const types = {
        announcements: [
            { id: 'funding', label: 'Financement' },
            { id: 'training', label: 'Formation' },
            { id: 'partnership', label: 'Partenariat' },
            { id: 'opportunity', label: 'Opportunité' }
        ],
        events: [
            { id: 'forum', label: 'Forum' },
            { id: 'workshop', label: 'Atelier' },
            { id: 'webinar', label: 'Webinaire' },
            { id: 'conference', label: 'Conférence' }
        ]
    };

    // Sample combined data
    const opportunities = [
        {
            id: 1,
            category: 'announcements',
            type: 'funding',
            title: "Subvention pour projets agricoles",
            description: "Programme de financement pour les projets agricoles innovants.",
            deadline: "2024-03-30",
            organization: "Ministère de l'Agriculture",
            location: "National",
            requirements: ["Plan d'affaires", "Licence agricole"],
            status: "Actif",
            imageUrl: "/api/placeholder/400/250"
        },
        {
            id: 2,
            category: 'events',
            type: 'workshop',
            title: "Atelier sur l'Entrepreneuriat Digital",
            description: "Formation pratique sur le marketing digital et la gestion.",
            date: "2024-02-28",
            time: "14:00",
            organization: "Tech Hub Cameroun",
            location: "Douala",
            capacity: 50,
            requirements: ["Ordinateur portable"],
            status: "Actif",
            imageUrl: "/api/placeholder/400/250"
        }
    ];

    const getTypeColor = (type, category) => {
        const colors = {
            announcements: {
                funding: 'bg-green-100 text-green-800',
                training: 'bg-blue-100 text-blue-800',
                partnership: 'bg-purple-100 text-purple-800',
                opportunity: 'bg-orange-100 text-orange-800'
            },
            events: {
                forum: 'bg-indigo-100 text-indigo-800',
                workshop: 'bg-pink-100 text-pink-800',
                webinar: 'bg-yellow-100 text-yellow-800',
                conference: 'bg-cyan-100 text-cyan-800'
            }
        };
        return colors[category]?.[type] || 'bg-gray-100 text-gray-800';
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

    const filteredOpportunities = opportunities.filter(item => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (selectedType !== 'all' && item.type !== selectedType) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Side Navigation - Same as ProjectsPage */}
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
                            <HandHelping className="h-5 w-5"/>
                            <span>Proposition d'aide</span>
                        </a>
                        <a href="/entrepreneur/opportunity"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
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
                        {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                </div>
            </aside>


            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Annonces</h1>
                            <p className="text-gray-600">Découvrez les dernières opportunités pour votre projet</p>
                        </div>
                    </div>

                    {/* Type Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat.id);
                                            setSelectedType('all');
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedCategory === cat.id
                                                ? 'bg-emerald-600 text-white shadow-md'
                                                : 'bg-white text-gray-600 hover:bg-emerald-50'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Search Bar */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedType('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        selectedType === 'all'
                                            ? 'bg-emerald-600 text-white shadow-md'
                                            : 'bg-white text-gray-600 hover:bg-emerald-50'
                                    }`}
                                >
                                    Tous
                                </button>
                                {(selectedCategory === 'all'
                                        ? [...types.announcements, ...types.events]
                                        : types[selectedCategory] || []
                                ).map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            selectedType === type.id
                                                ? 'bg-emerald-600 text-white shadow-md'
                                                : 'bg-white text-gray-600 hover:bg-emerald-50'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                    {/* Announcements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredOpportunities.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
                            >
                                <div className="relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type, item.category)}`}>
                                            {item.type === 'funding' ? 'Financement' :
                                                item.type === 'training' ? 'Formation' :
                                                    item.type === 'partnership' ? 'Partenariat' :
                                                        item.type === 'forum' ? 'Forum' :
                                                            item.type === 'workshop' ? 'Atelier' :
                                                                item.type === 'webinar' ? 'Webinaire' :
                                                                    item.type === 'conference' ? 'Conférence' :
                                                                        'Opportunité'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{item.location}</span>
                                        </div>
                                        {item.category === 'events' ? (
                                            <>
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                                    <span className="text-sm">{item.date}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Clock className="h-4 w-4 mr-2 text-emerald-500"/>
                                                    <span className="text-sm">{item.time}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">Date limite: {item.deadline}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                            <span className="text-sm">{item.organization}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-all duration-200">
                                            {item.category === 'events' ? "S'inscrire" : 'Postuler'}
                                        </button>
                                        <button className="flex-1 border-2 border-emerald-600 text-emerald-600 py-2.5 rounded-lg hover:bg-emerald-50 transition-all duration-200">
                                            Voir détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*empty state*/}
                    {filteredOpportunities.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune opportunité disponible</h3>
                                <p className="text-gray-600 mb-6">Aucun résultat ne correspond à vos critères</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedType('all');
                                    }}
                                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                                >
                                    Voir toutes les opportunités
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpportunityPage;
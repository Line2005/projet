import React, {useEffect, useState} from 'react';
import { logoutUser } from "../../../Services/auth.js";
import {
    Search,
    FileText,
    Settings,
    LogOut,
    Calendar,
    MapPin,
    Users,
    HelpCircle,
    Info,
    Bell,
    HandHelping,
    AlertCircle,
    X, Menu
} from 'lucide-react';
import api from "../../../Services/api.js";
import OpportunityDetailModal from "../../opportunityDetails/OpportunityDetails.jsx";

const OpportunityPage = () => {
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            { id: 'webinars', label: 'Webinaire' },
            { id: 'conference', label: 'Conférence' }
        ]
    };

    // Add a function to get the image URL
    const getImageUrl = (item) => {
        if (!item || !item.image) {
            return "/api/placeholder/400/250";
        }

        const BASE_API_URL = 'http://127.0.0.1:8000';
        const image = item.image.toString().trim();

        // If it's already a full URL, return it
        if (image.startsWith('http')) {
            return image;
        }

        // If it's a relative URL starting with /, join it with base URL
        if (image.startsWith('/')) {
            return `${BASE_API_URL}${image}`;
        }

        // If it's just a path, join it with base URL
        return `${BASE_API_URL}/${image}`;
    };


    const getAvailableTypes = () => {
        if (selectedCategory === 'all') {
            return [...types.announcements, ...types.events];
        }
        return types[selectedCategory] || [];
    };

    useEffect(() => {
        fetchOpportunities();
    }, [selectedCategory]);

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            let data = [];

            if (selectedCategory === 'all' || selectedCategory === 'events') {
                const eventsResponse = await api.get('/public/events/');
                const eventsData = eventsResponse.data.map(event => ({
                    ...event,
                    category: 'events',
                    imageUrl: getImageUrl(event)
                }));
                data = [...data, ...eventsData];
            }

            if (selectedCategory === 'all' || selectedCategory === 'announcements') {
                const announcementsResponse = await api.get('/public/announcements/');
                const announcementsData = announcementsResponse.data.map(announcement => ({
                    ...announcement,
                    category: 'announcements',
                    imageUrl: getImageUrl(announcement)
                }));
                data = [...data, ...announcementsData];
            }

            setOpportunities(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch opportunities');
            console.error('Error fetching opportunities:', err);
        } finally {
            setLoading(false);
        }
    };


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
        const matchesType = selectedType === 'all' || item.type === selectedType;
        const matchesSearch = searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const renderOpportunityCard = (item) => (
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
            {types[item.category]?.find(t => t.id === item.type)?.label || item.type}
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
                                <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                <span className="text-sm">Capacité: {item.capacity}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
                                <span className="text-sm">Date limite: {item.registration_deadline}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Users className="h-4 w-4 mr-2 text-emerald-500"/>
                                <span className="text-sm">{item.organization?.name || 'Organization'}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => console.log(`Applying for opportunity ${item.id}`)}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-all duration-200"
                    >
                        {item.category === 'events' ? "S'inscrire" : 'Postuler'}
                    </button>
                    <button
                        onClick={() => {
                            setSelectedOpportunity(item);
                        }}
                        className="flex-1 border-2 border-emerald-600 text-emerald-600 py-2.5 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                    >
                        Voir détails
                    </button>
                </div>
            </div>
        </div>
    );

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
            {/* Side Navigation - Same as ProjectsPage */}
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
                        <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
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
                            {/* Filters */}
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
                                        {getAvailableTypes().map((type) => (
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

                            {/* Search Bar */}
                            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Rechercher..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
                                </div>
                            </div>

                            {/* Opportunities Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredOpportunities.map(renderOpportunityCard)}
                            </div>

                            {/* Empty State */}
                            {filteredOpportunities.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                        <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune opportunité disponible</h3>
                                        <p className="text-gray-600 mb-6">
                                            {error
                                                ? "Une erreur s'est produite lors du chargement des opportunités"
                                                : "Aucun résultat ne correspond à vos critères"}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSelectedType('all');
                                                setSearchQuery('');
                                            }}
                                            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                                        >
                                            Voir toutes les opportunités
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {/* Add the modal */}
            <OpportunityDetailModal
                opportunity={selectedOpportunity}
                onClose={() => {
                    setSelectedOpportunity(null);
                }}
            />
        </div>
    );
};

export default OpportunityPage;
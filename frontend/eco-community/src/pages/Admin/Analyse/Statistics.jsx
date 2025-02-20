import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {BarChart2, Users, Bell, User, LogOut, FileText, Network, Settings, FolderCheck} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart, Area
} from 'recharts';
import { useNavigate } from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "../../../components/ui/card.jsx";
import {logoutUser} from "../../../Services/auth.js";
import api from "../../../Services/api.js";
import PublicationsCard from "./PublicationChart.jsx";

const AdminAnalytics = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('analytics');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyticsData, setAnalyticsData] = useState({
        overview: [],
        monthly_stats: [],
        sector_data: [],
        proposal_stats: [],
        publications_data: [],
    });

    useEffect(() => {
        fetchAnalytics()
    }, []);


    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/analytics/');
            console.log('Raw Analytics Response:', response.data);
            console.log('Publications Data:', response.data.publications_data);
            setAnalyticsData(response.data);
            setError(null);
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };




    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const navigationItems = [
        { id: 'users', label: 'Utilisateurs', icon: Users, path: '/admin/dashboard' },
        { id: 'projects', label: 'Validation des projets', icon: FolderCheck, path: '/admin/project' },
        { id: 'analytics', label: 'Suivi et analyse', icon: BarChart2, path: '/admin/analytics' },
    ];

    const handleNavigation = (path, id) => {
        setActiveSection(id);
        navigate(path);
    };


    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            await logoutUser();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
                    <p className="font-semibold">{label}</p>
                    {payload.map((item, index) => (
                        <p key={index} className="text-sm" style={{ color: item.color }}>
                            {item.name}: {typeof item.value === 'number'
                            ? item.value.toLocaleString('fr-FR')
                            : item.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-600 p-4">
                    {error}
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.values(analyticsData.overview).map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                        >
                            <div className="p-4">
                                <h3 className="text-gray-800 font-semibold mb-1 text-sm">{stat.title}</h3>
                                <p className={`text-xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
                                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} depuis le dernier mois
                                </p>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Progress Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Évolution Mensuelle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analyticsData.monthly_stats}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month"/>
                                        <YAxis/>
                                        <Tooltip content={<CustomTooltip/>}/>
                                        <Legend/>
                                        <Line type="monotone" dataKey="projects" stroke="#4f46e5" name="Projets"/>
                                        <Line type="monotone" dataKey="financial" stroke="#10b981"
                                              name="Demandes d'aide Financière"/>
                                        <Line type="monotone" dataKey="technical" stroke="#f59e0b"
                                              name="Demande d'aide Technique"/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Publications card */}
                    <PublicationsCard data={analyticsData.publications_data} />

                    {/* Sector Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribution par Secteur</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analyticsData.sector_data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({name, value, percent}) =>
                                                `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {analyticsData.sector_data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip/>}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Success Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Évolution Mensuelle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analyticsData.proposal_stats}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month"/>
                                        <YAxis/>
                                        <Tooltip content={<CustomTooltip/>}/>
                                        <Legend/>
                                        <Line type="monotone" dataKey="total_requests" stroke="#4f46e5"
                                              name="Demandes d'aide"/>
                                        <Line type="monotone" dataKey="financial_proposal" stroke="#10b981"
                                              name="Proposition Financière"/>
                                        <Line type="monotone" dataKey="technical_proposal" stroke="#f59e0b"
                                              name="Proposition Technique"/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrateur</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20}/>
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                            <User size={20}/>
                            <span className="text-sm font-medium">Admin</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20}/>
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-16">
                    <nav className="p-4">
                        <ul className="space-y-1">
                            {navigationItems.map(({id, label, icon: Icon, path}) => (
                                <li key={id}>
                                <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                                            activeSection === id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleNavigation(path, id)}
                                    >
                                        <Icon size={20}/>
                                        <span className="font-medium">{label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 max-w-7xl mx-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminAnalytics;
import React, { useEffect, useState } from 'react';
import { Users, FolderCheck, BarChart2, FileText, Network, Settings, Bell, User, Search, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../Services/auth.js";
import { adminService } from '../../../Services/Admin/UserMangement.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card.jsx';
import api from "../../../Services/api.js";
import {Button} from "../../../components/ui/button.jsx";
import UserModal from "./Form.jsx";



const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('users');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUserStats = async () => {
        try {
            const response = await api.get('/admin/users/stats');
            const data = response.data;

            setStats([
                { title: 'Total Utilisateurs', value: data.total_users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { title: 'En attente de validation', value: data.pending_validation, color: 'text-orange-500', bgColor: 'bg-orange-50' },
                { title: 'Comptes bloqués', value: data.blocked_users, color: 'text-red-500', bgColor: 'bg-red-50' },
                { title: 'Entrepreneurs', value: data.role_distribution.entrepreneur, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Investisseurs', value: data.role_distribution.investor, color: 'text-purple-600', bgColor: 'bg-purple-50' },
                { title: 'Associations', value: data.role_distribution.ong_association, color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
            ]);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to fetch statistics');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedRole) params.append('role', selectedRole);

            const response = await api.get(`/admin/users?${params.toString()}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchUserStats(), fetchUsers()]);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const userRole = localStorage.getItem('userRole');

            if (!token || userRole !== 'admin') {
                navigate('/login');
                return;
            }

            try {
                await api.get('/admin/users');
                await fetchInitialData();
            } catch (error) {
                console.error('Auth check error:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userRole');
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchUpdatedUsers = async () => {
            await fetchUsers();
        };

        if (searchTerm || selectedRole) {
            fetchUpdatedUsers();
        }
    }, [searchTerm, selectedRole]);

    const handleCreateUser = async (userData) => {
        try {
            setError(null);

            // Ensure password and confirm_password are included
            if (!userData.password || !userData.confirm_password) {
                setError('Password and confirm password are required');
                return;
            }

            const response = await adminService.createUser({
                ...userData,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                password: userData.password,
                confirm_password: userData.confirm_password,
                ...(userData.role === 'ONG-Association'
                        ? {
                            organization_name: userData.organization_name,
                            registration_number: userData.registration_number,
                            founded_year: userData.founded_year,
                            mission_statement: userData.mission_statement,
                            website_url: userData.website_url,
                        }
                        : {
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                        }
                )
            });

            setUsers(prevUsers => [...prevUsers, response]);
            await fetchUserStats();
            setModalOpen(false);
        } catch (error) {
            // Extract the error message properly
            const errorMessage = error.response?.data?.error ||
                error.message ||
                'Failed to create user';
            setError(errorMessage);
            console.error('Create user error:', error);
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await adminService.updateUser(selectedUser.id, userData);
            // Update local state
            setUsers(users.map(user =>
                user.id === selectedUser.id ? response : user
            ));
            setModalOpen(false);
        } catch (error) {
            setError('Failed to update user');
            console.error('Update user error:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminService.deleteUser(userId);
                await fetchUsers();
                await fetchUserStats();
            } catch (error) {
                setError('Failed to delete user');
            }
        }
    };

    const handleUserStatusUpdate = async (userId, isBlocked) => {
        try {
            await adminService.updateUserStatus(userId, {
                is_blocked: isBlocked,
                is_active: !isBlocked // Also update the active status
            });

            // Update the local state immediately
            setUsers(users.map(user => {
                if (user.id === userId) {
                    return {
                        ...user,
                        is_blocked: isBlocked,
                        status: isBlocked ? 'Inactif' : 'Actif'
                    };
                }
                return user;
            }));

            // Refresh stats
            await fetchUserStats();
        } catch (error) {
            setError('Failed to update user status');
            console.error('Error updating user status:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
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

    const handleNavigation = (path, id) => {
        setActiveSection(id);
        navigate(path);
    };

    const navigationItems = [
        { id: 'users', label: 'Utilisateurs', icon: Users, path: '/admin/dashboard' },
        { id: 'projects', label: 'Validation des projets', icon: FolderCheck, path: '/admin/project' },
        { id: 'analytics', label: 'Suivi et analyse', icon: BarChart2, path: '/admin/analytics' },
        { id: 'content', label: 'Gestion du contenu', icon: FileText, path: '/admin/content' },
        { id: 'network', label: 'Mise en réseau', icon: Network, path: '/admin/network' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/settings' },
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600">Chargement...</p>
                </div>
            );
        }

        if (error) {
            // Make sure we're rendering a string, not an object
            const errorMessage = typeof error === 'object' ?
                (error.message || JSON.stringify(error)) : error;

            return (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur! </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats?.map((stat, index) => (
                        <div key={index}
                             className={`p-6 ${stat.bgColor} rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300`}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle>Liste des utilisateurs</CardTitle>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}/>
                                <input
                                    type="search"
                                    placeholder="Rechercher..."
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">Tous les rôles</option>
                                <option value="entrepreneur">Entrepreneurs</option>
                                <option value="investor">Investisseurs</option>
                                <option value="ONG-Association">Association</option>
                            </select>
                            <Button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setModalOpen(true);
                                }}
                                className="mb-4"
                            >
                                Add User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left p-4 text-gray-600">Nom</th>
                                    <th className="text-left p-4 text-gray-600">Email</th>
                                    <th className="text-left p-4 text-gray-600">Rôle</th>
                                    <th className="text-left p-4 text-gray-600">Statut</th>
                                    <th className="text-left p-4 text-gray-600">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="p-4">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">{user.role}</td>
                                        <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    user.status === 'Actif'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status}
                                                </span>
                                        </td>
                                        <td className="p-4">
                                            {/*<button*/}
                                            {/*    onClick={() => {*/}
                                            {/*        setSelectedUser(user);*/}
                                            {/*        setModalOpen(true);*/}
                                            {/*    }}*/}
                                            {/*    className="text-blue-600 hover:text-blue-800 font-medium mr-3"*/}
                                            {/*>*/}
                                            {/*    Edit*/}
                                            {/*</button>*/}
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-800 font-medium mr-3"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className={`font-medium ${
                                                    user.is_blocked
                                                        ? 'text-green-600 hover:text-green-800'
                                                        : 'text-red-600 hover:text-red-800'
                                                }`}
                                                onClick={() => handleUserStatusUpdate(user.id, !user.is_blocked)}
                                            >
                                                {user.is_blocked ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrateur</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                            <User size={20} />
                            <span className="text-sm font-medium">Admin</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-16">
                    <nav className="p-4">
                        <ul className="space-y-1">
                            {navigationItems.map(({id, label, icon: Icon, path}) => (
                                <li key={id}>
                                    <button
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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

                <main className="flex-1 p-6">
                    {renderContent()}
                    <UserModal
                        isOpen={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
                    />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
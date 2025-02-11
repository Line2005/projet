import {useEffect, useState} from 'react';
import { logoutUser } from "../../../Services/auth.js";
import {Settings, LogOut, Menu, X, Lock, User, Shield } from 'lucide-react';
import api from "../../../Services/api.js";
import Alert from "../../../components/ui/alert.jsx";
import {AlertDescription} from "@chakra-ui/react";

const ParamPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [userId, setUserId] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            console.log('Fetching user profile...'); // Debug log
            const userId = localStorage.getItem('userId');
            console.log('User ID from localStorage:', userId); // Debug log

            const response = await api.get(`/users/${userId}/profile/`);
            console.log('Profile response:', response.data); // Debug log

            setUserProfile(response.data);
            initializeFormData(response.data); // Initialize form data when profile is fetched
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err); // Debug log
            setError(err.response?.data?.error || 'Failed to load user profile');
            setLoading(false);
        }
    };

    const initializeFormData = (profile) => {
        if (!profile) return;

        console.log('Initializing form with profile:', profile); // Add this line

        const baseData = {
            email: profile.user?.email || '',
            phone: profile.user?.phone || '',
        };
        setFormData({
            ...baseData,
            organization_name: profile.organization_name || '',
            registration_number: profile.registration_number || '',
            founded_year: profile.founded_year || '',
            mission_statement: profile.mission_statement || '',
            website_url: profile.website_url || '',
            bio: profile.bio || ''
        });
    };

    const validateForm = () => {
        console.log('Validating form with data:', formData);

        if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!formData.phone?.match(/^\+?[\d\s-]{8,}$/)) {
            setError('Please enter a valid phone number');
            return false;
        }

        if (!formData.organization_name || !formData.registration_number) {
            setError('Organization name and registration number are required');
            return false;
        }

        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value); // Add this line
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getImageUrl = (relativePath) => {
        if (!relativePath) return null;
        // Replace this with your actual backend URL
        const BACKEND_URL = 'http://127.0.0.1:8000';
        // If the path already starts with http/https, return it as is
        if (relativePath.startsWith('http')) {
            return relativePath;
        }
        // Remove leading slash if it exists
        const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
        return `${BACKEND_URL}/${cleanPath}`;
    };

    const handleProfileUpdate = async () => {
        if (!validateForm()) return;

        try {
            const formattedData = {
                user: {
                    email: formData.email,
                    phone: formData.phone
                }
            };
            Object.assign(formattedData, {
                organization_name: formData.organization_name,
                registration_number: formData.registration_number,
                founded_year: formData.founded_year,
                mission_statement: formData.mission_statement,
                website_url: formData.website_url,
                bio: formData.bio
            });

            console.log('Sending update:', formattedData); // Add this line
            await api.patch(`/users/${userId}/profile/`, formattedData);
            setSuccessMessage('Profile updated successfully');
            await fetchUserProfile(userId);
        } catch (err) {
            console.error('Update error:', err.response); // Add this line
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('New passwords do not match');
            return;
        }

        try {
            await api.patch(`/users/${userId}/profile/`, passwordData);
            setSuccessMessage('Password updated successfully');
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update password');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            await api.post(`/users/${userId}/profile/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('Profile image updated successfully');
            await fetchUserProfile(userId);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload image');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/users/${userId}/profile/`);
            localStorage.clear();
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete account');
        }
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logoutUser();
            window.location.href = '/login';
        } catch (error) {
            setError('Logout failed');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Handle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Alert Messages */}
            {(error || successMessage) && (
                <div className="fixed top-4 right-4 z-50">
                    <Alert variant={error ? "destructive" : "default"}>
                        <AlertDescription>
                            {error || successMessage}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg bg-emerald-600 text-white"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
            </div>

            {/* Side Navigation */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:block shadow-xl`}>
                <div className="p-6">
                    <h2 className="text-white text-2xl font-bold mb-8">
                        Eco Community
                    </h2>
                    <nav className="space-y-2">
                        <a href="/association/announce"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Bell className="h-5 w-5"/>
                            <span>Annonces</span>
                        </a>
                        <a href="/association/events"
                           className="flex items-center space-x-3 text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg">
                            <Calendar className="h-5 w-5"/>
                            <span>Événements</span>
                        </a>
                        <a href="/association/settings"
                           className="flex items-center space-x-3 bg-emerald-600/50 text-white px-4 py-3 rounded-lg">
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
                            <p className="text-gray-600">Gérez vos préférences et informations de compte</p>
                        </div>
                    </div>

                    {/* Settings Navigation */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6 backdrop-blur-lg bg-opacity-90">
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                    activeTab === 'profile'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2"/>
                                    Profil
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                    activeTab === 'security'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Lock className="h-4 w-4 mr-2"/>
                                    Sécurité
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                    activeTab === 'privacy'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Shield className="h-4 w-4 mr-2"/>
                                    Confidentialité
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="bg-white rounded-xl shadow-md p-6 backdrop-blur-lg bg-opacity-90">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div
                                        className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                        {userProfile?.user?.profile_image ? (
                                            <img
                                                src={getImageUrl(userProfile.user.profile_image)}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-full h-full p-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Photo de profil</h3>
                                        <div className="flex space-x-3 mt-2">
                                            <label
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                                Modifier
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nom de l'organisation
                                                </label>
                                                <input
                                                    type="text"
                                                    name="organization_name"
                                                    value={formData.organization_name || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Numéro d'enregistrement
                                                </label>
                                                <input
                                                    type="text"
                                                    name="registration_number"
                                                    value={formData.registration_number || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Année de création
                                                </label>
                                                <input
                                                    type="text"
                                                    name="founded_year"
                                                    value={formData.founded_year || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Site web
                                                </label>
                                                <input
                                                    type="url"
                                                    name="website_url"
                                                    value={formData.website_url || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mission
                                                </label>
                                                <textarea
                                                    name="mission_statement"
                                                    value={formData.mission_statement || ''}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                ></textarea>
                                            </div>

                                    {/* Common fields for all user types */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>

                                    {/* Bio field for all users */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            rows="4"
                                            placeholder="Tell us about yourself or your organization..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <button
                                        onClick={() => fetchUserProfile()}
                                        className="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le mot de passe</h3>
                                    <div className="space-y-4">
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Mot de passe actuel"
                                        />
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Nouveau mot de passe"
                                        />
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Confirmer le nouveau mot de passe"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-6">
                                        <button
                                            onClick={handlePasswordUpdate}
                                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de
                                    confidentialité</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 mb-2">Suppression du compte</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            La suppression de votre compte est définitive. Toutes vos données seront effacées.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                                        >
                                            Supprimer mon compte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParamPage;
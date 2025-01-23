import React, { useState } from 'react';
import { logoutUser } from "../../../Services/auth.js";
import {
    FileText,
    Settings,
    Users,
    LogOut,
    Menu,
    X,
    Bell,
    Lock,
    Globe,
    User,
    Mail,
    Phone,
    Shield,
    HelpCircle,
    Info,
    HandHelping,
    BarChart2
} from 'lucide-react';

const SettingsPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Side Navigation */}
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
                            <BarChart2 className="h-5 w-5"/>
                            <span>Tableau de bord</span>
                        </a>
                        <a href="/entrepreneur/settings"
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

            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 fixed w-full z-50 px-4 py-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white text-xl font-bold flex items-center">
                            <FileText className="h-5 w-5 mr-2"/>
                            EcoCommunity
                        </h2>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:bg-emerald-600/50 p-2 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-gradient-to-b from-emerald-700 to-emerald-800 z-40 pt-20">
                        <nav className="p-4 space-y-2">
                            <a href="#" className="block text-emerald-100 hover:bg-emerald-600/50 px-4 py-3 rounded-lg transition-all duration-200">
                                Mes Projets
                            </a>
                            <a href="#" className="block bg-emerald-600/50 text-white px-4 py-3 rounded-lg shadow-md">
                                Paramètres
                            </a>
                            <a href="#" className="block text-emerald-100 hover:bg-red-500/20 px-4 py-3 rounded-lg transition-all duration-200">
                                Déconnexion
                            </a>
                        </nav>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
                        <p className="text-gray-600">Gérez vos préférences et informations de compte</p>
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
                                    <User className="h-4 w-4 mr-2" />
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
                                    <Lock className="h-4 w-4 mr-2" />
                                    Sécurité
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                    activeTab === 'notifications'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Notifications
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
                                    <Shield className="h-4 w-4 mr-2" />
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
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <User className="h-10 w-10 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Photo de profil</h3>
                                        <div className="flex space-x-3 mt-2">
                                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200">
                                                Modifier
                                            </button>
                                            <button className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'entreprise</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Nom de votre entreprise"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="+237 6XX XXX XXX"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            rows="4"
                                            placeholder="Décrivez votre activité..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <button className="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                        Annuler
                                    </button>
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200">
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Mot de passe actuel"
                                        />
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Nouveau mot de passe"
                                        />
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Confirmer le nouveau mot de passe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentification à deux facteurs</h3>
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Protection du compte</p>
                                            <p className="text-sm text-gray-600">Ajouter une couche de sécurité supplémentaire</p>
                                            {/* Previous code remains the same until the security section */}

                                        </div>
                                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200">
                                            Activer
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <button className="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                        Annuler
                                    </button>
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200">
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de notification</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Notifications par email</p>
                                            <p className="text-sm text-gray-600">Recevoir des mises à jour sur vos projets</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Notifications SMS</p>
                                            <p className="text-sm text-gray-600">Recevoir des alertes importantes par SMS</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Notifications de demande d'aide</p>
                                            <p className="text-sm text-gray-600">Être notifié des nouvelles demandes d'aide</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200">
                                        Enregistrer les préférences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de confidentialité</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Profil public</p>
                                            <p className="text-sm text-gray-600">Rendre votre profil visible aux autres utilisateurs</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Partage des données</p>
                                            <p className="text-sm text-gray-600">Autoriser le partage de vos données avec nos partenaires</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 mb-2">Suppression du compte</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            La suppression de votre compte est définitive. Toutes vos données seront effacées.
                                        </p>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200">
                                            Supprimer mon compte
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6">
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200">
                                        Enregistrer les paramètres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
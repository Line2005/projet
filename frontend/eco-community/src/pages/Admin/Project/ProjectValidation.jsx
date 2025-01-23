import React, {useEffect, useState} from 'react';
import {
    Users,
    FolderCheck,
    BarChart2,
    FileText,
    Network,
    Settings,
    Bell,
    User,
    Search,
    Eye,
    Download,
    Check,
    X,
    MessageCircle,
    LogOut
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from '../../../components/ui/card.jsx';
import { logoutUser } from "../../../Services/auth.js";
import axios from "axios";
import api from "../../../Services/api.js";

const getDocumentDisplayName = (documentType) => {
    const documentNames = {
        'id_card': 'Carte Nationale d\'Identité',
        'business_register': 'Registre de Commerce',
        'company_statutes': 'Statuts de l\'Entreprise',
        'tax_clearance': 'Attestation de Non Redevance Fiscale',
        'permits': 'Permis et Licences',
        'intellectual_property': 'Propriété Intellectuelle',
        'photos': 'Photos',
        'feasibility_study': 'Étude de Faisabilité',
        'project_photos': 'Photos du Projet'
    };
    return documentNames[documentType] || documentType;
};

const AdminProject = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [statusUpdateComment, setStatusUpdateComment] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Fetch projects when component mounts
    useEffect(() => {
        fetchProjects();
    }, []); // Empty dependency array means this runs once when component mounts

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            console.log('API Response:', response.data);
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const updateProjectStatus = async (projectId, newStatus) => {
        try {
            await api.post(`/projects/${projectId}/update-status/`, {
                status: newStatus,
                comments: statusUpdateComment
            });

            fetchProjects(); // Refresh the projects list after update
            setStatusUpdateComment('');
        } catch (error) {
            console.error('Error updating project status:', error);
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'approved': return 'Approuvé';
            case 'rejected': return 'Refusé';
            default: return status;
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.entrepreneur_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const navigationItems = [
        { id: 'users', label: 'Utilisateurs', icon: Users, path: '/admin/dashboard' },
        { id: 'projects', label: 'Validation des projets', icon: FolderCheck, path: '/admin/project' },
        { id: 'analytics', label: 'Suivi et analyse', icon: BarChart2, path: '/admin/analytics' },
        { id: 'content', label: 'Gestion du contenu', icon: FileText, path: '/admin/content' },
        { id: 'network', label: 'Mise en réseau', icon: Network, path: '/admin/network' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/admin/settings' },
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

    const handleNavigation = (path, id) => {
        setActiveSection(id);
        navigate(path);
    };

    const renderContent = () => {
        if (activeSection === 'projects') {
            return (
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 bg-orange-50">
                                <h3 className="text-lg font-semibold text-gray-800">En attente</h3>
                                <p className="text-3xl font-bold text-orange-500">
                                    {projects.filter(p => p.status === 'pending').length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 bg-green-50">
                                <h3 className="text-lg font-semibold text-gray-800">Approuvés</h3>
                                <p className="text-3xl font-bold text-green-600">
                                    {projects.filter(p => p.status === 'approved').length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 bg-red-50">
                                <h3 className="text-lg font-semibold text-gray-800">Refusés</h3>
                                <p className="text-3xl font-bold text-red-500">
                                    {projects.filter(p => p.status === 'rejected').length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Projects List and Details */}
                    <div className="flex gap-6">
                        {/* Projects List */}
                        <Card className="w-1/3">
                            <CardContent className="p-0">
                                <div className="p-4 border-b">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            size={18}/>
                                        <input
                                            type="search"
                                            placeholder="Rechercher un projet..."
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <select
                                            className="p-2 border rounded-lg"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">Tous</option>
                                            <option value="pending">En attente</option>
                                            <option value="approved">Approuvés</option>
                                            <option value="rejected">Refusés</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="overflow-y-auto max-h-[600px] divide-y">
                                    {filteredProjects.map((project) => (
                                        <button
                                            key={project.id}
                                            className={`w-full p-4 text-left hover:bg-gray-50 ${
                                                selectedProject?.id === project.id ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            <h3 className="font-semibold text-gray-800">{project.project_name}</h3>
                                            <p className="text-sm text-gray-600">Par: {project.entrepreneur_name}</p>
                                            <p className="text-sm text-gray-600">Secteur: {project.sector}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm text-gray-500">
                                                  {new Date(project.created_at).toLocaleDateString()}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                                                    {getStatusDisplay(project.status)}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Details */}
                        <Card className="flex-1">
                            <CardContent className="p-6">
                                {selectedProject ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">{selectedProject.project_name}</h3>
                                                <p className="text-gray-600">Entrepreneur: {selectedProject.entrepreneur_name}</p>
                                                <p className="text-gray-600">Date de
                                                    création: {new Date(selectedProject.created_at).toLocaleDateString()}</p>
                                            </div>
                                            {selectedProject.status === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                                                        onClick={() => updateProjectStatus(selectedProject.id, 'approved')}
                                                    >
                                                        <Check size={20}/>
                                                        Approuver
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                                                        onClick={() => updateProjectStatus(selectedProject.id, 'rejected')}
                                                    >
                                                        <X size={20}/>
                                                        Rejeter
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Description du projet</h4>
                                            <p className="text-gray-700">{selectedProject.description}</p>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Détails du projet</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Secteur:</p>
                                                    <p className="font-medium">{selectedProject.sector}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Budget estimé:</p>
                                                    <p className="font-medium">{selectedProject.estimated_budget} FCFA</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Public cible:</p>
                                                    <p className="font-medium">{selectedProject.target_audience}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Plan de financement:</p>
                                                    <p className="font-medium">{selectedProject.financing_plan}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">Documents</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedProject.documents.map((doc) => (
                                                    <div key={doc.id}
                                                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <span className="text-gray-700">{getDocumentDisplayName(doc.document_type)}</span>
                                                        <div className="flex gap-2">
                                                            <a
                                                                href={doc.file}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 hover:bg-gray-200 rounded-full"
                                                            >
                                                                <Eye size={20} className="text-blue-600"/>
                                                            </a>
                                                            <a
                                                                href={doc.file}
                                                                download
                                                                className="p-2 hover:bg-gray-200 rounded-full"
                                                            >
                                                                <Download size={20} className="text-green-600"/>
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedProject.status === 'pending' && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">Commentaires pour la
                                                    décision</h4>
                                                <textarea
                                                    className="w-full p-3 border rounded-lg"
                                                    rows="3"
                                                    value={statusUpdateComment}
                                                    onChange={(e) => setStatusUpdateComment(e.target.value)}
                                                    placeholder="Ajoutez vos commentaires ici..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-[600px] flex items-center justify-center">
                                        <p className="text-gray-500">Sélectionnez un projet pour voir les détails</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between px-6 py-4 max-w-[1920px] mx-auto">
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

                <main className="flex-1 p-6 max-w-[1920px] mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-500">Chargement...</p>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminProject;

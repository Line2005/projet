import React, { useEffect, useState } from 'react';
import { FileText, Users, Calendar, DollarSign, Search, Mail, Phone, MessageCircle, Filter, ChevronDown, ChevronUp, Eye, Download } from 'lucide-react';
import api from "../../../Services/api.js";
import {Card} from "../../../components/ui/card.jsx";

const GroupedCollaborations = () => {
    const [groupedCollabs, setGroupedCollabs] = useState({});
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedEntrepreneur, setExpandedEntrepreneur] = useState(null);
    const [activeDetailTab, setActiveDetailTab] = useState('details');
    const [contracts, setContracts] = useState([]);

    // Mock data fetching - replace with your actual API call
    const fetchAndGroupCollaborations = async () => {
        try {
            const response = await api.get('/collaborations/');
            const collabs = response.data.collaborations || [];

            // Group collaborations by entrepreneur
            const grouped = collabs.reduce((acc, collab) => {
                const entrepreneurId = collab.entrepreneur_details.id;

                if (!acc[entrepreneurId]) {
                    acc[entrepreneurId] = {
                        entrepreneur: collab.entrepreneur_details,
                        collaborations: [],
                        projects: new Set(),
                        contracts: new Set(),
                        totalInvestment: 0
                    };
                }

                acc[entrepreneurId].collaborations.push(collab);
                acc[entrepreneurId].projects.add(collab.project_name);
                if (collab.contract_details) {
                    acc[entrepreneurId].contracts.add(collab.contract_details.id);
                }
                if (collab.collaboration_type === 'financial' && collab.contract_details?.investment_amount) {
                    acc[entrepreneurId].totalInvestment += parseFloat(collab.contract_details.investment_amount);
                }

                return acc;
            }, {});

            setGroupedCollabs(grouped);
        } catch (error) {
            console.error('Error fetching collaborations:', error);
        }
    };

    useEffect(() => {
        fetchAndGroupCollaborations();
        fetchContracts();
    }, []);

    const getFilteredEntrepreneurs = () => {
        return Object.entries(groupedCollabs).filter(([_, data]) => {
            if (activeFilter !== 'all') {
                const hasFilteredType = data.collaborations.some(
                    collab => collab.collaboration_type === activeFilter
                );
                if (!hasFilteredType) return false;
            }

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    data.entrepreneur.name.toLowerCase().includes(searchLower) ||
                    Array.from(data.projects).some(project =>
                        project.toLowerCase().includes(searchLower)
                    )
                );
            }

            return true;
        });
    };

    const fetchContracts = async () => {
        try {
            const response = await api.get('/contracts/');
            setContracts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching contracts:', err);
        }
    };

    const formatFileName = (contract) => {
        const projectName = contract.proposal_details?.project_name || 'projet';
        const contractType = contract.contract_type === 'financial' ? 'investissement' : 'mentorat';
        return `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_contrat_${contractType}.pdf`;
    };

    const handleDownloadContract = async (contractId) => {
        try {
            const contractToDownload = contracts.find(c => c.id === contractId);
            if (!contractToDownload) {
                throw new Error('Contract not found');
            }

            const response = await api.get(`/contracts/${contractId}/download/`, {
                responseType: 'blob'
            });

            const filename = formatFileName(contractToDownload);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading contract:', err);
            alert('Erreur lors du téléchargement du contrat');
        }
    };

    const handleViewContract = async (contractId) => {
        try {
            const response = await api.get(`/contracts/${contractId}/view/`, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error viewing contract:', error);
        }
    };

    const getUniqueProjects = (collaborations) => {
        // Create a Map to store unique projects with their latest dates
        const uniqueProjects = new Map();

        collaborations.forEach(collab => {
            const existingProject = uniqueProjects.get(collab.project_name);
            if (!existingProject || new Date(collab.start_date) > new Date(existingProject.start_date)) {
                uniqueProjects.set(collab.project_name, {
                    id: collab.id,
                    project_name: collab.project_name,
                    start_date: collab.start_date
                });
            }
        });

        return Array.from(uniqueProjects.values());
    };

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
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
                            <Filter className="h-4 w-4 inline-block mr-2" />
                            Tous les entrepreneurs
                        </button>
                        <button
                            onClick={() => setActiveFilter('financial')}
                            className={`px-4 py-2 rounded-lg ${
                                activeFilter === 'financial'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <DollarSign className="h-4 w-4 inline-block mr-2" />
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
                            <Users className="h-4 w-4 inline-block mr-2" />
                            Mentorat
                        </button>
                    </div>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Rechercher un entrepreneur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Entrepreneurs List */}
            {getFilteredEntrepreneurs().map(([entrepreneurId, data]) => (
                <Card key={entrepreneurId} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{data.entrepreneur.name}</h3>
                                <p className="text-gray-600">{data.projects.size} projets
                                    • {data.contracts.size} contrats</p>
                            </div>
                            <div>
                                {/* Show collaboration types for this entrepreneur */}
                                {Array.from(new Set(data.collaborations.map(c => c.collaboration_type))).map((type) => (
                                    <span key={type} className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        type === 'financial'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {type === 'financial' ? 'Investissement' : 'Mentorat'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-blue-500"/>
                                <span className="text-sm">{data.entrepreneur.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-blue-500"/>
                                <span className="text-sm">{data.entrepreneur.phone}</span>
                            </div>
                            {/* Display unique projects */}
                            {getUniqueProjects(data.collaborations).map(project => (
                                <div key={project.id} className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <FileText className="h-4 w-4 mr-2 text-blue-500"/>
                                        <span className="text-sm">Projet: {project.project_name}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500"/>
                                        <span className="text-sm">
                                            Début: {new Date(project.start_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Expanded Details Section */}
                        <div className="mt-6 flex justify-between items-center">
                            <button className="flex items-center text-emerald-600 hover:text-emerald-700">
                                <MessageCircle className="h-4 w-4 mr-2"/>
                                Contacter
                            </button>
                            <button
                                onClick={() => setExpandedEntrepreneur(
                                    expandedEntrepreneur === entrepreneurId ? null : entrepreneurId
                                )}
                                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                {expandedEntrepreneur === entrepreneurId ? (
                                    <>
                                        <ChevronUp className="h-4 w-4 mr-2"/>
                                        Masquer les détails
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-4 w-4 mr-2"/>
                                        Voir les détails
                                    </>
                                )}
                            </button>
                        </div>

                        {expandedEntrepreneur === entrepreneurId && (
                            <div className="mt-6 pt-6 border-t">
                                {/* Navigation Tabs */}
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        onClick={() => setActiveDetailTab('details')}
                                        className={`px-4 py-2 rounded-lg ${
                                            activeDetailTab === 'details'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Détails
                                    </button>
                                    <button
                                        onClick={() => setActiveDetailTab('contracts')}
                                        className={`px-4 py-2 rounded-lg ${
                                            activeDetailTab === 'contracts'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Contrats
                                    </button>
                                </div>

                                {activeDetailTab === 'details' ? (
                                    <div className="space-y-4">
                                        {data.collaborations.map(collab => (
                                            <div key={collab.id} className="p-4 border rounded-lg">
                                                <div>
                                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                                        Informations du Projet
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex items-center text-gray-600">
                                                            <FileText className="h-5 w-5 mr-3 text-emerald-600"/>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Projet</p>
                                                                <p className="font-medium">{collab.project_name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Calendar className="h-5 w-5 mr-3 text-emerald-600"/>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Date de début</p>
                                                                <p className="font-medium">
                                                                    {new Date(collab.start_date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.collaborations.map(collab => (
                                            collab.contract_details && (
                                                <div key={collab.contract_details.id}
                                                     className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center">
                                                        <FileText className="h-5 w-5 text-emerald-600 mr-3"/>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                Contrat - {collab.project_name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Type: {collab.collaboration_type === 'financial' ? 'Investissement' : 'Mentorat'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewContract(collab.contract_details.id)}
                                                            className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                                                            title="Voir le contrat"
                                                        >
                                                            <Eye className="h-5 w-5"/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadContract(collab.contract_details.id)}
                                                            className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                                                            title="Télécharger le contrat"
                                                        >
                                                            <Download className="h-5 w-5"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            ))}

            {/* Empty State */}
            {getFilteredEntrepreneurs().length === 0 && (
                <div className="text-center py-12">
                    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun collaborateur trouvé</h3>
                        <p className="text-gray-600">
                            {searchQuery
                                ? "Aucun collaborateur ne correspond à votre recherche"
                                : "Vous n'avez pas encore de collaborateurs actifs"}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default GroupedCollaborations;
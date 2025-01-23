import React from 'react';
import { FileText, X, Clock, Target, Briefcase, Users, AlertCircle, ExternalLink } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "../../../../components/ui/card.jsx";
import {Alert, AlertDescription, AlertTitle} from "@chakra-ui/react";


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

const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

const getFileIcon = (filename) => {
    const extension = getFileExtension(filename);
    const iconClasses = "h-6 w-6";

    switch(extension) {
        case 'pdf':
            return <FileText className={`${iconClasses} text-red-600`} />;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return <FileText className={`${iconClasses} text-blue-600`} />;
        default:
            return <FileText className={`${iconClasses} text-gray-600`} />;
    }
};

export const ProjectDetailsCard = ({ project, onClose }) => {
    if (!project) return null;

    // Keep all your existing helper functions here...
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDocumentClick = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-lg shadow-xl">
                {/* Fixed Header */}
                <div className="flex-shrink-0">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white relative rounded-t-lg">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white hover:text-emerald-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <div>
                            <CardTitle className="text-2xl font-bold mb-2">{project.project_name}</CardTitle>
                            <p className="text-emerald-100">Par {project.entrepreneur_name}</p>
                            <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                                {project.status_display}
                            </span>
                        </div>
                    </CardHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto px-6 py-6">
                    <div className="space-y-8">
                        {/* Project Image */}
                        {project.project_image && (
                            <div className="mb-6">
                                <img
                                    src={project.project_image}
                                    alt={project.project_name}
                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        {/* Key Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3">
                                <Briefcase className="h-5 w-5 text-emerald-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Secteur</p>
                                    <p className="font-medium">{project.sector}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Target className="h-5 w-5 text-emerald-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Budget Estimé</p>
                                    <p className="font-medium">{parseInt(project.estimated_budget).toLocaleString()} FCFA</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Users className="h-5 w-5 text-emerald-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Public Cible</p>
                                    <p className="font-medium">{project.target_audience}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-emerald-600"/>
                                <div>
                                    <p className="text-sm text-gray-500">Créé le</p>
                                    <p className="font-medium">{formatDate(project.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rest of your content sections */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600">{project.description}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Objectifs spécifiques</h3>
                                <p className="text-gray-600">{project.specific_objectives}</p>
                            </div>
                        </div>

                        {/* Documents Section */}
                        {project.documents && project.documents.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {project.documents.map((doc) => (
                                        <button
                                            key={doc.id}
                                            onClick={() => handleDocumentClick(doc.file)}
                                            className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(doc.file)}
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-800">{getDocumentDisplayName(doc.document_type)}</p>
                                                    <p className="text-sm text-gray-500">Ajouté le {formatDate(doc.uploaded_at)}</p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors"/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Comments */}
                        {project.admin_comments && (
                            <Alert>
                                <AlertCircle className="h-4 w-4"/>
                                <AlertTitle>Commentaires administratifs</AlertTitle>
                                <AlertDescription>{project.admin_comments}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex-shrink-0 px-6 py-4 bg-gray-50 rounded-b-lg border-t">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

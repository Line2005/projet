import React, { useState, useEffect } from 'react';
import {
    Calendar, DollarSign, Wrench, User, X, Mail, Building, Target,
    Coins, FileText, ArrowLeft, Users, Goal, Info, Clock,
    MessageSquare, Paperclip, ExternalLink
} from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../../../../components/ui/dialog.jsx";
import {CardHeader, CardTitle} from "../../../../components/ui/card.jsx";

const getDocumentDisplayName = (type) => {
    const documentTypes = {
        'id_card': 'Carte Nationale d\'Identité',
        'business_register': 'Registre de Commerce',
        'company_statutes': 'Statuts de l\'Entreprise',
        'tax_clearance': 'Attestation de Non Redevance Fiscale',
        'permits': 'Permis et Licences',
        'intellectual_property': 'Propriété Intellectuelle',
        'photos': 'Photos',
        'feasibility_study': 'Étude de Faisabilité',
        'project_photos': 'Images du Projet'
    };
    return documentTypes[type] || type;
};

const getFileExtension = (fileUrl) => {
    return fileUrl.split('.').pop().toLowerCase();
};

const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <FileText className="h-6 w-6 text-gray-600" />;

    const extension = getFileExtension(fileUrl);
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



const RequestDetails = ({ request, onClose, }) => {
    if (!request) return null;

    const createdDate = new Date(request.created_at).toLocaleDateString('fr-FR');
    const requesterName = request.entrepreneur_details?.name || 'Non spécifié';
    const requesterEmail = request.entrepreneur_details?.email || 'Non spécifié';
    const projectCreatedDate = new Date(request.project.created_at).toLocaleDateString('fr-FR');

    const formatMoney = (amount) => amount?.toLocaleString() + ' FCFA';

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getSectorLabel = (sector) => {
        const sectorMap = {
            'agriculture': 'Agriculture',
            'technology': 'Technologie',
            'crafts': 'Artisanat',
            'commerce': 'Commerce',
            'education': 'Éducation',
            'healthcare': 'Santé',
            'tourism': 'Tourisme',
            'manufacturing': 'Fabrication',
            'services': 'Services'
        };
        return sectorMap[sector] || sector;
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            'pending': 'En attente',
            'approved': 'Approuvé',
            'rejected': 'Refusé'
        };
        return statusMap[status] || status;
    };


    const handleDocumentClick = (fileUrl) => {
        if (!fileUrl) {
            console.error("Document file URL is undefined");
            alert("Document URL is not available. Please contact support.");
            return;
        }
        window.open(fileUrl, '_blank');
    };



    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-lg shadow-xl">
                {/* Fixed Header */}
                <div className="flex-shrink-0">
                    <CardHeader
                        className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white relative rounded-t-lg">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white hover:text-emerald-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <div>
                            <CardTitle className="text-2xl font-bold mb-2"> Détails de la demande</CardTitle>
                        </div>
                    </CardHeader>
                </div>

                        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
                            <div className="p-6 space-y-8">
                                {/* Status and Type Badges */}
                                <div className="flex flex-wrap gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                request.request_type === 'financial' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {request.request_type === 'financial' ? (
                                    <span className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-2"/>
                                        Aide Financière
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Wrench className="h-4 w-4 mr-2"/>
                                        Aide Technique
                                    </span>
                                )}
                            </span>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                        request.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                {request.status === 'completed' ? 'Résolu' : 'En attente'}
                            </span>
                                </div>

                                {/* Project Details */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Informations du Projet</h3>

                                        {/* Basic Project Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <Building className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Nom du Projet</p>
                                                        <p className="text-gray-700">{request.project_details.project_name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Target className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Secteur d'Activité</p>
                                                        <p className="text-gray-700">{getSectorLabel(request.project_details.sector)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Info className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Statut du Projet</p>
                                                        <p className="text-gray-700">{getStatusLabel(request.project_details.status)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <Clock className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Date de Création</p>
                                                        <p className="text-gray-700">{new Date(request.project_details.created_at).toLocaleDateString('fr-FR')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Coins className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Budget Estimé</p>
                                                        <p className="text-gray-700">{formatMoney(request.project_details.estimated_budget)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FileText className="h-5 w-5 mt-1 text-emerald-600 flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Plan de Financement</p>
                                                        <p className="text-gray-700">{request.project_details.financing_plan}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Project Description */}
                                        <div className="space-y-4">
                                            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                                                <p className="font-medium text-gray-900 mb-2">Description du Projet</p>
                                                <p className="text-gray-700 whitespace-pre-wrap">{request.project_details.description}</p>
                                            </div>

                                            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                                                <p className="font-medium text-gray-900 mb-2">Objectifs Spécifiques</p>
                                                <p className="text-gray-700 whitespace-pre-wrap">{request.project_details.specific_objectives}</p>
                                            </div>

                                            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                                                <p className="font-medium text-gray-900 mb-2">Public Cible</p>
                                                <p className="text-gray-700">{request.project_details.target_audience}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Documents */}
                                    {request.project_details.documents && request.project_details.documents.length > 0 && (
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Paperclip className="h-5 w-5"/>
                                                Documents du Projet
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {request.project_details.documents.map((doc, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDocumentClick(doc.file_url)} // Ensure `doc.file` exists
                                                        className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            {getFileIcon(doc.file_url)}
                                                            <div className="text-left">
                                                                <p className="font-medium text-gray-800">{getDocumentDisplayName(doc.document_type)}</p>
                                                                <p className="text-sm text-gray-500">Ajouté le {formatDate(doc.uploaded_at)}</p>
                                                            </div>
                                                        </div>
                                                        <ExternalLink
                                                            className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors"
                                                        />
                                                    </button>
                                                ))}

                                            </div>
                                        </div>
                                    )}

                                    {/* Requester Details */}
                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Informations du
                                            Demandeur</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center text-gray-700">
                                                <Calendar className="h-5 w-5 mr-3 text-gray-600"/>
                                                <div>
                                                    <p className="font-medium">Date de la Demande</p>
                                                    <p>{createdDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <User className="h-5 w-5 mr-3 text-gray-600"/>
                                                <div>
                                                    <p className="font-medium">Nom</p>
                                                    <p>{requesterName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <Mail className="h-5 w-5 mr-3 text-gray-600"/>
                                                <div>
                                                    <p className="font-medium">Email</p>
                                                    <p>{requesterEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Specific Details */}
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4">Détails de la
                                                Demande</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="font-medium text-gray-700">Besoin Spécifique</p>
                                                    <p className="mt-2">{request.specific_need}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-700">Description</p>
                                                    <p className="mt-2 whitespace-pre-wrap">{request.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial or Technical Details */}
                                        {request.request_type === 'financial' && request.financial_details && (
                                            <div className="bg-gray-50 p-6 rounded-xl">
                                                <h4 className="text-lg font-bold text-gray-900 mb-4">Détails
                                                    Financiers</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="font-medium text-gray-700">Montant demandé</p>
                                                        <p className="mt-1">{formatMoney(request.financial_details.amount_requested)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">Taux d'intérêt</p>
                                                        <p className="mt-1">{request.financial_details.interest_rate}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">Durée</p>
                                                        <p className="mt-1">{request.financial_details.duration_months} mois</p>
                                                        <div>
                                                            <p className="font-medium text-gray-700">Mensualité</p>
                                                            <p className="mt-1">{formatMoney(request.financial_details.monthly_payment)}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="font-medium text-gray-700">Montant total à
                                                                rembourser</p>
                                                            <p className="mt-1">{formatMoney(request.financial_details.total_repayment)}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="font-medium text-gray-700">Intérêts totaux</p>
                                                            <p className="mt-1">{formatMoney(request.financial_details.total_interest)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {request.request_type === 'technical' && request.technical_details && (
                                                    <div className="bg-gray-50 p-6 rounded-xl">
                                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Détails
                                                            Techniques</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="font-medium text-gray-700">Expertise
                                                                    requise</p>
                                                                <p className="mt-1">{request.technical_details.expertise_needed}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-700">Durée
                                                                    estimée</p>
                                                                <p className="mt-1">{request.technical_details.estimated_duration} jours</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
        </div>
);
};

export default RequestDetails;
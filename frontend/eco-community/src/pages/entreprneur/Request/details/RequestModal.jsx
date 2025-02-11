import React, { useState, useEffect } from 'react';
import { Eye, Save, ArrowLeft, DollarSign, Wrench, Calendar, MapPin, User, X , Mail } from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../../../../components/ui/dialog.jsx";


const HelpRequestDetails = ({ request, isOpen, onClose, onUpdate, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        specificNeed: '',
        description: '',
        // Financial details
        amountRequested: '',
        interestRate: '',
        durationMonths: '',
        // Technical details
        expertiseNeeded: '',
        estimatedDuration: ''
    });

    useEffect(() => {
        if (request) {
            setFormData({
                specificNeed: request.specific_need || '',
                description: request.description || '',
                // Financial details
                amountRequested: request.financial_details?.amount_requested || '',
                interestRate: request.financial_details?.interest_rate || '',
                durationMonths: request.financial_details?.duration_months || '',
                // Technical details
                expertiseNeeded: request.technical_details?.expertise_needed || '',
                estimatedDuration: request.technical_details?.estimated_duration || ''
            });
        }
    }, [request]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updateData = {
            specific_need: formData.specificNeed,
            description: formData.description
        };

        if (request.request_type === 'financial') {
            updateData.financial_details = {
                amount_requested: parseFloat(formData.amountRequested),
                interest_rate: parseFloat(formData.interestRate),
                duration_months: parseInt(formData.durationMonths)
            };
        } else if (request.request_type === 'technical') {
            updateData.technical_details = {
                expertise_needed: formData.expertiseNeeded,
                estimated_duration: parseInt(formData.estimatedDuration)
            };
        }

        try {
            await onUpdate(request.id, updateData);
            // Rafraîchir les données après la mise à jour
            await onRefresh();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating request:', error);

        }
    };

    if (!request) return null;

    // Safely get nested values
    const projectName = request.project_details?.project_name || 'Non spécifié';
    const requesterName = request.entrepreneur_details?.name || 'Non spécifié';
    const requesterEmail = request.entrepreneur_details?.email || 'Non spécifié';
    const createdDate = new Date(request.created_at).toLocaleDateString('fr-FR');


    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" aria-hidden="true" />
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-3xl w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.25)] z-50 border-0">
                <div className="sticky top-0 z-50 bg-white border-b">
                    <DialogHeader className="p-6">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                Détails de la demande
                            </DialogTitle>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </DialogHeader>
                </div>

                <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
                    <div className="p-6 space-y-8">
                        <div className="flex flex-wrap gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                request.request_type === 'financial'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {request.request_type === 'financial' ? (
                                    <span className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Aide Financière
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Wrench className="h-4 w-4 mr-2" />
                                        Aide Technique
                                    </span>
                                )}
                            </span>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                request.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {request.status === 'completed' ? 'Résolu' : 'En attente'}
                            </span>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{projectName}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="h-5 w-5 mr-3 text-emerald-600"/>
                                    <span>{createdDate}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <User className="h-5 w-5 mr-3 text-emerald-600"/>
                                    <span>{requesterName}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Mail className="h-5 w-5 mr-3 text-emerald-600"/>
                                    <span>{requesterEmail}</span>
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* ... (rest of the form content remains the same) ... */}
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Besoin Spécifique</h4>
                                    <p className="text-gray-900">{request.specific_need}</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                                    <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                                </div>

                                {request.request_type === 'financial' && request.financial_details && (
                                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Détails Financiers</h4>
                                        <div className="space-y-4">
                                            <p className="text-gray-900">
                                                <span className="font-medium">Montant demandé:</span> {request.financial_details.amount_requested?.toLocaleString()} FCFA
                                            </p>
                                            <p className="text-gray-900">
                                                <span className="font-medium">Taux d'intérêt:</span> {request.financial_details.interest_rate}%
                                            </p>
                                            <p className="text-gray-900">
                                                <span className="font-medium">Durée:</span> {request.financial_details.duration_months} mois
                                            </p>
                                            <p className="text-gray-900">
                                                <span className="font-medium">Mensualité:</span> {request.financial_details.monthly_payment?.toLocaleString()} FCFA
                                            </p>
                                            <p className="text-gray-900">
                                                <span className="font-medium">Montant total à rembourser:</span> {request.financial_details.total_repayment?.toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {request.request_type === 'technical' && request.technical_details && (
                                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Détails Techniques</h4>
                                        <div className="space-y-4">
                                            <p className="text-gray-900">
                                                <span className="font-medium">Expertise requise:</span> {request.technical_details.expertise_needed}
                                            </p>
                                            <p className="text-gray-900">
                                                <span className="font-medium">Durée estimée:</span> {request.technical_details.estimated_duration} jours
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full px-6 py-3 text-emerald-600 border-2 border-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center"
                                >
                                    Modifier les informations
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpRequestDetails;
import React, {useEffect, useState} from 'react';
import {ArrowLeft, DollarSign, Info, Calendar, Users, Lock} from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
import {useHelpRequest} from "../../UseHelpRequest.jsx";
import api from "../../../../Services/api.js";

const FinancialHelpProposalPage = ({ project, onBack }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    // Get the help request ID from project or location state
    const helpRequestId = project?.id || location.state?.project?.id;

    // Use the ID directly in the hook
    const { helpRequest, loading: loadingRequest } = useHelpRequest(helpRequestId);

    const [formData, setFormData] = useState({
        help_request: helpRequestId || '',  // This will store the help_request ID
        investment_amount: '',  // Changed to match backend field
        investment_type: 'equity',
        payment_schedule: 'single',
        additional_terms: '',
        expected_return: '',
        timeline: ''
    });

    useEffect(() => {
        const projectData = project || location.state?.project;
        if (projectData) {
            setFormData(prev => ({
                ...prev,
                help_request: projectData.id
            }));
        }
    }, [project, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Updated to match your API endpoint structure
            const response = await api.post('/proposals/financial/', {
                ...formData,
                investment_amount: parseFloat(formData.investment_amount) // Ensure number for DecimalField
            });

            navigate('/investors/project', {
                state: { message: 'Proposition soumise avec succès!' }
            });
        } catch (error) {
            setError(error.response?.data?.error || 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoBack = () => {
        navigate('/investors/project');
    };

    // Show loading state while fetching help request
    if (loadingRequest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-center text-gray-600">Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if help request couldn't be loaded
    if (!helpRequest && !loadingRequest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-center text-red-600">Impossible de charger la demande d'aide</p>
                        <button
                            onClick={handleGoBack}
                            className="mt-4 mx-auto block text-emerald-600 hover:text-emerald-700"
                        >
                            Retour aux projets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Retour aux projets
                </button>

                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Proposition de soutien financier</h1>
                            <p className="text-gray-600 mt-1">Pour le projet: {helpRequest?.project_details?.project_name}</p>
                        </div>
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Aide Financière
                        </span>
                    </div>

                    {/* Project Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <DollarSign className="h-5 w-5 text-emerald-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Montant demandé</p>
                                    <p className="font-semibold">{helpRequest?.financial_details?.amount_requested.toLocaleString()} FCFA</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-emerald-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Entrepreneur</p>
                                    <p className="font-semibold"> {helpRequest?.entrepreneur_details?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Date de soumission</p>
                                    <p className="font-semibold">{new Date(helpRequest.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Montant de l'investissement proposé (FCFA)*
                            </label>
                            <div className="relative">
                                <DollarSign
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    type="number"
                                    required
                                    name="investment_amount"
                                    value={formData.investment_amount}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type d'investissement*
                            </label>
                            <select
                                required
                                name="investment_type"
                                value={formData.investment_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="equity">Participation au capital</option>
                                <option value="loan">Prêt</option>
                                <option value="grant">Subvention</option>
                                <option value="revenue-sharing">Partage des revenus</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Échéancier de paiement proposé*
                            </label>
                            <select
                                required
                                name="payment_schedule"
                                value={formData.payment_schedule}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="single">Paiement unique</option>
                                <option value="monthly">Versements mensuels</option>
                                <option value="quarterly">Versements trimestriels</option>
                                <option value="custom">Personnalisé</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Retour sur investissement attendu*
                            </label>
                            <textarea
                                required
                                value={formData.expected_return}
                                onChange={(e) => setFormData({...formData, expected_return: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={3}
                                placeholder="Décrivez vos attentes en termes de retour sur investissement..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Calendrier d'investissement proposé*
                            </label>
                            <textarea
                                required
                                value={formData.timeline}
                                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={3}
                                placeholder="Détaillez votre proposition de calendrier d'investissement..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conditions supplémentaires
                            </label>
                            <textarea
                                value={formData.additional_terms}
                                onChange={(e) => setFormData({...formData, additional_terms: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={4}
                                placeholder="Ajoutez des conditions ou des termes supplémentaires à votre proposition..."
                            />
                        </div>

                        <div className="flex items-start bg-blue-50 p-4 rounded-lg">
                            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                            <p className="text-sm text-blue-700">
                                Cette proposition sera envoyée à l'entrepreneur pour examen. Vous pourrez ensuite discuter des détails et finaliser les termes de l'investissement.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300"
                            >
                                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la proposition'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FinancialHelpProposalPage;
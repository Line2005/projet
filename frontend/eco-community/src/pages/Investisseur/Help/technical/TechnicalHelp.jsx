import React, {useEffect, useState} from 'react';
import { ArrowLeft, Wrench, Info, Calendar, Users, Clock } from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
import api from "../../../../Services/api.js";
import {useHelpRequest} from "../../UseHelpRequest.jsx";

const TechnicalHelpProposalPage = ({ project, onBack }) => {
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
        expertise: '',
        experience_level: 'senior', // Changed to match backend field
        availability: '',
        support_duration: '',
        support_type: 'mentoring',
        proposed_approach: '',
        additional_resources: '',
        expected_outcomes: ''  // Changed to match backend field
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
            const response = await api.post('/proposals/technical/', formData);

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
                            <h1 className="text-2xl font-bold text-gray-900">Proposition de soutien technique</h1>
                            <p className="text-gray-600 mt-1">Pour le projet: {helpRequest?.project_details?.project_name}</p>
                        </div>
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full flex items-center">
                            <Wrench className="h-4 w-4 mr-2" />
                            Aide Technique
                        </span>
                    </div>

                    {/* Project Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <Wrench className="h-5 w-5 text-emerald-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Expertise requise</p>
                                    <p className="font-semibold">{helpRequest?.technical_details?.expertise_needed}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-emerald-500 mr-2" />
                                <div>
                                    <p className="text-sm text-gray-600">Entrepreneur</p>
                                    <p className="font-semibold">{helpRequest?.entrepreneur_details?.name}</p>
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
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Domaines d'expertise*
                            </label>
                            <textarea
                                required
                                name="expertise"
                                value={formData.expertise}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={3}
                                placeholder="Décrivez vos domaines d'expertise pertinents pour ce projet..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Niveau d'expérience*
                            </label>
                            <select
                                required
                                name="experience_level"
                                value={formData.experience_level}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="junior">Junior (1-3 ans)</option>
                                <option value="intermediate">Intermédiaire (3-5 ans)</option>
                                <option value="senior">Senior (5-10 ans)</option>
                                <option value="expert">Expert (10+ ans)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type de support proposé*
                            </label>
                            <select
                                required
                                name="support_type"
                                value={formData.support_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="mentoring">Mentorat</option>
                                <option value="development">Développement</option>
                                <option value="review">Revue de code</option>
                                <option value="consulting">Consultation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Disponibilité*
                            </label>
                            <textarea
                                required
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={2}
                                placeholder="Indiquez vos disponibilités (jours/heures par semaine)..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Durée estimée du support*
                            </label>
                            <input
                                type="text"
                                required
                                name="support_duration"
                                value={formData.support_duration}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Ex: 3 mois, 6 semaines..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Approche proposée*
                            </label>
                            <textarea
                                required
                                name="proposed_approach"
                                value={formData.proposed_approach}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={4}
                                placeholder="Décrivez votre approche pour aider ce projet..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ressources additionnelles
                            </label>
                            <textarea
                                name="additional_resources"
                                value={formData.additional_resources}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={3}
                                placeholder="Listez les ressources supplémentaires que vous pourriez apporter..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Résultats attendus*
                            </label>
                            <textarea
                                required
                                name="expected_outcomes"
                                value={formData.expected_outcomes}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={4}
                                placeholder="Décrivez les résultats attendus de votre intervention..."
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onBack}
                                disabled={isSubmitting}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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

export default TechnicalHelpProposalPage;
import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Menu,
    X,
    DollarSign,
    HandPlatter,
} from "lucide-react";
import api from "../../../../Services/api.js";
import Alert from "../../../../components/ui/alert.jsx";
import * as PropTypes from "prop-types";
import {useNavigate, useSearchParams} from "react-router-dom";


function AlertDescription(props) {
    return null;
}

AlertDescription.propTypes = {children: PropTypes.node};

const HelpRequestForm = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [helpType, setHelpType] = useState("");
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        specific_need: "",
        description: "",
        request_type: "",
        project: "",
        // Financial details
        amount_requested: "",
        interest_rate: "",
        duration_months: 12,
        // Technical details
        expertise_needed: "",
        estimated_duration: 30
    });

    // Update useEffect to handle pre-selected project
    useEffect(() => {
        fetchProjects();
        if (projectId) {
            setFormData(prev => ({
                ...prev,
                project: projectId
            }));
        }
    }, [projectId]);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects/');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            setError("Failed to fetch projects");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleProjectSelect = (e) => {
    //     const projectId = e.target.value;
    //     setFormData(prev => ({
    //         ...prev,
    //         project: projectId
    //     }));
    //     setSelectedProject(projects.find(p => p.id === parseInt(projectId)));
    // };

    const handleTypeSelect = (type) => {
        setHelpType(type);
        setFormData(prev => ({
            ...prev,
            request_type: type
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const requestBody = {
                project: formData.project,
                request_type: formData.request_type,
                specific_need: formData.specific_need,
                description: formData.description
            };

            // Add type-specific details
            if (formData.request_type === 'financial') {
                requestBody.financial_details = {
                    amount_requested: parseFloat(formData.amount_requested),
                    interest_rate: parseFloat(formData.interest_rate),
                    duration_months: parseInt(formData.duration_months)
                };
            } else if (formData.request_type === 'technical') {
                requestBody.technical_details = {
                    expertise_needed: formData.expertise_needed,
                    estimated_duration: parseInt(formData.estimated_duration)
                };
            }

            const response = await api.post('/help-requests/', requestBody);

            if (response.status === 201) {
                setSuccess("Help request submitted successfully!");
                setFormData({
                    specific_need: "",
                    description: "",
                    request_type: "",
                    project: "",
                    amount_requested: "",
                    interest_rate: 5.00,
                    duration_months: 12,
                    expertise_needed: "",
                    estimated_duration: 30
                });
                setHelpType("");
                // Redirect after success
                setTimeout(() => navigate('/entrepreneur/project'), 2000);

            } else {
                setError(response.data.error || "Failed to submit help request");
            }
        } catch (error) {
            setError("An error occurred while submitting the request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-emerald-600 text-white"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            <div className="lg:ml-64">
                <div className="px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demande d'aide</h1>
                            <p className="text-gray-600">
                                Formulaire de demande d'aide pour votre projet
                            </p>
                        </div>
                    </div>

                    {(error || success) && (
                        <Alert className="mb-6">
                            <AlertDescription>
                                {error ? (
                                    <span className="text-red-600">{error}</span>
                                ) : (
                                    <span className="text-green-600">{success}</span>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg bg-opacity-90">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type d'aide
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleTypeSelect("financial")}
                                            className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                                                helpType === "financial"
                                                    ? "border-yellow-500 bg-yellow-50"
                                                    : "border-gray-200 hover:border-yellow-500"
                                            }`}
                                        >
                                            <DollarSign className={`h-6 w-6 mr-2 ${
                                                helpType === "financial" ? "text-yellow-500" : "text-gray-400"
                                            }`} />
                                            <span className={`font-medium ${
                                                helpType === "financial" ? "text-yellow-700" : "text-gray-600"
                                            }`}>
                                                Aide Financière
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleTypeSelect("technical")}
                                            className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                                                helpType === "technical"
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-gray-200 hover:border-emerald-500"
                                            }`}
                                        >
                                            <HandPlatter className={`h-6 w-6 mr-2 ${
                                                helpType === "technical" ? "text-emerald-500" : "text-gray-400"
                                            }`} />
                                            <span className={`font-medium ${
                                                helpType === "technical" ? "text-emerald-700" : "text-gray-600"
                                            }`}>
                                                Aide Technique
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Besoin Spécifique
                                    </label>
                                    <input
                                        type="text"
                                        name="specific_need"
                                        value={formData.specific_need}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description Détaillée
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                {helpType === "financial" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Montant Demandé
                                            </label>
                                            <input
                                                type="number"
                                                name="amount_requested"
                                                value={formData.amount_requested}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Taux d'intérêt (%)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="interest_rate"
                                                value={formData.interest_rate}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Entrez le taux d'intérêt souhaité"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Durée (en mois)
                                            </label>
                                            <input
                                                type="number"
                                                name="duration_months"
                                                value={formData.duration_months}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    </>
                                )}

                                {helpType === "technical" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expertise Requise
                                            </label>
                                            <input
                                                type="text"
                                                name="expertise_needed"
                                                value={formData.expertise_needed}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Durée Estimée (en jours)
                                            </label>
                                            <input
                                                type="number"
                                                name="estimated_duration"
                                                value={formData.estimated_duration}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !helpType}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Envoi en cours..." : "Soumettre la demande"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestForm;
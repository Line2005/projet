import React, { useState } from 'react';
import {Upload, Info, ArrowLeft} from 'lucide-react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import api from "../../../../Services/api.js";

const ProjectCreationForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(true);

    // Add state for API submission status
    const [submissionStatus, setSubmissionStatus] = useState({
        success: false,
        message: '',
    });

    const [formData, setFormData] = useState({
        project_name: '',
        description: '',
        sector: '',
        specific_objectives: '',
        target_audience: '',
        estimated_budget: '',
        financing_plan: '',
        documents: {
            id_card: null,
            business_register: null,
            company_statutes: null,
            tax_clearance: null,
            permits: null,
            intellectual_property: null,
            photos: [],
            feasibility_study: null,
            project_photos: []
        }
    });

    const sectors = [
        'Agriculture',
        'Technology',
        'Crafts',
        'Commerce',
        'Education',
        'Healthcare',
        'Tourism',
        'Manufacturing',
        'Services'
    ];

    // Add data validation helper
    const validateFormData = () => {
        const errors = [];

        if (!formData.project_name.trim()) errors.push('Le nom du projet est requis');
        if (!formData.sector) errors.push('Le secteur est requis');
        if (!formData.description.trim()) errors.push('La description est requise');
        if (!formData.specific_objectives.trim()) errors.push('Les objectifs spécifiques sont requis');
        if (!formData.target_audience.trim()) errors.push('Le public cible est requis');
        if (!formData.estimated_budget || isNaN(parseFloat(formData.estimated_budget)))
            errors.push('Le budget estimé doit être un nombre valide');
        if (!formData.financing_plan.trim()) errors.push('Le plan de financement est requis');

        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'estimated_budget') {
            // Only allow numbers and decimal point
            const numericValue = value.replace(/[^\d.-]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileUpload = (e, documentType) => {
        const file = e.target.files[0];
        console.log('File selected:', file); // Add this debug line

        if (!file) {
            console.log('No file selected'); // Add this debug line
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [documentType]: null
                }
            }));
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`Le fichier ${file.name} est trop volumineux. La taille maximum est de 5MB.`);
            return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setError(`Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG`);
            return;
        }

        // Update form data with the new file
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [documentType]: file
            }
        }));

        // Clear any previous errors
        setError(null);
    };

    const handleCloseError = () => {
        setShowError(false); // Hide the alert when close button is clicked
    };

    const handleGoBack = () => {
        navigate('/entrepreneur/project');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate required files
        const requiredFiles = ['id_card', 'tax_clearance'];
        const missingFiles = requiredFiles.filter(
            fileType => !formData.documents[fileType]
        );

        if (missingFiles.length > 0) {
            setError(`Veuillez télécharger les documents requis: ${missingFiles.join(', ')}`);
            setLoading(false);
            return;
        }

        try {
            // Format the budget as a number
            const budget = parseFloat(formData.estimated_budget.replace(/[^\d.-]/g, ''));

            // Prepare project data with proper data types
            const projectData = {
                project_name: formData.project_name.trim(),
                sector: formData.sector.toLowerCase(),
                description: formData.description.trim(),
                specific_objectives: formData.specific_objectives.trim(),
                target_audience: formData.target_audience.trim(),
                estimated_budget: budget,
                financing_plan: formData.financing_plan.trim(),
            };

            // Validate data before submission
            if (!projectData.project_name || !projectData.sector || !projectData.description ||
                !projectData.specific_objectives || !projectData.target_audience ||
                isNaN(projectData.estimated_budget) || !projectData.financing_plan) {
                throw new Error('Veuillez remplir tous les champs obligatoires');
            }

            // Create project with proper error handling
            const projectResponse = await api.post('/projects/', projectData);

            if (!projectResponse.data || !projectResponse.data.id) {
                throw new Error('La réponse du serveur est invalide');
            }

            const projectId = projectResponse.data.id;

            // Upload documents with progress tracking
            await uploadDocuments(projectResponse.data.id);


            setSubmissionStatus({
                success: true,
                message: 'Project created successfully!'
            });

            setTimeout(() => navigate('/entrepreneur/project'), 2000);

        } catch (err) {
            console.error('Error:', err);
            setError(handleError(err));
            setSubmissionStatus({
                success: false,
                message: 'Failed to create project.'
            });
        } finally {
            setLoading(false);
        }
    };

    // Update the document upload function
    const uploadDocuments = async (projectId) => {
        const documentUploads = [];

        for (const [docType, fileData] of Object.entries(formData.documents)) {
            if (docType === 'photos' && fileData.length > 0) {
                // Handle multiple photo uploads
                for (const photoFile of fileData) {
                    const photoFormData = new FormData();
                    photoFormData.append('document_type', 'photo');  // Note: single 'photo' type
                    photoFormData.append('file', photoFile);

                    try {
                        const response = await api.post(
                            `/projects/${projectId}/upload-document/`,
                            photoFormData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }
                        );
                        documentUploads.push(response.data);
                    } catch (error) {
                        console.error(`Error uploading photo:`, error);
                        throw new Error(`Failed to upload photo`);
                    }
                }

            } else if (fileData && docType !== 'photos') {
                // Handle other document types
                const formData = new FormData();
                formData.append('document_type', docType);
                formData.append('file', fileData);

                try {
                    const response = await api.post(
                        `/projects/${projectId}/upload-document/`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );
                    documentUploads.push(response.data);
                } catch (error) {
                    console.error(`Error uploading ${docType}:`, error);
                    throw new Error(`Failed to upload ${docType}`);
                }
            }else if (docType === 'project_photos' && fileData.length > 0) {
                // Handle multiple photo uploads
                for (const photoFile of fileData) {
                    const imageFormData = new FormData();
                    imageFormData.append('document_type', 'project_image');
                    imageFormData.append('file', formData.documents.project_photo);

                    try {
                        const response = await api.post(
                            `/projects/${projectId}/upload-document/`,
                            imageFormData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }
                        );
                        documentUploads.push(response.data);
                    } catch (error) {
                        console.error(`Error uploading project photo:`, error);
                        throw new Error(`Failed to upload project photo`);
                    }
                }
            }
        }

        return documentUploads;
    };

    const handleError = (err) => {
        if (err.response?.data) {
            const serverError = err.response.data;
            return typeof serverError === 'object'
                ? Object.entries(serverError)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')
                : serverError;
        }
        return err.message || 'An error occurred while creating the project.';
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    {/* Header */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Retour aux projets
                    </button>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">Créer Votre Projet</h1>

                        {/* Progress Steps */}
                        <div className="mb-12">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            step <= currentStep ? 'bg-emerald-700 text-white' : 'bg-gray-200'
                                        }`}>
                                            {step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`h-1 w-24 sm:w-32 md:w-48 ${
                                                step < currentStep ? 'bg-emerald-700' : 'bg-gray-200'
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-sm text-gray-600">Informations de Base</span>
                                <span className="text-sm text-gray-600">Détails</span>
                                <span className="text-sm text-gray-600">Documents</span>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-md mb-4 relative">
                                <span className="text-xl mr-3">⚠️</span>
                                <span className="flex-grow">{error}</span>
                                <button
                                    onClick={handleCloseError}
                                    className="absolute top-2 right-2 text-red-700 font-bold hover:text-red-900"
                                >
                                    X
                                </button>
                            </div>
                        )}

                        {submissionStatus.success && (
                            <div className="flex items-center bg-green-50 text-green-700 p-4 rounded-md mb-4 relative">
                                <span className="text-xl mr-3">⚠️</span>
                                <span className="flex-grow">{submissionStatus.message}</span>
                                <button
                                    onClick={handleCloseError}
                                    className="absolute top-2 right-2 text-green-700 font-bold hover:text-green-900"
                                >
                                    X
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                        {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nom du Projet
                                        </label>
                                        <input
                                            type="text"
                                            name="project_name"
                                            value={formData.project_name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Secteur
                                        </label>
                                        <select
                                            name="sector"
                                            value={formData.sector}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        >
                                            <option value="">Sélectionnez un secteur</option>
                                            {sectors.map((sector) => (
                                                <option key={sector} value={sector}>
                                                    {sector}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Objectifs Spécifiques
                                        </label>
                                        <textarea
                                            name="specific_objectives"
                                            value={formData.specific_objectives}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Public Cible
                                        </label>
                                        <input
                                            type="text"
                                            name="target_audience"
                                            value={formData.target_audience}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Budget Estimé (FCFA)
                                        </label>
                                        <input
                                            type="number"
                                            name="estimated_budget"
                                            value={formData.estimated_budget}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Plan de Financement
                                        </label>
                                        <textarea
                                            name="financing_plan"
                                            value={formData.financing_plan}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                                            required
                                            placeholder="Décrivez vos sources de financement (fonds propres, subventions, crowdfunding, etc.)"
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-emerald-700">Documents Requis</h3>
                                        <div className="space-y-4">
                                            <div className="border rounded-lg p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Carte Nationale d'Identité *
                                                </label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-2 text-emerald-500" />
                                                            <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            name="id_card"
                                                            onChange={(e) => handleFileUpload(e, 'id_card')}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="border rounded-lg p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Attestation de Non Redevance Fiscale *
                                                </label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-2 text-emerald-500" />
                                                            <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            name="tax_clearance"
                                                            onChange={(e) => handleFileUpload(e, 'tax_clearance')}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            required
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg text-emerald-700">Documents Optionnels</h3>
                                        <div className="space-y-4">
                                            <div className="border rounded-lg p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Registre de Commerce
                                                </label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-2 text-emerald-500" />
                                                            <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            name="business_register"
                                                            onChange={(e) => handleFileUpload(e, 'business_register')}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="border rounded-lg p-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Étude de Faisabilité
                                                </label>
                                                <div className="flex items-center justify-center w-full">
                                                    <label
                                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                        <div
                                                            className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-8 h-8 mb-2 text-emerald-500"/>
                                                            <p className="text-sm text-gray-500">Cliquez pour
                                                                télécharger</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            name="feasibility_study"
                                                            onChange={(e) => handleFileUpload(e, 'feasibility_study')}
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                        />
                                                    </label>
                                                </div>

                                                <div className="border rounded-lg p-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Photo du projet *
                                                    </label>
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                            <div
                                                                className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <Upload className="w-8 h-8 mb-2 text-emerald-500"/>
                                                                <p className="text-sm text-gray-500">Cliquez pour
                                                                    télécharger</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                name="project_photos"
                                                                onChange={(e) => handleFileUpload(e, 'project_photos')}
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                required
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="px-6 py-2 border border-emerald-700 rounded-md text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                                        disabled={loading}
                                    >
                                        Précédent
                                    </button>
                                )}
                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="ml-auto px-6 py-2 bg-emerald-700 text-white rounded-md text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        Suivant
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="ml-auto px-6 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        {loading ? 'Création en cours...' : 'Soumettre le Projet'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Information Panel */}
                    <div className="mt-12 bg-emerald-50 rounded-lg p-6">
                        <div className="flex items-start">
                            <Info className="text-emerald-700 w-6 h-6 mt-1 flex-shrink-0" />
                            <div className="ml-4">
                                <h4 className="text-lg font-semibold text-emerald-700 mb-2">
                                    Informations Importantes
                                </h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Tous les documents marqués d'un astérisque (*) sont obligatoires.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Les fichiers doivent être au format PDF, JPG ou PNG et ne pas dépasser 5MB.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Votre demande sera examinée dans un délai de 5 jours ouvrables.
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        Pour toute question, n'hésitez pas à contacter notre équipe de support.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Support Contact */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Besoin d'aide pour créer votre projet ?{' '}
                            <a href="#contact" className="text-emerald-700 hover:text-emerald-800 font-medium">
                                Contactez notre équipe
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Banner */}
            <div className="bg-emerald-700 mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Prêt à faire partie de notre communauté ?
                        </h2>
                        <p className="text-emerald-100 mb-6">
                            Rejoignez les entrepreneurs qui transforment leurs communautés à travers EcoCommunity
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="px-6 py-3 bg-white text-emerald-700 rounded-md font-medium hover:bg-emerald-50 transition-colors">
                                En savoir plus
                            </button>
                            <button className="px-6 py-3 bg-yellow-500 text-white rounded-md font-medium hover:bg-yellow-600 transition-colors">
                                Créer un compte
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCreationForm;
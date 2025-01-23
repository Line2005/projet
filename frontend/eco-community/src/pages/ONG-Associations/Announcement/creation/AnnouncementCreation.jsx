import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, MapPin, Users, Clock, Tag, CheckCircle, Info, AlertCircle } from 'lucide-react';

const CreateAnnouncementPage = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("/api/placeholder/400/250");

    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        organization: '',
        location: '',
        deadline: '',
        requirements: [''],
        additionalInfo: '',
        contactEmail: '',
        contactPhone: '',
        budget: '',
        applicationProcess: '',
        status: 'draft'
    });

    const announcementTypes = [
        { id: 'funding', label: 'Financement', description: 'Subventions, prêts, investissements' },
        { id: 'training', label: 'Formation', description: 'Programmes éducatifs, ateliers, séminaires' },
        { id: 'partnership', label: 'Partenariat', description: 'Collaborations, alliances stratégiques' },
        { id: 'event', label: 'Événement', description: 'Conférences, foires, networking' },
        { id: 'opportunity', label: 'Opportunité', description: 'Autres opportunités professionnelles' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequirementChange = (index, value) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    const addRequirement = () => {
        setFormData(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const removeRequirement = (index) => {
        const newRequirements = formData.requirements.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
        // Navigate back to announcements page
        navigate('/association/announce');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/association/announce/')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Retour aux annonces
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle annonce</h1>
                    <p className="mt-2 text-gray-600">Remplissez les informations ci-dessous pour créer votre annonce</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Main Information Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations principales</h2>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image de l'annonce
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="mb-4 w-full max-w-md rounded-lg"
                                        />
                                        <Upload className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                                            <span>Télécharger un fichier</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre de l'annonce *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Ex: Programme de financement pour projets innovants"
                            />
                        </div>

                        {/* Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type d'annonce *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {announcementTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                            formData.type === type.id
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-gray-200 hover:border-emerald-200'
                                        }`}
                                        onClick={() => handleInputChange({ target: { name: 'type', value: type.id } })}
                                    >
                                        <div className="flex items-center mb-2">
                                            <CheckCircle className={`h-5 w-5 mr-2 ${
                                                formData.type === type.id ? 'text-emerald-500' : 'text-gray-300'
                                            }`} />
                                            <span className="font-medium">{type.label}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{type.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description détaillée *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Décrivez en détail votre annonce..."
                            />
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Détails de l'annonce</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Organization */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organisation *
                                </label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Nom de l'organisation"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Localisation *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Ex: Yaoundé, National, etc."
                                />
                            </div>

                            {/* Budget (if type is funding) */}
                            {formData.type === 'funding' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Budget disponible
                                    </label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Montant en FCFA"
                                    />
                                </div>
                            )}

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date limite *
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Conditions requises</h2>

                        <div className="space-y-4">
                            {formData.requirements.map((requirement, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={requirement}
                                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Ex: Minimum 2 ans d'expérience"
                                    />
                                    {formData.requirements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                + Ajouter une condition
                            </button>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de contact</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de contact *
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Téléphone de contact
                                </label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="+237 ..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/announcements')}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                            className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                        >
                            Sauvegarder comme brouillon
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Publier l'annonce
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <div className="flex items-start">
                            <Info className="h-6 w-6 text-blue-500 mr-4 mt-1" />
                            <div>
                                <h3 className="text-lg font-medium text-blue-900 mb-2">
                                    Conseils pour une bonne annonce
                                </h3>
                                <ul className="space-y-2 text-blue-800">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                        Soyez clair et concis dans votre description
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                        Précisez les conditions d'éligibilité
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                        Indiquez clairement les délais et dates importantes
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                        Fournissez des coordonnées de contact valides
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Warning for required fields */}
                    <div className="mt-4 flex items-center text-gray-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Les champs marqués d'un astérisque (*) sont obligatoires
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAnnouncementPage;
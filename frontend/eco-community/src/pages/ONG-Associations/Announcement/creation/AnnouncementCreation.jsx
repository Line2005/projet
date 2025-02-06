import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, MapPin, Users, Clock, Tag, CheckCircle, Info, AlertCircle, DollarSign } from 'lucide-react';
import toast from "react-hot-toast";
import api from "../../../../Services/api.js";

const CreateAnnouncementPage = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("/api/placeholder/400/250");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        organization: '',
        location: '',
        deadline: '',
        requirements: [''],
        additionalInfo: '',
        contact_email: '',
        contact_phone: '',
        budget: '',
        applicationProcess: '',
        status: 'draft'
    });

    const [errors, setErrors] = useState({});
    const [typeSpecificErrors, setTypeSpecificErrors] = useState({});

    const announcementTypes = [
        {
            id: 'funding',
            label: 'Financement',
            description: 'Subventions, prêts, investissements',
            requiredFields: ['budget'],
            icon: DollarSign
        },
        {
            id: 'training',
            label: 'Formation',
            description: 'Programmes éducatifs, ateliers, séminaires',
            requiredFields: ['requirements'],
            icon: Users
        },
        {
            id: 'partnership',
            label: 'Partenariat',
            description: 'Collaborations, alliances stratégiques',
            requiredFields: ['requirements'],
            icon: CheckCircle
        },
        {
            id: 'event',
            label: 'Événement',
            description: 'Conférences, foires, networking',
            requiredFields: ['location', 'deadline'],
            icon: Calendar
        },
        {
            id: 'opportunity',
            label: 'Opportunité',
            description: 'Autres opportunités professionnelles',
            requiredFields: ['deadline'],
            icon: Tag
        }
    ];

    // Handle type-specific field requirements
    useEffect(() => {
        if (formData.type) {
            const selectedType = announcementTypes.find(type => type.id === formData.type);
            if (selectedType) {
                validateTypeSpecificFields(selectedType.requiredFields);
            }
        }
    }, [formData.type, formData.budget, formData.requirements, formData.location, formData.deadline]);

    const validateTypeSpecificFields = (requiredFields) => {
        const newErrors = {};

        requiredFields.forEach(field => {
            switch (field) {
                case 'budget':
                    if (!formData.budget || isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
                        newErrors.budget = 'Un budget valide est requis pour les financements';
                    }
                    break;
                case 'requirements':
                    if (!formData.requirements.some(req => req.trim())) {
                        newErrors.requirements = 'Au moins une condition est requise';
                    }
                    break;
                case 'location':
                    if (!formData.location.trim()) {
                        newErrors.location = 'La localisation est requise';
                    }
                    break;
                case 'deadline':
                    if (!formData.deadline) {
                        newErrors.deadline = 'La date limite est requise';
                    }
                    break;
                default:
                    break;
            }
        });

        setTypeSpecificErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update the requirement handling functions
    const handleRequirementChange = (index, value) => {
        const newRequirements = [...formData.requirements];
        newRequirements[index] = value;
        setFormData(prev => ({
            ...prev,
            requirements: newRequirements
        }));
    };

    const addRequirement = () => {
        if (formData.requirements.length < 10) { // Optional: limit max requirements
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, '']
            }));
        }
    };

    const removeRequirement = (index) => {
        if (formData.requirements.length > 1) { // Always keep at least one requirement field
            const newRequirements = formData.requirements.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                requirements: newRequirements
            }));
        }
    };

    const validateImageFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            toast.error('Seuls les formats JPG, JPEG et PNG sont acceptés');
            return false;
        }

        if (file.size > maxSize) {
            toast.error('La taille du fichier ne doit pas dépasser 10MB');
            return false;
        }

        return true;
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && validateImageFile(file)) {
            try {
                // Create a new File object with a proper name and type
                const imageType = file.type.split('/')[1];
                const newFileName = `image_${Date.now()}.${imageType}`;
                const newFile = new File([file], newFileName, { type: file.type });

                setSelectedFile(newFile);

                // Create preview URL
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(newFile);
            } catch (error) {
                console.error('Error processing image:', error);
                toast.error('Erreur lors du traitement de l\'image');
            }
        }
    };

    // const formatRequirementsForSubmission = (requirements) => {
    //     // Filter out empty requirements and trim whitespace
    //     return requirements
    //         .map(req => req.trim())
    //         .filter(req => req.length > 0);
    // };

    const handleStatusSubmit = async (status) => {
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();

            // Add basic fields
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('type', formData.type);
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('location', formData.location.trim());
            formDataToSend.append('deadline', formData.deadline);
            formDataToSend.append('contact_email', formData.contact_email.trim());
            formDataToSend.append('status', status);

            if (formData.contact_phone.trim()) {
                formDataToSend.append('contact_phone', formData.contact_phone.trim());
            }

            // Handle budget for funding type
            if (formData.type === 'funding' && formData.budget) {
                formDataToSend.append('budget', parseFloat(formData.budget).toFixed(2));
            }

            // Handle requirements - ensure proper JSON stringification
            const formattedRequirements = formData.requirements
                .map(req => req.trim())
                .filter(req => req.length > 0);

            // Always send requirements as a JSON string, even if empty
            formDataToSend.append('requirements', JSON.stringify(formattedRequirements));

            // Handle image upload
            if (selectedFile instanceof File) {
                formDataToSend.append('image', selectedFile);
            }

            const response = await api.post('/announcements/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 201) {
                toast.success('Annonce créée avec succès!');
                navigate('/association/announce');
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            if (error.response?.data) {
                Object.entries(error.response.data).forEach(([key, value]) => {
                    const errorMessage = Array.isArray(value) ? value.join(', ') : value;
                    toast.error(`${key}: ${errorMessage}`);
                });
            } else {
                toast.error('Une erreur est survenue lors de la création de l\'annonce');
            }
        } finally {
            setIsSubmitting(false);
        }
    };


// Add a proper validateForm function with console logs
    const validateForm = () => {
        const newErrors = {};

        // Basic validations
        if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
        if (!formData.type) newErrors.type = 'Le type d\'annonce est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.deadline) newErrors.deadline = 'La date limite est requise';
        if (!formData.contact_email) newErrors.contact_email = 'L\'email de contact est requis';
        if (!formData.location.trim()) newErrors.location = 'La localisation est requise';

        // Type-specific validations
        if (formData.type === 'funding') {
            const budget = parseFloat(formData.budget);
            if (!budget || isNaN(budget) || budget <= 0) {
                newErrors.budget = 'Un budget valide est requis pour les financements';
            }
        }

        if (['training', 'partnership'].includes(formData.type)) {
            const validRequirements = formData.requirements.filter(req => req.trim());
            if (validRequirements.length === 0) {
                newErrors.requirements = 'Au moins une condition est requise';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Render type-specific fields
    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case 'funding':
                return (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget disponible *
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                    typeSpecificErrors.budget ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Montant en FCFA"
                            />
                        </div>
                        {typeSpecificErrors.budget && (
                            <p className="mt-1 text-sm text-red-600">{typeSpecificErrors.budget}</p>
                        )}
                    </div>
                );
            case 'training':
            case 'partnership':
                return (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prérequis *
                        </label>
                        {formData.requirements.map((requirement, index) => (
                            <div key={index} className="flex items-center gap-4 mb-2">
                                <input
                                    type="text"
                                    value={requirement}
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        typeSpecificErrors.requirements ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ex: Minimum 2 ans d'expérience"
                                />
                                {index > 0 && (
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
                            + Ajouter un prérequis
                        </button>
                        {typeSpecificErrors.requirements && (
                            <p className="mt-1 text-sm text-red-600">{typeSpecificErrors.requirements}</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
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

                <form onSubmit={handleStatusSubmit} className="space-y-8">
                    {/* Main Information Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations principales</h2>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image de l'annonce
                            </label>
                            <div
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="mb-4 w-full max-w-md rounded-lg"
                                        />
                                        <Upload className="h-12 w-12 text-gray-400"/>
                                    </div>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
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
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                    errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Ex: Programme de financement pour projets innovants"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
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
                                        onClick={() => handleInputChange({target: {name: 'type', value: type.id}})}
                                    >
                                        <div className="flex items-center mb-2">
                                            <type.icon className={`h-5 w-5 mr-2 ${
                                                formData.type === type.id ? 'text-emerald-500' : 'text-gray-300'
                                            }`}/>
                                            <span className="font-medium">{type.label}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{type.description}</p>
                                    </div>
                                ))}
                            </div>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                            )}
                        </div>

                        {/* Type-specific fields */}
                        {renderTypeSpecificFields()}

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description détaillée *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Décrivez en détail votre annonce..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Location and Deadline Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Localisation et Date</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Localisation *
                                </label>
                                <div className="relative">
                                    <span
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400"/>
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.location || typeSpecificErrors.location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Ex: Yaoundé, National, etc."
                                    />
                                </div>
                                {(errors.location || typeSpecificErrors.location) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.location || typeSpecificErrors.location}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date limite *
                                </label>
                                <div className="relative">
                                    <span
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400"/>
                                    </span>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.deadline || typeSpecificErrors.deadline ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {(errors.deadline || typeSpecificErrors.deadline) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.deadline || typeSpecificErrors.deadline}
                                    </p>
                                )}
                            </div>
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
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.contact_email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="email@example.com"
                                />
                                {errors.contact_email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Téléphone de contact
                                </label>
                                <input
                                    type="tel"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="+237 ..."
                                />
                                {errors.contact_phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/association/announce')}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusSubmit('draft')}
                            className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            Sauvegarder comme brouillon
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusSubmit('published')}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Publication...' : 'Publier l\'annonce'}
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <div className="flex items-start">
                            <Info className="h-6 w-6 text-blue-500 mr-4 mt-1"/>
                            <div>
                                <h3 className="text-lg font-medium text-blue-900 mb-2">
                                    Conseils pour une bonne annonce
                                </h3>
                                <ul className="space-y-2 text-blue-800">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2"/>
                                        Soyez clair et concis dans votre description
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2"/>
                                        Précisez les conditions d'éligibilité
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2"/>
                                        Indiquez clairement les délais et dates importantes
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2"/>
                                        Fournissez des coordonnées de contact valides
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAnnouncementPage;
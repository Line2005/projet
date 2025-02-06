import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import api from "../../../Services/api.js";
import AnnouncementImage from "./AnnouncementImage.jsx";

const EditAnnouncementModal = ({ announcement, onClose, onUpdate }) => {
    // Initialize requirements as an array, handling both string and array inputs
    const initialRequirements = (() => {
        try {
            if (Array.isArray(announcement.requirements)) {
                return announcement.requirements;
            }
            if (typeof announcement.requirements === 'string') {
                return JSON.parse(announcement.requirements);
            }
            return [];
        } catch {
            return [];
        }
    })();

    const [formData, setFormData] = useState({
        title: announcement.title || '',
        type: announcement.type || '',
        description: announcement.description || '',
        location: announcement.location || '',
        deadline: announcement.deadline || '',
        budget: announcement.budget || '',
        requirements: initialRequirements,
        contact_email: announcement.contact_email || '',
        contact_phone: announcement.contact_phone || '',
        status: announcement.status || ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(announcement.image || null);
    const [modified, setModified] = useState({});

    const announcementTypes = {
        'funding': 'Financement',
        'training': 'Formation',
        'partnership': 'Partenariat',
        'event': 'Événement',
        'opportunity': 'Opportunité'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setModified(prev => ({
            ...prev,
            [name]: true
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleRequirementsChange = (e) => {
        const text = e.target.value;
        // Simply store the raw text as array of lines
        const requirements = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== ''); // Remove empty lines

        setFormData(prev => ({
            ...prev,
            requirements: requirements
        }));
        setModified(prev => ({
            ...prev,
            requirements: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!announcement.id) return;

        setSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();

            Object.keys(modified).forEach(key => {
                if (key === 'requirements') {
                    // Clean up the requirements array before sending
                    const requirementsToSend = formData.requirements
                        .map(req => req.trim())
                        .filter(req => req !== '');
                    formDataToSend.append('requirements', JSON.stringify(requirementsToSend));
                } else if (key === 'image' && imageFile) {
                    formDataToSend.append('image', imageFile);
                } else if (key === 'budget' && formData[key]) {
                    formDataToSend.append('budget', formData[key].toString());
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await api.patch(
                `/announcements/${announcement.id}/`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            onUpdate(response.data);
            onClose();
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData) {
                const formattedErrors = {};
                Object.entries(errorData).forEach(([key, value]) => {
                    formattedErrors[key] = typeof value === 'string' ? value : value.join(' ');
                });
                setErrors(formattedErrors);
            } else {
                setErrors({
                    non_field_errors: "Une erreur s'est produite lors de la mise à jour de l'annonce"
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Modifier l'annonce
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {errors.non_field_errors && (
                        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                            {errors.non_field_errors}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type d'annonce
                                </label>
                                <input
                                    type="text"
                                    value={announcementTypes[formData.type] || formData.type}
                                    disabled
                                    className="w-full p-2 rounded-lg bg-gray-50 border-transparent"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 min-h-[120px]"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {formData.type === 'funding' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Budget
                                    </label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.budget && (
                                        <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                                    )}
                                </div>
                            )}

                            {['training', 'partnership'].includes(formData.type) && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prérequis
                                    </label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements.join('\n')}
                                        onChange={handleRequirementsChange}
                                        rows={6}
                                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 min-h-[120px]"
                                        placeholder="Entrez chaque prérequis sur une nouvelle ligne"
                                    />
                                    {errors.requirements && (
                                        <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Lieu
                                    </label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date limite
                                    </label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.deadline && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email de contact
                                    </label>
                                    <input
                                        type="email"
                                        name="contact_email"
                                        value={formData.contact_email}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.contact_email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Téléphone de contact
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact_phone"
                                        value={formData.contact_phone}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.contact_phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image
                                </label>
                                <div className="mt-1 flex items-center gap-4">
                                    {imagePreview && (
                                        <AnnouncementImage
                                            image={imagePreview}
                                            title={formData.title}
                                            className="h-32 w-32 object-cover rounded-lg"
                                        />
                                    )}
                                    <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <span className="flex items-center">
                                            <Upload className="h-5 w-5 mr-2" />
                                            {imagePreview ? "Changer l'image" : "Ajouter une image"}
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setImageFile(file);
                                                    setImagePreview(URL.createObjectURL(file));
                                                    setModified(prev => ({
                                                        ...prev,
                                                        image: true
                                                    }));
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || Object.keys(modified).length === 0}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save className="h-5 w-5" />
                                {submitting ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAnnouncementModal;
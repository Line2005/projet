import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, Clock, MapPin, X, Info, Users } from 'lucide-react';
import api from "../../../../Services/api.js";


const CreateEventPage = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        registration_deadline: '',
        status: 'draft'
    });

    const handleGoBack = () => {
        navigate('/association/events');
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Frontend validation
        const validationErrors = {};

        // Basic field validations (same as before)
        if (!formData.title.trim()) validationErrors.title = 'Le titre est requis';
        if (!formData.type) validationErrors.type = 'Le type d\'événement est requis';
        if (!formData.description.trim()) validationErrors.description = 'La description est requise';
        if (!formData.date) validationErrors.date = 'La date est requise';
        if (!formData.time) validationErrors.time = 'L\'heure est requise';
        if (!formData.location.trim()) validationErrors.location = 'Le lieu est requis';
        if (!formData.capacity || parseInt(formData.capacity) < 1) validationErrors.capacity = 'La capacité doit être au moins de 1';
        if (!formData.registration_deadline) validationErrors.registration_deadline = 'La date limite d\'inscription est requise';

        // Registration deadline validation
        if (formData.registration_deadline && formData.date) {
            const registrationDeadline = new Date(formData.registration_deadline);
            const eventDate = new Date(formData.date);
            if (registrationDeadline >= eventDate) {
                validationErrors.registration_deadline = 'La date limite d\'inscription doit être avant la date de l\'événement';
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert image to base64 if present
            let imageData = null;
            if (imageFile) {
                imageData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        // Extract base64 data from the result
                        const base64String = reader.result.split(',')[1];
                        resolve(base64String);
                    };
                    reader.readAsDataURL(imageFile);
                });
            }

            // Prepare the request data
            const requestData = {
                ...formData,
                image: imageData
            };

            // Send request to create event
            const response = await api.post('/events/', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            navigate('/association/events');
        } catch (error) {
            console.error('Event creation error:', error.response ? error.response.data : error.message);
            setError(error.response?.data || 'Une erreur inattendue s\'est produite');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={handleGoBack}
                        className="mr-4 p-2 hover:bg-white rounded-lg"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Créer un événement</h1>
                        <p className="text-gray-600">Organisez un nouvel événement pour votre communauté</p>
                    </div>
                </div>

                {/* Error handling */}
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
                        {typeof error === 'object'
                            ? JSON.stringify(error)
                            : error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload section remains the same as previous implementation */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Image de l'événement</h2>
                        {!selectedImage ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                <div className="text-center">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                    <div className="text-gray-600">
                                        <label className="cursor-pointer text-emerald-600 hover:text-emerald-700">
                                            <span>Choisir une image</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                        <p className="text-sm text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                                >
                                    <X className="h-5 w-5 text-gray-600"/>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Rest of the form remains the same as previous implementation */}
                    {/* Note: only changes are in handleSubmit method and a few field names */}

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Informations de base</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre de l'événement
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Donnez un titre à votre événement"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type d'événement
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionnez un type</option>
                                    <option value="forum">Forum</option>
                                    <option value="workshop">Atelier</option>
                                    <option value="webinars">Webinars</option>
                                    <option value="conference">Conférence</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Décrivez votre événement"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date and Location section remains the same */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Date et lieu</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1"/>
                                        Date
                                    </div>
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1"/>
                                        Heure
                                    </div>
                                </label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1"/>
                                        Lieu
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Adresse de l'événement"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements and Capacity section remains the same */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Conditions et capacité</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1"/>
                                        Capacité maximale
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData(prev => ({...prev, capacity: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Nombre de participants maximum"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date limite d'inscription
                                </label>
                                <input
                                    type="date"
                                    value={formData.registration_deadline}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        registration_deadline: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={(e) => {
                                // Explicitly set status to draft when this button is clicked
                                setFormData(prev => ({...prev, status: 'draft'}));
                                handleSubmit(e);
                            }}
                            className="px-6 py-3 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        >
                            Enregistrer comme brouillon
                        </button>
                        <button
                            type="submit"
                            onClick={(e) => {
                                // Explicitly set status to published when this button is clicked
                                setFormData(prev => ({...prev, status: 'published'}));
                                handleSubmit(e);
                            }}
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                                isSubmitting
                                    ? 'bg-emerald-400 text-white cursor-not-allowed'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                        >
                            {isSubmitting ? 'Création en cours...' : 'Créer l\'événement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default CreateEventPage;
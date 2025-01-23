import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, Clock, MapPin, X, Info, Users } from 'lucide-react';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        requirements: [''],
        registrationDeadline: ''
    });

    const handleGoBack = () => {
        navigate('/association/events');
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    const addRequirement = () => {
        setFormData(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const removeRequirement = (index) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const handleRequirementChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.map((req, i) =>
                i === index ? value : req
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
        navigate('/ngo/events');
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Image de l'événement</h2>
                        {!selectedImage ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                <div className="text-center">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                                    <X className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        )}
                    </div>

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
                                >
                                    <option value="">Sélectionnez un type</option>
                                    <option value="collecte">Collecte</option>
                                    <option value="distribution">Distribution</option>
                                    <option value="formation">Formation</option>
                                    <option value="autre">Autre</option>
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
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date and Location */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Date et lieu</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Date
                                    </div>
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        Heure
                                    </div>
                                </label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData(prev => ({...prev, time: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        Lieu
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Adresse de l'événement"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Requirements and Capacity */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Conditions et capacité</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        Capacité maximale
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData(prev => ({...prev, capacity: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Nombre de participants maximum"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <div className="flex items-center">
                                        <Info className="h-4 w-4 mr-1" />
                                        Conditions requises
                                    </div>
                                </label>
                                {formData.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={req}
                                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Ajoutez une condition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addRequirement}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 mt-2"
                                >
                                    + Ajouter une condition
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date limite d'inscription
                                </label>
                                <input
                                    type="date"
                                    value={formData.registrationDeadline}
                                    onChange={(e) => setFormData(prev => ({...prev, registrationDeadline: e.target.value}))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Créer l'événement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;
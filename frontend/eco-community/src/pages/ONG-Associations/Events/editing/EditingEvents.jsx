import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Calendar, Clock, MapPin, X, Info, Users, AlertCircle } from 'lucide-react';

const EditEventPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize with the event data structure
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        requirements: [''],
        registrationDeadline: '',
        status: ''
    });

    useEffect(() => {
        // Simulate fetching event data
        // In a real application, you would fetch from your API
        const fetchEventData = () => {
            setIsLoading(true);
            try {
                // Simulated event data (matching the format from NGOEventsPage)
                const eventData = {
                    id: 1,
                    title: "Forum de l'Entrepreneuriat 2024",
                    type: "forum",
                    description: "Grand rassemblement des entrepreneurs et des structures d'accompagnement.",
                    date: "2024-03-15",
                    time: "09:00",
                    location: "Palais des Congrès, Yaoundé",
                    status: "upcoming",
                    capacity: 100,
                    requirements: ["Être entrepreneur", "Avoir un projet innovant"],
                    registrationDeadline: "2024-03-01",
                    imageUrl: "/api/placeholder/400/250"
                };

                setFormData(eventData);
                setSelectedImage(eventData.imageUrl);
                setIsLoading(false);
            } catch (err) {
                setError("Impossible de charger les données de l'événement");
                setIsLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Simulate API call to update event
            console.log('Updated event data:', formData);
            navigate('/ngo/events');
        } catch (err) {
            setError("Erreur lors de la mise à jour de l'événement");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold text-gray-900">Modifier l'événement</h1>
                        <p className="text-gray-600">Mettez à jour les informations de votre événement</p>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

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

                    {/* Status Selection */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Statut de l'événement</h2>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="upcoming">À venir</option>
                            <option value="ongoing">En cours</option>
                            <option value="completed">Terminé</option>
                            <option value="draft">Brouillon</option>
                            <option value="cancelled">Annulé</option>
                        </select>
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
                                    <option value="forum">Forum</option>
                                    <option value="workshop">Atelier</option>
                                    <option value="training">Formation</option>
                                    <option value="conference">Conférence</option>
                                    <option value="other">Autre</option>
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="px-6 py-3 bg-white text-gray-600 rounded-lg hover:bg-gray-50 border border-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Sauvegarder les modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventPage;
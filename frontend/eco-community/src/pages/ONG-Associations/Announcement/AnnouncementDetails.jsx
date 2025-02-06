import React from 'react';
import { X, Calendar, Users, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import AnnouncementImage from "./AnnouncementImage.jsx";

const AnnouncementDetailsModal = ({ announcement, onClose }) => {
    if (!announcement) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'Non spécifié';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'CFA'
        }).format(amount);
    };

    const typeLabels = {
        funding: 'Financement',
        training: 'Formation',
        partnership: 'Partenariat',
        event: 'Événement',
        opportunity: 'Opportunité'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header with close button */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Détails de l'annonce</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Image */}
                    <div className="mb-6 rounded-lg overflow-hidden">
                        <AnnouncementImage
                            image={announcement.image}
                            title={announcement.title}
                            className="h-full"
                        />
                    </div>

                    {/* Title and Status */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {announcement.title}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            announcement.status === 'published'
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}>
              {announcement.status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Date limite</p>
                                <p>{formatDate(announcement.deadline)}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <Users className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Type</p>
                                <p>{typeLabels[announcement.type] || announcement.type}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <MapPin className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Localisation</p>
                                <p>{announcement.location}</p>
                            </div>
                        </div>

                        {announcement.budget && (
                            <div className="flex items-center text-gray-700">
                                <DollarSign className="h-5 w-5 mr-3 text-emerald-500" />
                                <div>
                                    <p className="font-medium">Budget</p>
                                    <p>{formatCurrency(announcement.budget)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{announcement.description}</p>
                    </div>

                    {/* Requirements */}
                    {announcement.requirements && announcement.requirements.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Prérequis</h3>
                            <div className="flex flex-wrap gap-2">
                                {announcement.requirements.map((req, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                                    >
                    {req}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Contact</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 mr-2 text-emerald-500" />
                                <a href={`mailto:${announcement.contact_email}`} className="text-emerald-600 hover:underline">
                                    {announcement.contact_email}
                                </a>
                            </div>
                            {announcement.contact_phone && (
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-emerald-500" />
                                    <a href={`tel:${announcement.contact_phone}`} className="text-emerald-600 hover:underline">
                                        {announcement.contact_phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetailsModal;
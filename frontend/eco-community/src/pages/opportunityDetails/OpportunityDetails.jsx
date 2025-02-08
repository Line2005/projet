import React from 'react';
import {
    Calendar,
    MapPin,
    Users,
    Mail,
    Phone,
    DollarSign,
    Clock,
    X,
    Building,
    FileText,
    Tag
} from 'lucide-react';

const OpportunityDetailModal = ({ opportunity,onClose }) => {
    if (!opportunity) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle clicking outside the modal to close it
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative">
                {/* Close button - Always visible */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="h-6 w-6 text-gray-500" />
                </button>

                {/* Image header */}
                <div className="relative h-64">
                    <img
                        src={opportunity.imageUrl}
                        alt={opportunity.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/250";
                        }}
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium">
                            {opportunity.category === 'events' ? 'Événement' : 'Annonce'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h2>
                        <div className="flex items-center text-gray-600 mb-4">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{opportunity.organization?.name || 'Organisation'}</span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-line">{opportunity.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-3 text-emerald-500" />
                            <span>{opportunity.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                            <span>
                                {opportunity.category === 'events'
                                    ? `Date: ${formatDate(opportunity.date)}`
                                    : `Date limite: ${formatDate(opportunity.deadline || opportunity.registration_deadline)}`
                                }
                            </span>
                        </div>

                        {opportunity.category === 'events' && (
                            <div className="flex items-center text-gray-600">
                                <Users className="h-5 w-5 mr-3 text-emerald-500" />
                                <span>Capacité: {opportunity.capacity} personnes</span>
                            </div>
                        )}

                        {opportunity.budget && (
                            <div className="flex items-center text-gray-600">
                                <DollarSign className="h-5 w-5 mr-3 text-emerald-500" />
                                <span>Budget: {opportunity.budget.toLocaleString()} €</span>
                            </div>
                        )}
                    </div>

                    {opportunity.requirements && opportunity.requirements.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Prérequis</h3>
                            <ul className="space-y-2">
                                {opportunity.requirements.map((req, index) => (
                                    <li key={index} className="flex items-start">
                                        <Tag className="h-5 w-5 mr-3 text-emerald-500 mt-0.5" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(opportunity.contact_email || opportunity.contact_phone) && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-3">Contact</h3>
                            <div className="space-y-3">
                                {opportunity.contact_email && (
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="h-5 w-5 mr-3 text-emerald-500" />
                                        <a href={`mailto:${opportunity.contact_email}`} className="hover:text-emerald-600">
                                            {opportunity.contact_email}
                                        </a>
                                    </div>
                                )}
                                {opportunity.contact_phone && (
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-5 w-5 mr-3 text-emerald-500" />
                                        <a href={`tel:${opportunity.contact_phone}`} className="hover:text-emerald-600">
                                            {opportunity.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action buttons - Always show at least the close button */}
                <div className="border-t p-6 bg-gray-50">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => {/* Handle application/registration */}}
                            className="flex-1 bg-emerald-600 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            {opportunity.category === 'events' ? "S'inscrire" : 'Postuler'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 border-2 border-emerald-600 text-emerald-600 py-2.5 px-4 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetailModal;
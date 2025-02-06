import React from 'react';
import { X, Calendar, Users, UserPlus, Clock, MapPin, DollarSign } from 'lucide-react';
import EventImage from "./EventImage.jsx";

const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const typeLabels = {
        forum: "Forum",
        workshop: "Atelier",
        webinars: "Webinaire",
        conference: "Conférence"
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
                        {event.image ? (
                            <div className="h-full w-full">
                                <EventImage
                                    image={event.image}
                                    title={event.title}
                                    className="h-full"
                                />
                            </div>
                        ) : (
                            <div
                                className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-gray-400"/>
                            </div>
                        )}
                    </div>

                    {/* Title and Status */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {event.title}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === 'published'
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}>
              {event.status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Date de l'évènement</p>
                                <p>{formatDate(event.date)}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <Clock className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Heure</p>
                                <p>{formatTime(event.time)}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <Users className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Type</p>
                                <p>{typeLabels[event.type] || event.type}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <MapPin className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Localisation</p>
                                <p>{event.location}</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <UserPlus className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Capacité</p>
                                <p>{event.capacity} participants</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <Calendar className="h-5 w-5 mr-3 text-emerald-500" />
                            <div>
                                <p className="font-medium">Date limite d'inscription</p>
                                <p>{formatDate(event.registration_deadline)}</p>
                            </div>
                        </div>
                    </div>


                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>

                    {/* Organization Info */}
                    {event.organization && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold mb-3">Organisation</h3>
                            <p className="text-gray-700">{event.organization.name}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
import React from 'react';
import {
    DollarSign,
    Calendar,
    Clock,
    User,
    Briefcase,
    Target,
    FileText,
    X,
    Timer,
    Wrench
} from 'lucide-react';

const ProposalDetailModal = ({ proposal, onClose }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderFinancialDetails = () => (
        <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 mt-1 text-emerald-500" />
                <div>
                    <h4 className="font-medium text-gray-900">Montant de l'investissement</h4>
                    <p className="text-gray-600">{proposal.investment_amount.toLocaleString()} €</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <Briefcase className="w-5 h-5 mt-1 text-emerald-500" />
                <div>
                    <h4 className="font-medium text-gray-900">Type d'investissement</h4>
                    <p className="text-gray-600">{proposal.investment_type}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 mt-1 text-emerald-500" />
                <div>
                    <h4 className="font-medium text-gray-900">Échéancier de paiement</h4>
                    <p className="text-gray-600">{proposal.payment_schedule}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 mt-1 text-emerald-500" />
                <div>
                    <h4 className="font-medium text-gray-900">Retour sur investissement attendu</h4>
                    <p className="text-gray-600">{proposal.expected_return}</p>
                </div>
            </div>
        </div>
    );

    const renderTechnicalDetails = () => (
        <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <Wrench className="w-5 h-5 mt-1 text-emerald-500"/>
                <div>
                    <h4 className="font-medium text-gray-900">Expertise</h4>
                    <p className="text-gray-600">{proposal.expertise}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <User className="w-5 h-5 mt-1 text-emerald-500"/>
                <div>
                    <h4 className="font-medium text-gray-900">Niveau d'expérience</h4>
                    <p className="text-gray-600">{proposal.experience_level}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-1 text-emerald-500"/>
                <div>
                    <h4 className="font-medium text-gray-900">Disponibilité</h4>
                    <p className="text-gray-600">{proposal.availability}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 mt-1 text-emerald-500"/>
                <div>
                    <h4 className="font-medium text-gray-900">Approche proposée</h4>
                    <p className="text-gray-600">{proposal.proposed_approach}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <Briefcase className="w-5 h-5 mt-1 text-emerald-500"/>
                <div>
                    <h4 className="font-medium text-gray-900">Ressources additionnelles</h4>
                    <p className="text-gray-600">{proposal.additional_resources}</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <Timer className="w-5 h-5 mt-1 text-emerald-500"/>
                <div>
                    <h4 className="font-medium text-gray-900">Durée du support</h4>
                    <p className="text-gray-600">{proposal.support_duration}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}/>

                <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-start p-6 border-b">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Détails de la proposition
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {proposal.type === 'financial' ? 'Aide financière' : 'Support technique'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <User className="w-5 h-5 mt-1 text-emerald-500"/>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {proposal.type === 'financial' ? 'Investisseur' : 'Mentor'}
                                    </h4>
                                    <p className="text-gray-600">
                                        {proposal.type === 'financial' ? proposal.investor : proposal.mentor}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <FileText className="w-5 h-5 mt-1 text-emerald-500"/>
                                <div>
                                    <h4 className="font-medium text-gray-900">Description du projet</h4>
                                    <p className="text-gray-600">{proposal.description}</p>
                                </div>
                            </div>

                            {proposal.type === 'financial' ? renderFinancialDetails() : renderTechnicalDetails()}

                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 mt-1 text-emerald-500"/>
                                <div>
                                    <h4 className="font-medium text-gray-900">Date de soumission</h4>
                                    <p className="text-gray-600">{proposal.submissionDate}</p>
                                </div>
                            </div>
                        </div>

                        {proposal.additional_terms && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Termes additionnels</h4>
                                <p className="text-gray-600">{proposal.additional_terms}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t bg-gray-50 rounded-b-xl">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalDetailModal;
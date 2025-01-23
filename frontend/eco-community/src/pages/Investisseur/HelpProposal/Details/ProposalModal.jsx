import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../../../../components/ui/dialog.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "../../../../components/ui/card.jsx";
import {DollarSign, Wrench, Clock, Timer, Calendar, CreditCard, CalendarDays, Check, X} from "lucide-react";
import React from "react";

// const getStatusStyle = (status) => {
//     switch (status) {
//         case 'accepted':
//             return 'bg-green-100 text-green-800';
//         case 'refused':
//             return 'bg-red-100 text-red-800';
//         default:
//             return 'bg-yellow-100 text-yellow-800';
//     }
// };

const getStatusStyle = (status) => {
    const styles = {
        accepted: 'bg-green-100 text-green-800 border border-green-200',
        refused: 'bg-red-100 text-red-800 border border-red-200',
        default: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    };
    return styles[status] || styles.default;
};

const getStatusIcon = (status) => {
    const icons = {
        accepted: <Check className="h-3 w-3 mr-1" />,
        refused: <X className="h-3 w-3 mr-1" />,
        default: <Clock className="h-3 w-3 mr-1" />
    };
    return icons[status] || icons.default;
};

export const ProposalDetailModal = ({ proposal, onClose }) => {
    if (!proposal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col bg-white rounded-lg shadow-xl">
                {/* Header raffiné */}
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white relative rounded-t-lg p-5">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white hover:text-emerald-200 transition-colors p-1.5 rounded-full hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <div className="space-y-2">
                        <CardTitle className="text-xl font-medium">Proposal Details</CardTitle>
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-normal flex items-center shadow-sm ${getStatusStyle(proposal.status)}`}>
                                {getStatusIcon(proposal.status)}
                                {proposal.status === 'accepted' ? 'Accepted' : proposal.status === 'refused' ? 'Refused' : 'Pending'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-normal flex items-center shadow-sm ${
                                proposal.type === 'financial' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                                {proposal.type === 'financial' ? (
                                    <span className="flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1"/>
                                        Financial Support
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Wrench className="h-3 w-3 mr-1"/>
                                        Technical Support
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <div className="p-5 space-y-6">
                    {/* Help Request Details */}
                    <Card className="border border-emerald-100">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base text-emerald-800 font-medium">Help Request Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Specific Need</p>
                                    <p className="text-sm text-gray-900">{proposal.help_request_details?.specific_need}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Request Type</p>
                                    <p className="text-sm text-gray-900">{proposal.help_request_details?.request_type}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Proposal Details */}
                    {proposal.type === 'financial' && (
                        <Card className="border border-emerald-100">
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-base text-emerald-800 font-medium">Financial Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-lg flex items-center space-x-3">
                                        <CreditCard className="h-5 w-5 text-emerald-600"/>
                                        <div>
                                            <p className="text-xs font-normal text-emerald-800">Investment Amount</p>
                                            <p className="text-base font-medium text-emerald-900">{proposal.formattedAmount}</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-lg flex items-center space-x-3">
                                        <CalendarDays className="h-5 w-5 text-emerald-600"/>
                                        <div>
                                            <p className="text-xs font-normal text-emerald-800">Payment Schedule</p>
                                            <p className="text-base font-medium text-emerald-900 capitalize">{proposal.payment_schedule}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-emerald-800">Expected Return</h4>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{proposal.expected_return}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-emerald-800">Additional Terms</h4>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{proposal.additional_terms || 'No additional terms specified'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Technical Proposal Details */}
                    {proposal.type === 'technical' && (
                        <Card className="border border-emerald-100">
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-base text-emerald-800 font-medium">Technical Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-lg flex items-center space-x-3">
                                        <Wrench className="h-5 w-5 text-emerald-600"/>
                                        <div>
                                            <p className="text-xs font-normal text-emerald-800">Expertise</p>
                                            <p className="text-base font-medium text-emerald-900">{proposal.expertise}</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-lg flex items-center space-x-3">
                                        <Timer className="h-5 w-5 text-emerald-600"/>
                                        <div>
                                            <p className="text-xs font-normal text-emerald-800">Support Duration</p>
                                            <p className="text-base font-medium text-emerald-900">{proposal.support_duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    {['Proposed Approach', 'Expected Outcomes', 'Additional Resources'].map((title) => {
                                        const key = title.toLowerCase().replace(' ', '_');
                                        if (!proposal[key] && title === 'Additional Resources') return null;
                                        return (
                                            <div key={key} className="space-y-1">
                                                <h4 className="text-sm font-medium text-emerald-800">{title}</h4>
                                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{proposal[key]}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timeline Footer */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1.5 text-emerald-600"/>
                            <span>Submitted: {new Date(proposal.created_at).toLocaleDateString()}</span>
                        </div>
                        {proposal.updated_at !== proposal.created_at && (
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1.5 text-emerald-600"/>
                                <span>Last updated: {new Date(proposal.updated_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
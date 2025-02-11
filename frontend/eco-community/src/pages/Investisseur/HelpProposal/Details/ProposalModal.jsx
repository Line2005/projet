import {Card, CardContent, CardHeader, CardTitle} from "../../../../components/ui/card.jsx";
import {DollarSign, Wrench, Clock, Timer, Calendar, CreditCard, CalendarDays, Check, X} from "lucide-react";


const getStatusStyle = (status) => {
    const styles = {
        accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-500/10',
        refused: 'bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-500/10',
        default: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/10'
    };
    return styles[status] || styles.default;
};

const getStatusIcon = (status) => {
    const icons = {
        accepted: <Check className="h-4 w-4 mr-1.5" />,
        refused: <X className="h-4 w-4 mr-1.5" />,
        default: <Clock className="h-4 w-4 mr-1.5" />
    };
    return icons[status] || icons.default;
};

export const ProposalDetailModal = ({ proposal, onClose }) => {
    if (!proposal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col bg-white rounded-xl shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white relative rounded-t-xl p-6">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <div className="space-y-3">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Proposal Details</CardTitle>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${getStatusStyle(proposal.status)}`}>
                                {getStatusIcon(proposal.status)}
                                {proposal.status === 'accepted' ? 'Accepted' : proposal.status === 'refused' ? 'Refused' : 'Pending'}
                            </span>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${
                                proposal.type === 'financial' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                                {proposal.type === 'financial' ? (
                                    <span className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1.5"/>
                                        Financial Support
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Wrench className="h-4 w-4 mr-1.5"/>
                                        Technical Support
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <div className="p-6 space-y-6">
                    <Card className="border-0 shadow-md bg-white">
                        <CardHeader className="py-4 px-5 border-b border-gray-100">
                            <CardTitle className="text-lg text-emerald-900 font-semibold">Help Request Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-600">Specific Need</p>
                                    <p className="text-base text-gray-900">{proposal.help_request_details?.specific_need}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-600">Request Type</p>
                                    <p className="text-base text-gray-900">{proposal.help_request_details?.request_type}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {proposal.type === 'financial' && (
                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader className="py-4 px-5 border-b border-gray-100">
                                <CardTitle className="text-lg text-emerald-900 font-semibold">Financial Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl flex items-center space-x-4">
                                        <div className="bg-emerald-700/10 p-2.5 rounded-lg">
                                            <CreditCard className="h-6 w-6 text-emerald-700"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">Investment Amount</p>
                                            <p className="text-lg font-semibold text-emerald-950">{proposal.formattedAmount}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl flex items-center space-x-4">
                                        <div className="bg-emerald-700/10 p-2.5 rounded-lg">
                                            <CalendarDays className="h-6 w-6 text-emerald-700"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">Payment Schedule</p>
                                            <p className="text-lg font-semibold text-emerald-950 capitalize">{proposal.payment_schedule}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <h4 className="text-base font-semibold text-emerald-900">Expected Return</h4>
                                        <p className="text-base text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">{proposal.expected_return}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-base font-semibold text-emerald-900">Additional Terms</h4>
                                        <p className="text-base text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">{proposal.additional_terms || 'No additional terms specified'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {proposal.type === 'technical' && (
                        <Card className="border-0 shadow-md bg-white">
                            <CardHeader className="py-4 px-5 border-b border-gray-100">
                                <CardTitle className="text-lg text-emerald-900 font-semibold">Technical Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl flex items-center space-x-4">
                                        <div className="bg-emerald-700/10 p-2.5 rounded-lg">
                                            <Wrench className="h-6 w-6 text-emerald-700"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">Expertise</p>
                                            <p className="text-lg font-semibold text-emerald-950">{proposal.expertise}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl flex items-center space-x-4">
                                        <div className="bg-emerald-700/10 p-2.5 rounded-lg">
                                            <Timer className="h-6 w-6 text-emerald-700"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">Support Duration</p>
                                            <p className="text-lg font-semibold text-emerald-950">{proposal.support_duration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-2">
                                    {['Proposed Approach', 'Expected Outcomes', 'Additional Resources'].map((title) => {
                                        const key = title.toLowerCase().replace(' ', '_');
                                        if (!proposal[key] && title === 'Additional Resources') return null;
                                        return (
                                            <div key={key} className="space-y-2">
                                                <h4 className="text-base font-semibold text-emerald-900">{title}</h4>
                                                <p className="text-base text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">{proposal[key]}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-emerald-600"/>
                            <span>Submitted: {new Date(proposal.created_at).toLocaleDateString()}</span>
                        </div>
                        {proposal.updated_at !== proposal.created_at && (
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-emerald-600"/>
                                <span>Last updated: {new Date(proposal.updated_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
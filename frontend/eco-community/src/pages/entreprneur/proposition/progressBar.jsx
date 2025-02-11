import Progress from "../../../components/ui/progress.jsx";

const ProposalProgress = ({ proposal, requestAmounts }) => {
    const calculateProgress = () => {
        // Ensure all values are properly parsed as numbers
        const totalRequested = Number(proposal?.requestedAmount) || 0;
        const proposalAmount = Number(proposal?.amount) || 0;

        // Get accepted amount from requestAmounts, handling possible undefined values
        let acceptedAmount = 0;
        if (proposal?.helpRequestId && requestAmounts?.[proposal.helpRequestId]) {
            acceptedAmount = Number(requestAmounts[proposal.helpRequestId].accepted_amount || 0);
        }

        // If the current proposal is accepted, include it in accepted amount if not already counted
        if (proposal.status === 'accepted' && !acceptedAmount.toString().includes(proposalAmount)) {
            acceptedAmount += proposalAmount;
        }

        // Calculate total progress including this proposal if it's pending
        const totalProgress = totalRequested > 0 ?
            ((acceptedAmount + (proposal.status === 'pending' ? proposalAmount : 0)) / totalRequested) * 100 : 0;

        // Calculate remaining amount
        let remainingAmount = totalRequested - acceptedAmount;
        if (proposal.status === 'pending') {
            remainingAmount -= proposalAmount;
        }
        remainingAmount = Math.max(0, remainingAmount);

        return {
            currentProgress: Math.min(100, Math.max(0, (acceptedAmount / totalRequested) * 100)),
            withProposalProgress: Math.min(100, Math.max(0, totalProgress)),
            remainingAmount,
            acceptedAmount,
            totalRequested,
            proposalAmount
        };
    };

    const {
        currentProgress,
        withProposalProgress,
        remainingAmount,
        acceptedAmount,
        proposalAmount
    } = calculateProgress();

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
                <span>Montant proposé: {proposalAmount.toLocaleString('fr-FR')} FCFA</span>
                <span>Demandé: {proposal.requestedAmount.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <div className="relative pt-1">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                    {/* Base progress bar showing current accepted amount */}
                    <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${currentProgress}%` }}
                    />
                    {/* Additional progress showing pending proposal */}
                    {proposal.status === 'pending' && (
                        <div
                            className="h-full bg-emerald-400 rounded-r-full absolute top-0"
                            style={{
                                width: `${withProposalProgress}%`,
                                left: `${currentProgress}%`
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
                <span>
                    Reste à financer: {remainingAmount.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                    {acceptedAmount.toLocaleString('fr-FR')} FCFA
                    {proposal.status === 'pending' && (
                        <>
                            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                            + {proposalAmount.toLocaleString('fr-FR')} FCFA
                        </>
                    )}
                </span>
            </div>
        </div>
    );
};

export default ProposalProgress;
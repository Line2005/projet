import Progress from "../../../components/ui/progress.jsx";


const ProposalProgress = ({ proposal, requestAmounts }) => {
    const calculateProgress = (proposal, requestAmounts) => {
        if (!proposal || !proposal.helpRequestId || !requestAmounts || !requestAmounts[proposal.helpRequestId]) {
            return {
                current: 0,
                withProposal: 0,
                remaining: 100,
                remainingAmount: proposal.requestedAmount || 0,
                acceptedAmount: 0,
                totalRequested: proposal.requestedAmount || 0
            };
        }

        const amountData = requestAmounts[proposal.helpRequestId];
        const acceptedAmount = amountData.accepted_amount || 0;
        const totalRequested = proposal.requestedAmount || 0;
        const currentProposalValue = proposal.status === 'pending' ? proposal.amount : 0;

        // Calculate remaining amount
        const remainingBeforeProposal = Math.max(0, totalRequested - acceptedAmount);
        const remainingAfterProposal = Math.max(0, remainingBeforeProposal - currentProposalValue);

        // Calculate percentages
        const currentProgress = totalRequested > 0 ? (acceptedAmount / totalRequested) * 100 : 0;
        const progressWithCurrent = totalRequested > 0 ?
            Math.min(100, ((acceptedAmount + currentProposalValue) / totalRequested) * 100) : 0;

        return {
            current: Math.min(100, currentProgress),
            withProposal: Math.min(100, progressWithCurrent),
            remaining: Math.max(0, 100 - progressWithCurrent),
            remainingAmount: remainingAfterProposal,
            acceptedAmount: acceptedAmount,
            totalRequested: totalRequested
        };
    };

    const progress = calculateProgress(proposal, requestAmounts);

    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Montant proposé: {proposal.amount.toLocaleString('fr-FR')} FCFA</span>
                <span>Demandé: {proposal.requestedAmount.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <Progress
                value={progress.withProposal}
                className="h-2 bg-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          Reste à financer: {progress.remainingAmount.toLocaleString('fr-FR')} FCFA
        </span>
                <span>
          {Math.round(progress.withProposal)}%
        </span>
            </div>
        </div>
    );
};

export default ProposalProgress;
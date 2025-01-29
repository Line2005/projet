import { Users, DollarSign } from 'lucide-react';

const InvestorStats = ({ collaborationsData, apiStats }) => {
    // Calculate stats from grouped collaborations data
    const calculateStats = () => {
        const stats = {
            total_entrepreneurs: 0,
            total_collaborations: 0,
            unique_financial_partners: new Set(), // Track unique financial partners
            unique_technical_partners: new Set(), // Track unique financial partners
            technical_collaborations: 0,
            total_projects: new Set(),
        };

        Object.entries(collaborationsData).forEach(([investorId, data]) => {
            // Count unique entrepreneurs
            stats.total_entrepreneurs++;

            // Count total projects
            data.collaborations.forEach(collab => {
                stats.total_projects.add(collab.project_name);
            });

            // Check if this investor has any financial collaborations
            const hasFinancialCollabs = data.collaborations.some(
                collab => collab.collaboration_type === 'financial'
            );

            // If they have financial collaborations, count them as one unique financial partner
            if (hasFinancialCollabs) {
                stats.unique_financial_partners.add(investorId);
            }

            // Check if this investor has any technical collaborations
            const hasTechnicalCollabs = data.collaborations.some(
                collab => collab.collaboration_type === 'technical'
            );

            // If they have technical collaborations, count them as one unique financial partner
            if (hasTechnicalCollabs) {
                stats.unique_technical_partners.add(investorId);
            }

            stats.total_collaborations += data.collaborations.length;
        });

        return {
            ...stats,
            total_projects: stats.total_projects.size,
            financial_collaborations: stats.unique_financial_partners.size, // Use the size of unique partners set
            technical_collaborations: stats.unique_technical_partners.size, // Use the size of unique partners set
            total_investment_amount: apiStats?.total_investment_amount || 0
        };
    };

    const stats = calculateStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Entrepreneurs</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total_entrepreneurs}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total_projects}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Partenaires Financiers</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.financial_collaborations}
                        </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Support Technique</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.technical_collaborations}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Montant Total Reçu</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {Number(stats.total_investment_amount).toLocaleString()} FCFA
                        </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorStats;
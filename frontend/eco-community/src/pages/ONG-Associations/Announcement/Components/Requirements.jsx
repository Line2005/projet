import React from 'react';

const RequirementsList = ({ requirements }) => {
    const parseRequirements = (reqs) => {
        if (Array.isArray(reqs)) {
            return reqs;
        }
        if (typeof reqs === 'string') {
            try {
                return JSON.parse(reqs);
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const parsedRequirements = parseRequirements(requirements);

    return (
        <div className="flex flex-wrap gap-2">
            {parsedRequirements.map((req, index) => (
                <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                    {req}
                </span>
            ))}
        </div>
    );
};

export default RequirementsList;
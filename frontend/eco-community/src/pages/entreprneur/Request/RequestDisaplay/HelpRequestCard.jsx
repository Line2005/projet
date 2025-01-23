import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const HelpRequestCard = ({ request, onUpdateRequestStatus, updatingRequestId, onDetailsOpen }) => {
    const isUpdating = updatingRequestId === request.id;

    return (
        <div className="p-4 border rounded-lg shadow">
            <h3 className="text-xl font-bold">{request.project.project_name}</h3>
            <p>{request.specific_need}</p>
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => onUpdateRequestStatus(request.id, 'completed')}
                    disabled={isUpdating}
                    className="text-green-600"
                >
                    <CheckCircle /> Completed
                </button>
                <button
                    onClick={() => onUpdateRequestStatus(request.id, 'pending')}
                    disabled={isUpdating}
                    className="text-red-600"
                >
                    <XCircle /> Pending
                </button>
                <button onClick={onDetailsOpen} className="text-blue-600">
                    <Eye /> Details
                </button>
            </div>
        </div>
    );
};

export default HelpRequestCard;

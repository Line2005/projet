import React from 'react';
import { X } from 'lucide-react';

const Alert = ({ type = 'info', message, description, onClose }) => {
    const alertStyles = {
        base: "p-4 rounded-md border flex items-start gap-3",
        types: {
            info: "bg-blue-50 border-blue-500 text-blue-700",
            success: "bg-green-50 border-green-500 text-green-700",
            warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
            error: "bg-red-50 border-red-500 text-red-700",
        },
    };

    return (
        <div className={`${alertStyles.base} ${alertStyles.types[type]}`}>
            <div className="flex-1">
                <div className="font-medium">{message}</div>
                {description && (
                    <div className="mt-1 text-sm opacity-90">{description}</div>
                )}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-current opacity-70 hover:opacity-100"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
};

export default Alert;
import React from 'react';

const Alert = ({ type = 'info', message, description, onClose }) => {
    const alertStyles = {
        base: "p-4 rounded-md border flex items-start",
        types: {
            info: "bg-blue-50 border-blue-500 text-blue-700",
            success: "bg-green-50 border-green-500 text-green-700",
            warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
            error: "bg-red-50 border-red-500 text-red-700",
        },
    };

    return (
        <div className={`${alertStyles.base} ${alertStyles.types[type]} shadow-md`}>
            <div className="flex-grow">
                <p className="font-semibold">{message}</p>
                {description && <p className="text-sm mt-1">{description}</p>}
            </div>
            {onClose && (
                <button
                    className="ml-4 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={onClose}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;

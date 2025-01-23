import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-b ${className}`}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
};

// New CardTitle Component
export const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-bold ${className}`}>
            {children}
        </h3>
    );
};

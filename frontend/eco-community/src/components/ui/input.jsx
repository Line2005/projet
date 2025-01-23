import React from 'react';

export const Input = ({ type = 'text', className = '', ...props }) => {
    return (
        <input
            type={type}
            className={`border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
            {...props}
        />
    );
};

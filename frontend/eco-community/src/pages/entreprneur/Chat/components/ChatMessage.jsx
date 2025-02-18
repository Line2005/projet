import React from "react";

export const ChatMessage = ({ message, formatDate }) => (
    <div className={`flex ${message.is_sender ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] rounded-lg p-3 shadow-sm transition-all duration-200 ${
            message.is_sender
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                : 'bg-white text-gray-900'
        }`}>
            <p className="leading-relaxed">{message.content}</p>
            <span className={`text-xs ${
                message.is_sender ? 'text-emerald-100' : 'text-gray-500'
            } block mt-1`}>
                {formatDate(message.timestamp)}
            </span>
        </div>
    </div>
);
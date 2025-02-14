import React from "react";

export const ConversationItem = ({ conversation, isSelected, onClick, formatDate }) => (
    <div
        onClick={onClick}
        className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
            isSelected ? 'bg-emerald-50' : ''
        }`}
    >
        <div className="flex items-start space-x-3">
            <div className="relative">
                <img
                    src={conversation.entrepreneur.avatar}
                    alt={conversation.entrepreneur.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                />
                {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"/>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.entrepreneur.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                            {conversation.project.name}
                        </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(conversation.last_message_date)}
                        </span>
                        {conversation.entrepreneur.unreadCount > 0 && (
                            <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                                {conversation.entrepreneur.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">
                    {conversation.last_message}
                </p>
            </div>
        </div>
    </div>
);
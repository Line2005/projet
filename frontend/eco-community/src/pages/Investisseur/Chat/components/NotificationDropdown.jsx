import {X} from "lucide-react";
import React from "react";

export const NotificationDropdown = ({ notifications, onClose }) => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border p-2 z-50">
        <div className="flex items-center justify-between p-2 border-b">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
            </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(conv => (
                <div key={conv.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                        <img
                            src={conv.entrepreneur.avatar}
                            alt={conv.entrepreneur.name}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{conv.entrepreneur.name}</p>
                            <p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
                        </div>
                        {conv.entrepreneur.unreadCount > 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                {conv.entrepreneur.unreadCount} new
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
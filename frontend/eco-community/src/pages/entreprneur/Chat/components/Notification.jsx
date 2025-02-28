import React from 'react';
import { Bell } from 'lucide-react';

const NotificationDropdown = ({ notifications, onClose, onConversationClick }) => {
    if (!notifications || notifications.length === 0) {
        return (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
                <div className="text-center text-gray-600 py-4">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-gray-400"/>
                    <p>Aucune nouvelle notification</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-3 border-b">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.map((conversation) => {
                    // Get investor data directly from the structure
                    const investor = conversation.investor;
                    const investorName = investor ? `${investor.first_name} ${investor.last_name}` : 'Unknown Investor';

                    // Get project name from help_request
                    const projectName = conversation.help_request?.project?.project_name || 'Non spécifié';

                    const user = investor?.user || {};

                    // Determine the profile image URL
                    let profileImageUrl = '/default-avatar.png'; // Default fallback image

                    // Try to get the profile image from various possible paths
                    if (user.profile_image) {
                        profileImageUrl = user.profile_image;
                    } else if (investor?.profile_image) {
                        profileImageUrl = investor?.profile_image;
                    }

                    // If profile image is a relative URL, make sure it has the correct base URL
                    if (profileImageUrl && !profileImageUrl.startsWith('http') && !profileImageUrl.startsWith('/default-avatar.png')) {
                        // Add your API base URL - adjust as needed based on your configuration
                        const baseUrl = 'http://127.0.0.1:8000';
                        profileImageUrl = `${baseUrl}${profileImageUrl.startsWith('/') ? '' : '/'}${profileImageUrl}`;
                    }

                    return (
                        <div
                            key={conversation.id}
                            onClick={() => {
                                onConversationClick(conversation);
                                onClose();
                            }}
                            className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={profileImageUrl}
                                        alt={investorName}
                                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                                        onError={(e) => {
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                    <span
                                        className="absolute -top-1 -right-1 bg-emerald-500 rounded-full w-4 h-4 border-2 border-white"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {investorName}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                    {`${conversation.unread_count} nouveau${conversation.unread_count > 1 ? 'x' : ''} message${conversation.unread_count > 1 ? 's' : ''}`}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Projet: {projectName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-3 border-t bg-gray-50">
                <button
                    onClick={onClose}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
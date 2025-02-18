import React from "react";

export const ConversationItem = ({ conversation, isSelected, onClick, formatDate }) => {
    // Safely access nested properties with optional chaining
    const entrepreneurDetails = conversation?.help_request?.entrepreneur_details || {};
    const entrepreneur = conversation?.help_request?.entrepreneur || {};
    const user = entrepreneur?.user || {};
    const project = conversation?.help_request?.project || {};
    const projectDetails = conversation?.help_request?.project_details || {};
    const lastMessage = conversation?.last_message;

    // Determine the profile image URL
    let profileImageUrl = '/default-avatar.png'; // Default fallback image

    // Try to get the profile image from various possible paths
    if (user.profile_image) {
        profileImageUrl = user.profile_image;
    } else if (entrepreneurDetails.profile_image) {
        profileImageUrl = entrepreneurDetails.profile_image;
    }

    // If profile image is a relative URL, make sure it has the correct base URL
    if (profileImageUrl && !profileImageUrl.startsWith('http') && !profileImageUrl.startsWith('/default-avatar.png')) {
        // Add your API base URL - adjust as needed based on your configuration
        const baseUrl = 'http://127.0.0.1:8000';
        profileImageUrl = `${baseUrl}${profileImageUrl.startsWith('/') ? '' : '/'}${profileImageUrl}`;
    }

    // Get name from the appropriate source
    const firstName = entrepreneurDetails.first_name || entrepreneur.first_name || user.first_name || '';
    const lastName = entrepreneurDetails.last_name || entrepreneur.last_name || user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';

    // Get project name
    const projectName = projectDetails?.project_name || project?.name || project?.project_name || 'Untitled Project';

    return (
        <div
            onClick={onClick}
            className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? 'bg-emerald-50' : ''
            }`}
        >
            <div className="flex items-start space-x-3">
                <div className="relative">
                    <img
                        src={profileImageUrl}
                        alt={fullName}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                        onError={(e) => {
                            // Fallback to default image if loading fails
                            e.target.onerror = null;
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {fullName}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                                {projectName}
                            </p>
                        </div>
                        <div className="flex flex-col items-end ml-2">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                {lastMessage ? formatDate(lastMessage.timestamp) : formatDate(conversation.created_at)}
                            </span>
                            {conversation.unread_count > 0 && (
                                <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                                    {conversation.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                        {lastMessage ? lastMessage.content : 'Nouvelle conversation'}
                    </p>
                </div>
            </div>
        </div>
    );
};
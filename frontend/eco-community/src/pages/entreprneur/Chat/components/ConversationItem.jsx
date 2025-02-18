import React from 'react';

export const EntrepreneurConversationItem = ({ conversation, isSelected, onClick, formatDate }) => {
    // Defensive data extraction with fallbacks
    const investor = conversation?.investor || {};
    const user = investor?.user || {};

    // Get investor name with multiple fallback levels
    const getInvestorName = () => {
        if (investor?.first_name && investor?.last_name) {
            return `${investor.first_name} ${investor.last_name}`;
        }
        if (user?.first_name && user?.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return 'Unknown Investor';
    };

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

    // Get profile image with fallback
    const getProfileImage = () => {
        return user?.profile_image || investor?.profile_image || '/default-avatar.png';
    };

    // Get project name with fallback
    const getProjectName = () => {
        const project = conversation?.help_request?.project;
        return project?.project_name || project?.name || 'Unknown Project';
    };

    // Get last message or timestamp
    const getLastMessageInfo = () => {
        if (conversation?.last_message) {
            return {
                content: conversation.last_message.content,
                timestamp: formatDate(conversation.last_message.timestamp)
            };
        }
        return {
            content: 'New conversation',
            timestamp: formatDate(conversation.created_at)
        };
    };

    const messageInfo = getLastMessageInfo();

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
                        alt={getInvestorName()}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                        onError={(e) => {
                            e.target.src = '/default-avatar.png';
                        }}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {getInvestorName()}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                                {getProjectName()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end ml-2">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                {messageInfo.timestamp}
                            </span>
                            {conversation.unread_count > 0 && (
                                <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                                    {conversation.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                        {messageInfo.content}
                    </p>
                </div>
            </div>
        </div>
    );
};
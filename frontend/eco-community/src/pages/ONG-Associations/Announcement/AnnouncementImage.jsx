import React from 'react';

const AnnouncementImage = ({ image, title, className }) => {
    // Function to get the full image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return "/api/placeholder/400/250";

        // If the image URL is already absolute (starts with http:// or https://)
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        // Construct the full URL by combining the API base URL with the image path
        // Make sure to update REACT_APP_API_URL with your actual API base URL
        const baseUrl = 'http://127.0.0.1:8000';
        return `${baseUrl}${imageUrl}`;
    };

    return (
        <div className={`relative ${className}`}>
            <img
                src={getImageUrl(image)}
                alt={title || 'Announcement image'}
                className="h-full w-full object-cover"
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/api/placeholder/400/250";
                }}
            />
        </div>
    );
};

export default AnnouncementImage;
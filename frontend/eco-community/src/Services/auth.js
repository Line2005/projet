const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();

        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);

        console.log('Stored Tokens:', {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken'),
            userRole: localStorage.getItem('userRole'),
            userId: localStorage.getItem('userId'),
        });


        return data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                refresh_token: refreshToken
            })
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        // Clear all auth-related data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');

        // Additional cleanup if needed
        localStorage.removeItem('userData');

        // Redirect to login page
        window.location.href = '/login';

    } catch (error) {
        console.error('Logout error:', error);
        // Even if the API call fails, clear local storage and redirect
        localStorage.clear();
        window.location.href = '/login';
    }
};
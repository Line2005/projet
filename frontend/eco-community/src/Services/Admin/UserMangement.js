import api from "../api.js";

export const adminService = {
    getUserStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUsers: async (params = {}) => {
        try {
            const response = await api.get('/admin/users', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // updateUserStatus: async (userId, isBlocked) => {
    //     try {
    //         const response = await api.patch(`/admin/users/${userId}`, {
    //             is_blocked: isBlocked
    //         });
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // Fetch user details by ID
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    createUser: async (userData) => {
        try {
            // Use the admin users endpoint instead of register
            const response = await api.post('/admin/users', {
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                confirm_password: userData.confirm_password,
                role: userData.role,
                // Additional fields based on role
                ...(userData.role !== 'ONG-Association' ? {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                } : {
                    organization_name: userData.organization_name,
                    registration_number: userData.registration_number,
                    founded_year: userData.founded_year,
                    mission_statement: userData.mission_statement,
                    website_url: userData.website_url,
                })
            });
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            console.log('Sending update request:', userId, userData); // Debug line
            const response = await api.patch(`/admin/users/${userId}`, userData);
            console.log('Update response:', response.data); // Debug line
            return response.data;
        } catch (error) {
            console.error('Error in updateUser:', error);
            console.error('Error response:', error.response?.data); // Debug line
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    updateUserStatus: async (userId, statusData) => {
        try {
            const response = await api.patch(`/admin/users/${userId}`, {
                is_blocked: statusData.is_blocked,
                is_active: !statusData.is_blocked  // Update active status as well
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
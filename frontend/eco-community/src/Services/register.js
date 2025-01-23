const API_BASE_URL = 'http://127.0.0.1:8000/api';  // Adjust this to match your Django server URL

export const registerUser = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role: formData.role,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirm_password: formData.confirmPassword,
                // Conditional fields based on role
                ...(formData.role === 'ONG-Association' ? {
                    organization_name: formData.organizationName,
                    registration_number: formData.registrationNumber,
                    founded_year: formData.foundedYear,
                    mission_statement: formData.missionStatement,
                    website_url: formData.websiteUrl,
                } : {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                })
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
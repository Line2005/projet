import React, { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button.jsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.jsx";
import {adminService} from "../../../Services/Admin/UserMangement.js";

const UserModal = ({ isOpen, onClose, user, onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        role: 'entrepreneur',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        organization_name: '',
        registration_number: '',
        founded_year: new Date().getFullYear(),
        mission_statement: '',
        website_url: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load user data into the form when the modal opens
    useEffect(() => {
        const loadUserData = async () => {
            if (user?.id) {
                setLoading(true);
                try {
                    const userData = await adminService.getUserById(user.id);

                    // Map the user data to form fields
                    const mappedData = {
                        email: userData.email,
                        phone: userData.phone,
                        role: userData.role,
                        // Don't set password fields for existing users
                        password: '',
                        confirm_password: '',
                    };

                    // Add role-specific fields
                    if (userData.role === 'ONG-Association') {
                        // Organization fields should be accessed directly from the response
                        mappedData.organization_name = userData.organization_name || '';
                        mappedData.registration_number = userData.registration_number || '';
                        mappedData.founded_year = userData.founded_year || new Date().getFullYear();
                        mappedData.mission_statement = userData.mission_statement || '';
                        mappedData.website_url = userData.website_url || '';
                    } else {
                        mappedData.first_name = userData.first_name || '';
                        mappedData.last_name = userData.last_name || '';
                    }

                    setFormData(mappedData);
                } catch (error) {
                    console.error('Error loading user data:', error);
                    setFormErrors({ general: 'Failed to load user data' });
                } finally {
                    setLoading(false);
                }
            } else {
                // Reset form for new user
                setFormData({
                    email: '',
                    phone: '',
                    role: 'entrepreneur',
                    password: '',
                    confirm_password: '',
                    first_name: '',
                    last_name: '',
                    organization_name: '',
                    registration_number: '',
                    founded_year: new Date().getFullYear(),
                    mission_statement: '',
                    website_url: ''
                });
            }
        };
        loadUserData();
    }, [user, isOpen]);

    // Validate the form
    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Invalid email address";
        }

        if (!user) { // Only validate password for new users
            if (!formData.password) {
                errors.password = "Password is required";
            } else if (formData.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
            }

            if (formData.password !== formData.confirm_password) {
                errors.confirm_password = "Passwords do not match";
            }
        }

        if (formData.role === 'ONG-Association') {
            if (!formData.organization_name) {
                errors.organization_name = "Organization name is required";
            }
            if (!formData.registration_number) {
                errors.registration_number = "Registration number is required";
            }
        } else if (formData.role !== 'admin') { // Skip validation for admin role
            if (!formData.first_name) {
                errors.first_name = "First name is required";
            }
            if (!formData.last_name) {
                errors.last_name = "Last name is required";
            }
        }

        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        // Create the update data object
        const updateData = {
            email: formData.email,
            phone: formData.phone,
        };

        // Add role-specific fields
        if (formData.role === 'ONG-Association') {
            Object.assign(updateData, {
                organization_name: formData.organization_name,
                registration_number: formData.registration_number,
                founded_year: formData.founded_year,
                mission_statement: formData.mission_statement,
                website_url: formData.website_url
            });
        } else if (formData.role !== 'admin') {
            Object.assign(updateData, {
                first_name: formData.first_name,
                last_name: formData.last_name
            });
        }

        // Add password fields only for new users
        if (!user) {
            updateData.password = formData.password;
            updateData.confirm_password = formData.confirm_password;
        }

        console.log('Submitting data:', updateData); // Debug line

        try {
            await onSubmit(updateData);
            onClose();
        } catch (error) {
            setFormErrors({
                general: error.response?.data?.error || error.message || 'Error submitting form'
            });
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full px-3 py-2 border rounded-md ${formErrors.email ? 'border-red-500' : ''}`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                        </div>

                        {/* Phone */}
                        <input
                            type="tel"
                            placeholder="Phone"
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        {/* Role */}
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="entrepreneur">Entrepreneur</option>
                            <option value="investor">Investor</option>
                            <option value="ONG-Association">Association</option>
                            <option value="admin">Admin</option>
                        </select>

                        {/* Role-Specific Fields */}
                        {formData.role === 'ONG-Association' ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Organization Name"
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.organization_name ? 'border-red-500' : ''}`}
                                    value={formData.organization_name}
                                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                                />
                                {formErrors.organization_name && <p className="text-red-500 text-sm mt-1">{formErrors.organization_name}</p>}

                                <input
                                    type="text"
                                    placeholder="Registration Number"
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.registration_number ? 'border-red-500' : ''}`}
                                    value={formData.registration_number}
                                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                />
                                {formErrors.registration_number && <p className="text-red-500 text-sm mt-1">{formErrors.registration_number}</p>}

                                <input
                                    type="number"
                                    placeholder="Founded Year"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.founded_year}
                                    onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                                />

                                <textarea
                                    placeholder="Mission Statement"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.mission_statement}
                                    onChange={(e) => setFormData({ ...formData, mission_statement: e.target.value })}
                                    rows={4}
                                />

                                <input
                                    type="url"
                                    placeholder="Website URL"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                />
                            </>
                        ) : formData.role !== 'admin' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.first_name ? 'border-red-500' : ''}`}
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                                {formErrors.first_name && <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>}

                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={`w-full px-3 py-2 border rounded-md ${formErrors.last_name ? 'border-red-500' : ''}`}
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                                {formErrors.last_name && <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>}
                            </>
                        )}

                        {/* Password Fields (Only for New Users) */}
                        {!user && (
                            <>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className={`w-full px-3 py-2 border rounded-md ${formErrors.password ? 'border-red-500' : ''}`}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className={`w-full px-3 py-2 border rounded-md ${formErrors.confirm_password ? 'border-red-500' : ''}`}
                                        value={formData.confirm_password}
                                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                    />
                                    {formErrors.confirm_password && <p className="text-red-500 text-sm mt-1">{formErrors.confirm_password}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* General Errors */}
                    {formErrors.general && (
                        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                            {formErrors.general}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {user ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserModal;
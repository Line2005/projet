import React, { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button.jsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.jsx";
import { adminService } from "../../../Services/Admin/UserMangement.js";

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

    // Rest of the useEffect and validation logic remains the same...
    useEffect(() => {
        const loadUserData = async () => {
            if (user?.id) {
                setLoading(true);
                try {
                    const userData = await adminService.getUserById(user.id);
                    const mappedData = {
                        email: userData.email,
                        phone: userData.phone,
                        role: userData.role,
                        password: '',
                        confirm_password: '',
                    };

                    if (userData.role === 'ONG-Association') {
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

    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Invalid email address";
        }

        if (!user) {
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
        } else if (formData.role !== 'admin') {
            if (!formData.first_name) {
                errors.first_name = "First name is required";
            }
            if (!formData.last_name) {
                errors.last_name = "Last name is required";
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        const updateData = {
            email: formData.email,
            phone: formData.phone,
        };

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

        if (!user) {
            updateData.password = formData.password;
            updateData.confirm_password = formData.confirm_password;
        }

        try {
            await onSubmit(updateData);
            onClose();
        } catch (error) {
            setFormErrors({
                general: error.response?.data?.error || error.message || 'Error submitting form'
            });
        }
    };

    const inputClassName = (error) => `
        w-full px-3 py-2 border rounded-md
        ${error ? 'border-red-500' : 'border-gray-300'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors duration-200
    `;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {user ? 'Edit User' : 'Create User'}
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic Info Section */}
                            <div className="space-y-4 md:col-span-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={inputClassName(formErrors.email)}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        className={inputClassName()}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />

                                    <select
                                        className={inputClassName()}
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="entrepreneur">Entrepreneur</option>
                                        <option value="investor">Investor</option>
                                        <option value="ONG-Association">Association</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            {/* Role-Specific Fields */}
                            <div className="space-y-4 md:col-span-2">
                                {formData.role === 'ONG-Association' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Organization Name"
                                                className={inputClassName(formErrors.organization_name)}
                                                value={formData.organization_name}
                                                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                                            />
                                            {formErrors.organization_name &&
                                                <p className="text-red-500 text-sm">{formErrors.organization_name}</p>}
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Registration Number"
                                            className={inputClassName(formErrors.registration_number)}
                                            value={formData.registration_number}
                                            onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                        />

                                        <input
                                            type="number"
                                            placeholder="Founded Year"
                                            className={inputClassName()}
                                            value={formData.founded_year}
                                            onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                                        />

                                        <div className="md:col-span-2">
                                            <textarea
                                                placeholder="Mission Statement"
                                                className={inputClassName()}
                                                value={formData.mission_statement}
                                                onChange={(e) => setFormData({ ...formData, mission_statement: e.target.value })}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <input
                                                type="url"
                                                placeholder="Website URL"
                                                className={inputClassName()}
                                                value={formData.website_url}
                                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ) : formData.role !== 'admin' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className={inputClassName(formErrors.first_name)}
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            />
                                            {formErrors.first_name &&
                                                <p className="text-red-500 text-sm">{formErrors.first_name}</p>}
                                        </div>

                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className={inputClassName(formErrors.last_name)}
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            />
                                            {formErrors.last_name &&
                                                <p className="text-red-500 text-sm">{formErrors.last_name}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Password Fields */}
                            {!user && (
                                <div className="space-y-4 md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className={inputClassName(formErrors.password)}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            {formErrors.password &&
                                                <p className="text-red-500 text-sm">{formErrors.password}</p>}
                                        </div>

                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                className={inputClassName(formErrors.confirm_password)}
                                                value={formData.confirm_password}
                                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                            />
                                            {formErrors.confirm_password &&
                                                <p className="text-red-500 text-sm">{formErrors.confirm_password}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Messages */}
                        {formErrors.general && (
                            <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                                {formErrors.general}
                            </div>
                        )}
                    </form>
                </div>

                <DialogFooter className="sm:justify-end">
                    <div className="flex gap-4 mt-6">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleSubmit}>
                            {user ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserModal;
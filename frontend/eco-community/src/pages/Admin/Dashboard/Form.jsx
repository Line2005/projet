import React, { useState, useEffect } from 'react';
import {Button} from "../../../components/ui/button.jsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../../../components/ui/dialog.jsx";

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

    useEffect(() => {
        if (user) {
            if (user.role !== 'ONG-Association') {
                setFormData({
                    email: user.email || '',
                    phone: user.phone || '',
                    role: user.role || 'entrepreneur',
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    organization_name: '',
                    registration_number: '',
                    founded_year: new Date().getFullYear(),
                    mission_statement: '',
                    website_url: ''
                });
            } else {
                setFormData({
                    email: user.email || '',
                    phone: user.phone || '',
                    role: user.role || 'ONG-Association',
                    first_name: '',
                    last_name: '',
                    organization_name: user.organization_name || '',
                    registration_number: user.registration_number || '',
                    founded_year: user.founded_year || new Date().getFullYear(),
                    mission_statement: user.mission_statement || '',
                    website_url: user.website_url || ''
                });
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
        setFormErrors({});
    }, [user, isOpen]);

    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email invalide";
        }

        if (!user) {  // Only validate password for new users
            if (!formData.password) {
                errors.password = "Le mot de passe est requis";
            } else if (formData.password.length < 8) {
                errors.password = "Le mot de passe doit contenir au moins 8 caractères";
            }

            if (formData.password !== formData.confirm_password) {
                errors.confirm_password = "Les mots de passe ne correspondent pas";
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

        try {
            console.log("Submitting form data:", formData); // Debug log
            await onSubmit(formData);
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
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full px-3 py-2 border rounded-md ${formErrors.email ? 'border-red-500' : ''}`}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                        </div>

                        <input
                            type="tel"
                            placeholder="Phone"
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />

                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="entrepreneur">Entrepreneur</option>
                            <option value="investor">Investisseur</option>
                            <option value="ONG-Association">Association</option>
                        </select>

                        {formData.role !== 'ONG-Association' ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                />
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Organization Name"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.organization_name}
                                    onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="Registration Number"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.registration_number}
                                    onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="Founded Year"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.founded_year}
                                    onChange={(e) => setFormData({...formData, founded_year: parseInt(e.target.value)})}
                                />
                                <textarea
                                    placeholder="Mission Statement"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.mission_statement}
                                    onChange={(e) => setFormData({...formData, mission_statement: e.target.value})}
                                />
                                <input
                                    type="url"
                                    placeholder="Website URL"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                                />
                            </>
                        )}

                        {!user && (
                            <>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className={`w-full px-3 py-2 border rounded-md ${formErrors.password ? 'border-red-500' : ''}`}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className={`w-full px-3 py-2 border rounded-md ${formErrors.confirm_password ? 'border-red-500' : ''}`}
                                        value={formData.confirm_password}
                                        onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                                    />
                                    {formErrors.confirm_password && <p className="text-red-500 text-sm mt-1">{formErrors.confirm_password}</p>}
                                </div>
                            </>
                        )}
                    </div>

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
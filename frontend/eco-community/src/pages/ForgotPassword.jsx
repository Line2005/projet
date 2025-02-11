import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Alert from "../components/ui/alert.jsx";
import {AlertDescription} from "@chakra-ui/react";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateEmail = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }
        return newErrors;
    };

    const validateCode = () => {
        const newErrors = {};
        if (!formData.code.trim()) {
            newErrors.code = "Le code est requis";
        } else if (!/^\d{6}$/.test(formData.code)) {
            newErrors.code = "Le code doit contenir 6 chiffres";
        }
        return newErrors;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        return newErrors;
    };

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        const newErrors = validateEmail();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitStatus(null);

            try {
                // Call your API to send reset code
                // await sendResetCode(formData.email);
                setSubmitStatus('success');
                setStep(2);
            } catch (error) {
                setSubmitStatus('error');
                setErrors({
                    submit: error.message || "Une erreur est survenue. Veuillez réessayer plus tard."
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        const newErrors = validateCode();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitStatus(null);

            try {
                // Call your API to verify code
                // await verifyCode(formData.email, formData.code);
                setSubmitStatus('success');
                setStep(3);
            } catch (error) {
                setSubmitStatus('error');
                setErrors({
                    submit: error.message || "Code invalide. Veuillez réessayer."
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        const newErrors = validatePassword();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitStatus(null);

            try {
                // Call your API to reset password
                // await resetPassword(formData.email, formData.code, formData.password);
                setSubmitStatus('success');
                // Redirect to login after short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } catch (error) {
                setSubmitStatus('error');
                setErrors({
                    submit: error.message || "Une erreur est survenue. Veuillez réessayer plus tard."
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-emerald-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <a href="/" className="text-xl font-bold">EcoCommunity</a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <button
                            onClick={() => setStep(Math.max(1, step - 1))}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </button>

                        {step === 1 && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
                                <p className="text-gray-600 mb-8">
                                    Entrez votre adresse email pour recevoir un code de réinitialisation
                                </p>

                                <form onSubmit={handleSubmitEmail} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                placeholder="votreemail@exemple.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Envoi en cours..." : "Envoyer le code"}
                                    </button>
                                    <a href="/login" className="text-sm text-emerald-600 hover:text-emerald-500">
                                        Connexion
                                    </a>
                                </form>


                            </>
                        )}

                        {step === 2 && (
                            <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification</h2>
                                <p className="text-gray-600 mb-8">
                                    Entrez le code à 6 chiffres envoyé à {formData.email}
                                </p>

                                <form onSubmit={handleSubmitCode} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Code de vérification
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                        {errors.code && (
                                            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Vérification..." : "Vérifier le code"}
                                    </button>
                                    <a href="/login" className="text-sm text-emerald-600 hover:text-emerald-500">
                                        Connexion
                                    </a>
                                </form>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h2>
                                <p className="text-gray-600 mb-8">
                                    Créez un nouveau mot de passe sécurisé
                                </p>

                                <form onSubmit={handleSubmitPassword} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nouveau mot de passe
                                        </label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                placeholder="8 caractères minimum"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5"/> :
                                                    <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirmer le mot de passe
                                        </label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5"/> :
                                                    <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Modification..." : "Modifier le mot de passe"}
                                    </button>
                                    <a href="/login" className="text-sm text-emerald-600 hover:text-emerald-500">
                                        Connexion
                                    </a>
                                </form>
                            </>
                        )}

                        {submitStatus === 'success' && (
                            <Alert className="mt-6 bg-emerald-50 border-emerald-200">
                                <Check className="h-4 w-4 text-emerald-600"/>
                                <AlertDescription className="text-emerald-800">
                                {step === 1 && "Code envoyé avec succès!"}
                                    {step === 2 && "Code vérifié avec succès!"}
                                    {step === 3 && "Mot de passe modifié avec succès! Redirection..."}
                                </AlertDescription>
                            </Alert>
                        )}

                        {submitStatus === 'error' && (
                            <Alert className="mt-6 bg-red-50 border-red-200">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    {errors.submit}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
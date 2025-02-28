import React, { useState } from "react";
import { registerUser } from '../services/register.js';
import {
    Eye,
    EyeOff,
    Users,
    Building2,
    Rocket,
    Shield,
    Building,
    FileText,
    Mail,
    Phone,
    Lock,
    User,
    Link,
    Calendar, TrendingUp, ArrowLeft
} from "lucide-react";
import Alert from "../components/ui/alert.jsx";

const Register = () => {
    const [formData, setFormData] = useState({
        // Common fields
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "entrepreneur",
        terms: false,

        // Individual fields
        firstName: "",
        lastName: "",

        // Organization fields
        organizationName: "",
        registrationNumber: "",
        foundedYear: "",
        missionStatement: "",
        websiteUrl: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const features = [
        {
            icon: <Users className="w-6 h-6 text-emerald-700"/>,
            title: "Réseau Professionnel",
            description: "Connectez-vous avec des entrepreneurs et mentors passionnés"
        },
        {
            icon: <Building2 className="w-6 h-6 text-emerald-700"/>,
            title: "Ressources Exclusives",
            description: "Accédez à des formations et des opportunités de financement"
        },
        {
            icon: <Rocket className="w-6 h-6 text-emerald-700"/>,
            title: "Innovation Locale",
            description: "Participez au développement économique du Cameroun"
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-700"/>,
            title: "Support Personnalisé",
            description: "Bénéficiez d'un accompagnement adapté à vos besoins"
        }
    ];

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleRoleChange = (roleValue) => {
        setFormData(prev => ({
            ...prev,
            role: roleValue
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const isMentor = formData.role === "ONG-Association";

        // Common validations
        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Le numéro de téléphone est requis";
        } else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = "Numéro de téléphone invalide (9 chiffres requis)";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        if (!formData.terms) {
            newErrors.terms = "Vous devez accepter les conditions d'utilisation";
        }

        // Role-specific validations
        if (isMentor) {
            if (!formData.organizationName.trim()) {
                newErrors.organizationName = "Le nom de l'organisation est requis";
            }
            if (!formData.registrationNumber.trim()) {
                newErrors.registrationNumber = "Le numéro d'enregistrement est requis";
            }
            if (!formData.foundedYear) {
                newErrors.foundedYear = "L'année de création est requise";
            } else if (formData.foundedYear < 1900 || formData.foundedYear > new Date().getFullYear()) {
                newErrors.foundedYear = "Année invalide";
            }
        } else {
            if (!formData.firstName.trim()) {
                newErrors.firstName = "Le prénom est requis";
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = "Le nom est requis";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitStatus(null);

            try {
                const response = await registerUser(formData);
                setSubmitStatus("success");
                // Optionally redirect to login or dashboard
                window.location.href = '/login';

                // Reset form
                setFormData({
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    role: "entrepreneur",
                    terms: false,
                    firstName: "",
                    lastName: "",
                    organizationName: "",
                    registrationNumber: "",
                    foundedYear: "",
                    missionStatement: "",
                    websiteUrl: "",
                });
            } catch (error) {
                setSubmitStatus("error");
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

    // Role selector component
    const RoleSelector = () => {
        const roles = [
            { id: "entrepreneur", label: "Entrepreneur" },
            { id: "investor", label: "Investisseur" },
            { id: "ONG-Association", label: "Association" }
        ];

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Je suis un(e)
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => handleRoleChange(role.id)}
                            className={`flex-1 py-3 px-4 text-center transition-colors duration-200 ${
                                formData.role === role.id
                                    ? "bg-emerald-600 text-white font-medium"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                            aria-pressed={formData.role === role.id}
                        >
                            {role.label}
                        </button>
                    ))}
                </div>

                {/* Hidden select for form submission consistency if needed */}
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="sr-only"
                    aria-hidden="true"
                >
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const isMentor = formData.role === "ONG-Association";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            {/* Navigation */}
            <nav className="bg-emerald-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <a href="/" className="flex items-center space-x-2">
                                <div className="bg-white p-1 rounded-full">
                                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                                </div>
                                <span className="text-xl font-bold">EcoCommunity</span>
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <a href="/" className="flex items-center text-emerald-100 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                <span>Retour à l'accueil</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Section - Registration Form */}
                        <div className="p-8 lg:p-12">
                            <div className="max-w-md mx-auto">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
                                <p className="text-gray-600 mb-8">
                                    {isMentor
                                        ? "Rejoignez notre réseau d'organisations de mentorat"
                                        : "Commencez votre parcours entrepreneurial"}
                                </p>

                                {submitStatus === "success" && (
                                    <Alert
                                        type="success"
                                        message="Votre compte a été créé avec succès!"
                                        description="Vous allez recevoir un email de confirmation."
                                        onClose={() => console.log('closed')}
                                    />
                                )}

                                {submitStatus === "error" && (
                                    <Alert
                                        type="error"
                                        message="Votre compte n'a pas été créer!"
                                        description={errors.submit}
                                        onClose={() => console.log('closed')}
                                    />
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Use the RoleSelector component here */}
                                    <RoleSelector/>

                                    {isMentor ? (
                                        // Organization fields
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nom de l'organisation
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="organizationName"
                                                        value={formData.organizationName}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                        placeholder="Entrez le nom de votre organisation"
                                                    />
                                                    <Building
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                </div>
                                                {errors.organizationName && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
                                                )}
                                            </div>

                                            {/* Other organization fields */}
                                            {/* ... (rest of the organization fields) */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Numéro d'enregistrement
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="registrationNumber"
                                                        value={formData.registrationNumber}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                        placeholder="Ex: 123456789"
                                                    />
                                                    <FileText
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                </div>
                                                {errors.registrationNumber && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Année de création
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="foundedYear"
                                                        value={formData.foundedYear}
                                                        onChange={handleChange}
                                                        min="1900"
                                                        max={new Date().getFullYear()}
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                        placeholder={`1900 - ${new Date().getFullYear()}`}
                                                    />
                                                    <Calendar
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                </div>
                                                {errors.foundedYear && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.foundedYear}</p>
                                                )}
                                            </div>

                                            <div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1">
                                                            Site Web
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="url"
                                                                name="websiteUrl"
                                                                value={formData.websiteUrl}
                                                                onChange={handleChange}
                                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                placeholder="https://www.example.com"
                                                            />
                                                            <Link
                                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                        </div>
                                                        {errors.websiteUrl && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {errors.websiteUrl}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium text-gray-700 mb-1">
                                                            Mission de l'organisation
                                                        </label>
                                                        <div className="relative">
                                                            <textarea
                                                                name="missionStatement"
                                                                value={formData.missionStatement}
                                                                onChange={handleChange}
                                                                rows={6}
                                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                placeholder="Décrivez brièvement la mission de votre organisation..."
                                                            />
                                                            <FileText
                                                                className="absolute left-3 top-6 text-gray-400 w-5 h-5"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Individual fields
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Prénom
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        id="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                                        placeholder="Entrez votre prénom"
                                                        aria-invalid={errors.firstName ? "true" : "false"}
                                                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                                                    />
                                                    {errors.firstName && (
                                                        <p className="mt-1 text-sm text-red-600"
                                                           id="firstName-error">
                                                            {errors.firstName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nom
                                                </label>
                                                <div className="relative">
                                                    <User
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        id="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                                        placeholder="Entrez votre nom"
                                                        aria-invalid={errors.lastName ? "true" : "false"}
                                                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                                                    />
                                                    {errors.lastName && (
                                                        <p className="mt-1 text-sm text-red-600"
                                                           id="lastName-error">
                                                            {errors.lastName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Common fields */}
                                    {/* ... (rest of the common fields) */}
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
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Téléphone
                                        </label>
                                        <div className="relative">
                                            <Phone
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                placeholder="6XXXXXXXX"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mot de passe
                                        </label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
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
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
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

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                name="terms"
                                                checked={formData.terms}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <label className="text-sm text-gray-600">
                                                J'accepte les{" "}
                                                <a href="#" className="text-emerald-600 hover:text-emerald-500">
                                                    conditions d'utilisation
                                                </a>{" "}
                                                et la{" "}
                                                <a href="#" className="text-emerald-600 hover:text-emerald-500">
                                                    politique de confidentialité
                                                </a>
                                            </label>
                                            {errors.terms && (
                                                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Création en cours..." : "Créer mon compte"}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-gray-600">
                                    Vous avez déjà un compte?{" "}
                                    <a href="/login"
                                       className="text-emerald-600 hover:text-emerald-500 font-medium">
                                        Connectez-vous
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Features */}
                        <div
                            className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 lg:p-12 text-white relative overflow-hidden">
                            {/* Abstract background pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <svg width="100%" height="100%" className="absolute inset-0">
                                    <pattern id="pattern-circles" x="0" y="0" width="20" height="20"
                                             patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                        <circle id="pattern-circle" cx="10" cy="10" r="5" fill="none"
                                                stroke="currentColor" strokeWidth="1"></circle>
                                    </pattern>
                                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                                </svg>
                            </div>
                            <div className="max-w-md mx-auto relative z-10">
                                <h3 className="text-3xl font-bold mb-8">Rejoignez EcoCommunity</h3>
                                <div className="w-20 h-1 bg-emerald-400 rounded mb-6"></div>
                                <p className="text-emerald-100 mb-12">
                                    Votre plateforme dédiée à l'entrepreneuriat communautaire au Cameroun.
                                    Rejoignez notre écosystème innovant et contribuez au développement local.
                                </p>

                                <div className="space-y-8">
                                    {features.map((feature, index) => (
                                        <div key={index}
                                             className="flex items-start space-x-4 transition-transform duration-200 hover:-translate-y-1">
                                            <div className="flex-shrink-0 bg-white rounded-lg p-2 shadow-md">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
                                                <p className="text-emerald-100">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
    );
};

export default Register;
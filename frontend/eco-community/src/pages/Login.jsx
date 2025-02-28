import React, { useState } from "react";
import { Eye, EyeOff, Users, TrendingUp, Camera, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Services/auth";
import Alert from "../components/ui/alert.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const response = await loginUser({
                    email: formData.email,
                    password: formData.password,
                });

                setSubmitStatus("success");
                console.log("Login successful for role:", response.user.role);

                // Redirect based on user role
                setTimeout(() => {
                    switch (response.user.role) {
                        case "admin":
                            console.log("Navigating to admin dashboard");
                            navigate("/admin/dashboard");
                            break;
                        case "entrepreneur":
                            navigate("/entrepreneur/project");
                            break;
                        case "investor":
                            navigate("/investors/project");
                            break;
                        case "ONG-Association":
                            navigate("/association/announce");
                            break;
                        default:
                            navigate("/dashboard");
                    }
                }, 1000); // Small delay to show success message
            } catch (error) {
                console.error("Login error:", error);
                setSubmitStatus("error");
                setErrors({
                    submit: "Email ou mot de passe incorrect",
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const features = [
        {
            icon: <Users className="w-6 h-6 text-emerald-700" />,
            title: "Réseau Communautaire",
            description: "Rejoignez une communauté dynamique d'entrepreneurs au Cameroun"
        },
        {
            icon: <Camera className="w-6 h-6 text-emerald-700" />,
            title: "Projets Innovants",
            description: "Découvrez et soutenez des projets locaux à fort impact social"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-emerald-700" />,
            title: "Suivi de Performance",
            description: "Analysez et optimisez vos initiatives avec nos outils dédiés"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
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
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Section - Login Form */}
                        <div className="p-8 lg:p-12">
                            <div className="max-w-md mx-auto">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
                                <p className="text-gray-600 mb-8">Accédez à votre espace et rejoignez la communauté</p>

                                {submitStatus === "success" && (
                                    <Alert
                                        type="success"
                                        message="Connexion réussie !"
                                        description="Bienvenue sur EcoCommunity. Vous allez être redirigé..."
                                        onClose={() => setSubmitStatus(null)}
                                    />
                                )}

                                {submitStatus === "error" && (
                                    <Alert
                                        type="error"
                                        message="Connexion échouée !"
                                        description={errors.submit}
                                        onClose={() => setSubmitStatus(null)}
                                    />
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Adresse Email
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-600'} focus:border-transparent focus:ring-2 transition-colors`}
                                                placeholder="votreemail@exemple.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-600'} focus:border-transparent focus:ring-2 transition-colors`}
                                                placeholder="Votre mot de passe"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5"/> :
                                                    <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer">
                                                Se souvenir de moi
                                            </label>
                                        </div>
                                        <a href="/password" className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors font-medium">
                                            Mot de passe oublié?
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 relative overflow-hidden"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Connexion en cours...
                                            </span>
                                        ) : "Se connecter"}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-gray-600">
                                    Pas encore de compte?{" "}
                                    <a href="/register" className="text-emerald-600 hover:text-emerald-800 transition-colors font-medium">
                                        Créer un compte
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Features */}
                        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 lg:p-12 text-white relative overflow-hidden">
                            {/* Abstract background pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <svg width="100%" height="100%" className="absolute inset-0">
                                    <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                                        <circle id="pattern-circle" cx="10" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="1"></circle>
                                    </pattern>
                                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                                </svg>
                            </div>

                            <div className="max-w-md mx-auto relative z-10">
                                <h3 className="text-3xl font-bold mb-6">Bienvenue sur EcoCommunity</h3>
                                <div className="w-20 h-1 bg-emerald-400 rounded mb-6"></div>
                                <p className="text-emerald-100 mb-12 text-lg">
                                    Votre plateforme dédiée à l'entrepreneuriat communautaire au Cameroun.
                                    Connectez-vous pour accéder à toutes nos fonctionnalités.
                                </p>

                                <div className="space-y-8">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-4 transition-transform duration-200 hover:-translate-y-1">
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

export default Login;
import React, { useState } from "react";
import { Eye, EyeOff, Users, TrendingUp, Camera, Mail, Lock } from "lucide-react";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../Services/auth";

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

                console.log("Login successful for role:", response.user.role);

                // Redirect based on user role
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
            } catch (error) {
                console.error("Login error:", error);
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
            description: "Rejoignez une communauté dynamique d'entrepreneurs"
        },
        {
            icon: <Camera className="w-6 h-6 text-emerald-700" />,
            title: "Projets Innovants",
            description: "Découvrez et soutenez des projets locaux impactants"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-emerald-700" />,
            title: "Suivi de Performance",
            description: "Analysez et optimisez vos projets communautaires"
        }
    ];

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

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Section - Login Form */}
                        <div className="p-8 lg:p-12">
                            <div className="max-w-md mx-auto">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
                                <p className="text-gray-600 mb-8">Accédez à votre espace entrepreneur</p>

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
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
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
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"

                                                placeholder="Votre mot de passe"
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

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 text-sm text-gray-600">
                                                Se souvenir de moi
                                            </label>
                                        </div>
                                        <a href="/password" className="text-sm text-emerald-600 hover:text-emerald-500">
                                            Mot de passe oublié?
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200"
                                    >
                                        {isSubmitting ? "Connexion en cours..." : "Se connceter"}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-gray-600">
                                    Pas encore de compte?{" "}
                                    <a href="/register" className="text-emerald-600 hover:text-emerald-500 font-medium">
                                        Créer un compte
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Right Section - Features */}
                        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 lg:p-12 text-white">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-3xl font-bold mb-8">Bienvenue sur EcoCommunity</h3>
                                <p className="text-emerald-100 mb-12">
                                    Votre plateforme dédiée à l'entrepreneuriat communautaire au Cameroun.
                                    Connectez-vous pour accéder à toutes nos fonctionnalités.
                                </p>

                                <div className="space-y-8">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 bg-white rounded-lg p-2">
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
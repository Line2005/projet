import React, { useEffect, useState } from 'react';
import { Camera, Users, TrendingUp, PlusCircle } from 'lucide-react';
import {useNavigate} from "react-router-dom";

const EcoCommunity = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const impactSection = document.getElementById('impact');
            if (impactSection) {
                const rect = impactSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && !isVisible) {
                    setIsVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible]);

    const socialLinks = [
        { icon: 'facebook', url: '#' },
        { icon: 'twitter', url: '#' },
        { icon: 'linkedin', url: '#' },
        { icon: 'instagram', url: '#' }
    ];

    const quickLinks = [
        { name: 'Accueil', href: '#accueil' },
        { name: 'Services', href: '#services' },
        { name: 'À Propos', href: '#about' },
        { name: 'Contact', href: '#contact' }
    ];

    const testimonials = [
        {
            name: "Marie Nguemo",
            role: "Entrepreneure Sociale",
            quote: "Grâce à EcoCommunity, j'ai pu développer mon projet d'agriculture communautaire et créer un impact réel dans ma région."
        },
        {
            name: "Jean Tamba",
            role: "Investisseur Impact",
            quote: "La plateforme m'a permis de découvrir des projets innovants et d'investir dans l'avenir du Cameroun."
        },
        {
            name: "Sarah Ekotto",
            role: "Mentor",
            quote: "Accompagner les entrepreneurs sur EcoCommunity est une expérience enrichissante qui montre le potentiel de notre jeunesse."
        }
    ];

    const startCounters = () => {
        if (!isVisible) return;

        const counters = [
            { id: 'projectCount', target: 150 },
            { id: 'communityCount', target: 75 },
            { id: 'fundingCount', target: 500 },
            { id: 'jobCount', target: 1200 }
        ];

        counters.forEach(({ id, target }) => animateCounter(id, target));
    };

    useEffect(() => {
        if (isVisible) {
            startCounters();
        }
    }, [isVisible]);

    const animateCounter = (elementId, target, duration = 2000) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <>
            {/* Navigation */}
            <nav className="bg-emerald-700 text-white fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/" className="text-xl font-bold">EcoCommunity</a>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {['Accueil', 'Services', 'À Propos', 'Impact', 'Contact'].map(item => (
                                    <a key={item} href={`#${item.toLowerCase()}`} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-emerald-600">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="/login"
                               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50">
                                Connexion
                            </a>
                            <a href="/register"
                               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600">
                                S'inscrire
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section id="accueil" className="relative bg-emerald-700 pt-24 pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                                <div className="lg:py-24">
                                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                        <span className="block">Développez Votre</span>
                                        <span className="block text-yellow-400">Impact Communautaire</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        Première plateforme numérique dédiée à l'entrepreneuriat communautaire au Cameroun.
                                    </p>
                                    <div className="mt-10 sm:mt-12">
                                        <div className="sm:flex sm:justify-center lg:justify-start">
                                            <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 md:py-4 md:text-lg md:px-10"
                                                    onClick={handleRegister}
                                            >
                                                Démarrer un Projet
                                            </button>
                                            <button className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                                En Savoir Plus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                    <img src="/api/placeholder/800/600" alt="Community Impact" className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Projets</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Projets Vedettes
                            </p>
                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Project Card 1 */}
                            <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative w-full h-80 bg-white rounded-t-lg overflow-hidden group-hover:opacity-75">
                                    <img src="/api/placeholder/400/320" alt="Coopérative Agricole" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">Coopérative Agricole Durable</h3>
                                    <p className="mt-2 text-sm text-gray-500">Initiative communautaire pour développer l'agriculture durable dans la région de l'Ouest.</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-emerald-600 font-medium">2.5M FCFA collectés</span>
                                        <a href="#" className="text-yellow-500 hover:text-yellow-600">En savoir plus →</a>
                                    </div>
                                </div>
                            </div>

                            {/* Project Card 2 */}
                            <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative w-full h-80 bg-white rounded-t-lg overflow-hidden group-hover:opacity-75">
                                    <img src="/api/placeholder/400/320" alt="Artisanat Local" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">Artisanat Local Digital</h3>
                                    <p className="mt-2 text-sm text-gray-500">Plateforme de vente en ligne pour les artisans traditionnels du Cameroun.</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-emerald-600 font-medium">1.8M FCFA collectés</span>
                                        <a href="#" className="text-yellow-500 hover:text-yellow-600">En savoir plus →</a>
                                    </div>
                                </div>
                            </div>

                            {/* Project Card 3 */}
                            <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative w-full h-80 bg-white rounded-t-lg overflow-hidden group-hover:opacity-75">
                                    <img src="/api/placeholder/400/320" alt="Education Numérique" className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">Éducation Numérique Rurale</h3>
                                    <p className="mt-2 text-sm text-gray-500">Programme d'accès à l'éducation numérique dans les zones rurales.</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-emerald-600 font-medium">3.2M FCFA collectés</span>
                                        <a href="#" className="text-yellow-500 hover:text-yellow-600">En savoir plus →</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Service Card 1 */}
                            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <Camera className="text-3xl text-green-700" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Création de Projets</h3>
                                <p className="text-gray-600">Publiez vos projets communautaires, partagez votre vision et trouvez le soutien nécessaire pour réussir.</p>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Création de page de projet personnalisée
                                    </li>
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Outils de planification financière
                                    </li>
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Support technique continu
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 2 */}
                            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <Users className="text-3xl text-green-700" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Mise en Réseau</h3>
                                <p className="text-gray-600">Connectez-vous avec des investisseurs, experts et partenaires potentiels pour développer votre projet.</p>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Événements de networking
                                    </li>
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Mentorat personnalisé
                                    </li>
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Connexion avec des investisseurs
                                    </li>
                                </ul>
                            </div>

                            {/* Service Card 3 */}
                            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <TrendingUp className="text-3xl text-green-700" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">Suivi d'Impact</h3>
                                <p className="text-gray-600">Mesurez et visualisez l'impact de vos projets sur votre communauté grâce à nos outils analytiques.</p>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Tableaux de bord personnalisés
                                    </li>
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Rapports d'impact détaillés
                                    </li>
                                    <li className="flex items-center">
                                        <PlusCircle className="text-green-500 mr-2" size={16} />
                                        Métriques de performance
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section id="impact" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Notre Impact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div className="bg-green-50 p-6 rounded-lg">
                                <i className="fas fa-project-diagram text-4xl text-green-700 mb-4"></i>
                                <div id="projectCount" className="text-4xl font-bold text-green-700 mb-2">0</div>
                                <div className="text-gray-600">Projets Lancés</div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                                <i className="fas fa-users text-4xl text-green-700 mb-4"></i>
                                <div id="communityCount" className="text-4xl font-bold text-green-700 mb-2">0</div>
                                <div className="text-gray-600">Communautés Impactées</div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                                <i className="fas fa-money-bill-wave text-4xl text-green-700 mb-4"></i>
                                <div id="fundingCount" className="text-4xl font-bold text-green-700 mb-2">0</div>
                                <div className="text-gray-600">FCFA Mobilisés</div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg">
                                <i className="fas fa-briefcase text-4xl text-green-700 mb-4"></i>
                                <div id="jobCount" className="text-4xl font-bold text-green-700 mb-2">0</div>
                                <div className="text-gray-600">Emplois Créés</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <img src="/api/placeholder/600/400" alt="About Us" className="rounded-lg shadow-xl" />
                            </div>
                            <div className="md:w-1/2 md:pl-12">
                                <h2 className="text-3xl font-bold mb-6">À Propos de Nous</h2>
                                <p className="text-gray-600 mb-6">
                                    EcoCommunity est née de la vision de créer un écosystème entrepreneurial dynamique et inclusif au Cameroun.
                                    Notre plateforme connecte les entrepreneurs locaux avec les ressources et le soutien dont ils ont besoin pour réussir.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Nous croyons au pouvoir de l'entrepreneuriat communautaire pour créer un changement social positif
                                    et stimuler le développement économique local.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <Users className="text-2xl text-green-700 mb-2" />
                                        <h3 className="font-semibold mb-2">Notre Mission</h3>
                                        <p className="text-sm text-gray-600">Faciliter l'émergence d'initiatives entrepreneuriales communautaires.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <Camera className="text-2xl text-green-700 mb-2" />
                                        <h3 className="font-semibold mb-2">Notre Vision</h3>
                                        <p className="text-sm text-gray-600">Un Cameroun où chaque communauté prospère grâce à l'entrepreneuriat.</p>
                                    </div>
                                </div>
                                <button className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition flex items-center">
                                    En Savoir Plus
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Témoignages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
                                    <div className="flex items-center mb-4">
                                        <img src="/api/placeholder/64/64" alt={`Testimonial ${index + 1}`} className="w-12 h-12 rounded-full" />
                                        <div className="ml-4">
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">{testimonial.quote}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Contactez-Nous</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Nom complet</label>
                                        <input type="text" className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input type="email" className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Message</label>
                                        <textarea rows={4} className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-green-500" />
                                    </div>
                                    <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition w-full">
                                        Envoyer le message
                                    </button>
                                </form>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-semibold mb-6">Informations de contact</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <span className="text-2xl text-green-700 w-8">📍</span>
                                        <span className="text-gray-600">Yaoundé, Cameroun</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-2xl text-green-700 w-8">📞</span>
                                        <span className="text-gray-600">+237 6XX XXX XXX</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-2xl text-green-700 w-8">✉️</span>
                                        <span className="text-gray-600">contact@ecocommunity.cm</span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <h4 className="font-semibold mb-4">Suivez-nous</h4>
                                    <div className="flex space-x-4">
                                        {socialLinks.map((social, index) => (
                                            <a key={index} href={social.url} className="text-green-700 hover:text-green-800 text-2xl">
                                                {social.icon === 'facebook' && '📘'}
                                                {social.icon === 'twitter' && '📱'}
                                                {social.icon === 'linkedin' && '💼'}
                                                {social.icon === 'instagram' && '📷'}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-green-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">EcoCommunity</h3>
                            <p className="text-green-200">
                                Ensemble, construisons un Cameroun plus entrepreneurial.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Liens Rapides</h4>
                            <ul className="space-y-2">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} className="text-green-200 hover:text-white">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-green-200">
                                <li className="flex items-center">
                                    <span className="mr-2">📍</span>
                                    Yaoundé, Cameroun
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">✉️</span>
                                    contact@ecocommunity.cm
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">📞</span>
                                    +237 6XX XXX XXX
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Newsletter</h4>
                            <form className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="w-full px-4 py-2 rounded-lg text-gray-900"
                                />
                                <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition w-full flex items-center justify-center">
                                    <span className="mr-2">✈️</span> S'abonner
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
                        <p>&copy; 2025 EcoCommunity. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default EcoCommunity;
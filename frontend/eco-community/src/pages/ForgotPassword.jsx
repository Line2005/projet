import React, { useState } from 'react';
import {Mail, Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle, TrendingUp} from 'lucide-react';
import Alert from "../components/ui/alert.jsx";
import {requestPasswordReset, resetPassword, verifyResetCode} from "../Services/auth.js";

const ForgotPassword = () => {
    const [stage, setStage] = useState('forgot');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Password validation state
    const [isPasswordValid, setIsPasswordValid] = useState({
        length: false,
        number: false,
        mixedCase: false
    });

    // Password validation function
    const validatePassword = (password) => {
        setIsPasswordValid({
            length: password.length >= 8,
            number: /\d/.test(password),
            mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password)
        });
    };

    // Handle OTP input
    const handleCodeChange = (index, value) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle backspace in OTP input
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Handle password reset request
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSubmitStatus(null);

        try {
            await requestPasswordReset(email);
            setSubmitStatus('success');
            setStage('verify');
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle verification code submission
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSubmitStatus(null);

        try {
            await verifyResetCode(email, code.join(''));
            setSubmitStatus('success');
            setStage('reset');
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitStatus(null);

        if (!Object.values(isPasswordValid).every(Boolean)) {
            setError('Please meet all password requirements');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(
                email,
                code.join(''), // Join the code array into a string
                newPassword,
                confirmPassword
            );
            setSubmitStatus('success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
            setError(error.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    const renderForgotPassword = () => (
        <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600 mb-8">
                Enter your email address to receive a verification code
            </p>

            <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                            placeholder="youremail@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                </button>

                <a href="/login" className="block text-sm text-emerald-600 hover:text-emerald-500 text-center">
                    Retour sur la page de connexion
                </a>
            </form>
        </>
    );

    const renderVerifyCode = () => (
        <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification</h2>
            <p className="text-gray-600 mb-8">
                Enter the 6-digit code sent to {email}
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Verification Code
                    </label>
                    <div className="flex justify-between space-x-2">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                required
                                disabled={loading}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50"
                    disabled={loading || code.some(digit => !digit)}
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                <a href="/login" className="block text-sm text-emerald-600 hover:text-emerald-500 text-center">
                    Back to Login
                </a>
            </form>
        </>
    );

    const renderResetPassword = () => (
        <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">New Password</h2>
            <p className="text-gray-600 mb-8">
                Create a new secure password
            </p>

            <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                validatePassword(e.target.value);
                            }}
                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                            placeholder="8 characters minimum"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                            placeholder="Confirm your password"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center">
                        <Check className={`w-4 h-4 mr-2 ${isPasswordValid.length ? 'text-green-500' : 'text-gray-300'}`} />
                        At least 8 characters long
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <Check className={`w-4 h-4 mr-2 ${isPasswordValid.number ? 'text-green-500' : 'text-gray-300'}`} />
                        Contains at least one number
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <Check className={`w-4 h-4 mr-2 ${isPasswordValid.mixedCase ? 'text-green-500' : 'text-gray-300'}`} />
                        Contains both uppercase and lowercase letters
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-700 text-white py-3 px-4 rounded-lg hover:bg-emerald-800 transition duration-200 disabled:opacity-50"
                    disabled={loading || !Object.values(isPasswordValid).every(Boolean) || !confirmPassword}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <a href="/login" className="block text-sm text-emerald-600 hover:text-emerald-500 text-center">
                    Back to Login
                </a>
            </form>
        </>
    );

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

            <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        {stage !== 'forgot' && (
                            <button
                                onClick={() => setStage(stage === 'verify' ? 'forgot' : stage === 'reset' ? 'verify' : 'forgot')}
                                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                                disabled={loading}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </button>
                        )}

                        {stage === 'forgot' && renderForgotPassword()}
                        {stage === 'verify' && renderVerifyCode()}
                        {stage === 'reset' && renderResetPassword()}

                        {submitStatus === 'success' && (
                            <Alert
                                type="success"
                                message="Étape franchie!"
                                description={
                                    stage === 'forgot'
                                        ? "Code sent successfully!"
                                        : stage === 'verify'
                                            ? "Code verified successfully!"
                                            : stage === 'reset'
                                                ? "Password changed successfully! Redirecting..."
                                                : null
                                }
                            />

                        )}

                        {submitStatus === 'error' && (
                            <Alert
                                type="error"
                                message="Votre mot de passe n'a pas été réinitialisé!"
                                description={error.submit || "Une erreur inconnue s'est produite. Veuillez réessayer."}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
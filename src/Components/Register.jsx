// Register.jsx
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    


    // Password strength criteria
    const passwordCriteria = [
        { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
        { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
        { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd) },
        { label: 'Contains special character', test: (pwd) => /[!@#$%^&*]/.test(pwd) }
    ];

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'username':
                if (!value.trim()) error = 'Username is required';
                else if (value.trim().length < 3) error = 'Username must be at least 3 characters';
                else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Username can only contain letters, numbers, and underscores';
                break;
                
            case 'password':
                if (!value) error = 'Password is required';
                else if (value.length < 8) error = 'Password must be at least 8 characters';
                break;
                
            case 'confirmPassword':
                if (!value) error = 'Please confirm your password';
                else if (value !== formData.password) error = 'Passwords do not match';
                break;
                
            default:
                break;
        }
        
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validate on change
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validate on blur
        const error = validateField(name, formData[name]);
        console.log("Error for", name, ":", error);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        
        setErrors(newErrors);
        setTouched({
            username: true,
            password: true,
            confirmPassword: true
        });
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
         try {
        console.log ("Submitting registration with data:", formData);
        console.log(`${import.meta.env.VITE_BASE_URL}/register`);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/register`, { username: formData.username, password: formData.password });      
      console.log("Registration successful:", res.data);
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || "Registration Failed. Please try again.";
      alert(message);
    }
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            console.log('Registration data:', {
                username: formData.username,
                password: formData.password
            });
            
            setIsLoading(false);
            navigate('/login', { state: { registered: true } });
        }, 1500);
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-10">
            <div className="w-full max-w-2xl">
                {/* Header with decorative element */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4 shadow-sm">
                        <User size={32} className="text-emerald-700" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500 text-sm">Join us to start shopping and tracking your orders</p>
                </div>

                {/* Back to Login Link */}
                <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-6">
                        
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                                    USERNAME
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={18} />
                                    </span>
                                    <input 
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-base ${
                                            touched.username && errors.username 
                                                ? 'border-red-300 focus:border-red-500' 
                                                : touched.username && !errors.username
                                                ? 'border-emerald-300 focus:border-emerald-500'
                                                : 'border-slate-200 focus:border-emerald-500'
                                        }`}
                                        placeholder="Choose a username"
                                    />
                                    {touched.username && !errors.username && (
                                        <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                                    )}
                                </div>
                                {touched.username && errors.username && (
                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <XCircle size={12} />
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                                    PASSWORD
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full pl-12 pr-12 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-base ${
                                            touched.password && errors.password 
                                                ? 'border-red-300 focus:border-red-500' 
                                                : touched.password && !errors.password
                                                ? 'border-emerald-300 focus:border-emerald-500'
                                                : 'border-slate-200 focus:border-emerald-500'
                                        }`}
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {touched.password && errors.password && (
                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <XCircle size={12} />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                          

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                                    CONFIRM PASSWORD
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </span>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full pl-12 pr-12 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-base ${
                                            touched.confirmPassword && errors.confirmPassword 
                                                ? 'border-red-300 focus:border-red-500' 
                                                : touched.confirmPassword && !errors.confirmPassword
                                                ? 'border-emerald-300 focus:border-emerald-500'
                                                : 'border-slate-200 focus:border-emerald-500'
                                        }`}
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <XCircle size={12} />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-3 pt-4">
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    className="w-4 h-4 mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                                    required
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600">
                                    I agree to the{' '}
                                    <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">
                                        Terms of Service
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button 
                                    onClick={handleSubmit}
                                    disabled={isLoading }
                                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-base"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className="text-center pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center items-center gap-6 mt-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span>Secure Registration</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Lock size={14} className="text-emerald-600" />
                        <span>Data Encryption</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <User size={14} className="text-emerald-600" />
                        <span>Privacy Protected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
// Register.jsx
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, CheckCircle, XCircle, ShieldCheck, Zap, BarChart2 } from 'lucide-react'

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

    const passwordCriteria = [
        { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
        { label: 'Uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'Lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
        { label: 'Number', test: (pwd) => /[0-9]/.test(pwd) },
        { label: 'Special character (!@#$%^&*)', test: (pwd) => /[!@#$%^&*]/.test(pwd) }
    ];

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'username':
                if (!value.trim()) error = 'Username is required';
                else if (value.trim().length < 3) error = 'Must be at least 3 characters';
                else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = 'Only letters, numbers, and underscores';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                else if (value.length < 8) error = 'Must be at least 8 characters';
                break;
            case 'confirmPassword':
                if (!value) error = 'Please confirm your password';
                else if (value !== formData.password) error = 'Passwords do not match';
                break;
            default: break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        setTouched({ username: true, password: true, confirmPassword: true });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/register`, {
                username: formData.username,
                password: formData.password
            });
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.message || "Registration Failed. Please try again.";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    const getInputClass = (field) => {
        const base = "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white";
        if (touched[field] && errors[field]) return `${base} border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100`;
        if (touched[field] && !errors[field]) return `${base} border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100`;
        return `${base} border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100`;
    };

    const passStrength = passwordCriteria.filter(c => c.test(formData.password)).length;
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][passStrength];
    const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1'][passStrength];

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 sm:p-2"
            style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>

            <div className="w-full max-w-5xl bg-white rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-0 sm:border border-slate-100">

                {/* ── MOBILE TOP STRIP (visible only on mobile) ── */}


                {/* ── LEFT PANEL: Branding (desktop only) ── */}
                <div
                    className="hidden md:flex md:w-4/12 p-10 flex-col justify-between relative overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #4f46e5, #6366f1, #7c3aed)' }}
                >
                    {/* Background decoration */}
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />

                    {/* Logo */}
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <span className="text-white font-extrabold text-xl">S</span>
                            </div>
                            <div>
                                <p className="text-white font-extrabold text-lg leading-none tracking-tight">StockPop</p>
                                <p className="text-indigo-200 text-[0.6rem] font-semibold tracking-widest uppercase">Order Management</p>
                            </div>
                        </Link>

                        <h2 className="text-white font-bold text-2xl leading-snug mb-3">
                            Start managing<br />orders smarter.
                        </h2>
                        <p className="text-indigo-200 text-sm leading-relaxed">
                            Create your account and get instant access to your order dashboard.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="relative z-10 space-y-4 my-8">
                        {[
                            { icon: <BarChart2 size={16} />, text: 'Real-time order tracking' },
                            { icon: <Zap size={16} />, text: 'Lightning-fast order placement' },
                            { icon: <ShieldCheck size={16} />, text: 'Secure & encrypted data' },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white border border-white/20 flex-shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-sm text-indigo-100 font-medium">{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom note */}
                    <p className="relative z-10 text-indigo-300 text-xs">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white font-semibold hover:underline">Sign in →</Link>
                    </p>
                </div>

                {/* ── RIGHT PANEL: Form ── */}
                <div className="w-full md:w-8/12 p-4 sm:p-6 md:p-10 flex flex-col justify-center min-w-0">

                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
                        <p className="text-slate-500 text-sm">Fill in the details below to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 w-full">

                        {/* Username */}
                        <div className="w-full">
                            <label htmlFor="username" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <User size={16} />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClass('username')}
                                    placeholder="Enter Username"
                                    autoComplete="username"
                                />
                                {touched.username && !errors.username && formData.username && (
                                    <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-500" />
                                )}
                            </div>
                            {touched.username && errors.username && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <XCircle size={12} /> {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="w-full">
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${getInputClass('password')} pr-11`}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <XCircle size={12} /> {errors.password}
                                </p>
                            )}

                            {/* Password strength bar */}
                            {formData.password.length > 0 && (
                                <div className="mt-2.5">
                                    <div className="flex gap-1 mb-1.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{ background: i <= passStrength ? strengthColor : '#e2e8f0' }} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                            {passwordCriteria.map((c, i) => (
                                                <span key={i} className={`text-[0.65rem] flex items-center gap-0.5 font-medium ${c.test(formData.password) ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                    {c.test(formData.password) ? <CheckCircle size={9} /> : <XCircle size={9} />}
                                                    {c.label}
                                                </span>
                                            ))}
                                        </div>
                                        {strengthLabel && (
                                            <span className="text-[0.65rem] font-bold ml-2 flex-shrink-0" style={{ color: strengthColor }}>
                                                {strengthLabel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="w-full">
                            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`${getInputClass('confirmPassword')} pr-11`}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {touched.confirmPassword && errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <XCircle size={12} /> {errors.confirmPassword}
                                </p>
                            )}
                            {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                                <p className="mt-1.5 text-xs text-indigo-600 flex items-center gap-1">
                                    <CheckCircle size={12} /> Passwords match
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-indigo-600 cursor-pointer flex-shrink-0"
                                required
                            />
                            <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                                I agree to the{' '}
                                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">Terms of Service</button>
                                {' '}and{' '}
                                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">Privacy Policy</button>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                            style={{
                                background: isLoading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                boxShadow: isLoading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account →'
                            )}
                        </button>

                        {/* Sign in link (mobile) */}
                        <p className="text-center text-xs text-slate-500 md:hidden pt-1">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthSession } from '../utils/Auth';
import { User, Lock, Eye, EyeOff, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, { username, password });
      setAuthSession(res.data);
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || "Login Failed. Please check your credentials.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[90%] mt-3 flex items-center justify-center bg-slate-50 sm:p-4"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-5xl bg-white rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-0 sm:border border-slate-100">

        {/* ── MOBILE TOP STRIP (mobile only) ── */}


        {/* ── LEFT PANEL: Branding (desktop only) ── */}
        <div
          className="hidden md:flex md:w-4/12 p-10 flex-col justify-between relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #4f46e5, #6366f1, #7c3aed)' }}
        >
          {/* Background decorations */}
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
              Welcome<br />back!
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Sign in to access your dashboard and manage your orders seamlessly.
            </p>
          </div>

          {/* Features */}
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

          {/* Footer note */}
          <p className="relative z-10 text-indigo-300 text-xs">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">Register →</Link>
          </p>
        </div>

        {/* ── RIGHT PANEL: Form ── */}
        <div className="w-full md:w-8/12 p-4 sm:p-6 md:p-12 flex flex-col justify-center min-w-0">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">

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
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 cursor-pointer select-none">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
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
                  Signing in...
                </>
              ) : (
                'Sign In →'
              )}
            </button>

            {/* Register link (mobile only) */}
            <p className="text-center text-xs text-slate-500 md:hidden pt-1">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
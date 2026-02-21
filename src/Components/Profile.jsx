import React from 'react';
import { useUser } from '../Context/UserContext';
import { CircleUser, Mail, Shield, Key, Calendar, Edit3, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Loading profile...</h2>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

    return (
        <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        Account Profile
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">
                        Manage your personal information and account settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Avatar Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center transition-all duration-300">
                            <div className="relative mb-5 group cursor-pointer">
                                <div
                                    className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-indigo-200 transition-transform duration-300 group-hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                                >
                                    {user?.username ? user.username.charAt(0).toUpperCase() : <CircleUser size={64} />}
                                </div>
                                <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Edit3 className="text-white" size={24} />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user?.username}</h2>
                            <p className="text-sm text-slate-500 font-medium mb-5">
                                {isAdmin ? 'Administrator' : 'Premium Member'}
                            </p>
                            <span className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wide shadow-sm ${isAdmin ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                {isAdmin ? 'ADMIN PORTAL ACCESS' : 'ACTIVE ACCOUNT'}
                            </span>
                        </div>

                        {/* Quick Links Menu */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Settings Menu</h3>
                            </div>
                            <div className="flex flex-col">
                                <button className="flex items-center gap-3 w-full px-5 py-4 text-sm font-semibold text-indigo-700 bg-indigo-50/50 border-l-4 border-indigo-600 text-left transition-colors">
                                    <CircleUser size={18} />
                                    Personal Information
                                </button>
                                <button className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors">
                                    <Shield size={18} />
                                    Security & Privacy
                                </button>
                                <button className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors border-b border-slate-50">
                                    <Settings size={18} />
                                    Preferences
                                </button>
                                <Link to="/logout" className="flex items-center gap-3 w-full px-5 py-4 text-sm font-semibold text-red-500 hover:bg-red-50 text-left transition-colors">
                                    <LogOut size={18} />
                                    Sign Out
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Info Section */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personal Information</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Review your basic account details</p>
                                </div>
                                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors active:scale-[0.98]">
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                            </div>
                            <div className="p-6 md:p-8">
                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">

                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <CircleUser size={14} className="text-slate-300" />
                                            Username
                                        </label>
                                        <div className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-100 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-100">
                                            {user?.username || 'Not set'}
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Mail size={14} className="text-slate-300" />
                                            Email Address
                                        </label>
                                        <div className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-100 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-100">
                                            {user?.email || `${user?.username?.toLowerCase()}@example.com`}
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Shield size={14} className="text-slate-300" />
                                            Account Role
                                        </label>
                                        <div className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-100 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-100">
                                            {isAdmin ? 'Administrator' : 'User'}
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-300" />
                                            Member Since
                                        </label>
                                        <div className="w-full bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-100 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-100">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Joined'}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Security Section Summarized */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Security Essentials</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Manage your account security features</p>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                            <Key size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Account Password</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">Last changed never</p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98]">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
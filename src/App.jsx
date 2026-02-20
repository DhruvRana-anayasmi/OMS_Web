import './App.css'
import Home from './Components/Home.jsx'
import About from './Components/About.jsx'
import Login from './Components/Login.jsx'
import { isAuthenticated } from './utils/Auth.jsx'
import { AuthWrapper } from './wrappers/AuthWrapper.jsx';
import Order from './Components/Order.jsx';
import Success from './Components/Success.jsx'
import OrderContext from './Context/OrderContext.jsx';
import Logout from './Components/Logout.jsx';
import { History, CircleUser, LogOut, Home as HomeIcon, ShoppingBag } from 'lucide-react';
import OrderHistory from './Components/OrderHistory.jsx'
import Register from './Components/Register.jsx'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import { useState, useEffect } from 'react'

export default function App() {
  const [orderItems, setOrderItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isScrolled, setIsScrolled] = useState(false);
  const getOrderItems = () => orderItems;

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Premium Navigation - Clean & Compact */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 py-1'
          : 'bg-white/90 backdrop-blur-sm border-b border-transparent py-2'
        }`}>
        {/* Full Width Justified Layout */}
        <div className="max-w-full mx-auto px-8">
          <div className="flex items-center justify-between h-14">

            {/* LEFT: Brand Identity */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-slate-800 tracking-tight leading-none mr-2">STORE</span>
                  {/* <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Premium Dashboard</span> */}
                </div>
              </Link>
            </div>

            {/* MIDDLE: Navigation */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-emerald-700 rounded-lg transition-all duration-200"
                >
                  <HomeIcon size={18} strokeWidth={2} />
                  <span>Home</span>
                </Link>

                {isLoggedIn && (
                  <Link
                    to="/history"
                    className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-emerald-700 rounded-lg transition-all duration-200"
                  >
                    <ShoppingBag size={18} strokeWidth={2} />
                    <span>Orders</span>
                  </Link>
                )}
              </div>
            </div>

            {/* RIGHT: Account Actions */}
            <div className="flex items-center justify-end gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  {/* Minimalist Logout Button */}
                  <Link
                    to="/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={18} strokeWidth={2.2} />
                    <span className="hidden lg:inline">Exit</span>
                  </Link>

                  <div className="w-px h-6 bg-slate-200 relative group z-[100]"></div>

                  {/* Profile Pill */}
                  <button className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-full hover:border-emerald-300 transition-all shadow-sm">
                    <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      AD
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Admin</span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-700">
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-emerald-700 text-white text-sm font-bold rounded-xl hover:bg-emerald-800 shadow-md transition-all active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content with Top Padding (adjusted for smaller navbar) */}
      <div className="pt-16 min-h-screen bg-slate-50">
        <OrderContext.Provider value={{ orderItems, setOrderItems, getOrderItems }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthWrapper><Home /></AuthWrapper>} />
            <Route path="/order" element={<AuthWrapper><Order /></AuthWrapper>} />
            <Route path="/success" element={<AuthWrapper><Success /></AuthWrapper>} />
            <Route path="/logout" element={<AuthWrapper><Logout /></AuthWrapper>} />
            <Route path="/history" element={<AuthWrapper><OrderHistory /></AuthWrapper>} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </OrderContext.Provider>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-slate-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(203, 213, 225, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(203, 213, 225, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}></div>
      </div>
    </BrowserRouter>
  );
}
import './App.css'
import Home from './Components/Home.jsx'
import About from './Components/About.jsx'
import Login from './Components/Login.jsx'
import { isAuthenticated } from './utils/Auth.jsx'
import { AuthWrapper } from './wrappers/AuthWrapper.jsx';
import Order from './Components/Order.jsx';
import Success from './Components/Success.jsx'
import OrderContext from './Context/OrderContext.jsx';
import { UserProvider } from './Context/UserContext.jsx';
import Logout from './Components/Logout.jsx';
import { History, CircleUser, LogOut, Home as HomeIcon, ShoppingBag, Menu, X } from 'lucide-react';
import OrderHistory from './Components/OrderHistory.jsx'
import Register from './Components/Register.jsx'
import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { useUser } from './Context/UserContext.jsx';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

export default function App() {
  const [orderItems, setOrderItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const getOrderItems = () => orderItems;

  const { user } = useUser();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <BrowserRouter>
      {/* Premium Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100'
          }`}
        style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-column grid: left | center | right */}
          <div className="grid h-16" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

            {/* ── LEFT: Brand ── */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group select-none">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-indigo-300 group-hover:scale-105 transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  <span className="text-white font-extrabold text-lg tracking-tight">S</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-[1.15rem] text-slate-800 tracking-tight">StockPop</span>
                  <span className="text-[0.6rem] text-indigo-500 font-semibold tracking-widest uppercase">Order Management</span>
                </div>
              </Link>
            </div>

            {/* ── CENTER: Nav Links (desktop) ── */}
            <div className="hidden md:flex items-center justify-center">
                 {
                isAuthenticated() && <div>
              <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-1 rounded-xl border border-slate-200">
               
                   <Link
                  to="/"
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition-all duration-200"
                 >
                   <HomeIcon size={16} strokeWidth={2} />
                  <span>Home</span>
                </Link>

                {isLoggedIn && (
                  <Link
                  to="/history"
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-lg transition-all duration-200"
                  >
                    <ShoppingBag size={16} strokeWidth={2} />
                    <span>Orders</span>
                  </Link>
                )}
                </div>
              </div>
                }
            </div>

            {/* ── RIGHT: User / Auth ── */}
            <div className="flex items-center justify-end gap-3">
              {isLoggedIn ? (
                <>
                  {/* Desktop: logout + avatar pill */}
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      to="/logout"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={16} strokeWidth={2} />
                      <span className="hidden lg:inline">Logout</span>
                    </Link>

                    <div className="w-px h-5 bg-slate-200" />

                    {/* Avatar + Dropdown */}
                    <div className="relative group">
                      <button className="flex items-center gap-2 pl-1 pr-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-indigo-400 hover:shadow-md transition-all duration-200">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                        >
                          {user?.username ? user.username.charAt(0).toUpperCase() : <CircleUser size={16} />}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 max-w-[90px] truncate">
                          {user?.username || 'User'}
                        </span>
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-wide">Signed in as</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{user?.username || 'User'}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <CircleUser size={15} />
                            Profile Settings
                          </Link>
                          <Link
                            to="/history"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <ShoppingBag size={15} />
                            Order History
                          </Link>
                        </div>
                        <div className="border-t border-slate-100 pt-1">
                          <Link
                            to="/logout"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: hamburger */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </>
              ) : (
                /* Non-authenticated */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.97]"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                  >
                    Get Started
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile Slide-down Menu ── */}
          <div
            className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="pb-4 pt-2 border-t border-slate-100 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon size={18} strokeWidth={2} />
                {isAuthenticated() ? "Home" : ""}
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    to="/history"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag size={18} strokeWidth={2} />
                    Orders
                  </Link>

                  {/* User card */}
                  <div className="mx-1 mt-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                    >
                      {user?.username ? user.username.charAt(0).toUpperCase() : <CircleUser size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.username || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>

                  <Link
                    to="/logout"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOut size={18} strokeWidth={2} />
                    Logout
                  </Link>
                </>
              )}

              {!isLoggedIn && (
                <div className="flex flex-col gap-2 pt-2 px-1">
                  <Link
                    to="/login"
                    className="px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 text-sm font-semibold text-white rounded-xl transition-colors text-center"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Top Padding */}
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
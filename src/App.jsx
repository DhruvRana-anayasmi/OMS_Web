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
import { History } from 'lucide-react';
import { CircleUser } from 'lucide-react';
import OrderHistory from './Components/OrderHistory.jsx'

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
      {/* Premium Navigation - Clearly Visible */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg border-b border-slate-200' 
          : 'bg-white border-b border-slate-200'
      }`}>
        <div className="max-w-[1400px] mx-auto">
          {/* Main Navbar Content - Three Column Layout */}
          <div className="flex items-center justify-between h-20 px-8">
            
          

            {/* CENTER: Main Navigation */}
            <div className="flex items-center justify-center flex-1">
              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-2xl">
                <Link 
                  to="/" 
                  className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white hover:text-emerald-700 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white hover:text-emerald-700 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  Products
                </Link>
                <Link 
                  to="/about" 
                  className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white hover:text-emerald-700 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  About
                </Link>
              </div>
            </div>

            {/* RIGHT: Auth & User Menu */}
            <div className="flex items-center justify-end gap-4 flex-1">
              {isLoggedIn ? (
                <>
                  <Link 
                    to='/history' 
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 group relative"
                  >
                    <History size={18} strokeWidth={1.8} />
                    <span>Orders</span>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                      3
                    </span>
                  </Link>
                  
                  <div className="w-px h-8 bg-slate-200"></div>
                  
                  <div className="relative group">
                    
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-16 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 mt-1">admin@storefront.com</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <CircleUser size={16} />
                          Profile Settings
                        </Link>
                        <Link 
                          to="/history" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <History size={16} />
                          Order History
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <Link 
                          to="/logout" 
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
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
      <div className="pt-20 min-h-screen bg-slate-50">
        <OrderContext.Provider value={{orderItems, setOrderItems, getOrderItems}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthWrapper><Home/></AuthWrapper>} />
            <Route path="/order" element={<AuthWrapper><Order/></AuthWrapper>} />
            <Route path="/success" element={<AuthWrapper><Success/></AuthWrapper>} />
            <Route path="/logout" element={<AuthWrapper><Logout/></AuthWrapper>} />
            <Route path="/history" element={<AuthWrapper><OrderHistory/></AuthWrapper>} />
          </Routes>
        </OrderContext.Provider>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-slate-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(203, 213, 225, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(203, 213, 225, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}></div>
      </div>
    </BrowserRouter>
  );
}
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
  const getOrderItems = () => orderItems;

  useEffect(() => {
    // Check authentication status on mount and when storage changes
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    checkAuth();
    
    // Listen for storage changes (in case of login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab auth changes
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> 
        {isLoggedIn?<Link to="/logout">Logout</Link>:<Link to="/login">Login</Link>}
        <Link to='/history'><History className=' ml-[85vw]'></History></Link>
        <CircleUser></CircleUser>
      </nav>

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
    </BrowserRouter>
  );
}

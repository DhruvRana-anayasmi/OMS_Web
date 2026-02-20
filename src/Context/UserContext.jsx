import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, isAuthenticated } from '../utils/Auth';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
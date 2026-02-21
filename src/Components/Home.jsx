import React from 'react'
import Product from './Product'
import { useUser } from '../Context/UserContext'
import { Loader2 } from 'lucide-react'
const Home = () => {
  const { user, loading } = useUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Loading your store...</h2>
        <p className="text-sm font-medium text-slate-500 mt-2">Please wait a moment while we fetch the latest products.</p>
      </div>
    );
  }

  return (
    <>
      <Product isAdmin={isAdmin} ></Product>
    </>
  )
}

export default Home
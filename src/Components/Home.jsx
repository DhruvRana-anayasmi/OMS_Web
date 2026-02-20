import React from 'react'
import Product from './Product'
import { useUser } from '../Context/UserContext'
const Home = () => {
  const { user, loading } = useUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
  <>
  <Product isAdmin={isAdmin} ></Product>
  </> 
  )
}

export default Home
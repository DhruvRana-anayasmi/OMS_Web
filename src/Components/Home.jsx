import React, { useEffect } from 'react'
import Product from './Product'
import { isAuthenticated } from '../utils/Auth'
const Home = () => {
  useEffect(()=>{
    isAuthenticated();
  },[])
  return (
  <>
  <Product></Product>
  </> 
  )
}

export default Home
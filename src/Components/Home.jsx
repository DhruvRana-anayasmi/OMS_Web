import React, { useEffect } from 'react'
import Product from './Product'
import axios from 'axios';
import { isAuthenticated } from '../utils/Auth'
import { getToken } from '../utils/Auth'
import { useState } from 'react';
const Home = () => {
  const [role, setRole] = useState([]);
  let isAdmin = false;
  useEffect(()=>{
    isAuthenticated();

    axios({
        method: "get",
        url: "http://localhost:8080/me",
        params: {},     // query params (GET)
        data: {},       // request body (POST/PUT)
        headers: { Authorization: `Bearer ${getToken()}` },    // request headers
      }).then((res) => {
        setRole(res.data.roles);
        console.log(res.roles);
      }).catch((err) => {
        console.error(err);
      });

  },[])
  return (
  <>
  <Product isAdmin={role.includes("ROLE_ADMIN")} ></Product>
  </> 
  )
}

export default Home
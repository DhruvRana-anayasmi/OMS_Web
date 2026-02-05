import React, { useEffect, useContext } from 'react'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getToken, isAuthenticated } from '../utils/Auth';
import { useState } from 'react';
import OrderContext from '../Context/OrderContext';

const Product = () => {
  const [products, setproducts] = useState([]);
  const [selectedCart, setSelectedCart] = useState({});
  const { setOrderItems } = useContext(OrderContext);
  
  const handleCartChange = (product, quantity) => {
    setSelectedCart(prev => ({
      ...prev,
      [product.productId]: { product, quantity }
    }));
  };
  
  const handleOrder = () => {
    console.log("Cart items:", selectedCart);
    // Filter out items with quantity > 0
    const cartItems = Object.values(selectedCart)
      .filter(item => item.quantity > 0);
    console.log("Items to order:", cartItems);
    setOrderItems(cartItems);
  }


  useEffect(() => {
     
      console.log("Token", getToken());
      axios({
        method: "get",
        url: "http://localhost:8080/products",
        params: {},     // query params (GET)
        data: {},       // request body (POST/PUT)
        headers: { Authorization: `Bearer ${getToken()}` },    // request headers
      }).then((res) => {
        setproducts(res.data);
        console.log(res.data);
      }).catch((err) => {
        console.error(err);
      });
    

  }, [])
  return isAuthenticated ? (
    <>
    {console.log(isAuthenticated())}
      <div className='p-3'>
        <div className='flex justify-between font-bold text-3xl mb-3 text-orange-400 gap-3'>
          <div>
            Trending now
          </div>
          <Link to='order' onClick={handleOrder} className='text-sm text-black p-1 rounded-md text-white bg-green-400 font-normal content-center'>
            Complete Purchase
          </Link>
          </div>
        <div className='container'>
          {products.map(product => (
            <ProductItem 
              key={product.productId} 
              product={product} 
              onCartChange={handleCartChange}
            />
          ))}
        </div>
      </div>
    </>
  ) : <div>Please login</div>;
}

export default Product
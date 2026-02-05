import React, { use, useContext,useState, useEffect } from 'react'
import OrderContext from '../Context/OrderContext'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'
import Success from './Success'
import axios from 'axios'
import { getToken } from '../utils/Auth'

const Order = () => {
  const { orderItems } = useContext(OrderContext);
  const OrderItems = orderItems;
  const [data,setData]=useState({ items: [] });

  useEffect(() => {
    const items = OrderItems.map((product) => ({
      productId: product.product.productId,
      quantity: product.quantity
    }));
    setData({ items });
  }, [OrderItems]);

  const handleorder = () => {
    console.log("Order Data:", data);
    axios({
        method: "post",
        url: "http://localhost:8080/order",
        params: {},     // query params (GET)
        data: data,       // request body (POST/PUT)
        headers: { Authorization: `Bearer ${getToken()}` },    // request headers
      }).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.error(err);
      });
  }

  return (
    <>
      {console.log("Order Component", OrderItems)}
      <div className='p-3'>
        <div className='flex justify-between font-bold text-3xl mb-3 text-orange-400 gap-3'>
        <div>Your Order</div>
        <Link to='/success' className='bg-orange-400 text-white rounded-md text-sm font-normal content-center p-1' onClick={handleorder}>Order Now</Link>
        </div>
        {OrderItems.length > 0 ? (
          <div className='container'>
            {OrderItems.map((product) => (
              <div key={product.product.productId} >
                <ProductItem 
              key={product.product.productId} 
              product={product.product} 
              quantity={product.quantity}
            />
              </div>
            ))}
            
          </div>
        ) : (
          <p>No items in cart</p>
        )}
      </div>
    </>
  )
}

export default Order
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getToken } from '../utils/Auth'
import OrderItem from './OrderItem'
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
useEffect(()=>{
   
     axios({
        method: "get",
        url: "http://localhost:8080/orders",
        params: {},     // query params (GET)
        data: {},       // request body (POST/PUT)
        headers: { Authorization: `Bearer ${getToken()}` },    // request headers
      }).then((res) => {
        console.log(res.data);
        setOrders(res.data);
      }).catch((err) => {
        console.error(err);
      });

},[])
return (
<>

        <div className='flex font-bold text-3xl mb-3 text-orange-400 gap-3'>Your Order History</div>
        <div className='flex gap-3 flex-wrap p-4'>
            {orders.map((order)=>(
            <OrderItem  key={order.orderId} orderId={order.orderId} order={order.items}></OrderItem>
        ))}
        </div>
</>   
)
}

export default OrderHistory
import React from 'react'

const OrderItem = (props) => {
  return (
    <div className='flex-grow min-w-64 max-w-sm p-4 border rounded-lg shadow bg-white'>
        <div className='flex flex-col gap-2'>
            <div className='font-semibold mb-2 text-lg'>Order ID: {props.orderId}</div>
            {props.order.map((item)=>(
                <div key={item.productId} className='p-2 mb-2 border-b border-gray-300 break-words'>
                    {console.log("OrderItem Component", item)}

                    <div>Product Name: {item.productName}</div>
                    <div>Price: {item.price}</div>
                    <div>Quantity: {item.quantity}</div>
                </div> 
        
    ))}
    </div>
    </div>
)}

export default OrderItem
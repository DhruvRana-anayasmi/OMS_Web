import React from 'react'
import { useState } from 'react';
const ProductItem = (props) => {
  const [quantity, setQuantity] = useState(0);
  const [showCart, setShowCart] = useState(true);

  const handleCart = () => {
    setShowCart(false);
    setQuantity(1);
    // Send data to parent
    props.onCartChange?.(props.product, 1);
  };

  const handleIncreaseCart = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    // Send data to parent
    props.onCartChange?.(props.product, newQuantity);
  }

  const handleReduceCart = () => {
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    // Send data to parent
    props.onCartChange?.(props.product, newQuantity);
    
    if(newQuantity === 0){
      setShowCart(true);
    }
  }
  return (
    <div>
      <div className='rounded-md  card'>
          <div className='font-bold text-xl p-1 text-green-600'>
            {props.product.productName}
          </div>
          <div className='text-sm pt-2'><span className='font-semibold'>Mfg. Dt.: </span>{props.product.manufacturingDate}</div>
          <div className='text-sm '><span className='font-semibold'>Exp. Dt.: </span>{props.product.expirationDate}</div>
          <div className='text-sm '><span className='font-semibold'>Price: </span>{props.product.price}</div>
          {props.quantity !== undefined && (
            <div className='text-sm '><span className='font-semibold'>Quantity: </span>{props.quantity}</div>
          )}
          <div className='flex gap-4 p-2'>
            <button className='bg-orange-400 p-0.5 rounded-md'>Buy Now</button>
            {!showCart && (
              <div className='bg-gray-400 p-0.5 text-white rounded-md'>
                <button className='px-2 rounded-md mr-1 minus' onClick={handleReduceCart}>-</button>
                <span>{quantity}</span>
                <button className='px-2 rounded-md ml-1' onClick={handleIncreaseCart}>+</button>
              </div>
            )}
            {showCart && (
              <button className='bg-gray-400 p-0.5 text-white rounded-md' onClick={handleCart}>Add to Cart</button>
            )}
          </div>
      </div>
    </div>
  )
}

export default ProductItem
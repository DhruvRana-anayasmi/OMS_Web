import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

const ProductItem = (props) => {
  const navigate = useNavigate();
  const [inv, setInv] = useState(props.stock);
  const [tempInv, setTempInv] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [showCart, setShowCart] = useState(true);
  const [show, setShow] = useState(true);

  const handleCart = () => {
    setShowCart(false);
    setQuantity(1);
    props.onCartChange?.(props.product, 1);
  };

  const handleIncreaseCart = () => {
    const newQuantity = quantity + 1;
    if (newQuantity > 10) {
      alert("You cannot add more than 10 items of the same product to the cart.");
      return;
    }
    setQuantity(newQuantity);
    props.onCartChange?.(props.product, newQuantity);
  };

  const handleReduceCart = () => {
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    props.onCartChange?.(props.product, newQuantity);
    if (newQuantity === 0) setShowCart(true);
  };

  const setInventory = () => {
    const newInvValue = Number(tempInv);
    const difference = newInvValue - inv;

    if (difference === 0) {
      setShow(true);
      return;
    }

    const method = difference > 0 ? 'increase' : 'decrease';
    axios({
      method: "post",
      url: `${import.meta.env.VITE_BASE_URL}/${method}/${props.product.productId}`,
      data: { quantity: Math.abs(difference) },
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(() => {
        setInv(newInvValue);
        setShow(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Operation failed.");
      });
  };

  const changeStock = () => {
    setShow(false);
    setTempInv(inv);
  };

  // Helper for stock display logic
  const isLowStock = !props.isAdmin && props.stock < 10 && props.stock > 0;
  const isOutOfStock = !props.isAdmin && props.stock === 0;
  const stockPercentage = Math.min((props.stock / 20) * 100, 100);

  return (
    <div className="group p-2">
      <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out border border-slate-100 overflow-hidden">

        {/* Premium accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600/80" />

        <div className="p-6 flex flex-col gap-5">
          {/* Header with enhanced typography */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Premium Product
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900 leading-tight">
                {props.product.productName}
              </h3>
            </div>
            {props.product.price && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 font-medium">Price</span>
                <span className="text-2xl font-light text-slate-900 tracking-tight">
                  ₹<span className="font-bold text-emerald-700">{props.product.price}</span>
                </span>
              </div>
            )}
          </div>

          {/* Product metadata with enhanced styling */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Manufactured
              </span>
              <span className="text-sm font-medium text-slate-700">
                {props.product.manufacturingDate}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Expires
              </span>
              <span className="text-sm font-medium text-amber-600">
                {props.product.expirationDate}
              </span>
            </div>
          </div>

          {/* Stock status with visual indicators */}
          {!props.isAdmin && props.stock > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Stock Level</span>
                <span className="text-sm font-bold text-slate-700">{props.stock} units</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  style={{ width: `${stockPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Enhanced alert badges */}
          {isLowStock && (
            <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 px-4 py-3 rounded-xl border border-amber-200/50">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Only {props.stock} left in stock — order soon</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="flex items-center justify-center gap-2 text-xs bg-slate-100 text-slate-500 px-4 py-3 rounded-xl border border-slate-200">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span className="font-medium">Out of Stock</span>
            </div>
          )}

          {/* Admin Inventory Controls - Enhanced */}
          {props.isAdmin ? (
            <div className="pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Current Stock</span>
                  <span className="text-lg font-bold text-slate-900">{inv ? inv : '...'}</span>
                </div>
                {show ? (
                  <button
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 group"
                    onClick={changeStock}
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Update Inventory
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={tempInv}
                        onChange={(e) => setTempInv(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors text-center text-lg font-semibold"
                        autoFocus
                        min="0"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">Qty</span>
                    </div>
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 ease-out flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                      onClick={setInventory}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Enhanced User Controls */
            !props.quantity && !isOutOfStock && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Buy Now
                  </button>

                  {showCart ? (
                    <button
                      className="px-6 py-3.5 border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98]"
                      onClick={handleCart}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cart
                    </button>
                  ) : (
                    <div className="flex items-center bg-slate-900 rounded-xl shadow-lg">
                      <button
                        className="w-12 h-12 text-white hover:bg-slate-800 rounded-l-xl transition-colors font-bold text-lg flex items-center justify-center disabled:opacity-50"
                        onClick={handleReduceCart}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <div className="w-12 text-center font-semibold text-white border-x border-slate-700">
                        <span className="text-lg">{quantity}</span>
                      </div>
                      <button
                        className="w-12 h-12 text-white hover:bg-slate-800 rounded-r-xl transition-colors font-bold text-lg flex items-center justify-center"
                        onClick={handleIncreaseCart}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] pattern-dots" />
      </div>
    </div>
  );
};

export default ProductItem;
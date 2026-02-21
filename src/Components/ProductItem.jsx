import React, { useState, useContext } from 'react';
import axios from 'axios';
import { getToken } from '../utils/Auth';
import { data, useNavigate } from 'react-router-dom';
import OrderContext from '../Context/OrderContext';

const ProductItem = (props) => {
  const navigate = useNavigate();
  const [inv, setInv] = useState(props.stock);
  const [tempInv, setTempInv] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [showCart, setShowCart] = useState(true);
  const [show, setShow] = useState(true);
  const { setOrderItems } = useContext(OrderContext);
  const [modal, setModal] = useState(false);
  const [productName, setProductName] = useState(props.product.productName);
  const [manufacturingDate, setManufacturingDate] = useState(props.product.manufacturingDate);
  const [expirationDate, setExpirationDate] = useState(props.product.expirationDate);
  const [price, setPrice] = useState(props.product.price);
  const handleBuyNow = () => {
    setOrderItems([{ product: props.product, quantity: 1 }]);
    navigate('/order');
  };

  const editProduct = () => {
    axios(`${import.meta.env.VITE_BASE_URL}/product/${props.product.productId}`, {
      method: 'PUT',
      data: {
        productName: productName,
        price: price,
        manufacturingDate: manufacturingDate,
        expirationDate: expirationDate,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then(() => {
        setModal(false);
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      })
  }

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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios({
        method: "delete",
        url: `${import.meta.env.VITE_BASE_URL}/delete/${props.product.productId}`,
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to delete product.");
        });
    }
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
    <div className="group p-0">
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
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 group shadow-sm active:scale-[0.98]"
                        onClick={changeStock}
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Update
                      </button>
                      <button
                        className="px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 ease-out flex items-center justify-center group border border-red-200/50 hover:border-red-300 shadow-sm active:scale-[0.98]"
                        onClick={handleDelete}
                        title="Delete Product"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      className="w-full py-3.5 border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-semibold rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98]"
                      onClick={() => setModal(true)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Product Details
                    </button>
                    {modal && (
                      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Update Product Details</h3>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setModal(false)}
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className='px-6 py-5'>
                            <div className='space-y-5'>
                              {/* Product Name */}
                              <div className='space-y-1.5'>
                                <label htmlFor="productName" className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                                  Product Name
                                </label>
                                <input
                                  type="text"
                                  id="productName"
                                  value={productName}
                                  onChange={(e) => setProductName(e.target.value)}
                                  className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 placeholder:text-slate-400'
                                  placeholder="e.g. Organic Almonds"
                                />
                              </div>

                              {/* Date Row */}
                              <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-1.5'>
                                  <label htmlFor="manufacturingDate" className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                                    Mfg. Date
                                  </label>
                                  <input
                                    type="date"
                                    id="manufacturingDate"
                                    value={manufacturingDate}
                                    onChange={(e) => setManufacturingDate(e.target.value)}
                                    className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900'
                                  />
                                </div>
                                <div className='space-y-1.5'>
                                  <label htmlFor="expirationDate" className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                                    Exp. Date
                                  </label>
                                  <input
                                    type="date"
                                    id="expirationDate"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900'
                                  />
                                </div>
                              </div>

                              {/* Price */}
                              <div className='space-y-1.5'>
                                <label htmlFor="price" className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                                  Price
                                </label>
                                <div className='relative'>
                                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium'>₹</span>
                                  <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className='w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900'
                                    placeholder='0.00'
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Modal Footer */}
                          <div className='px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3'>
                            <button
                              type="button"
                              className='px-5 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-colors'
                              onClick={() => setModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className='px-6 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all duration-200 ease-out flex items-center gap-2 active:scale-[0.98]'
                              onClick={editProduct}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Add Product
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
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
              <div className="pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98]"
                    onClick={handleBuyNow}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Buy Now
                  </button>

                  {showCart ? (
                    <button
                      className="px-6 py-1 border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98]"
                      onClick={handleCart}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cart
                    </button>
                  ) : (
                    <div className="flex p-0 items-center bg-slate-900 rounded-xl shadow-lg">
                      <button
                        className="w-10 h-10 text-white hover:bg-slate-800 rounded-l-xl transition-colors font-bold text-lg flex items-center justify-center disabled:opacity-50"
                        onClick={handleReduceCart}
                      >
                        −
                      </button>
                      <div className="w-10 text-center font-semibold text-white border-x border-slate-700">
                        <span className="text-base">{quantity}</span>
                      </div>
                      <button
                        className="w-10 h-10 text-white hover:bg-slate-800 rounded-r-xl transition-colors font-bold text-lg flex items-center justify-center"
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
    </div >
  );
};

export default ProductItem;
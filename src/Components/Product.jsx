import React, { useEffect, useContext } from 'react'
import ProductItem from './ProductItem'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, isAuthenticated } from '../utils/Auth';
import { useState } from 'react';
import OrderContext from '../Context/OrderContext';

const Product = (props) => {
  const navigate = useNavigate()
  const [modal, setModal] = useState(false);
  let isAdmin = false;
  const [products, setproducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedCart, setSelectedCart] = useState({});
  const { setOrderItems } = useContext(OrderContext);
  
  const handleCartChange = (product, quantity) => {
    setSelectedCart(prev => ({
      ...prev,
      [product.productId]: { product, quantity }
    }));
  };

  const addProduct = () => {
    if(!document.getElementById("productName").value || !document.getElementById("manufacturingDate").value || !document.getElementById("expirationDate").value || !document.getElementById("price").value){
      alert("Please fill in all fields.");
      return;
    }
    axios({
        method: "post",
        url: `${import.meta.env.VITE_BASE_URL}/add`,
        params: {},
        data: {
          productName: document.getElementById("productName").value,
          manufacturingDate: document.getElementById("manufacturingDate").value,
          expirationDate: document.getElementById("expirationDate").value,
          price: document.getElementById("price").value
        },
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then((res) => {
        window.location.reload();
      }).catch((err) => {
        console.error(err);
        alert("Cannot add product/s.");
      });
  }

  const handleOrder = () => {
    const cartItems = Object.values(selectedCart)
      .filter(item => item.quantity > 0);
    setOrderItems(cartItems);
  }

  useEffect(() => {
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASE_URL}/products`,
      params: {},
      data: {},
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then((res) => {
      setproducts(res.data);
    }).catch((err) => {
      console.error(err);
    });
    
    axios({
      method: "get",
      url: `${import.meta.env.VITE_BASE_URL}/inventory`,
      params: {},
      data: {},
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then((res) => {
      setInventory(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  // Calculate cart total
  const cartTotal = Object.values(selectedCart)
    .filter(item => item.quantity > 0)
    .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const cartItemCount = Object.values(selectedCart)
    .filter(item => item.quantity > 0)
    .length;

  return isAuthenticated() ? (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {props.isAdmin ? "Management" : "Collection"}
              </span>
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-light text-slate-900">
                  {props.isAdmin ? "Admin" : "Premium"}
                </h1>
                <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">
                  {props.isAdmin ? "Panel" : "Products"}
                </h2>
              </div>
              {/* Signature Underline */}
              <div className="h-0.5 w-20 bg-emerald-600 mt-1" />
            </div>

            {/* Cart Summary for Users */}
            {!props.isAdmin && cartItemCount > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    Cart Total
                  </span>
                  <div className="text-xl font-bold text-slate-900">
                    ₹{cartTotal.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <Link to='order' 
                  onClick={handleOrder}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 ease-out flex items-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Order
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Action Bar */}
      {props.isAdmin && (
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                Managing <span className="font-bold text-slate-900">{products.length}</span> products
              </span>
            </div>
            <button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ease-out flex items-center gap-2 shadow-sm active:scale-[0.98]"
              onClick={() => setModal(true)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Modal */}
      {modal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Backdrop */}
          <div 
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
            onClick={() => setModal(false)}
          />
          
          {/* Modal Container */}
          <div className='relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200'>
            {/* Modal Header */}
            <div className='px-6 py-5 border-b border-slate-100 bg-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900'>Add New Product</h3>
                  <p className='text-sm text-slate-500 mt-0.5'>Create a new product in your inventory</p>
                </div>
                <button 
                  onClick={() => setModal(false)}
                  className='text-slate-400 hover:text-slate-600 transition-colors p-1'
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Form */}
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
                onClick={addProduct}
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

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {products.length > 0 ? (
          <>
            {/* Grid Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-900">{products.length}</span> products
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Sort by:</span>
                <button className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
                  Latest
                </button>
                <span>•</span>
                <button className="hover:text-emerald-600 transition-colors">
                  Price
                </button>
                <span>•</span>
                <button className="hover:text-emerald-600 transition-colors">
                  Name
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map(product => (
                <ProductItem 
                  isAdmin={props.isAdmin}
                  stock={inventory.find(item => item.productId === product.productId)?.quantity || 0}
                  key={product.productId} 
                  product={product} 
                  onCartChange={handleCartChange}
                />
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No products found</h3>
            <p className="text-slate-500 text-sm mb-4">Get started by adding your first product</p>
            {props.isAdmin && (
              <button 
                onClick={() => setModal(true)}
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
          <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-slate-500 mb-6">Please log in to access the product catalog</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg active:scale-[0.98]"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default Product; 
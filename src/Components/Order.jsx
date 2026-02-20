import React, { useContext, useState, useEffect } from 'react'
import OrderContext from '../Context/OrderContext'
import ProductItem from './ProductItem'
import { useNavigate, Link } from 'react-router-dom'
import Success from './Success'
import axios from 'axios'
import { getToken } from '../utils/Auth'
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Shield, Clock } from 'lucide-react'

const Order = () => {
  const navigate = useNavigate();
  const { orderItems } = useContext(OrderContext);
  const OrderItems = orderItems;
  const [data, setData] = useState({ items: [] });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const items = OrderItems.map((product) => ({
      productId: product.product.productId,
      quantity: product.quantity
    }));
    setData({ items });
  }, [OrderItems]);

  // Calculate order summary
  const subtotal = OrderItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
  
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  const handleorder = () => {
    setIsProcessing(true);
    console.log("Order Data:", data);
    axios({
        method: "post",
        url: `${import.meta.env.VITE_BASE_URL}/order`,
        params: {},
        data: data,
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then((res) => {
        console.log(res.data);
        navigate('/success');
      }).catch((err) => {
        console.error(err);
        alert("Insufficient quantity found for your product/s.");
        setIsProcessing(false);
      });
  }

  const handleContinueShopping = () => {
    navigate('/');
  }

  return (
    <>
      {console.log("Order Component", OrderItems)}
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={handleContinueShopping}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Continue Shopping</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column - Order Items */}
            <div className="flex-1">
              {/* Page Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} className="text-emerald-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Your Order</h1>
                  <p className="text-sm text-slate-500">
                    {OrderItems.length} {OrderItems.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>

              {/* Order Items Grid */}
              {OrderItems.length > 0 ? (
                <div className="space-y-4">
                  {OrderItems.map((product) => (
                    <div 
                      key={product.product.productId} 
                      className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                    >
                      <ProductItem 
                        product={product.product} 
                        quantity={product.quantity}
                      />
                    </div>
                  ))}

                  {/* Delivery Estimate Banner */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mt-4">
                    <Truck size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Estimated Delivery</p>
                      <p className="text-xs text-blue-600">
                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                    <ShoppingBag size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-slate-500 text-sm mb-6">Looks like you haven't added any items to your cart yet.</p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <ShoppingBag size={16} />
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            {OrderItems.length > 0 && (
              <div className="lg:w-96">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-24">
                  
                  {/* Summary Header */}
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                  </div>

                  {/* Summary Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-medium">FREE</span>
                      ) : (
                        <span className="font-medium text-slate-900">₹{shipping.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax (5%)</span>
                      <span className="font-medium text-slate-900">₹{tax.toFixed(2)}</span>
                    </div>

                    {shipping > 0 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs">
                        <p className="text-amber-800">
                          Add ₹{(500 - subtotal).toFixed(2)} more to get free shipping
                        </p>
                        <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2">
                          <div 
                            className="bg-emerald-600 h-1.5 rounded-full" 
                            style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-slate-900">Total</span>
                        <span className="text-2xl font-bold text-emerald-700">₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>
                    </div>

                    {/* Payment Methods */}
                    <div className="pt-4">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        Accepting
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                          Credit Card
                        </div>
                        <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                          Debit Card
                        </div>
                        <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                          UPI
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <button 
                        onClick={handleorder}
                        disabled={isProcessing}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} />
                            <span>Place Order</span>
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={handleContinueShopping}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-4 rounded-xl border-2 border-slate-200 transition-all duration-200 active:scale-[0.98]"
                      >
                        Continue Shopping
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Shield size={14} />
                        <span>Secure Payment</span>
                      </div>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Fast Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Order
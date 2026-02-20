import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getToken } from '../utils/Auth'
import OrderItem from './OrderItem'
import { Package, Clock, ShoppingBag, Search, Filter, ChevronDown } from 'lucide-react'

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        setIsLoading(true);
        axios({
            method: "get",
            url: `${import.meta.env.VITE_BASE_URL}/orders`,
            params: {},
            data: {},
            headers: { Authorization: `Bearer ${getToken()}` },
        }).then((res) => {
            console.log(res.data);
            setOrders(res.data);
            setIsLoading(false);
        }).catch((err) => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    // Filter and sort orders
    const filteredOrders = orders
        .filter(order => filterStatus === 'all' ? true : order.status === filterStatus)
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.orderDate) - new Date(a.orderDate);
            } else {
                return new Date(a.orderDate) - new Date(b.orderDate);
            }
        });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
    const totalSpent = orders.reduce((sum, order) => 
        sum + order.items.reduce((orderSum, item) => 
            orderSum + (item.price * item.quantity), 0
        ), 0
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-[1400px] mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Package size={24} className="text-emerald-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
                            <p className="text-sm text-slate-500">
                                View and track all your past orders
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-3">
                        <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5">
                            <p className="text-xs text-slate-500">Total Orders</p>
                            <p className="text-xl font-bold text-slate-900">{totalOrders}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5">
                            <p className="text-xs text-slate-500">Items</p>
                            <p className="text-xl font-bold text-slate-900">{totalItems}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5">
                            <p className="text-xs text-slate-500">Total Spent</p>
                            <p className="text-xl font-bold text-emerald-700">₹{totalSpent.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                {orders.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">Filter:</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setFilterStatus('all')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                            filterStatus === 'all' 
                                                ? 'bg-emerald-700 text-white shadow-sm' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button 
                                        onClick={() => setFilterStatus('delivered')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                            filterStatus === 'delivered' 
                                                ? 'bg-emerald-700 text-white shadow-sm' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        Delivered
                                    </button>
                                    <button 
                                        onClick={() => setFilterStatus('processing')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                            filterStatus === 'processing' 
                                                ? 'bg-emerald-700 text-white shadow-sm' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        Processing
                                    </button>
                                    <button 
                                        onClick={() => setFilterStatus('cancelled')}
                                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                            filterStatus === 'cancelled' 
                                                ? 'bg-red-600 text-white shadow-sm' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        Cancelled
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-600">Sort by:</span>
                                <div className="relative">
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-700 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">Loading your orders...</p>
                    </div>
                )}

                {/* Orders Grid */}
                {!isLoading && (
                    <>
                        {filteredOrders.length > 0 ? (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div 
                                        key={order.orderId} 
                                        className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                                    >
                                        <OrderItem orderId={order.orderId} order={order.items} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
                                    <Package size={40} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
                                <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
                                    {orders.length > 0 
                                        ? "No orders match your current filter criteria. Try adjusting your filters."
                                        : "You haven't placed any orders yet. Start shopping to see your order history here."}
                                </p>
                                {orders.length === 0 && (
                                    <button 
                                        onClick={() => window.location.href = '/'}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                                    >
                                        <ShoppingBag size={16} />
                                        Start Shopping
                                    </button>
                                )}
                                {orders.length > 0 && filterStatus !== 'all' && (
                                    <button 
                                        onClick={() => setFilterStatus('all')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderHistory
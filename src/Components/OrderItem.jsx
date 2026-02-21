// OrderItem.jsx
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Package, Calendar, Truck, CheckCircle, XCircle } from 'lucide-react'

const OrderItem = ({ orderId, date, order }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate order totals
    const itemCount = order.length;
    const subtotal = order.reduce((sum, item) => sum + (item.price), 0);

    // Trim nanoseconds (if present)
    let date1 = new Date(date.slice(0, 23));

    let formatted = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date1);

    // Mock status (you can replace with actual status from API)
    const status = order.status || 'processing'; // Example statuses: 'delivered', 'processing', 'cancelled'

    const statusConfig = {
        delivered: {
            color: 'bg-emerald-100 text-emerald-700',
            icon: CheckCircle,
            text: 'Delivered'
        },
        processing: {
            color: 'bg-amber-100 text-amber-700',
            icon: Truck,
            text: 'Processing'
        },
        cancelled: {
            color: 'bg-red-100 text-red-700',
            icon: XCircle,
            text: 'Cancelled'
        }
    };

    const StatusIcon = statusConfig[status].icon;

    return (
        <div className="w-full">
            {/* Order Header */}
            <div
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Order Info */}
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${status === 'delivered' ? 'bg-emerald-100' :
                            status === 'processing' ? 'bg-amber-100' : 'bg-red-100'
                            }`}>
                            <Package size={20} className={
                                status === 'delivered' ? 'text-emerald-700' :
                                    status === 'processing' ? 'text-amber-700' : 'text-red-700'
                            } />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-slate-900">Order #{orderId}</h3>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${statusConfig[status].color}`}>
                                    <StatusIcon size={12} />
                                    {statusConfig[status].text}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{formatted}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Package size={12} />
                                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Total & Expand */}
                    <div className="flex items-center gap-4 ml-14 md:ml-0">
                        <div className="text-right">
                            <p className="text-xs text-slate-500">Total Amount</p>
                            <p className="text-lg font-bold text-emerald-700">₹{subtotal.toFixed(2)}</p>
                        </div>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Order Details */}
            {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 p-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4">Order Items</h4>
                    <div className="space-y-3">
                        {order.map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Package size={20} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{item.productName || `Product #${item.productId}`}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900">₹{item.price / item.quantity}</p>
                                    <p className="text-xs text-slate-500">₹{(item.price).toFixed(2)} total</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium text-slate-900">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Shipping</span>
                            <span className="text-emerald-600 font-medium">FREE</span>
                        </div>
                        <div className="flex justify-between text-base font-bold mt-3 pt-3 border-t border-slate-200">
                            <span className="text-slate-900">Total</span>
                            <span className="text-emerald-700">₹{subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-1/2 flex justify-center gap-3 mt-4">
                        <button className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]">
                            Track Order
                        </button>

                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderItem
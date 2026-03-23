import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Package, Calendar, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

const OrderSuccessPage: React.FC = () => {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mb-8">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Order Confirmed!</h1>
        <p className="text-stone-500 text-lg">
          Thank you for your purchase, <span className="text-stone-900 font-bold">{lastOrder.name}</span>. Your seeds are being prepared for shipment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[40px] border border-stone-200 overflow-hidden shadow-xl shadow-stone-900/5"
      >
        <div className="bg-stone-50 p-8 border-b border-stone-200 flex flex-wrap justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Order Number</p>
            <p className="text-lg font-bold text-stone-900">{lastOrder.orderId}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Date</p>
            <p className="text-lg font-bold text-stone-900">{lastOrder.date}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-lg font-bold text-emerald-700">${lastOrder.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          {/* Items */}
          <div>
            <h3 className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs mb-6">
              <Package className="h-4 w-4 text-emerald-600" />
              Order Items
            </h3>
            <div className="space-y-4">
              {lastOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-stone-900">{item.name}</p>
                    <p className="text-xs text-stone-400">Quantity: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-stone-100">
            {/* Shipping */}
            <div>
              <h3 className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs mb-6">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Shipping Address
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {lastOrder.name}<br />
                {lastOrder.address}<br />
                {lastOrder.pincode}<br />
                Phone: {lastOrder.phone}
              </p>
            </div>

            {/* Delivery Info */}
            <div>
              <h3 className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs mb-6">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Estimated Delivery
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Your order will be delivered within 3-5 business days. You will receive a tracking link via SMS once it's dispatched.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/products"
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" /> Continue Shopping
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-8 py-4 bg-stone-100 text-stone-900 font-bold rounded-2xl hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
        >
          Back to Home <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

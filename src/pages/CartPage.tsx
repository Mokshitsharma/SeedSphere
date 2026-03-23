import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CartRecommendations from '../components/CartRecommendations';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-stone-900">Shopping Cart</h1>
        <span className="text-stone-500 font-medium">{totalItems} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="bg-stone-50 rounded-[40px] p-12 text-center border border-dashed border-stone-200">
              <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-stone-300" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
              <p className="text-stone-500 mb-8 max-w-xs mx-auto">
                Looks like you haven't added any seeds to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
              >
                Explore Seeds <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-stone-200 group"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <Link to={`/product/${item.id}`} className="text-lg font-bold text-stone-900 hover:text-emerald-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-stone-400 mt-1 uppercase tracking-wider font-bold">{item.category}</p>
                    <p className="text-emerald-700 font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-stone-50 rounded-xl p-1 border border-stone-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-stone-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-stone-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-stone-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-bold transition-colors pt-4"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] p-10 border border-stone-200 sticky top-28 shadow-xl shadow-stone-900/5">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                <span className="text-xl font-bold text-stone-900">Total</span>
                <span className="text-2xl font-bold text-emerald-700">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to={cart.length > 0 ? "/checkout" : "#"}
              className={`w-full py-5 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl ${
                cart.length > 0
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              }`}
              onClick={(e) => cart.length === 0 && e.preventDefault()}
            >
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-center text-xs text-stone-400 mt-6 font-medium uppercase tracking-widest">
              Secure Checkout Guaranteed
            </p>
          </div>
        </div>
      </div>
      
      <CartRecommendations />
    </div>
  );
};

export default CartPage;

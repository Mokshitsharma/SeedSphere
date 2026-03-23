import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <Heart className="h-10 w-10 text-rose-300" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-4">Your wishlist is empty</h1>
        <p className="text-stone-500 mb-10 max-w-sm mx-auto">
          Save items you love to your wishlist and they'll appear here!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all"
        >
          Explore Seeds <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-stone-900">My Wishlist</h1>
        <span className="text-stone-500 font-medium">{wishlist.length} items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {wishlist.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden hover:shadow-xl hover:shadow-stone-900/5 transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-rose-500 transition-colors shadow-sm"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-400 font-bold uppercase tracking-wider">{product.category}</p>
                  </div>
                  <span className="text-xl font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 mb-6">{product.description}</p>
                <div className="flex gap-3">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-grow py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl transition-all text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WishlistPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all hover:shadow-xl hover:shadow-emerald-900/5"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white rounded-full text-stone-900 hover:bg-emerald-600 hover:text-white transition-colors shadow-lg"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-white rounded-full text-stone-900 hover:bg-emerald-600 hover:text-white transition-colors shadow-lg"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-stone-900 rounded-md border border-stone-200">
            {product.category}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm ${
            active 
              ? 'bg-rose-500 text-white scale-110' 
              : 'bg-white/90 backdrop-blur-sm text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`h-4 w-4 ${active ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-5">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-stone-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="mt-4 flex items-center justify-between gap-4">
          <Link
            to={`/product/${product.id}`}
            className="flex-grow py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-900/10"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

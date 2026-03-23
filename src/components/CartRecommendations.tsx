import React from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

const CartRecommendations: React.FC = () => {
  const { cart } = useCart();

  // Filter out products already in the cart
  const cartItemIds = new Set(cart.map((item) => item.id));
  const recommendations = products
    .filter((product) => !cartItemIds.has(product.id))
    .sort(() => 0.5 - Math.random()) // Randomize
    .slice(0, 4); // Show 4 recommendations

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Recommended for You</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CartRecommendations;

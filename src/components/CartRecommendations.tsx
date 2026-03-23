import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

const CartRecommendations: React.FC = () => {
  const { cart } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const allProducts = await fetchProducts();
        const cartItemIds = new Set(cart.map((item) => item.id));
        const filtered = allProducts
          .filter((product) => !cartItemIds.has(product.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRecommendations(filtered);
      } catch (err) {
        console.error('Error loading recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRecommendations();
  }, [cart]);

  if (loading || recommendations.length === 0) return null;

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

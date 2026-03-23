import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Plus, Minus, Star, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const p = await fetchProductById(id);
        setProduct(p);
        
        if (p) {
          const all = await fetchProducts();
          setRelatedProducts(all.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-stone-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products" className="text-emerald-600 font-bold">Back to Products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-medium mb-12 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="aspect-square rounded-[40px] overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-stone-200 cursor-pointer hover:border-emerald-500 transition-all">
                <img
                  src={product.image}
                  alt={`${product.name} view ${i}`}
                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-stone-400 font-medium">(128 Customer Reviews)</span>
            </div>
            <p className="text-3xl font-bold text-emerald-700">₹{product.price.toFixed(2)}</p>
          </div>

          <p className="text-stone-600 leading-relaxed mb-10 text-lg">
            {product.description} Our seeds are tested for high germination rates and are 100% non-GMO. Perfect for both beginners and experienced gardeners.
          </p>

          <div className="space-y-8 mb-12">
            <div className="flex items-center gap-6">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-xs">Quantity</span>
              <div className="flex items-center bg-stone-100 rounded-2xl p-1 border border-stone-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white rounded-xl transition-colors text-stone-600"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-white rounded-xl transition-colors text-stone-600"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20"
            >
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-stone-900 uppercase tracking-tight">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-stone-900 uppercase tracking-tight">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <RefreshCw className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-stone-900 uppercase tracking-tight">Easy Returns</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-stone-900 mb-12">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

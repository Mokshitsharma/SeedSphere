import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../data/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);
  const categoryFilter = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Vegetables', 'Fruits', 'Flowers', 'Grains'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // Default newest (no change)
      });
  }, [categoryFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Our Collection</h1>
          <p className="text-stone-500">Discover {filteredProducts.length} premium seed varieties.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search seeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-12 pr-10 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-6 text-stone-900 font-bold uppercase tracking-wider text-xs">
              <Filter className="h-4 w-4" />
              Categories
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    categoryFilter === cat
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2">Need Help?</h4>
            <p className="text-xs text-emerald-800/70 leading-relaxed mb-4">
              Not sure which seeds are right for your climate? Our experts are here to help.
            </p>
            <button className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors">
              Contact Expert
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-stone-100 animate-pulse rounded-2xl aspect-[4/5]" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="bg-stone-100 p-6 rounded-full mb-6">
                <Search className="h-12 w-12 text-stone-300" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">No seeds found</h3>
              <p className="text-stone-500 max-w-xs">
                We couldn't find any products matching your current filters. Try adjusting them.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                }}
                className="mt-6 text-emerald-600 font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sprout, Droplets, Sun, Database } from 'lucide-react';
import { fetchProducts, seedProducts } from '../data/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  const handleSeed = async () => {
    if (window.confirm('Seed initial products to Firestore?')) {
      await seedProducts();
      window.location.reload();
    }
  };

  const categories = [
    { name: 'Vegetables', icon: <Sprout className="h-6 w-6" />, color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Fruits', icon: <Leaf className="h-6 w-6" />, color: 'bg-orange-100 text-orange-700' },
    { name: 'Flowers', icon: <Sun className="h-6 w-6" />, color: 'bg-rose-100 text-rose-700' },
    { name: 'Grains', icon: <Droplets className="h-6 w-6" />, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000"
            alt="Hero background"
            className="w-full h-full object-cover opacity-50 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-6">
              Premium Agriculture
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8">
              Premium Quality <span className="text-emerald-400">Seeds</span> for Every Garden.
            </h1>
            <p className="text-lg text-stone-300 mb-10 leading-relaxed max-w-lg">
              Discover our curated collection of non-GMO, high-yield seeds. From organic vegetables to vibrant flowers, we bring nature to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-emerald-900/20"
              >
                Shop Collection <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSeed}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all border border-white/20 flex items-center gap-2"
              >
                <Database className="h-5 w-5" /> Seed Database
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Browse by Category</h2>
            <p className="text-stone-500 max-w-md">Explore our diverse range of seeds categorized for your specific gardening needs.</p>
          </div>
          <Link to="/products" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${cat.name}`}
                className="group flex flex-col items-center p-8 bg-white border border-stone-200 rounded-3xl hover:border-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className={`p-5 rounded-2xl ${cat.color} mb-6 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-900">{cat.name}</h3>
                <span className="text-xs text-stone-400 mt-2 font-medium uppercase tracking-wider">Explore Collection</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Featured Seeds</h2>
            <p className="text-stone-500 max-w-md">Our hand-picked selection of the most popular and high-performing seeds this season.</p>
          </div>
          <Link to="/products" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Shop All <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-stone-100 animate-pulse rounded-2xl aspect-[4/5]" />
            ))
          ) : (
            featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] bg-emerald-900 overflow-hidden py-20 px-8 md:px-16">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
            <img
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"
              alt="Garden"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to start your dream garden?
            </h2>
            <p className="text-emerald-100/80 text-lg mb-10">
              Join thousands of happy growers. Get expert advice and premium seeds delivered to your door.
            </p>
            <Link
              to="/products"
              className="inline-flex px-10 py-5 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-colors shadow-2xl"
            >
              Start Growing Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

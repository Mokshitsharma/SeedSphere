import React, { useState } from 'react';
import { products as initialProducts, seedProducts } from '../data/products';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  X,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [products, setProducts] = useState(initialProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Orders
  const [orders] = useState([
    { id: 'ORD-7721', customer: 'Sarah Jenkins', date: '2024-03-18', total: 124.50, status: 'Completed' },
    { id: 'ORD-7722', customer: 'Michael Chen', date: '2024-03-18', total: 45.00, status: 'Processing' },
    { id: 'ORD-7723', customer: 'Emma Wilson', date: '2024-03-17', total: 89.20, status: 'Pending' },
  ]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSeedDatabase = async () => {
    if (window.confirm('This will seed the database with initial products. Continue?')) {
      setIsSeeding(true);
      try {
        await seedProducts();
        alert('Database seeded successfully! Please refresh to see changes.');
      } catch (err) {
        console.error('Error seeding database:', err);
        alert('Error seeding database. Check console.');
      } finally {
        setIsSeeding(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <div className="bg-emerald-600 p-1 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            Admin Panel
          </h2>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'overview' ? 'bg-emerald-50 text-emerald-600' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <TrendingUp className="h-5 w-5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'products' ? 'bg-emerald-50 text-emerald-600' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Package className="h-5 w-5" /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="h-5 w-5" /> Orders
          </button>
        </nav>
        <div className="p-4 border-t border-stone-100">
          <div className="bg-stone-900 rounded-2xl p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Logged in as</p>
            <p className="font-bold truncate">mokshitsharmalaptop@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Store Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="text-emerald-500 font-bold text-sm">+12%</span>
                </div>
                <p className="text-stone-500 font-bold text-sm uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-stone-900">$12,450.00</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <span className="text-blue-500 font-bold text-sm">+5%</span>
                </div>
                <p className="text-stone-500 font-bold text-sm uppercase tracking-wider mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold text-stone-900">1,284</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-purple-500 font-bold text-sm">+18%</span>
                </div>
                <p className="text-stone-500 font-bold text-sm uppercase tracking-wider mb-1">Active Customers</p>
                <h3 className="text-3xl font-bold text-stone-900">842</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-stone-900">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-emerald-600 font-bold text-sm">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-400 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-stone-900">{order.id}</td>
                        <td className="px-6 py-4 text-stone-600">{order.customer}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-stone-900">${order.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-stone-900">Product Catalog</h1>
              <div className="flex gap-4">
                <button 
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white font-bold rounded-2xl hover:bg-stone-900 transition-all shadow-lg shadow-stone-900/20 disabled:opacity-50"
                >
                  <Database className={`h-5 w-5 ${isSeeding ? 'animate-spin' : ''}`} /> 
                  {isSeeding ? 'Seeding...' : 'Seed Database'}
                </button>
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
                >
                  <Plus className="h-5 w-5" /> Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-400 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover border border-stone-200" referrerPolicy="no-referrer" />
                            <span className="font-bold text-stone-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Customer Orders</h1>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${
                      order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'Processing' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status === 'Completed' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900">{order.id}</h4>
                      <p className="text-sm text-stone-500">{order.customer} • {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-stone-900 mb-1">${order.total.toFixed(2)}</p>
                    <button className="text-xs font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Add Product Modal (Mock) */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingProduct(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-stone-900">Add New Product</h3>
                <button onClick={() => setIsAddingProduct(false)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Product Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="e.g. Organic Tomato Seeds" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Category</label>
                    <select className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                      <option>Vegetables</option>
                      <option>Fruits</option>
                      <option>Flowers</option>
                      <option>Grains</option>
                      <option>Herbs</option>
                      <option>Tools</option>
                      <option>Fertilizers</option>
                      <option>Pest Control</option>
                      <option>Pulses</option>
                      <option>Oilseeds</option>
                      <option>Spices</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Price ($)</label>
                    <input type="number" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea rows={3} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="Describe your product..." />
                </div>
                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20"
                >
                  Create Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

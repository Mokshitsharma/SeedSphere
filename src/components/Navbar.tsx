import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Leaf, Menu, X, Heart, LogIn, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAdmin = user?.email === 'mokshitsharmalaptop@gmail.com';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:bg-emerald-700 transition-colors">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">SeedSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.path ? 'text-emerald-600' : 'text-stone-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-2 border-l border-stone-200 pl-6">
              <Link to="/wishlist" className="relative p-2 text-stone-600 hover:text-rose-500 transition-colors">
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2 text-stone-600 hover:text-emerald-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <div className="ml-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors"
                    title={user.email || ''}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/wishlist" className="relative p-2 text-stone-600">
              <Heart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-stone-600">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-stone-600 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-4 text-base font-medium rounded-lg ${
                    location.pathname === link.path
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-4 text-base font-medium rounded-lg ${
                  location.pathname === '/wishlist'
                    ? 'bg-rose-50 text-rose-500'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                Wishlist ({wishlist.length})
              </Link>
              <div className="pt-4 border-t border-stone-100">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-4 text-base font-medium text-stone-600 hover:bg-stone-50 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout ({user.email})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-4 text-base font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login with Google</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

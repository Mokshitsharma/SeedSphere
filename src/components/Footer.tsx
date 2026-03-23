import React from 'react';
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-6">
              <Leaf className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold tracking-tight">SeedSphere</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Empowering growers since 1995. We provide the highest quality, non-GMO seeds for gardens of all sizes.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/" className="hover:text-emerald-500 transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-emerald-500 transition-colors">All Products</a></li>
              <li><a href="/cart" className="hover:text-emerald-500 transition-colors">Shopping Cart</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Categories</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/products?category=Vegetables" className="hover:text-emerald-500 transition-colors">Vegetables</a></li>
              <li><a href="/products?category=Fruits" className="hover:text-emerald-500 transition-colors">Fruits</a></li>
              <li><a href="/products?category=Flowers" className="hover:text-emerald-500 transition-colors">Flowers</a></li>
              <li><a href="/products?category=Grains" className="hover:text-emerald-500 transition-colors">Grains</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>hello@seedsphere.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>123 Garden Lane, Green Valley, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © 2026 SeedSphere. All rights reserved. Built for quality growers.
          </p>
          <div className="flex gap-6">
            <Facebook className="h-5 w-5 hover:text-emerald-500 cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 hover:text-emerald-500 cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 hover:text-emerald-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

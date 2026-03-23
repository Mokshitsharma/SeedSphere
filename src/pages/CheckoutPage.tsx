import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart, setLastOrder } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Create Order on Backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, customer: formData }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');
      const { orderId, amount, currency } = await orderResponse.json();

      // 2. Load Razorpay Script
      const loadScript = (src: string) => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsSubmitting(false);
        return;
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_placeholder', // This should be your RAZORPAY_KEY_ID from env, but for frontend we use a public key or placeholder
        amount: amount,
        currency: currency,
        name: "SeedSphere",
        description: "Premium Seed Purchase",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // 4. Verify Payment on Backend
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                customer: formData,
                items: cart,
                amount: totalPrice
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              const orderDetails = {
                ...formData,
                items: [...cart],
                total: totalPrice,
                orderId: verifyData.orderId,
                date: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              };

              setLastOrder(orderDetails);
              clearCart();
              navigate('/order-success');
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Something went wrong during verification');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: "#059669",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-bold mb-12 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-stone-900 mb-8">Shipping Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Phone Number</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Shipping Address</label>
              <textarea
                required
                name="address"
                rows={4}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, Apartment, Suite, etc."
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Pincode / Zip Code</label>
              <input
                required
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="10001"
                className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="pt-6">
              <div className="bg-stone-100 rounded-3xl p-8 border border-stone-200 mb-8">
                <div className="flex items-center gap-4 mb-4 text-stone-900 font-bold">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Payment Method
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">
                  For this demo, we only support <strong>Cash on Delivery</strong>. Your order will be processed immediately.
                </p>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className={`w-full py-5 bg-stone-900 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-900/20 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-stone-800'
                }`}
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Lock className="h-5 w-5" /> Pay & Place Order
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] p-10 border border-stone-200 sticky top-28">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Order Summary</h2>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-stone-400 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-stone-100">
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Subtotal</span>
                <span>₹{(totalPrice - (totalPrice > 500 ? 0 : 50)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">{totalPrice > 500 ? 'FREE' : '₹50.00'}</span>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-stone-900">Total</span>
                <span className="text-2xl font-bold text-emerald-700">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider leading-tight">
                Your data is protected by industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

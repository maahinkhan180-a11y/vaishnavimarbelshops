import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';
import { whatsappEnquiry } from '@/lib/whatsapp';

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('display_order')
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      {/* Trust badges */}
      <div className="border-b border-stone-700">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-stone-400" size={28} />
            <div>
              <p className="text-sm font-semibold text-white">Secure Packaging</p>
              <p className="text-xs text-stone-400">Safe & damage-proof</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="text-stone-400" size={28} />
            <div>
              <p className="text-sm font-semibold text-white">Fast Delivery</p>
              <p className="text-xs text-stone-400">Pan-India shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="text-stone-400" size={28} />
            <div>
              <p className="text-sm font-semibold text-white">Easy Returns</p>
              <p className="text-xs text-stone-400">7-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Headphones className="text-stone-400" size={28} />
            <div>
              <p className="text-sm font-semibold text-white">Customer Support</p>
              <p className="text-xs text-stone-400">Mon-Sat, 9am-7pm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/logo.jpeg" alt="Vaishnavi Marble" className="w-10 h-10 rounded-lg object-cover" />
            <h3 className="text-white font-bold text-lg">Vaishnavi Marble</h3>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed">
            The leading destination for exquisite marble in Kolkata. Tiles, sanitaryware, kitchen sinks, vanities, parking tiles, marble statues, mandirs, marble & granite.
          </p>
          {/* Social Media Icons */}
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://facebook.com/vaishnavimarble"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
            >
              <Facebook size={18} className="text-white" />
            </a>
            <a
              href="https://instagram.com/vaishnavimarble"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
            >
              <Instagram size={18} className="text-white" />
            </a>
            <a
              href="https://youtube.com/@vaishnavimarble"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-red-600 flex items-center justify-center transition-colors"
            >
              <Youtube size={18} className="text-white" />
            </a>
            <a
              href={whatsappEnquiry('I have a general enquiry about your products.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-green-600 flex items-center justify-center transition-colors"
            >
              <MessageCircle size={18} className="text-white" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Categories</h4>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
          <ul className="space-y-2">
            <li><button onClick={() => navigate('/')} className="text-sm text-stone-400 hover:text-white transition-colors">Home</button></li>
            <li><button onClick={() => navigate('/cart')} className="text-sm text-stone-400 hover:text-white transition-colors">Cart</button></li>
            <li><button onClick={() => navigate('/admin')} className="text-sm text-stone-400 hover:text-white transition-colors">Admin Login</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Address & Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-stone-400">
              <MapPin size={16} className="mt-0.5 shrink-0" /> Krishnapur Taruliya Main Road (near Chanchal Kumari Girls High School), Sonartari Apartment, P.S. New Town, Kolkata - 700102
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-400">
              <Phone size={16} /> +91 93303 00408
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-400">
              <Phone size={16} /> +91 98363 44786
            </li>
            <li>
              <a href={whatsappEnquiry('I have a general enquiry about your products.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors">
                <MessageCircle size={16} /> WhatsApp: +91 70039 48297
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-stone-400">
              <Mail size={16} /> marblevaishnavi@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-700">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} Vaishnavi Marble. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

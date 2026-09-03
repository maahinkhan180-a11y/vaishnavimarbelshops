import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Home, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { navigate } from '@/lib/router';
import type { Category } from '@/types';
import { supabase } from '@/lib/supabase';
import { whatsappEnquiry } from '@/lib/whatsapp';

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('display_order')
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-stone-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 font-bold text-lg text-stone-800 hover:text-stone-900 transition-colors"
            >
              <img src="/logo.jpeg" alt="Vaishnavi Marble" className="w-10 h-10 rounded-lg object-cover" />
              <span className="hidden sm:inline">Vaishnavi Marble</span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-5">
            <button
              onClick={() => navigate('/')}
              className="text-stone-700 hover:text-stone-900 font-medium text-sm transition-colors flex items-center gap-1"
            >
              <Home size={16} /> Home
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="text-stone-700 hover:text-stone-900 font-medium text-sm transition-colors"
              >
                {cat.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-40 lg:w-56 pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700 focus:border-transparent"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </form>
            <a
              href={whatsappEnquiry('I have a general enquiry about your products.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={24} />
            </a>
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-stone-700 hover:text-stone-900 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-stone-200">
            <form onSubmit={handleSearch} className="mt-3 mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </form>
            <button
              onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-stone-700 font-medium"
            >
              Home
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { navigate(`/category/${cat.slug}`); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-stone-700 font-medium"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

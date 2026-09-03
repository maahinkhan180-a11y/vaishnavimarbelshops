import { useState, useEffect } from 'react';
import { ArrowRight, Star, TrendingUp, Package, Award, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import type { Category, Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { whatsappEnquiry } from '@/lib/whatsapp';

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('products').select('*').eq('is_featured', true).order('display_order').limit(8),
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data ?? []);
      setFeaturedProducts(prodRes.data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* Category Carousel - right after navbar */}
      <section>
        <CategoryCarousel categories={categories} />
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/6634141/pexels-photo-6634141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Marble background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-amber-400 font-medium text-sm tracking-wider uppercase mb-3">Kolkata's Leading Marble Destination</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              Vaishnavi Marble
            </h1>
            <p className="text-stone-300 text-lg mb-8 max-w-xl">
              Premium tiles, sanitaryware, kitchen sinks, vanities, parking tiles, marble statues, mandirs, marble & granite. Exquisite craftsmanship at the best prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/category/marble-statues')}
                className="bg-white text-stone-900 px-6 py-3 rounded-lg font-semibold hover:bg-stone-100 transition-colors flex items-center gap-2"
              >
                Shop Marble Statues <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/category/tiles')}
                className="border border-stone-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors"
              >
                Shop Tiles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Package className="text-stone-700" size={32} />
            <div>
              <p className="text-2xl font-bold text-stone-800">90+</p>
              <p className="text-xs text-stone-500">Products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="text-stone-700" size={32} />
            <div>
              <p className="text-2xl font-bold text-stone-800">8</p>
              <p className="text-xs text-stone-500">Categories</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="text-stone-700" size={32} />
            <div>
              <p className="text-2xl font-bold text-stone-800">29+</p>
              <p className="text-xs text-stone-500">Subcategories</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="text-stone-700" size={32} />
            <div>
              <p className="text-2xl font-bold text-stone-800">4.5+</p>
              <p className="text-xs text-stone-500">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-stone-800 mb-2">Shop by Category</h2>
          <p className="text-stone-500">Explore our wide range of quality products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 hover:shadow-lg transition-all"
            >
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <h3 className="text-white font-semibold text-xs">{cat.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">Featured Products</h2>
              <p className="text-stone-500 mt-1">Handpicked premium products for you</p>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-stone-800 rounded-2xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Need Bulk or Wholesale Enquiry?</h2>
          <p className="text-stone-300 mb-6 max-w-2xl mx-auto">
            Get special pricing on bulk orders. Contact our team for personalized quotes on large quantity purchases.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+919330300408"
              className="inline-block bg-white text-stone-900 px-8 py-3 rounded-lg font-semibold hover:bg-stone-100 transition-colors"
            >
              Call +91 93303 00408
            </a>
            <a
              href={whatsappEnquiry('I would like to enquire about bulk/wholesale pricing.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

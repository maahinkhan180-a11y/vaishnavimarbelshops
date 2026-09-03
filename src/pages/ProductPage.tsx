import { useState, useEffect } from 'react';
import { Star, Minus, Plus, ShoppingCart, Check, Truck, ShieldCheck, RefreshCw, Headphones, ChevronRight, Zap, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import { useCart } from '@/context/CartContext';
import type { Product, Subcategory, Category } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { whatsappProductOrder } from '@/lib/whatsapp';

export function ProductPage({ productSlug }: { productSlug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setAddedToCart(false);

    supabase
      .from('products')
      .select('*')
      .eq('slug', productSlug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) {
          setLoading(false);
          return;
        }
        setProduct(data);

        const { data: sub } = await supabase
          .from('subcategories')
          .select('*')
          .eq('id', data.subcategory_id)
          .maybeSingle();

        if (sub) {
          setSubcategory(sub);
          const { data: cat } = await supabase
            .from('categories')
            .select('*')
            .eq('id', sub.category_id)
            .maybeSingle();
          setCategory(cat);

          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('subcategory_id', sub.id)
            .neq('id', data.id)
            .order('display_order')
            .limit(4);
          setRelatedProducts(related ?? []);
        }

        setLoading(false);
      });
  }, [productSlug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleWhatsAppOrder = () => {
    if (product) {
      window.open(whatsappProductOrder(product.name, `Rs. ${product.price.toLocaleString('en-IN')}`, quantity), '_blank');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-stone-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4" />
              <div className="h-6 bg-stone-200 rounded w-1/2" />
              <div className="h-32 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-stone-500">Product not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-stone-700 underline">Back to Home</button>
      </div>
    );
  }

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-stone-500 mb-6 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-stone-700">Home</button>
        <ChevronRight size={14} />
        {category && (
          <>
            <button onClick={() => navigate(`/category/${category.slug}`)} className="hover:text-stone-700">{category.name}</button>
            <ChevronRight size={14} />
          </>
        )}
        {subcategory && (
          <>
            <button onClick={() => navigate(`/category/${category?.slug}/sub/${subcategory.slug}`)} className="hover:text-stone-700">{subcategory.name}</button>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-stone-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
            )}
          </div>
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-stone-500 mb-1">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  size={18}
                  className={i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-stone-600">{product.rating.toFixed(1)}</span>
            <span className="text-stone-300">|</span>
            <span className={`text-sm font-medium ${product.stock_status === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock_status}
            </span>
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-stone-900">Rs. {product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="text-lg text-stone-400 line-through">Rs. {product.mrp.toLocaleString('en-IN')}</span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-green-600">{discount}% OFF</span>
            )}
          </div>
          <p className="text-sm text-stone-500 mb-6">Per Box (Inclusive of all taxes)</p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-stone-700">Quantity:</span>
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-stone-600 hover:bg-stone-100"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-2 text-stone-600 hover:bg-stone-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status !== 'In Stock'}
              className="flex-1 border border-stone-800 text-stone-800 py-3 rounded-lg font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addedToCart ? <><Check size={20} /> Added!</> : <><ShoppingCart size={20} /> Add to Cart</>}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock_status !== 'In Stock'}
              className="flex-1 bg-stone-800 text-white py-3 rounded-lg font-semibold hover:bg-stone-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={20} /> Buy Now
            </button>
          </div>

          {/* WhatsApp Order */}
          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <MessageCircle size={20} /> Order on WhatsApp
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Truck size={20} className="text-stone-500" /> Delivery Available
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <ShieldCheck size={20} className="text-stone-500" /> Secure Packaging
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <RefreshCw size={20} className="text-stone-500" /> Easy Returns
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Headphones size={20} className="text-stone-500" /> Customer Support
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Specifications</h2>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <tbody>
              {Object.entries(product.specs).map(([key, value], idx) => (
                <tr key={key} className={idx % 2 === 0 ? 'bg-stone-50' : ''}>
                  <td className="py-3 px-4 text-sm font-medium text-stone-700 w-1/3">{key}</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{value}</td>
                </tr>
              ))}
              {product.size && (
                <tr className={Object.keys(product.specs).length % 2 === 0 ? 'bg-stone-50' : ''}>
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Size</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.size}</td>
                </tr>
              )}
              {product.thickness && (
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Thickness</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.thickness}</td>
                </tr>
              )}
              {product.finish && (
                <tr className="bg-stone-50">
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Finish</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.finish}</td>
                </tr>
              )}
              {product.color && (
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Color</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.color}</td>
                </tr>
              )}
              {product.design && (
                <tr className="bg-stone-50">
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Design</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.design}</td>
                </tr>
              )}
              {product.coverage_per_box && (
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Coverage per Box</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.coverage_per_box}</td>
                </tr>
              )}
              {product.pieces_per_box && (
                <tr className="bg-stone-50">
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Pieces per Box</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.pieces_per_box}</td>
                </tr>
              )}
              {product.suitable_for && (
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-stone-700">Suitable For</td>
                  <td className="py-3 px-4 text-sm text-stone-600">{product.suitable_for}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

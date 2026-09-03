import { useState, useEffect } from 'react';
import { Lock, Mail, LogOut, Plus, Pencil, Trash2, X, Package, Layers, Tag, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import type { Category, Subcategory, Product } from '@/types';

export function AdminPage() {
  const { session, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-stone-400">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <AdminLogin signIn={signIn} />;
  }

  return <AdminDashboard signOut={signOut} />;
}

function AdminLogin({ signIn }: { signIn: (email: string, password: string) => Promise<{ error: string | null }> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Admin Login</h1>
            <p className="text-stone-500 text-sm mt-1">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="marblevaishnavi@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-stone-800 text-white py-3 rounded-lg font-semibold hover:bg-stone-900 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full text-sm text-stone-500 hover:text-stone-700 mt-4 flex items-center justify-center gap-1"
          >
            <ArrowLeft size={14} /> Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ signOut }: { signOut: () => Promise<void> }) {
  const [tab, setTab] = useState<'products' | 'categories' | 'subcategories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [prodRes, catRes, subRes] = await Promise.all([
      supabase.from('products').select('*').order('display_order'),
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('subcategories').select('*').order('display_order'),
    ]);
    setProducts(prodRes.data ?? []);
    setCategories(catRes.data ?? []);
    setSubcategories(subRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? All subcategories and products under it will also be deleted.')) return;
    await supabase.from('categories').delete().eq('id', id);
    loadData();
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Delete this subcategory? All products under it will also be deleted.')) return;
    await supabase.from('subcategories').delete().eq('id', id);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-500 text-sm">Manage your store catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-sm text-stone-600 hover:text-stone-900">View Store</button>
          <button onClick={signOut} className="flex items-center gap-1.5 text-sm bg-stone-100 text-stone-700 px-3 py-2 rounded-lg hover:bg-stone-200">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <Package className="text-stone-700" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{products.length}</p>
            <p className="text-xs text-stone-500">Products</p>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <Layers className="text-stone-700" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{categories.length}</p>
            <p className="text-xs text-stone-500">Categories</p>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <Tag className="text-stone-700" size={28} />
          <div>
            <p className="text-2xl font-bold text-stone-800">{subcategories.length}</p>
            <p className="text-xs text-stone-500">Subcategories</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-stone-200 overflow-x-auto">
        {(['products', 'categories', 'subcategories'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-stone-800 text-stone-800' : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-stone-400 text-center py-10">Loading...</p>
      ) : tab === 'products' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-stone-500">{products.length} products</p>
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="flex items-center gap-1.5 bg-stone-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-900"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Product</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Brand</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Price</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Stock</th>
                    <th className="text-right text-xs font-semibold text-stone-600 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                          </div>
                          <span className="text-sm font-medium text-stone-700 line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">{p.brand}</td>
                      <td className="px-4 py-3 text-sm font-medium text-stone-800">Rs. {p.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-medium ${p.stock_status === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
                          {p.stock_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                            className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : tab === 'categories' ? (
        <div>
          <p className="text-sm text-stone-500 mb-4">{categories.length} categories</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800 text-sm">{cat.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1">{cat.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-stone-500 mb-4">{subcategories.length} subcategories</p>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3">Subcategory</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-xs font-semibold text-stone-600 px-4 py-3 hidden md:table-cell">Products</th>
                    <th className="text-right text-xs font-semibold text-stone-600 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subcategories.map(sub => {
                    const parentCat = categories.find(c => c.id === sub.category_id);
                    const productCount = products.filter(p => p.subcategory_id === sub.id).length;
                    return (
                      <tr key={sub.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 text-sm font-medium text-stone-700">{sub.name}</td>
                        <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">{parentCat?.name ?? '-'}</td>
                        <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">{productCount}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteSubcategory(sub.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          subcategories={subcategories}
          categories={categories}
          onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowProductForm(false); setEditingProduct(null); loadData(); }}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  subcategories,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  subcategories: Subcategory[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    image_url: product?.image_url ?? '',
    brand: product?.brand ?? '',
    material: product?.material ?? '',
    size: product?.size ?? '',
    thickness: product?.thickness ?? '',
    finish: product?.finish ?? '',
    color: product?.color ?? '',
    design: product?.design ?? '',
    coverage_per_box: product?.coverage_per_box ?? '',
    pieces_per_box: product?.pieces_per_box ?? '',
    suitable_for: product?.suitable_for ?? '',
    price: product?.price.toString() ?? '',
    mrp: product?.mrp.toString() ?? '',
    stock_status: product?.stock_status ?? 'In Stock',
    rating: product?.rating.toString() ?? '4.0',
    is_featured: product?.is_featured ?? false,
    display_order: product?.display_order.toString() ?? '0',
    subcategory_id: product?.subcategory_id ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSubs = subcategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.subcategory_id) {
      setError('Please select a subcategory');
      setSaving(false);
      return;
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const payload = {
      ...formData,
      slug,
      price: parseFloat(formData.price) || 0,
      mrp: parseFloat(formData.mrp) || 0,
      rating: parseFloat(formData.rating) || 4.0,
      display_order: parseInt(formData.display_order) || 0,
      is_featured: formData.is_featured,
    };

    let result;
    if (product) {
      result = await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      result = await supabase.from('products').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSaved();
    }
  };

  const update = (field: string, value: string | boolean) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => update('name', e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slug (auto if empty)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => update('slug', e.target.value)}
                placeholder="auto-generated"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => update('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={e => update('image_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Subcategory *</label>
            <select
              value={formData.subcategory_id}
              onChange={e => update('subcategory_id', e.target.value)}
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
            >
              <option value="">Select subcategory</option>
              {categories.map(cat => (
                <optgroup key={cat.id} label={cat.name}>
                  {filteredSubs.filter(s => s.category_id === cat.id).map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Brand</label>
              <input type="text" value={formData.brand} onChange={e => update('brand', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Material</label>
              <input type="text" value={formData.material} onChange={e => update('material', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Size</label>
              <input type="text" value={formData.size} onChange={e => update('size', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Thickness</label>
              <input type="text" value={formData.thickness} onChange={e => update('thickness', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Finish</label>
              <input type="text" value={formData.finish} onChange={e => update('finish', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Color</label>
              <input type="text" value={formData.color} onChange={e => update('color', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Design</label>
              <input type="text" value={formData.design} onChange={e => update('design', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Coverage/Box</label>
              <input type="text" value={formData.coverage_per_box} onChange={e => update('coverage_per_box', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Pieces/Box</label>
              <input type="text" value={formData.pieces_per_box} onChange={e => update('pieces_per_box', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Suitable For</label>
            <input type="text" value={formData.suitable_for} onChange={e => update('suitable_for', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price *</label>
              <input type="number" step="0.01" value={formData.price} onChange={e => update('price', e.target.value)} required className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">MRP</label>
              <input type="number" step="0.01" value={formData.mrp} onChange={e => update('mrp', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => update('rating', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Display Order</label>
              <input type="number" value={formData.display_order} onChange={e => update('display_order', e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Stock Status</label>
              <select
                value={formData.stock_status}
                onChange={e => update('stock_status', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-700"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => update('is_featured', e.target.checked)}
                  className="rounded border-stone-300 text-stone-800 focus:ring-stone-700"
                />
                <span className="text-sm font-medium text-stone-700">Featured Product</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-lg font-medium hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-stone-800 text-white py-2.5 rounded-lg font-medium hover:bg-stone-900 disabled:opacity-50">
              {saving ? 'Saving...' : product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

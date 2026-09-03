import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { navigate } from '@/lib/router';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="font-bold text-lg text-stone-800 flex items-center gap-2">
            <ShoppingBag size={20} /> Cart ({totalItems})
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-stone-700">
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400 gap-3">
            <ShoppingBag size={48} />
            <p className="text-sm">Your cart is empty</p>
            <button
              onClick={() => { setIsOpen(false); navigate('/'); }}
              className="text-sm font-medium text-stone-700 hover:text-stone-900 underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 border-b border-stone-100 pb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {item.product.image_url && (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-stone-800 line-clamp-2">{item.product.name}</h3>
                    <p className="text-xs text-stone-500">{item.product.brand}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-stone-900">
                        Rs. {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 text-sm">Total ({totalItems} items)</span>
                <span className="text-xl font-bold text-stone-900">
                  Rs. {totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => { setIsOpen(false); navigate('/cart'); }}
                className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium hover:bg-stone-900 transition-colors"
              >
                View Cart & Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Barcode, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Phone, 
  DollarSign, 
  Receipt,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Header } from '../components/Header';
import { PrintModal } from '../components/PrintModal';
import { useApp } from '../context/AppContext';
import { Product, CartItem, SaleInvoice } from '../types';

export const POSSell: React.FC = () => {
  const navigate = useNavigate();
  const { products, dues, addSale, user, activeShop, printerConfig } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'cart' | 'checkout'>('cart');

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Due'>('Cash');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Print Modal
  const [completedSale, setCompletedSale] = useState<SaleInvoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      p => p.name.toLowerCase().includes(q) ||
           (p.barcode && p.barcode.toLowerCase().includes(q)) ||
           (p.brand && p.brand.toLowerCase().includes(q)) ||
           (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, rate: product.sellingPrice }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const updateRate = (productId: string, rate: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, rate } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const grandTotal = Math.max(0, subtotal - discount);
  const calculatedPaid = paidAmount === '' ? grandTotal : Math.max(0, Number(paidAmount) || 0);
  const dueAmount = Math.max(0, grandTotal - calculatedPaid);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setPaidAmount(grandTotal.toString());
    setView('checkout');
  };

  const handleConfirmSale = async () => {
    if (cart.length === 0 || !activeShop) return;

    setIsSubmitting(true);
    try {
      const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const saleData = {
        invoiceNo,
        date: today,
        time,
        customerName: customerName.trim() || 'Walk-in Customer',
        customerPhone: customerPhone.trim(),
        items: cart.map(c => ({
          productId: c.product.id,
          productName: c.product.name,
          unit: c.product.unit || 'pcs',
          quantity: c.quantity,
          rate: c.rate,
          purchasePrice: c.product.purchasePrice || 0,
          total: c.quantity * c.rate
        })),
        subtotal,
        discount,
        tax: 0,
        grandTotal,
        paidAmount: calculatedPaid,
        dueAmount,
        paymentMethod: dueAmount === grandTotal ? 'Due' : paymentMethod,
        sellerPhone: user?.phone || '',
        shopId: activeShop.id,
        status: 'Completed' as const
      };

      const invoiceId = await addSale(saleData);

      const savedSale: SaleInvoice = {
        ...saleData,
        id: invoiceId,
        createdAt: Date.now()
      };

      setCompletedSale(savedSale);
      setIsPrintModalOpen(true);

      // Reset Form
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDiscount(0);
      setPaidAmount('');
      setView('cart');
    } catch (e) {
      console.error(e);
      alert('Error creating sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Header */}
      <Header
        title={view === 'cart' ? 'Point of Sale (Sell)' : 'Confirm & Bill'}
        showBack={true}
      />

      {view === 'cart' ? (
        <div className="max-w-lg mx-auto w-full p-4 flex-1 flex flex-col pb-28">
          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, brand, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:border-forest-600 transition"
              />
            </div>
            <button
              onClick={() => {
                const code = prompt('Enter or scan barcode:');
                if (code) {
                  const found = products.find(p => p.barcode === code.trim());
                  if (found) addToCart(found);
                  else alert('No product found with barcode ' + code);
                }
              }}
              className="px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition"
              title="Scan Barcode"
            >
              <Barcode size={22} />
            </button>
          </div>

          {/* Product Cards List */}
          <div className="flex-1 overflow-y-auto space-y-2.5">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
                <ShoppingBag size={36} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold">No Products Available</p>
                <p className="text-xs text-slate-400 mt-1">Add items in Stock Book or change search term</p>
                <button
                  onClick={() => navigate('/stock-book')}
                  className="mt-3 px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Add Product
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const cartItem = cart.find(c => c.product.id === product.id);
                const isInCart = Boolean(cartItem);

                return (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`bg-white p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm active:scale-[0.99] ${
                      isInCart ? 'border-forest-600 ring-2 ring-forest-500/10 bg-forest-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-forest-700 font-extrabold shrink-0">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate flex-1">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{product.name}</h4>
                        {product.brand && (
                          <span className="text-[10px] text-forest-700 font-semibold block">{product.brand}</span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-slate-900 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/50">
                            ৳{product.sellingPrice}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Stock: <strong className={product.stock <= (product.minStockAlert || 5) ? 'text-rose-600' : 'text-slate-600'}>{product.stock}</strong> {product.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isInCart ? (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="flex items-center gap-1.5 bg-forest-700 text-white px-2 py-1 rounded-xl shadow"
                        >
                          <button
                            onClick={() => updateQuantity(product.id, cartItem!.quantity - 1)}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold px-1">{cartItem!.quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, cartItem!.quantity + 1)}
                            className="p-1 hover:bg-white/20 rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-forest-700 hover:text-white text-slate-600 flex items-center justify-center transition">
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Sticky Checkout Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-2xl max-w-lg mx-auto flex items-center justify-between rounded-t-3xl">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Cart Value
              </span>
              <div className="text-lg font-black text-forest-700">
                ৳{subtotal} <span className="text-xs font-semibold text-slate-500">({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={cart.length === 0}
              className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
                cart.length > 0
                  ? 'bg-gradient-to-r from-forest-700 to-forest-900 text-white shadow-forest-900/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Checkout View */
        <div className="max-w-lg mx-auto w-full p-4 flex-1 flex flex-col pb-12 space-y-4">
          {/* Customer Details Form */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Customer Information (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Customer Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Walk-in Customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile / Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Item Rates Adjustment */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Review Cart Items
            </h3>
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400">Qty: {item.quantity} {item.product.unit}</span>
                      <span className="text-[11px] font-bold text-slate-600">@ ৳{item.rate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateRate(item.product.id, Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right text-forest-700"
                    />
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment & Discount
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Discount (৳)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={discount || ''}
                  onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-forest-700 focus:outline-none focus:border-forest-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Paid Amount (৳)</label>
                <input
                  type="number"
                  placeholder={grandTotal.toString()}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-forest-600"
                />
              </div>
            </div>

            {/* Payment Mode Pills */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Payment Mode</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['Cash', 'bKash', 'Nagad', 'Bank', 'Due'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      paymentMethod === method
                        ? 'bg-forest-700 text-white border-forest-700 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Bill Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">৳{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>৳{grandTotal}</span>
              </div>
              {dueAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold pt-1">
                  <span>Customer Due:</span>
                  <span>৳{dueAmount}</span>
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setView('cart')}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition"
              >
                Back to Cart
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSale}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-700/20 active:scale-98 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Complete Sale & Print</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Thermal Modal */}
      <PrintModal
        sale={completedSale}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};

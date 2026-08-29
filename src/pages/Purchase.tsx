import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Check, ShoppingCart, Truck, Calendar } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { Product, PurchaseItem } from '../types';

export const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const { products, addPurchase, activeShop } = useApp();

  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [billNo, setBillNo] = useState(`BILL-${Date.now().toString().slice(-6)}`);
  
  // Selected items
  const [items, setItems] = useState<PurchaseItem[]>([]);
  
  // Add item inputs
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customName, setCustomName] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [qty, setQty] = useState<number>(1);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);

  // Bill payment
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Due'>('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (prodId === 'new') {
      setCustomName('');
      setCostPrice(0);
      setSellingPrice(0);
      setUnit('pcs');
    } else {
      const prod = products.find(p => p.id === prodId);
      if (prod) {
        setCustomName(prod.name);
        setCostPrice(prod.purchasePrice || 0);
        setSellingPrice(prod.sellingPrice || 0);
        setUnit(prod.unit || 'pcs');
      }
    }
  };

  const handleAddItem = () => {
    if (!customName.trim() || qty <= 0 || costPrice < 0) {
      alert('Please enter item name, valid quantity and cost price.');
      return;
    }

    const newItem: PurchaseItem = {
      productId: selectedProductId === 'new' ? '' : selectedProductId,
      productName: customName.trim(),
      unit,
      quantity: qty,
      costPrice,
      sellingPrice,
      total: qty * costPrice
    };

    setItems([...items, newItem]);
    
    // Reset item form
    setSelectedProductId('');
    setCustomName('');
    setQty(1);
    setCostPrice(0);
    setSellingPrice(0);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = Math.max(0, subtotal - discount);
  const calculatedPaid = paidAmount === '' ? grandTotal : Math.max(0, Number(paidAmount) || 0);
  const dueAmount = Math.max(0, grandTotal - calculatedPaid);

  const handleSavePurchase = async () => {
    if (items.length === 0 || !activeShop) {
      alert('Please add at least one item to purchase.');
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await addPurchase({
        billNo,
        date: today,
        time,
        supplierName: supplierName.trim() || 'General Supplier',
        supplierPhone: supplierPhone.trim(),
        items,
        subtotal,
        discount,
        grandTotal,
        paidAmount: calculatedPaid,
        dueAmount,
        paymentMethod: dueAmount === grandTotal ? 'Due' : paymentMethod,
        shopId: activeShop.id
      });

      alert('Purchase bill saved and inventory updated successfully!');
      navigate('/purchase-book');
    } catch (e) {
      console.error(e);
      alert('Failed to save purchase bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Purchase Entry (Stock In)" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Bill & Supplier Meta */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Bill / Memo No</label>
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-forest-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Supplier Mobile</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Supplier / Vendor Name</label>
            <input
              type="text"
              placeholder="e.g. Meghna Group / Distributor"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            />
          </div>
        </div>

        {/* Add Items Box */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingCart size={15} className="text-forest-700" />
            <span>Add Products to Bill</span>
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select from Existing Products</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            >
              <option value="">-- Choose Existing Product or Create New --</option>
              <option value="new">+ Enter New Product Name</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Product Name *</label>
            <input
              type="text"
              placeholder="Product Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Purchase Cost</label>
              <input
                type="number"
                placeholder="0"
                value={costPrice || ''}
                onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-forest-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Selling Price</label>
              <input
                type="number"
                placeholder="0"
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Qty & Unit</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={qty}
                  min={1}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none"
                />
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-12 px-1 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
          >
            <Plus size={15} />
            <span>Add Item to Bill</span>
          </button>
        </div>

        {/* Added Items Table */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-600 uppercase mb-2">Bill Items ({items.length})</h3>
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-bold text-slate-800 truncate">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} {item.unit} × ৳{item.costPrice} = <strong className="text-slate-800">৳{item.total}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Details</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Discount (৳)</label>
              <input
                type="number"
                placeholder="0"
                value={discount || ''}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Paid Amount (৳)</label>
              <input
                type="number"
                placeholder={grandTotal.toString()}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Grand Total:</span>
              <span className="font-bold text-slate-800">৳{grandTotal}</span>
            </div>
            {dueAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Supplier Due:</span>
                <span>৳{dueAmount}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSavePurchase}
            disabled={isSubmitting || items.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-98 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Saving Bill...' : 'Save Purchase Bill & Add Stock'}
          </button>
        </div>
      </main>
    </div>
  );
};

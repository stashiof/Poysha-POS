import React, { useState } from 'react';
import { Plus, Trash2, Printer, FileText } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const EstimateQuotation: React.FC = () => {
  const { products, activeShop } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quoteNo, setQuoteNo] = useState(`EST-${Date.now().toString().slice(-5)}`);
  const [items, setItems] = useState<Array<{ name: string; qty: number; rate: number; total: number }>>([]);

  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemRate, setItemRate] = useState(0);

  const addItem = () => {
    if (!itemName.trim() || itemRate <= 0) return;
    setItems([...items, { name: itemName.trim(), qty: itemQty, rate: itemRate, total: itemQty * itemRate }]);
    setItemName('');
    setItemQty(1);
    setItemRate(0);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const grandTotal = items.reduce((s, i) => s + i.total, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Estimate / Quotation" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Customer & Quote Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 no-print">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Estimate #</label>
              <input
                type="text"
                value={quoteNo}
                onChange={(e) => setQuoteNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Customer Mobile</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Customer Name</label>
            <input
              type="text"
              placeholder="Customer / Client Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>
        </div>

        {/* Add Items Box */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 no-print">
          <h3 className="text-xs font-bold uppercase text-slate-500">Add Item to Estimate</h3>
          <div>
            <input
              type="text"
              placeholder="Item Name / Description"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Unit Rate (৳)</label>
              <input
                type="number"
                placeholder="0"
                value={itemRate || ''}
                onChange={(e) => setItemRate(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-forest-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Qty</label>
              <input
                type="number"
                value={itemQty}
                min={1}
                onChange={(e) => setItemQty(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1"
          >
            <Plus size={15} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Printable Quotation Sheet */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-black text-slate-900">{activeShop?.name || 'Poysha Store'}</h2>
              <p className="text-[11px] text-slate-500">{activeShop?.address}</p>
              <p className="text-[11px] text-slate-500">{activeShop?.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-forest-700 uppercase bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                Quotation / Estimate
              </span>
              <p className="text-[10px] font-mono text-slate-500 mt-1">#{quoteNo}</p>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            <span className="font-bold">Estimated For:</span> {customerName || 'Client'} ({customerPhone || 'N/A'})
          </div>

          {/* Table */}
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-1 font-bold text-slate-500 flex justify-between uppercase text-[10px]">
              <span>Item</span>
              <span>Total</span>
            </div>
            {items.map((it, idx) => (
              <div key={idx} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{it.name}</p>
                  <p className="text-[10px] text-slate-400">{it.qty} × ৳{it.rate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">৳{it.total}</span>
                  <button onClick={() => removeItem(idx)} className="p-1 text-slate-400 hover:text-rose-500 no-print">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-sm">
            <span>Estimated Total:</span>
            <span className="text-forest-700">৳{grandTotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 no-print"
          >
            <Printer size={15} />
            <span>Print Quotation Memo</span>
          </button>
        </div>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { Barcode, Printer, Plus, Download } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const BarcodeGenerator: React.FC = () => {
  const { products } = useApp();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customText, setCustomText] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [labelCopies, setLabelCopies] = useState(6);

  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setCustomText(prod.barcode || `P-${prod.id.slice(-6)}`);
      setProductPrice(prod.sellingPrice?.toString() || '0');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Barcode Sticker Generator" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3 no-print">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select from Inventory</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            >
              <option value="">-- Choose Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (৳{p.sellingPrice})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Product Title</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Price (৳)</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Barcode Code</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. 8941100234"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sticker Copies</label>
              <input
                type="number"
                min={1}
                max={48}
                value={labelCopies}
                onChange={(e) => setLabelCopies(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <Printer size={15} />
            <span>Print {labelCopies} Barcode Labels</span>
          </button>
        </div>

        {/* Barcode Labels Sheet */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 no-print">Sticker Sheet Preview</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: labelCopies }).map((_, idx) => (
              <div
                key={idx}
                className="p-3 border-2 border-dashed border-slate-300 rounded-xl text-center flex flex-col items-center justify-center bg-white space-y-1"
              >
                <span className="text-[11px] font-extrabold text-slate-800 truncate max-w-full">
                  {productName || 'Sample Product'}
                </span>

                {/* SVG Barcode pattern simulation */}
                <div className="py-1">
                  <div className="flex items-center justify-center gap-[2px] h-9">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 3].map((w, i) => (
                      <div
                        key={i}
                        className="bg-black h-full"
                        style={{ width: `${(w % 3) + 1.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-600 block mt-0.5">
                    {customText || '000123456789'}
                  </span>
                </div>

                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  MRP ৳{productPrice || '00'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

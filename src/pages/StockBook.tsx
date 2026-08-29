import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Layers, AlertTriangle, Barcode, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const StockBook: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, activeShop } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [expireDate, setExpireDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBarcode('');
    setCategory('');
    setBrand('');
    setUnit('pcs');
    setPurchasePrice('');
    setSellingPrice('');
    setStock('');
    setMinStockAlert('5');
    setExpireDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBarcode(p.barcode || '');
    setCategory(p.category || '');
    setBrand(p.brand || '');
    setUnit(p.unit || 'pcs');
    setPurchasePrice(p.purchasePrice?.toString() || '0');
    setSellingPrice(p.sellingPrice?.toString() || '0');
    setStock(p.stock?.toString() || '0');
    setMinStockAlert(p.minStockAlert?.toString() || '5');
    setExpireDate(p.expireDate || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !activeShop) return;

    setIsSubmitting(true);
    try {
      const prodData = {
        name: name.trim(),
        barcode: barcode.trim(),
        category: category.trim(),
        brand: brand.trim(),
        unit: unit.trim() || 'pcs',
        purchasePrice: Number(purchasePrice) || 0,
        sellingPrice: Number(sellingPrice) || 0,
        stock: Number(stock) || 0,
        minStockAlert: Number(minStockAlert) || 5,
        expireDate: expireDate || undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, prodData);
      } else {
        await addProduct(prodData);
      }

      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery)) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchLow = filterLowStock ? p.stock <= (p.minStockAlert || 5) : true;
    return matchSearch && matchLow;
  });

  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalStockValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.purchasePrice || 0)), 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Stock Book & Inventory" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Inventory Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 grid grid-cols-2 gap-3">
          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Stock Qty</span>
            <span className="text-base font-extrabold text-teal-800 mt-0.5 block">{totalStockCount} Units</span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Stock Valuation</span>
            <span className="text-base font-extrabold text-emerald-800 mt-0.5 block">৳{totalStockValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Filter & Action */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, barcode, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            />
          </div>
          <button
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              filterLowStock ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <AlertTriangle size={14} />
            <span>Low Stock</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-3.5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-2.5">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <Layers size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Products Found</p>
              <button
                onClick={openAddModal}
                className="mt-3 px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Add First Product
              </button>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isLow = p.stock <= (p.minStockAlert || 5);

              return (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                      {isLow && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded">
                          Low
                        </span>
                      )}
                    </div>
                    {p.brand && <span className="text-[10px] text-forest-700 font-semibold block">{p.brand}</span>}
                    
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-bold text-slate-800">৳{p.sellingPrice}</span>
                      <span className="text-slate-400 text-[11px]">Cost: ৳{p.purchasePrice}</span>
                      <span className={`text-[11px] font-bold ${isLow ? 'text-rose-600 font-black' : 'text-slate-600'}`}>
                        Stock: {p.stock} {p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                      }}
                      className="p-2 bg-slate-100 hover:bg-rose-50 text-rose-500 rounded-xl transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-extrabold text-slate-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Basmati Rice 5kg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Barcode / SKU</label>
                <input
                  type="text"
                  placeholder="Scan or Type"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Brand / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Pran / Unilever"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Cost Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-forest-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Selling Price *</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Stock & Unit</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-16 px-1.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="pcs"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-12 px-1 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Min Stock Alert</label>
                <input
                  type="number"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition"
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

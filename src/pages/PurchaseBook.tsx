import React, { useState } from 'react';
import { Search, ShoppingCart, Truck } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const PurchaseBook: React.FC = () => {
  const { purchases } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = 
      p.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.supplierPhone && p.supplierPhone.includes(searchQuery));
    const matchesDate = !dateFilter || p.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
  const totalPaid = filteredPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDue = filteredPurchases.reduce((sum, p) => sum + p.dueAmount, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Purchase Book (Supplier Bills)" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-amber-50/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Purchase</span>
            <span className="text-sm font-extrabold text-amber-700 block mt-0.5">৳{totalAmount}</span>
          </div>
          <div className="p-2 bg-emerald-50/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Paid Out</span>
            <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">৳{totalPaid}</span>
          </div>
          <div className="p-2 bg-rose-50/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Payable Due</span>
            <span className="text-sm font-extrabold text-rose-600 block mt-0.5">৳{totalDue}</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search supplier or bill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>

        {/* Purchase Invoices List */}
        <div className="space-y-3">
          {filteredPurchases.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <ShoppingCart size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Purchase Bills Recorded</p>
            </div>
          ) : (
            filteredPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                      #{purchase.billNo}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <Truck size={14} className="text-slate-400" />
                      <span>{purchase.supplierName}</span>
                    </h4>
                    {purchase.supplierPhone && (
                      <p className="text-[11px] text-slate-400 font-mono">{purchase.supplierPhone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">৳{purchase.grandTotal}</span>
                    <span className="text-[10px] text-slate-400">{purchase.date}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  {purchase.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.productName} ({it.quantity} {it.unit})</span>
                      <span className="font-semibold">৳{it.total}</span>
                    </div>
                  ))}
                </div>

                {/* Payment Breakdown */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Paid: ৳{purchase.paidAmount} ({purchase.paymentMethod})
                  </span>
                  {purchase.dueAmount > 0 && (
                    <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                      Due: ৳{purchase.dueAmount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

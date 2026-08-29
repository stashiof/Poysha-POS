import React, { useState } from 'react';
import { Search, Phone, MessageSquare, Users, User, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const Contacts: React.FC = () => {
  const { dues, sales, purchases } = useApp();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'customers' | 'suppliers'>('customers');

  // Extract distinct customers from sales and dues
  const customersMap = new Map<string, { name: string; phone: string; totalSpent: number; due: number }>();
  sales.forEach(s => {
    if (s.customerPhone) {
      const existing = customersMap.get(s.customerPhone) || { name: s.customerName, phone: s.customerPhone, totalSpent: 0, due: 0 };
      existing.totalSpent += s.grandTotal;
      customersMap.set(s.customerPhone, existing);
    }
  });
  dues.filter(d => d.partyType === 'Customer').forEach(d => {
    const existing = customersMap.get(d.partyPhone) || { name: d.partyName, phone: d.partyPhone, totalSpent: 0, due: 0 };
    existing.due = d.amount;
    customersMap.set(d.partyPhone, existing);
  });

  // Extract distinct suppliers
  const suppliersMap = new Map<string, { name: string; phone: string; totalBought: number; due: number }>();
  purchases.forEach(p => {
    if (p.supplierPhone) {
      const existing = suppliersMap.get(p.supplierPhone) || { name: p.supplierName, phone: p.supplierPhone, totalBought: 0, due: 0 };
      existing.totalBought += p.grandTotal;
      suppliersMap.set(p.supplierPhone, existing);
    }
  });
  dues.filter(d => d.partyType === 'Supplier').forEach(d => {
    const existing = suppliersMap.get(d.partyPhone) || { name: d.partyName, phone: d.partyPhone, totalBought: 0, due: 0 };
    existing.due = d.amount;
    suppliersMap.set(d.partyPhone, existing);
  });

  const customerList = Array.from(customersMap.values()).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const supplierList = Array.from(suppliersMap.values()).filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Contacts Directory" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Toggle */}
        <div className="bg-white p-1 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1 shadow-sm">
          <button
            onClick={() => setTab('customers')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'customers' ? 'bg-forest-700 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Customers ({customersMap.size})
          </button>
          <button
            onClick={() => setTab('suppliers')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              tab === 'suppliers' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Suppliers ({suppliersMap.size})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contact by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
          />
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {tab === 'customers' ? (
            customerList.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No customer contacts found. Customers are automatically saved upon POS sales.
              </div>
            ) : (
              customerList.map((c) => (
                <div key={c.phone} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{c.phone}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="text-slate-400">Total Purchase: ৳{c.totalSpent.toLocaleString()}</span>
                      {c.due > 0 && <span className="text-rose-600 font-bold">Due: ৳{c.due}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${c.phone}`}
                      className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition"
                      title="Call"
                    >
                      <Phone size={16} />
                    </a>
                    <a
                      href={`https://wa.me/88${c.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl transition"
                      title="WhatsApp"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </div>
              ))
            )
          ) : (
            supplierList.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No supplier contacts found. Suppliers are automatically saved when recording purchase bills.
              </div>
            ) : (
              supplierList.map((s) => (
                <div key={s.phone} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.phone}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <span className="text-slate-400">Total Goods: ৳{s.totalBought.toLocaleString()}</span>
                      {s.due > 0 && <span className="text-rose-600 font-bold">Payable: ৳{s.due}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${s.phone}`}
                      className="p-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl transition"
                      title="Call"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </main>
    </div>
  );
};

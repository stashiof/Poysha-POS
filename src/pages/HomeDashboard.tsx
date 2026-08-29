import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ShoppingBag,
  BookOpen,
  Receipt,
  Wallet,
  Coins,
  Package,
  Layers,
  CalendarX,
  FileText,
  Users,
  Barcode,
  PieChart,
  TrendingUp,
  StickyNote,
  Printer,
  Sliders,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle
} from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getDashboardStats, activeShop } = useApp();
  const stats = getDashboardStats();

  const ledgerBooks = [
    { label: 'Purchase Book', icon: BookOpen, path: '/purchase-book', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Sales Book', icon: Receipt, path: '/sales-book', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Expenses Book', icon: Wallet, path: '/expenses-book', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'Cash Box', icon: Coins, path: '/cashbox', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Due Book', icon: FileText, path: '/due-book', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { label: 'Stock Book', icon: Layers, path: '/stock-book', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { label: 'Product List', icon: Package, path: '/products', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Expire Products', icon: CalendarX, path: '/expire-products', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  ];

  const shopTools = [
    { label: 'Estimate / Quote', icon: FileText, path: '/estimate', color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Contacts Directory', icon: Users, path: '/contacts', color: 'text-sky-600 bg-sky-50' },
    { label: 'Barcode Generator', icon: Barcode, path: '/barcode-gen', color: 'text-violet-600 bg-violet-50' },
    { label: 'Analytics & Trends', icon: PieChart, path: '/reports', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Business Report', icon: TrendingUp, path: '/business-report', color: 'text-blue-600 bg-blue-50' },
    { label: 'Shop Memos', icon: StickyNote, path: '/notes', color: 'text-amber-600 bg-amber-50' },
    { label: 'Thermal Printer', icon: Printer, path: '/printer', color: 'text-slate-700 bg-slate-100' },
    { label: 'Unit Admin', icon: Sliders, path: '/unit-admin', color: 'text-fuchsia-600 bg-fuchsia-50' },
    { label: 'Team & Access', icon: ShieldCheck, path: '/app-access', color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/90 pb-24 text-slate-800">
      {/* Top Header */}
      <Header />

      <main className="max-w-lg mx-auto px-4 -mt-6 relative z-20 space-y-4">
        {/* Live Stat Dashboard Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            {/* Cash Balance */}
            <div 
              onClick={() => navigate('/cashbox')}
              className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-2xl border border-emerald-100 cursor-pointer active:scale-98 transition"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Cash Balance
              </span>
              <div className="text-xl font-black text-emerald-700 flex items-center gap-1">
                <span>৳</span>
                <span>{stats.cashBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Today Sales */}
            <div 
              onClick={() => navigate('/sales-book')}
              className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-100 cursor-pointer active:scale-98 transition"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                Today's Sales
              </span>
              <div className="text-xl font-black text-blue-700 flex items-center gap-1">
                <span>৳</span>
                <span>{stats.todaySales.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            {/* Today Expense */}
            <div 
              onClick={() => navigate('/expenses-book')}
              className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                Today Expense
              </span>
              <span className="text-sm font-extrabold text-rose-600 mt-0.5 block">
                ৳{stats.todayExpenses.toLocaleString()}
              </span>
            </div>

            {/* Dues */}
            <div 
              onClick={() => navigate('/due-book')}
              className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border-x border-slate-100"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                Total Dues
              </span>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 mt-0.5">
                <ArrowDownRight size={12} />
                <span>৳{stats.customerDues.toLocaleString()}</span>
              </div>
              <div className="text-[10px] font-semibold text-rose-500 flex items-center justify-center gap-0.5">
                <ArrowUpRight size={12} />
                <span>৳{stats.supplierDues.toLocaleString()}</span>
              </div>
            </div>

            {/* Stock Count */}
            <div 
              onClick={() => navigate('/stock-book')}
              className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                Stock Qty
              </span>
              <span className="text-sm font-extrabold text-teal-700 mt-0.5 block">
                {stats.totalStockQty} Pcs
              </span>
            </div>
          </div>

          {/* Low Stock Warning Banner */}
          {stats.lowStockCount > 0 && (
            <div 
              onClick={() => navigate('/stock-book')}
              className="mt-3 py-2 px-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-800 font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                <span>{stats.lowStockCount} items low in stock</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 underline">View Items</span>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Purchase Button */}
          <button
            onClick={() => navigate('/purchase')}
            className="group relative bg-white p-4 rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-orange-200 active:scale-96 transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition">
              <ShoppingCart size={26} />
            </div>
            <div className="text-center">
              <span className="text-sm font-black text-slate-800 block">Purchase</span>
              <span className="text-[10px] font-medium text-slate-400">Add Stock & Bills</span>
            </div>
          </button>

          {/* Sale POS Button */}
          <button
            onClick={() => navigate('/sell')}
            className="group relative bg-white p-4 rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-emerald-200 active:scale-96 transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 text-gold flex items-center justify-center shadow-lg shadow-forest-900/25 group-hover:scale-105 transition">
              <ShoppingBag size={26} />
            </div>
            <div className="text-center">
              <span className="text-sm font-black text-slate-800 block">Point of Sale</span>
              <span className="text-[10px] font-medium text-slate-400">Quick POS Billing</span>
            </div>
          </button>
        </div>

        {/* Ledger Books Section */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-forest-700 rounded-full" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Ledger Books
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {ledgerBooks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center text-center group active:scale-92 transition"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition shadow-sm group-hover:shadow ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 mt-1.5 leading-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Store Tools & Operations */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-gold rounded-full" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Store Tools & Management
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {shopTools.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2 active:scale-95 transition"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

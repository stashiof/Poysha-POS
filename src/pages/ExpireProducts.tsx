import React from 'react';
import { CalendarX, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const ExpireProducts: React.FC = () => {
  const { products } = useApp();

  const now = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(now.getDate() + 30);

  const expiredProducts = products.filter(p => {
    if (!p.expireDate) return false;
    return new Date(p.expireDate) < now;
  });

  const expiringSoonProducts = products.filter(p => {
    if (!p.expireDate) return false;
    const exp = new Date(p.expireDate);
    return exp >= now && exp <= thirtyDaysLater;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Expire Products" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Expired Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <CalendarX size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-900 block">Expired Products</span>
              <span className="text-[11px] text-rose-700">Immediate action required</span>
            </div>
          </div>
          <span className="text-lg font-black text-rose-700">{expiredProducts.length}</span>
        </div>

        {/* Expired List */}
        <div className="space-y-2">
          {expiredProducts.length === 0 ? (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>No expired products in stock</span>
            </div>
          ) : (
            expiredProducts.map((p) => (
              <div key={p.id} className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                  <span className="text-[10px] text-rose-600 font-bold block">Expired on: {p.expireDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">Stock: {p.stock} {p.unit}</span>
                  <span className="text-[10px] text-slate-400">৳{p.sellingPrice}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Expiring Soon Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 block">Expiring in 30 Days</span>
              <span className="text-[11px] text-amber-700">Put on discount or sale</span>
            </div>
          </div>
          <span className="text-lg font-black text-amber-700">{expiringSoonProducts.length}</span>
        </div>

        <div className="space-y-2">
          {expiringSoonProducts.length === 0 ? (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
              No products expiring in next 30 days
            </div>
          ) : (
            expiringSoonProducts.map((p) => (
              <div key={p.id} className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                  <span className="text-[10px] text-amber-700 font-bold block">Expires on: {p.expireDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">Stock: {p.stock} {p.unit}</span>
                  <span className="text-[10px] text-slate-400">৳{p.sellingPrice}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

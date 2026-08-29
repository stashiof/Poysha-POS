import React, { useState } from 'react';
import { PieChart, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Award, Calendar } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';

export const AnalyticsReports: React.FC = () => {
  const { sales, expenses, purchases, products } = useApp();

  const totalSales = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPurchase = purchases.reduce((sum, p) => sum + p.grandTotal, 0);

  // Calculate gross profit from sale items
  let totalCostOfSoldGoods = 0;
  sales.forEach(s => {
    s.items.forEach(it => {
      totalCostOfSoldGoods += (it.purchasePrice || 0) * it.quantity;
    });
  });

  const grossProfit = totalSales - totalCostOfSoldGoods;
  const netProfit = grossProfit - totalExpenses;

  // Best selling products
  const productSalesMap = new Map<string, { name: string; qty: number; totalRevenue: number }>();
  sales.forEach(s => {
    s.items.forEach(it => {
      const existing = productSalesMap.get(it.productName) || { name: it.productName, qty: 0, totalRevenue: 0 };
      existing.qty += it.quantity;
      existing.totalRevenue += it.total;
      productSalesMap.set(it.productName, existing);
    });
  });

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Analytics & Insights" showBack={false} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Profit / Loss Banner */}
        <div className="bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-white rounded-3xl p-6 shadow-xl shadow-forest-900/20">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block mb-1">
                Net Profit / Earnings
              </span>
              <div className="text-3xl font-black text-white flex items-center gap-1">
                <span>৳</span>
                <span>{netProfit.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
              <TrendingUp size={24} className="text-gold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-300 block text-[11px]">Gross Revenue</span>
              <span className="font-bold text-white text-sm">৳{totalSales.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-300 block text-[11px]">Total Expenses</span>
              <span className="font-bold text-rose-300 text-sm">৳{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Business Key Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Cost of Goods Sold</span>
            <span className="text-base font-black text-slate-800 block mt-1">৳{totalCostOfSoldGoods.toLocaleString()}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Margin</span>
            <span className="text-base font-black text-emerald-700 block mt-1">
              {totalSales > 0 ? `${((grossProfit / totalSales) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-gold" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Top Selling Products
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No sales data available yet</p>
            ) : (
              topProducts.map((prod, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-forest-50 text-forest-700 text-xs font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{prod.name}</h4>
                      <span className="text-[10px] text-slate-400">{prod.qty} units sold</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">৳{prod.totalRevenue.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

import React, { useState } from 'react';
import { TrendingUp, Printer, Calendar, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const BusinessReport: React.FC = () => {
  const { sales, expenses, purchases, activeShop } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthSales = sales.filter(s => s.date.startsWith(selectedMonth));
  const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));
  const monthPurchases = purchases.filter(p => p.date.startsWith(selectedMonth));

  const totalRevenue = monthSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalStockPurchased = monthPurchases.reduce((sum, p) => sum + p.grandTotal, 0);

  let totalCostOfSales = 0;
  monthSales.forEach(s => {
    s.items.forEach(it => {
      totalCostOfSales += (it.purchasePrice || 0) * it.quantity;
    });
  });

  const grossProfit = totalRevenue - totalCostOfSales;
  const netProfit = grossProfit - totalExpenses;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Business Profit & Loss Report" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Month Selector & Print */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-forest-700" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>

        {/* Printable P&L Statement */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="text-center pb-3 border-b border-slate-200">
            <h2 className="text-base font-black text-slate-900 uppercase">
              {activeShop?.name || 'Poysha POS Store'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Profit & Loss Statement ({selectedMonth})</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Income Section */}
            <div>
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 text-forest-700">
                1. Operating Revenue
              </h3>
              <div className="space-y-1.5 pl-3 border-l-2 border-forest-600">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Sales ({monthSales.length} Invoices)</span>
                  <span className="font-bold text-slate-800">৳{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Cost of Goods Sold (COGS)</span>
                  <span>-৳{totalCostOfSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-100">
                  <span>Gross Profit</span>
                  <span>৳{grossProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Expenses Section */}
            <div className="pt-2">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 text-rose-600">
                2. Operating Expenses
              </h3>
              <div className="space-y-1.5 pl-3 border-l-2 border-rose-500">
                <div className="flex justify-between text-slate-600">
                  <span>Shop Expenses ({monthExpenses.length} Entries)</span>
                  <span className="font-bold text-rose-600">৳{totalExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Earnings Summary */}
            <div className="pt-4 border-t-2 border-slate-900">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Business Profit</span>
                  <span className="text-xs text-slate-400">After all costs & expenses</span>
                </div>
                <span className={`text-xl font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  ৳{netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

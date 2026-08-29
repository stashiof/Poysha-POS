import React, { useState } from 'react';
import { Search, Printer, Calendar, ArrowDownRight, Eye, Trash2, Receipt } from 'lucide-react';
import { Header } from '../components/Header';
import { PrintModal } from '../components/PrintModal';
import { useApp } from '../context/AppContext';
import { SaleInvoice } from '../types';

export const SalesBook: React.FC = () => {
  const { sales } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState<SaleInvoice | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const filteredSales = sales.filter(s => {
    const matchesSearch = 
      s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(searchQuery));
    const matchesDate = !dateFilter || s.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const totalSalesAmount = filteredSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalPaid = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDue = filteredSales.reduce((sum, s) => sum + s.dueAmount, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Sales Book (Invoices)" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Sales</span>
            <span className="text-sm font-extrabold text-blue-700 block mt-0.5">৳{totalSalesAmount}</span>
          </div>
          <div className="p-2 bg-emerald-50/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Cash Collected</span>
            <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">৳{totalPaid}</span>
          </div>
          <div className="p-2 bg-rose-50/60 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Sales Due</span>
            <span className="text-sm font-extrabold text-rose-600 block mt-0.5">৳{totalDue}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
          />
        </div>

        {/* Sales List */}
        <div className="space-y-3">
          {filteredSales.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <Receipt size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Sales Invoices Found</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2 hover:border-slate-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{sale.invoiceNo}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">{sale.customerName}</h4>
                    {sale.customerPhone && (
                      <p className="text-[11px] text-slate-400 font-mono">{sale.customerPhone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">৳{sale.grandTotal}</span>
                    <span className="text-[10px] text-slate-400">{sale.date} • {sale.time}</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-1">
                  {sale.items.map((it, i) => (
                    <span key={i} className="bg-slate-50 px-1.5 py-0.5 rounded text-slate-600">
                      {it.productName} ({it.quantity} {it.unit})
                    </span>
                  ))}
                </div>

                {/* Payment pill & Print action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2 items-center text-[10px]">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Paid: ৳{sale.paidAmount} ({sale.paymentMethod})
                    </span>
                    {sale.dueAmount > 0 && (
                      <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                        Due: ৳{sale.dueAmount}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSale(sale);
                      setIsPrintOpen(true);
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-forest-700 hover:text-white rounded-lg text-slate-600 transition flex items-center gap-1 text-xs font-bold px-2"
                  >
                    <Printer size={13} />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <PrintModal
        sale={selectedSale}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />
    </div>
  );
};

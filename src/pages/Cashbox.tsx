import React, { useState } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Coins, DollarSign } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const Cashbox: React.FC = () => {
  const { cashTransactions, addCashTransaction, activeShop } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [category, setCategory] = useState('Manual Entry');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalIn = cashTransactions
    .filter(c => c.type === 'IN')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalOut = cashTransactions
    .filter(c => c.type === 'OUT')
    .reduce((sum, c) => sum + c.amount, 0);

  const netBalance = totalIn - totalOut;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !activeShop) return;

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await addCashTransaction({
        type,
        category: category.trim() || (type === 'IN' ? 'Cash In' : 'Cash Out'),
        amount: Number(amount),
        date: today,
        time,
        paymentMethod,
        description: description.trim() || (type === 'IN' ? 'Cash Added' : 'Cash Withdrawn'),
        shopId: activeShop.id
      });

      setAmount('');
      setDescription('');
      setIsAdding(false);
    } catch (e) {
      console.error(e);
      alert('Failed to log transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Cash Box" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Net Balance Card */}
        <div className="bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-white rounded-3xl p-6 shadow-xl shadow-forest-900/20">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block mb-1">
            Current Cash-in-Hand
          </span>
          <div className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
            <span>৳</span>
            <span>{netBalance.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <ArrowDownLeft size={18} />
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">Total In</span>
                <span className="text-xs font-bold text-white">৳{totalIn.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <ArrowUpRight size={18} />
              </div>
              <div>
                <span className="text-[10px] text-rose-200 block uppercase font-bold">Total Out</span>
                <span className="text-xs font-bold text-white">৳{totalOut.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setType('IN');
              setIsAdding(true);
            }}
            className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ArrowDownLeft size={16} />
            <span>Cash In (Deposit)</span>
          </button>

          <button
            onClick={() => {
              setType('OUT');
              setIsAdding(true);
            }}
            className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ArrowUpRight size={16} />
            <span>Cash Out (Withdraw)</span>
          </button>
        </div>

        {/* Add Entry Modal / Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl p-5 shadow-md border border-slate-200 space-y-3 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {type === 'IN' ? 'Log Cash Inflow' : 'Log Cash Outflow'}
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Amount (৳) *</label>
              <input
                type="number"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Category / Reason</label>
              <input
                type="text"
                placeholder="e.g. Owner Investment / Bank Transfer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Description / Note</label>
              <input
                type="text"
                placeholder="Optional details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition"
              >
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* History Stream */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Transaction History</h3>
          {cashTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <Coins size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Cash Transactions</p>
            </div>
          ) : (
            cashTransactions.map((c) => (
              <div
                key={c.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    c.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {c.type === 'IN' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{c.description || c.category}</h4>
                    <p className="text-[10px] text-slate-400">{c.date} • {c.time} ({c.paymentMethod})</p>
                  </div>
                </div>

                <span className={`text-sm font-black ${
                  c.type === 'IN' ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {c.type === 'IN' ? '+' : '-'}৳{c.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

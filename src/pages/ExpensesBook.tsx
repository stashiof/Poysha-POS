import React, { useState } from 'react';
import { Plus, Trash2, Wallet, Calendar, DollarSign } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

const CATEGORIES = [
  'Rent',
  'Electricity',
  'Salary',
  'Snacks',
  'Transport',
  'Maintenance',
  'Internet',
  'Other'
] as const;

export const ExpensesBook: React.FC = () => {
  const { expenses, addExpense, deleteExpense, activeShop } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Rent');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [dateFilter, setDateFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredExpenses = expenses.filter(e => !dateFilter || e.date === dateFilter);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0 || !activeShop) return;

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await addExpense({
        title: title.trim(),
        category,
        amount: Number(amount),
        date: today,
        time,
        paymentMethod,
        shopId: activeShop.id
      });

      setTitle('');
      setAmount('');
      setIsAdding(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Expenses Book" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Total Banner */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Expenses
            </span>
            <div className="text-xl font-black text-rose-600 mt-0.5">
              ৳{totalExpense.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl p-5 shadow-md border border-rose-200 space-y-3 animate-fadeIn">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Record New Expense</h3>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Expense Title / Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Shop Rent / Electricity Bill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow transition"
              >
                {isSubmitting ? 'Saving...' : 'Save Expense'}
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

        {/* Date Filter */}
        <div className="flex justify-between items-center bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-600 pl-2">Filter by Date</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
          />
        </div>

        {/* Expense List */}
        <div className="space-y-2.5">
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <Wallet size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Expenses Recorded</p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-100">
                      {exp.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{exp.date} • {exp.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{exp.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-rose-600">৳{exp.amount}</span>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

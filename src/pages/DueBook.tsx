import React, { useState } from 'react';
import { Search, Phone, ArrowDownRight, ArrowUpRight, Check, Plus, DollarSign, UserCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { DueRecord } from '../types';

export const DueBook: React.FC = () => {
  const { dues, updateDuePayment } = useApp();
  const [tab, setTab] = useState<'Customer' | 'Supplier'>('Customer');
  const [searchQuery, setSearchQuery] = useState('');

  // Settle modal
  const [selectedParty, setSelectedParty] = useState<DueRecord | null>(null);
  const [settleAmount, setSettleAmount] = useState<string>('');
  const [settleNote, setSettleNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDues = dues.filter(d => {
    const matchTab = d.partyType === tab;
    const matchSearch = 
      d.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partyPhone.includes(searchQuery);
    return matchTab && matchSearch;
  });

  const totalDues = filteredDues.reduce((sum, d) => sum + d.amount, 0);

  const handleSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty || !settleAmount || Number(settleAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      await updateDuePayment(
        selectedParty.partyPhone,
        selectedParty.partyType,
        Number(settleAmount),
        settleNote.trim()
      );
      setSelectedParty(null);
      setSettleAmount('');
      setSettleNote('');
    } catch (e) {
      console.error(e);
      alert('Failed to update due');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Due Book (Ledger)" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Type Toggle Tabs */}
        <div className="bg-white p-1 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1 shadow-sm">
          <button
            onClick={() => setTab('Customer')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'Customer'
                ? 'bg-forest-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownRight size={15} />
            <span>Customer Dues (Receivable)</span>
          </button>

          <button
            onClick={() => setTab('Supplier')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'Supplier'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight size={15} />
            <span>Supplier Dues (Payable)</span>
          </button>
        </div>

        {/* Total Summary */}
        <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
          tab === 'Customer' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
              Total {tab === 'Customer' ? 'Receivable' : 'Payable'}
            </span>
            <div className="text-xl font-black mt-0.5">
              ৳{totalDues.toLocaleString()}
            </div>
          </div>
          <div className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl shadow-sm">
            {filteredDues.length} Parties
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${tab.toLowerCase()} by name or phone...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
          />
        </div>

        {/* Due List */}
        <div className="space-y-3">
          {filteredDues.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <UserCheck size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Outstanding Dues</p>
              <p className="text-xs text-slate-400 mt-1">All {tab.toLowerCase()} accounts are settled</p>
            </div>
          ) : (
            filteredDues.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{record.partyName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone size={12} className="text-slate-400" />
                      <span className="font-mono">{record.partyPhone}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-black ${
                      tab === 'Customer' ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      ৳{record.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{record.lastUpdated}</span>
                  </div>
                </div>

                {/* Settle Action Button */}
                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <a
                    href={`tel:${record.partyPhone}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedParty(record);
                      setSettleAmount(record.amount.toString());
                    }}
                    className={`px-3 py-1.5 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition ${
                      tab === 'Customer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    <Check size={14} />
                    <span>{tab === 'Customer' ? 'Collect Due' : 'Pay Due'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Settle Due Modal */}
      {selectedParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSettle} className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              {selectedParty.partyType === 'Customer' ? 'Collect Customer Due' : 'Pay Supplier Due'}
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{selectedParty.partyName}</p>
              <p className="text-slate-500 font-mono">{selectedParty.partyPhone}</p>
              <p className="text-rose-600 font-extrabold pt-1">
                Current Due: ৳{selectedParty.amount.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Amount Received / Paid (৳) *
              </label>
              <input
                type="number"
                required
                max={selectedParty.amount}
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Cash / bKash payment"
                value={settleNote}
                onChange={(e) => setSettleNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition"
              >
                {isSubmitting ? 'Saving...' : 'Confirm & Settle'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedParty(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
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

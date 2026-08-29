import React, { useState } from 'react';
import { Sliders, Plus, Trash2, ShieldCheck, UserPlus, Users, Store, LogOut } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const UnitAdmin: React.FC = () => {
  const [units, setUnits] = useState(['pcs', 'kg', 'gm', 'ltr', 'ml', 'box', 'packet', 'dozen', 'meter', 'bag']);
  const [newUnit, setNewUnit] = useState('');

  const addUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit.trim() || units.includes(newUnit.trim().toLowerCase())) return;
    setUnits([...units, newUnit.trim().toLowerCase()]);
    setNewUnit('');
  };

  const removeUnit = (u: string) => {
    setUnits(units.filter(item => item !== u));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Unit of Measurement Admin" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        <form onSubmit={addUnit} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Add new unit (e.g. carton, pair)"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-forest-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
          >
            <Plus size={15} />
            <span>Add</span>
          </button>
        </form>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Configured Units ({units.length})</h3>
          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <div
                key={u}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2"
              >
                <span>{u}</span>
                <button onClick={() => removeUnit(u)} className="text-slate-400 hover:text-rose-500">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export const AppAccess: React.FC = () => {
  const { user, activeShop } = useApp();
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Manager' | 'Cashier' | 'Salesperson'>('Salesperson');
  const [teamMembers, setTeamMembers] = useState([
    { name: user?.name || 'Owner', phone: user?.phone || '', role: 'Admin (Owner)', isCurrent: true }
  ]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setTeamMembers([...teamMembers, { name: `Staff (${phone.slice(-4)})`, phone: phone.trim(), role, isCurrent: false }]);
    setPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Team & App Access" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <UserPlus size={16} className="text-forest-700" />
            <span>Invite Staff / Cashier</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Staff Phone Number</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Permission Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="Manager">Manager (Full POS & Books)</option>
                <option value="Cashier">Cashier (Sell & Cashbox)</option>
                <option value="Salesperson">Salesperson (Sell Only)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition"
          >
            Grant Store Access
          </button>
        </form>

        {/* Member List */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Store Team</h3>
          <div className="divide-y divide-slate-100">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{m.phone}</p>
                </div>
                <span className="text-[10px] font-bold bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full border border-forest-100">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

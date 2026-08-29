import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Printer,
  Sliders,
  ShieldCheck,
  Globe,
  Database,
  LogOut,
  ChevronRight,
  Info,
  Smartphone,
  Cloud
} from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeShop, logoutUser } = useApp();

  const menuItems = [
    {
      title: 'Active Store Info & Profile',
      subtitle: activeShop?.name || 'Manage shop details',
      icon: Store,
      path: '/shops',
      color: 'text-forest-700 bg-forest-50'
    },
    {
      title: 'Thermal Printer Setup',
      subtitle: 'Paper size (58mm/80mm), header & footer',
      icon: Printer,
      path: '/printer',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Units of Measurement',
      subtitle: 'Manage pcs, kg, ltr, boxes',
      icon: Sliders,
      path: '/unit-admin',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Team & Staff Permissions',
      subtitle: 'Invite cashier, manager roles',
      icon: ShieldCheck,
      path: '/app-access',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Contacts Directory',
      subtitle: 'Customers & Supplier records',
      icon: Smartphone,
      path: '/contacts',
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Settings & Preferences" showBack={false} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-gold flex items-center justify-center font-extrabold text-lg shadow-md shadow-forest-900/10">
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{user?.name || 'Shop Admin'}</h3>
              <p className="text-xs text-slate-500 font-mono">{user?.phone}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                <Cloud size={10} /> Cloud Sync Active
              </span>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200 divide-y divide-slate-100">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            );
          })}
        </div>

        {/* App Info Box */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-forest-700 text-gold font-black mx-auto flex items-center justify-center">
            P
          </div>
          <h4 className="font-black text-sm text-slate-900">Poysha POS v2.0 (React Modern)</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Smart Cloud Shop Manager for Retailers, Wholesalers & Outlets
          </p>
          <div className="pt-3">
            <button
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <LogOut size={16} />
              <span>Log Out of Account</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

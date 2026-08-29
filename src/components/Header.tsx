import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, ChevronDown, ArrowLeft, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showShopSelector?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showShopSelector = false,
  rightAction
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeShop, user } = useApp();

  const isHome = location.pathname === '/' || location.pathname === '/home';

  if (!isHome && title) {
    return (
      <header className="sticky top-0 z-40 bg-gradient-to-r from-forest-700 via-forest-800 to-forest-900 text-white px-4 py-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-white"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-bold tracking-wide truncate max-w-[200px] sm:max-w-xs">
            {title}
          </h1>
        </div>
        <div>
          {rightAction || (
            <span className="text-xs bg-white/15 px-2.5 py-1 rounded-lg text-emerald-200 font-medium">
              {activeShop?.name || 'Poysha POS'}
            </span>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="relative bg-gradient-to-br from-forest-700 via-forest-800 to-forest-900 text-white pt-6 pb-12 px-5 rounded-b-[32px] shadow-lg overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gold/10 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/icon.svg" 
            alt="Poysha POS" 
            className="w-10 h-10 rounded-xl shadow bg-white/10 p-1 object-contain border border-white/20" 
          />
          <div>
            <button
              onClick={() => navigate('/shops')}
              className="flex items-center gap-1.5 text-left group"
            >
              <h1 className="text-lg font-extrabold tracking-tight text-white group-hover:text-gold-400 transition flex items-center gap-1">
                {activeShop?.name || 'Poysha POS Store'}
                <ChevronDown size={16} className="text-gold-400 opacity-80 group-hover:translate-y-0.5 transition" />
              </h1>
            </button>
            <p className="text-xs text-emerald-200/90 font-medium flex items-center gap-1 mt-0.5">
              <span>{user?.name || user?.phone || 'Shop Owner'}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">Active</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/shops')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-semibold text-white flex items-center gap-1.5 border border-white/15 backdrop-blur-sm"
          >
            <Store size={14} className="text-gold-400" />
            <span>Switch</span>
          </button>
        </div>
      </div>
    </header>
  );
};

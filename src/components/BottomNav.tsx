import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, BarChart3, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Sell (POS)', icon: ShoppingBag, path: '/sell' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] rounded-t-2xl max-w-lg mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = 
            (item.path === '/' && (location.pathname === '/' || location.pathname === '/home')) ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive ? 'text-forest-700 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition ${isActive ? 'bg-forest-50 text-forest-700' : ''}`}>
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-forest-800 font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

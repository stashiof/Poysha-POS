import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useApp();
  
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 11-digit mobile number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginUser(cleanPhone, isRegister ? (name.trim() || 'Shop Owner') : 'Shop Owner');
      setLoading(false);
      navigate('/shops');
    }, 400);
  };

  const handleDemoLogin = () => {
    loginUser('01700000000', 'Demo Merchant');
    navigate('/shops');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-800 via-forest-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden border border-white/20">
        {/* Top Decorative Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-forest-50 border border-forest-100 shadow-sm mb-3">
            <img 
              src="/logo.svg" 
              alt="Poysha POS" 
              className="h-12 max-w-[200px] object-contain" 
            />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {isRegister ? 'Create Shop Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister ? 'Join Poysha POS to manage your retail store' : 'Login with your mobile number to manage your shop'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Full Name / Shop Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Al-Madina Store"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-forest-600 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-forest-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Security PIN / Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-forest-600 focus:bg-white transition tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-forest-700 to-forest-900 hover:from-forest-800 hover:to-black text-white font-bold text-sm rounded-xl shadow-lg shadow-forest-900/20 active:scale-98 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account & Continue' : 'Sign In'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-semibold text-forest-700 hover:text-forest-900 hover:underline transition"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create New"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Instant Demo Access (No password required)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

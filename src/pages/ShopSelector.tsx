import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus, ArrowRight, MapPin, Phone, LogOut, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopSelector: React.FC = () => {
  const navigate = useNavigate();
  const { user, shops, activeShop, switchShop, createShop, logoutUser, isLoading } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopAddress, setNewShopAddress] = useState('');
  const [newShopPhone, setNewShopPhone] = useState('');
  const [creatingLoading, setCreatingLoading] = useState(false);

  const handleSelectShop = (shop: any) => {
    switchShop(shop);
    navigate('/home');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;

    setCreatingLoading(true);
    try {
      const created = await createShop(
        newShopName.trim(),
        newShopAddress.trim(),
        newShopPhone.trim() || user?.phone || ''
      );
      setCreatingLoading(false);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setCreatingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 flex flex-col justify-between">
      <div className="max-w-md mx-auto w-full pt-4 pb-12">
        {/* Top User Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 font-extrabold text-lg shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">{user?.name || 'Shop Owner'}</h2>
              <p className="text-xs text-slate-500 font-mono">{user?.phone}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Your Shops & Outlets</h1>
            <p className="text-xs text-slate-500">Select a store to open POS register</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
          >
            <Plus size={14} />
            <span>New Shop</span>
          </button>
        </div>

        {/* Create Shop Form (Collapsible) */}
        {isCreating && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-5 shadow-md border-2 border-forest-500/30 mb-5 animate-fadeIn space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Store size={16} className="text-forest-700" />
              <span>Create New Store</span>
            </h3>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Shop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Poysha General Store"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-forest-600 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address / Location</label>
              <input
                type="text"
                placeholder="e.g. Motijheel, Dhaka"
                value={newShopAddress}
                onChange={(e) => setNewShopAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-forest-600 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Store Helpline Phone</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={newShopPhone}
                onChange={(e) => setNewShopPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-forest-600 focus:bg-white transition"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={creatingLoading}
                className="flex-1 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5"
              >
                {creatingLoading ? 'Creating...' : 'Create & Open Store'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Shop List */}
        <div className="space-y-3">
          {shops.length === 0 && !isLoading ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
              <Store size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Store Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Create your first shop to start managing billing and inventory</p>
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2.5 bg-forest-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Create Store Now
              </button>
            </div>
          ) : (
            shops.map((shop) => {
              const isCurrent = activeShop?.id === shop.id;
              return (
                <div
                  key={shop.id}
                  onClick={() => handleSelectShop(shop)}
                  className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between ${
                    isCurrent ? 'border-forest-600 ring-2 ring-forest-500/20 bg-forest-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold ${
                      isCurrent ? 'bg-forest-700 text-gold' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Store size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{shop.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Check size={10} /> Active
                          </span>
                        )}
                      </div>
                      {shop.address && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-slate-400" />
                          <span>{shop.address}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-2 text-slate-400 hover:text-forest-700 transition">
                    <ArrowRight size={18} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

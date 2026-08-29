import React, { useState } from 'react';
import { Printer, Save, Check, FileText } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const PrinterSettings: React.FC = () => {
  const { printerConfig, updatePrinterConfig, activeShop } = useApp();

  const [paperWidth, setPaperWidth] = useState(printerConfig.paperWidth);
  const [headerTitle, setHeaderTitle] = useState(printerConfig.headerTitle || activeShop?.name || 'Poysha POS');
  const [headerSubtitle, setHeaderSubtitle] = useState(printerConfig.headerSubtitle || activeShop?.address || '');
  const [footerMessage, setFooterMessage] = useState(printerConfig.footerMessage || 'Thank you for shopping with us!');
  const [showLogo, setShowLogo] = useState(printerConfig.showLogo);
  const [showQrCode, setShowQrCode] = useState(printerConfig.showQrCode);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrinterConfig({
      paperWidth,
      headerTitle,
      headerSubtitle,
      footerMessage,
      showLogo,
      showQrCode
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Thermal Printer Setup" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Paper Size / Width</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaperWidth('58mm')}
                className={`py-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                  paperWidth === '58mm'
                    ? 'border-forest-700 bg-forest-50 text-forest-800 ring-2 ring-forest-600/20'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-sm">58mm (2 inch)</span>
                <span className="text-[10px] text-slate-400 font-normal">Standard Pocket POS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaperWidth('80mm')}
                className={`py-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                  paperWidth === '80mm'
                    ? 'border-forest-700 bg-forest-50 text-forest-800 ring-2 ring-forest-600/20'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-sm">80mm (3 inch)</span>
                <span className="text-[10px] text-slate-400 font-normal">Desktop Thermal Receipt</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Receipt Header Title</label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Address / Helpline Subtitle</label>
            <input
              type="text"
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Receipt Footer Note</label>
            <input
              type="text"
              value={footerMessage}
              onChange={(e) => setFooterMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? 'Saved Successfully!' : 'Save Configuration'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestPrint}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Printer size={15} />
              <span>Test Print</span>
            </button>
          </div>
        </form>

        {/* Live Receipt Preview */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Thermal Slip Layout Preview ({paperWidth})
          </span>
          <div className={`mx-auto bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 ${
            paperWidth === '58mm' ? 'max-w-[220px]' : 'max-w-[280px]'
          }`}>
            <h4 className="font-black text-xs uppercase text-slate-900">{headerTitle}</h4>
            <p className="text-[9px] text-slate-500">{headerSubtitle}</p>
            <div className="border-t border-b border-dashed border-slate-300 py-1 text-[10px] flex justify-between font-mono">
              <span>Item × 1</span>
              <span>৳150</span>
            </div>
            <div className="flex justify-between font-bold text-xs">
              <span>Total:</span>
              <span>৳150</span>
            </div>
            <p className="text-[8px] text-slate-400 pt-1">{footerMessage}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

import React, { useRef } from 'react';
import { X, Printer, Download, Share2, Check } from 'lucide-react';
import { SaleInvoice } from '../types';
import { useApp } from '../context/AppContext';

interface PrintModalProps {
  sale: SaleInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ sale, isOpen, onClose }) => {
  const { activeShop, printerConfig } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const is58mm = printerConfig.paperWidth === '58mm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-forest-700 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-gold" />
            <h3 className="font-bold text-sm">Print Invoice #{sale.invoiceNo}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex justify-center">
          <div 
            ref={receiptRef}
            id="thermal-receipt"
            className={`bg-white p-5 shadow-sm rounded-lg border border-slate-200 text-slate-800 font-mono text-xs ${
              is58mm ? 'w-[280px]' : 'w-[360px]'
            }`}
          >
            {/* Shop Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              {printerConfig.showLogo && (
                <div className="flex justify-center mb-1">
                  <img src="/icon.svg" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
              )}
              <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                {activeShop?.name || 'Poysha POS Store'}
              </h2>
              {activeShop?.address && (
                <p className="text-[10px] text-slate-500 mt-0.5">{activeShop.address}</p>
              )}
              {activeShop?.phone && (
                <p className="text-[10px] text-slate-500">Phone: {activeShop.phone}</p>
              )}
            </div>

            {/* Invoice Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-bold">{sale.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{sale.date} {sale.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold">{sale.customerName || 'Cash Customer'}</span>
              </div>
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span>{sale.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-2.5 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-slate-200 text-slate-900">
                <span className="flex-1">Item</span>
                <span className="w-12 text-center">Qty</span>
                <span className="w-16 text-right">Price</span>
                <span className="w-16 text-right">Total</span>
              </div>
              <div className="divide-y divide-slate-100 py-1">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 text-[11px]">
                    <span className="flex-1 truncate pr-1">{item.productName}</span>
                    <span className="w-12 text-center">{item.quantity} {item.unit || 'pcs'}</span>
                    <span className="w-16 text-right">৳{item.rate}</span>
                    <span className="w-16 text-right font-medium">৳{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="py-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>৳{sale.subtotal}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-৳{sale.discount}</span>
                </div>
              )}
              {sale.tax > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Tax / VAT:</span>
                  <span>+৳{sale.tax}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-300">
                <span>Grand Total:</span>
                <span>৳{sale.grandTotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Paid ({sale.paymentMethod}):</span>
                <span>৳{sale.paidAmount}</span>
              </div>
              {sale.dueAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Due Amount:</span>
                  <span>৳{sale.dueAmount}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-dashed border-slate-300 text-center space-y-1 text-[10px] text-slate-500">
              <p className="font-semibold text-slate-700">{printerConfig.footerText}</p>
              {printerConfig.showWatermark && (
                <p className="text-[9px] text-slate-400 font-medium mt-1">
                  {printerConfig.watermarkText || 'Software by Poysha POS'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 bg-forest-700 hover:bg-forest-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-forest-900/10 active:scale-95 transition"
          >
            <Printer size={18} />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

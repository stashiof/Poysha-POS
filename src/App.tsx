import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Login } from './pages/Login';
import { ShopSelector } from './pages/ShopSelector';
import { HomeDashboard } from './pages/HomeDashboard';
import { POSSell } from './pages/POSSell';
import { Purchase } from './pages/Purchase';
import { SalesBook } from './pages/SalesBook';
import { PurchaseBook } from './pages/PurchaseBook';
import { DueBook } from './pages/DueBook';
import { ExpensesBook } from './pages/ExpensesBook';
import { Cashbox } from './pages/Cashbox';
import { StockBook } from './pages/StockBook';
import { ExpireProducts } from './pages/ExpireProducts';
import { Contacts } from './pages/Contacts';
import { AnalyticsReports } from './pages/AnalyticsReports';
import { BusinessReport } from './pages/BusinessReport';
import { BarcodeGenerator } from './pages/BarcodeGenerator';
import { EstimateQuotation } from './pages/EstimateQuotation';
import { Notes } from './pages/Notes';
import { PrinterSettings } from './pages/PrinterSettings';
import { UnitAdmin, AppAccess } from './pages/UnitAdmin';
import { Settings } from './pages/Settings';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, activeShop, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-300">Loading Poysha POS...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!activeShop && window.location.pathname !== '/shops') {
    return <Navigate to="/shops" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/shops"
          element={
            <ProtectedRoute>
              <ShopSelector />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <POSSell />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <Purchase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-book"
          element={
            <ProtectedRoute>
              <SalesBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-book"
          element={
            <ProtectedRoute>
              <PurchaseBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/due-book"
          element={
            <ProtectedRoute>
              <DueBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses-book"
          element={
            <ProtectedRoute>
              <ExpensesBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashbox"
          element={
            <ProtectedRoute>
              <Cashbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock-book"
          element={
            <ProtectedRoute>
              <StockBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <StockBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expire-products"
          element={
            <ProtectedRoute>
              <ExpireProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AnalyticsReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/business-report"
          element={
            <ProtectedRoute>
              <BusinessReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/barcode-gen"
          element={
            <ProtectedRoute>
              <BarcodeGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estimate"
          element={
            <ProtectedRoute>
              <EstimateQuotation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/printer"
          element={
            <ProtectedRoute>
              <PrinterSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unit-admin"
          element={
            <ProtectedRoute>
              <UnitAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app-access"
          element={
            <ProtectedRoute>
              <AppAccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

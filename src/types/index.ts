export interface User {
  phone: string;
  name?: string;
  email?: string;
  pin?: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerPhone: string;
  address?: string;
  phone?: string;
  currency?: string;
  logoUrl?: string;
  createdAt?: string | number;
}

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  category?: string;
  brand?: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  stock: number;
  minStockAlert?: number;
  expireDate?: string;
  image?: string;
  updatedAt?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  rate: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  rate: number;
  purchasePrice: number;
  total: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Due' | 'Mixed';
  sellerPhone: string;
  shopId: string;
  notes?: string;
  status: 'Completed' | 'Returned' | 'Partial Return';
  createdAt: number;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  costPrice: number;
  sellingPrice?: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  billNo: string;
  date: string;
  time: string;
  supplierName: string;
  supplierPhone: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Due';
  shopId: string;
  createdAt: number;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Rent' | 'Electricity' | 'Salary' | 'Snacks' | 'Transport' | 'Maintenance' | 'Internet' | 'Other';
  amount: number;
  date: string;
  time: string;
  paymentMethod: string;
  note?: string;
  shopId: string;
  createdAt: number;
}

export interface CashTransaction {
  id: string;
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
  date: string;
  time: string;
  paymentMethod: string;
  reference?: string;
  description: string;
  shopId: string;
  createdAt: number;
}

export interface DueRecord {
  id: string;
  partyType: 'Customer' | 'Supplier';
  partyName: string;
  partyPhone: string;
  address?: string;
  amount: number; // Positive means receivable from customer or payable to supplier
  lastUpdated: string;
  history: Array<{
    id: string;
    date: string;
    type: 'Sale' | 'Purchase' | 'Payment_Received' | 'Payment_Given' | 'Adjustment';
    amount: number;
    referenceNo?: string;
    note?: string;
    createdAt: number;
  }>;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  completed?: boolean;
  isPinned?: boolean;
  shopId: string;
  createdAt: number;
}

export type ShopNote = Note;

export interface Unit {
  id: string;
  name: string;
  shortCode: string;
}

export interface PrinterConfig {
  paperWidth: '58mm' | '80mm' | 'A4';
  headerTitle?: string;
  headerSubtitle?: string;
  headerText?: string;
  footerMessage?: string;
  footerText?: string;
  showLogo: boolean;
  showQrCode?: boolean;
  showWatermark?: boolean;
  watermarkText?: string;
  autoPrintAfterSale?: boolean;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Shop, 
  Product, 
  SaleInvoice, 
  PurchaseInvoice, 
  Expense, 
  CashTransaction, 
  DueRecord, 
  PrinterConfig,
  Note
} from '../types';
import { rtdb, ref, onValue, set, push, update, remove, get } from '../firebase';

interface AppContextType {
  user: User | null;
  activeShop: Shop | null;
  shops: Shop[];
  products: Product[];
  sales: SaleInvoice[];
  purchases: PurchaseInvoice[];
  expenses: Expense[];
  cashTransactions: CashTransaction[];
  dues: DueRecord[];
  notes: Note[];
  printerConfig: PrinterConfig;
  isLoading: boolean;
  
  // Auth & Shop actions
  loginUser: (phone: string, name?: string) => void;
  logoutUser: () => void;
  switchShop: (shop: Shop) => void;
  createShop: (name: string, address?: string, phone?: string) => Promise<Shop>;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Transaction actions
  addSale: (sale: Omit<SaleInvoice, 'id' | 'createdAt'>) => Promise<string>;
  addPurchase: (purchase: Omit<PurchaseInvoice, 'id' | 'createdAt'>) => Promise<string>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCashTransaction: (trans: Omit<CashTransaction, 'id' | 'createdAt'>) => Promise<void>;
  
  // Due actions
  updateDuePayment: (partyPhone: string, partyType: 'Customer' | 'Supplier', amount: number, note?: string) => Promise<void>;
  
  // Note actions
  addNote: (noteOrTitle: Omit<Note, 'id' | 'createdAt'> | string, content?: string) => Promise<void>;
  toggleNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // Settings actions
  updatePrinterConfig: (config: Partial<PrinterConfig>) => void;
  updateShopDetails: (details: Partial<Shop>) => Promise<void>;
  
  // Stats
  getDashboardStats: () => {
    todaySales: number;
    todayExpenses: number;
    cashBalance: number;
    customerDues: number;
    supplierDues: number;
    totalStockQty: number;
    totalStockValue: number;
    lowStockCount: number;
    expiredCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PRINTER: PrinterConfig = {
  paperWidth: '58mm',
  headerText: 'Thank you for shopping with us!',
  footerText: 'Goods once sold are not returnable without invoice.',
  showLogo: true,
  showWatermark: true,
  watermarkText: 'Software by Poysha POS',
  autoPrintAfterSale: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('userPhone');
    const name = localStorage.getItem('userName') || 'Shop Owner';
    return saved ? { phone: saved, name } : null;
  });

  const [activeShop, setActiveShop] = useState<Shop | null>(() => {
    const shopId = localStorage.getItem('activeShopId');
    const shopName = localStorage.getItem('activeShopName') || 'Poysha POS Store';
    return shopId ? { id: shopId, name: shopName, ownerPhone: localStorage.getItem('userPhone') || '' } : null;
  });

  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleInvoice[]>([]);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [dues, setDues] = useState<DueRecord[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>(() => {
    try {
      const saved = localStorage.getItem('printerConfig');
      return saved ? { ...DEFAULT_PRINTER, ...JSON.parse(saved) } : DEFAULT_PRINTER;
    } catch {
      return DEFAULT_PRINTER;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync user's shops
  useEffect(() => {
    if (!user?.phone) {
      setShops([]);
      setIsLoading(false);
      return;
    }

    try {
      const userShopsRef = ref(rtdb, `users/${user.phone}/shops`);
      const unsub = onValue(userShopsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const shopList: Shop[] = Object.keys(data).map(key => ({
            id: key,
            name: data[key].name || 'My Store',
            ownerPhone: user.phone,
            address: data[key].address || '',
            phone: data[key].phone || user.phone,
            currency: data[key].currency || '৳'
          }));
          setShops(shopList);
          
          // Auto select if only one or if previously active
          const activeId = localStorage.getItem('activeShopId');
          const current = shopList.find(s => s.id === activeId) || shopList[0];
          if (current && (!activeShop || activeShop.id !== current.id)) {
            setActiveShop(current);
            localStorage.setItem('activeShopId', current.id);
            localStorage.setItem('activeShopName', current.name);
          }
        } else {
          setShops([]);
        }
        setIsLoading(false);
      }, (error) => {
        console.warn('Firebase RTDB error:', error);
        setIsLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.warn('Shop listener exception:', e);
      setIsLoading(false);
    }
  }, [user?.phone]);

  // Sync active shop data
  useEffect(() => {
    if (!activeShop?.id) {
      setProducts([]);
      setSales([]);
      setPurchases([]);
      setExpenses([]);
      setCashTransactions([]);
      setNotes([]);
      return;
    }

    const shopId = activeShop.id;

    // 1. Products Listener
    const prodRef = ref(rtdb, `shops/${shopId}/products`);
    const unsubProd = onValue(prodRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Product[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          purchasePrice: Number(data[key].purchasePrice) || 0,
          sellingPrice: Number(data[key].sellingPrice) || 0,
          stock: Number(data[key].stock) || 0,
          minStockAlert: Number(data[key].minStockAlert) || 5,
        }));
        setProducts(list);
      } else {
        setProducts([]);
      }
    });

    // 2. Sales Listener
    const salesRef = ref(rtdb, `shops/${shopId}/sales`);
    const unsubSales = onValue(salesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: SaleInvoice[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          items: data[key].items || [],
          grandTotal: Number(data[key].grandTotal) || 0,
          paidAmount: Number(data[key].paidAmount) || 0,
          dueAmount: Number(data[key].dueAmount) || 0,
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setSales(list);
      } else {
        setSales([]);
      }
    });

    // 3. Purchases Listener
    const purchaseRef = ref(rtdb, `shops/${shopId}/purchases`);
    const unsubPurchase = onValue(purchaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: PurchaseInvoice[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          items: data[key].items || [],
          grandTotal: Number(data[key].grandTotal) || 0,
          paidAmount: Number(data[key].paidAmount) || 0,
          dueAmount: Number(data[key].dueAmount) || 0,
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setPurchases(list);
      } else {
        setPurchases([]);
      }
    });

    // 4. Expenses Listener
    const expenseRef = ref(rtdb, `shops/${shopId}/expenses`);
    const unsubExpense = onValue(expenseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Expense[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          amount: Number(data[key].amount) || 0,
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setExpenses(list);
      } else {
        setExpenses([]);
      }
    });

    // 5. Cash Transactions
    const cashRef = ref(rtdb, `shops/${shopId}/cashbook`);
    const unsubCash = onValue(cashRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: CashTransaction[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          amount: Number(data[key].amount) || 0,
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setCashTransactions(list);
      } else {
        setCashTransactions([]);
      }
    });

    // 6. Notes Listener
    const notesRef = ref(rtdb, `shops/${shopId}/notes`);
    const unsubNotes = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Note[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setNotes(list);
      } else {
        setNotes([]);
      }
    });

    // 7. Dues Listener
    const duesRef = ref(rtdb, `shops/${shopId}/dues`);
    const unsubDues = onValue(duesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: DueRecord[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          amount: Number(data[key].amount) || 0,
          history: data[key].history ? Object.values(data[key].history) : []
        }));
        setDues(list);
      } else {
        setDues([]);
      }
    });

    return () => {
      unsubProd();
      unsubSales();
      unsubPurchase();
      unsubExpense();
      unsubCash();
      unsubNotes();
      unsubDues();
    };
  }, [activeShop?.id]);

  const loginUser = (phone: string, name = 'Shop Owner') => {
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userName', name);
    setUser({ phone, name });
  };

  const logoutUser = () => {
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    localStorage.removeItem('activeShopId');
    localStorage.removeItem('activeShopName');
    setUser(null);
    setActiveShop(null);
  };

  const switchShop = (shop: Shop) => {
    setActiveShop(shop);
    localStorage.setItem('activeShopId', shop.id);
    localStorage.setItem('activeShopName', shop.name);
  };

  const createShop = async (name: string, address = '', phone = user?.phone || '') => {
    if (!user?.phone) throw new Error('User not logged in');
    const newShopRef = push(ref(rtdb, `users/${user.phone}/shops`));
    const shopId = newShopRef.key!;
    const shopData = {
      name,
      address,
      phone,
      currency: '৳',
      createdAt: Date.now()
    };
    await set(newShopRef, shopData);
    
    // Also save in root shops
    await set(ref(rtdb, `shops/${shopId}/meta`), {
      name,
      ownerPhone: user.phone,
      address,
      phone,
      createdAt: Date.now()
    });

    const newShop: Shop = {
      id: shopId,
      name,
      ownerPhone: user.phone,
      address,
      phone,
      currency: '৳'
    };

    switchShop(newShop);
    return newShop;
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'updatedAt'>) => {
    if (!activeShop) throw new Error('No active shop');
    const newRef = push(ref(rtdb, `shops/${activeShop.id}/products`));
    await set(newRef, {
      ...productData,
      updatedAt: Date.now()
    });
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    if (!activeShop) throw new Error('No active shop');
    await update(ref(rtdb, `shops/${activeShop.id}/products/${id}`), {
      ...productData,
      updatedAt: Date.now()
    });
  };

  const deleteProduct = async (id: string) => {
    if (!activeShop) throw new Error('No active shop');
    await remove(ref(rtdb, `shops/${activeShop.id}/products/${id}`));
  };

  const addSale = async (saleData: Omit<SaleInvoice, 'id' | 'createdAt'>): Promise<string> => {
    if (!activeShop) throw new Error('No active shop');
    const newRef = push(ref(rtdb, `shops/${activeShop.id}/sales`));
    const invoiceId = newRef.key!;
    const timestamp = Date.now();

    const fullSale: SaleInvoice = {
      ...saleData,
      id: invoiceId,
      createdAt: timestamp
    };

    await set(newRef, fullSale);

    // Auto deduct product stock
    for (const item of saleData.items) {
      if (item.productId) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const newStock = Math.max(0, (prod.stock || 0) - item.quantity);
          await update(ref(rtdb, `shops/${activeShop.id}/products/${item.productId}`), {
            stock: newStock,
            updatedAt: timestamp
          });
        }
      }
    }

    // If there is due, add to due ledger
    if (saleData.dueAmount > 0 && saleData.customerPhone) {
      const duePartyRef = ref(rtdb, `shops/${activeShop.id}/dues/cust_${saleData.customerPhone}`);
      const snap = await get(duePartyRef);
      const existing = snap.val();
      const currentDue = existing ? Number(existing.amount) || 0 : 0;
      const newDue = currentDue + saleData.dueAmount;

      await update(duePartyRef, {
        partyType: 'Customer',
        partyName: saleData.customerName || 'Customer',
        partyPhone: saleData.customerPhone,
        address: saleData.customerAddress || '',
        amount: newDue,
        lastUpdated: saleData.date
      });

      const historyRef = push(ref(rtdb, `shops/${activeShop.id}/dues/cust_${saleData.customerPhone}/history`));
      await set(historyRef, {
        date: saleData.date,
        type: 'Sale',
        amount: saleData.dueAmount,
        referenceNo: saleData.invoiceNo,
        note: `Due on invoice #${saleData.invoiceNo}`,
        createdAt: timestamp
      });
    }

    // If paid amount > 0, log in Cashbox
    if (saleData.paidAmount > 0) {
      const cashRef = push(ref(rtdb, `shops/${activeShop.id}/cashbook`));
      await set(cashRef, {
        type: 'IN',
        category: 'Sales Receipt',
        amount: saleData.paidAmount,
        date: saleData.date,
        time: saleData.time,
        paymentMethod: saleData.paymentMethod,
        reference: saleData.invoiceNo,
        description: `Sale #${saleData.invoiceNo} - ${saleData.customerName || 'Walk-in'}`,
        shopId: activeShop.id,
        createdAt: timestamp
      });
    }

    return invoiceId;
  };

  const addPurchase = async (purchaseData: Omit<PurchaseInvoice, 'id' | 'createdAt'>): Promise<string> => {
    if (!activeShop) throw new Error('No active shop');
    const newRef = push(ref(rtdb, `shops/${activeShop.id}/purchases`));
    const billId = newRef.key!;
    const timestamp = Date.now();

    await set(newRef, {
      ...purchaseData,
      id: billId,
      createdAt: timestamp
    });

    // Increase product stock
    for (const item of purchaseData.items) {
      if (item.productId) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const newStock = (prod.stock || 0) + item.quantity;
          await update(ref(rtdb, `shops/${activeShop.id}/products/${item.productId}`), {
            stock: newStock,
            purchasePrice: item.costPrice || prod.purchasePrice,
            sellingPrice: item.sellingPrice || prod.sellingPrice,
            updatedAt: timestamp
          });
        }
      }
    }

    // If supplier due exists
    if (purchaseData.dueAmount > 0 && purchaseData.supplierPhone) {
      const supRef = ref(rtdb, `shops/${activeShop.id}/dues/sup_${purchaseData.supplierPhone}`);
      const snap = await get(supRef);
      const existing = snap.val();
      const currentDue = existing ? Number(existing.amount) || 0 : 0;
      const newDue = currentDue + purchaseData.dueAmount;

      await update(supRef, {
        partyType: 'Supplier',
        partyName: purchaseData.supplierName || 'Supplier',
        partyPhone: purchaseData.supplierPhone,
        amount: newDue,
        lastUpdated: purchaseData.date
      });

      const histRef = push(ref(rtdb, `shops/${activeShop.id}/dues/sup_${purchaseData.supplierPhone}/history`));
      await set(histRef, {
        date: purchaseData.date,
        type: 'Purchase',
        amount: purchaseData.dueAmount,
        referenceNo: purchaseData.billNo,
        note: `Purchase Bill #${purchaseData.billNo}`,
        createdAt: timestamp
      });
    }

    // Cashbook entry for paid amount
    if (purchaseData.paidAmount > 0) {
      const cashRef = push(ref(rtdb, `shops/${activeShop.id}/cashbook`));
      await set(cashRef, {
        type: 'OUT',
        category: 'Purchase Payment',
        amount: purchaseData.paidAmount,
        date: purchaseData.date,
        time: purchaseData.time,
        paymentMethod: purchaseData.paymentMethod,
        reference: purchaseData.billNo,
        description: `Supplier payment for Bill #${purchaseData.billNo} (${purchaseData.supplierName})`,
        shopId: activeShop.id,
        createdAt: timestamp
      });
    }

    return billId;
  };

  const addExpense = async (expData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!activeShop) return;
    const newRef = push(ref(rtdb, `shops/${activeShop.id}/expenses`));
    const timestamp = Date.now();
    await set(newRef, {
      ...expData,
      createdAt: timestamp
    });

    // Cashbox entry
    const cashRef = push(ref(rtdb, `shops/${activeShop.id}/cashbook`));
    await set(cashRef, {
      type: 'OUT',
      category: `Expense - ${expData.category}`,
      amount: expData.amount,
      date: expData.date,
      time: expData.time,
      paymentMethod: expData.paymentMethod,
      description: expData.title,
      shopId: activeShop.id,
      createdAt: timestamp
    });
  };

  const deleteExpense = async (id: string) => {
    if (!activeShop) return;
    await remove(ref(rtdb, `shops/${activeShop.id}/expenses/${id}`));
  };

  const addCashTransaction = async (transData: Omit<CashTransaction, 'id' | 'createdAt'>) => {
    if (!activeShop) return;
    const newRef = push(ref(rtdb, `shops/${activeShop.id}/cashbook`));
    await set(newRef, {
      ...transData,
      createdAt: Date.now()
    });
  };

  const updateDuePayment = async (
    partyPhone: string, 
    partyType: 'Customer' | 'Supplier', 
    amount: number, 
    note = ''
  ) => {
    if (!activeShop) return;
    const key = partyType === 'Customer' ? `cust_${partyPhone}` : `sup_${partyPhone}`;
    const dueRef = ref(rtdb, `shops/${activeShop.id}/dues/${key}`);
    const snap = await get(dueRef);
    const data = snap.val();
    if (!data) return;

    const currentDue = Number(data.amount) || 0;
    const newDue = Math.max(0, currentDue - amount);
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await update(dueRef, {
      amount: newDue,
      lastUpdated: today
    });

    const histRef = push(ref(rtdb, `shops/${activeShop.id}/dues/${key}/history`));
    await set(histRef, {
      date: today,
      type: partyType === 'Customer' ? 'Payment_Received' : 'Payment_Given',
      amount,
      note: note || `Due collection / payment for ${data.partyName}`,
      createdAt: Date.now()
    });

    // Cashbox Entry
    const cashRef = push(ref(rtdb, `shops/${activeShop.id}/cashbook`));
    await set(cashRef, {
      type: partyType === 'Customer' ? 'IN' : 'OUT',
      category: partyType === 'Customer' ? 'Due Collection' : 'Supplier Due Payment',
      amount,
      date: today,
      time,
      paymentMethod: 'Cash',
      description: `Due settled for ${data.partyName} (${partyPhone})`,
      shopId: activeShop.id,
      createdAt: Date.now()
    });
  };

  const addNote = async (noteOrTitle: Omit<Note, 'id' | 'createdAt'> | string, content = '') => {
    if (!activeShop) return;
    const newRef = push(ref(rtdb, `shops/${activeShop.id}/notes`));
    if (typeof noteOrTitle === 'string') {
      await set(newRef, {
        title: noteOrTitle,
        content,
        date: new Date().toISOString().split('T')[0],
        completed: false,
        shopId: activeShop.id,
        createdAt: Date.now()
      });
    } else {
      await set(newRef, {
        ...noteOrTitle,
        shopId: activeShop.id,
        createdAt: Date.now()
      });
    }
  };

  const toggleNote = async (id: string) => {
    if (!activeShop) return;
    const target = notes.find(n => n.id === id);
    if (!target) return;
    await update(ref(rtdb, `shops/${activeShop.id}/notes/${id}`), {
      completed: !target.completed
    });
  };

  const deleteNote = async (id: string) => {
    if (!activeShop) return;
    await remove(ref(rtdb, `shops/${activeShop.id}/notes/${id}`));
  };

  const updatePrinterConfig = (config: Partial<PrinterConfig>) => {
    const updated = { ...printerConfig, ...config };
    setPrinterConfig(updated);
    localStorage.setItem('printerConfig', JSON.stringify(updated));
  };

  const updateShopDetails = async (details: Partial<Shop>) => {
    if (!activeShop) return;
    await update(ref(rtdb, `shops/${activeShop.id}/meta`), details);
    if (user?.phone) {
      await update(ref(rtdb, `users/${user.phone}/shops/${activeShop.id}`), details);
    }
    setActiveShop({ ...activeShop, ...details });
  };

  const getDashboardStats = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    const todaySales = sales
      .filter(s => s.date === todayStr)
      .reduce((sum, s) => sum + (s.grandTotal || 0), 0);

    const todayExpenses = expenses
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const cashIn = cashTransactions
      .filter(c => c.type === 'IN')
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const cashOut = cashTransactions
      .filter(c => c.type === 'OUT')
      .reduce((sum, c) => sum + (c.amount || 0), 0);

    const cashBalance = cashIn - cashOut;

    const customerDues = dues
      .filter(d => d.partyType === 'Customer')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const supplierDues = dues
      .filter(d => d.partyType === 'Supplier')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const totalStockQty = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalStockValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.purchasePrice || 0)), 0);
    const lowStockCount = products.filter(p => (p.stock || 0) <= (p.minStockAlert || 5)).length;
    
    const expiredCount = products.filter(p => {
      if (!p.expireDate) return false;
      return new Date(p.expireDate) < new Date();
    }).length;

    return {
      todaySales,
      todayExpenses,
      cashBalance,
      customerDues,
      supplierDues,
      totalStockQty,
      totalStockValue,
      lowStockCount,
      expiredCount
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeShop,
        shops,
        products,
        sales,
        purchases,
        expenses,
        cashTransactions,
        dues,
        notes,
        printerConfig,
        isLoading,
        loginUser,
        logoutUser,
        switchShop,
        createShop,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        addPurchase,
        addExpense,
        deleteExpense,
        addCashTransaction,
        updateDuePayment,
        addNote,
        toggleNote,
        deleteNote,
        updatePrinterConfig,
        updateShopDetails,
        getDashboardStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

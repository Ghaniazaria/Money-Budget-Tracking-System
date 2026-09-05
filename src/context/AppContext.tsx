import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  BudgetCategory, 
  Transaction, 
  Project, 
  Client, 
  Invoice, 
  AIInsight, 
  DocumentItem, 
  AttentionItem, 
  NavigationTab,
  ThemeMode,
  ScannedReceiptData,
  Language,
  Currency,
  WorkspaceType,
  NoteItem,
  TaskItem
} from '../types';
import { 
  formatCurrency as formatCurrencyUtil, 
  convertCurrency as convertCurrencyUtil, 
  DEFAULT_EXCHANGE_RATE, 
  TRANSLATIONS, 
  FormatCurrencyOptions 
} from '../utils/i18n';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PROJECTS, 
  INITIAL_CLIENTS, 
  INITIAL_INVOICES, 
  INITIAL_ATTENTION_ITEMS, 
  INITIAL_AI_INSIGHTS, 
  INITIAL_DOCUMENTS,
  INITIAL_NOTES,
  INITIAL_TASKS,
  STUDENT_BUDGET_CATEGORIES
} from '../data/mockData';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentMonth: string;
  setCurrentMonth: (m: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  workspaceType: WorkspaceType;
  setWorkspaceType: (type: WorkspaceType) => void;
  switchWorkspace: (type: WorkspaceType) => void;
  
  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;

  // Currency & Conversion
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  toggleCurrency: () => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  formatCurrency: (amountInIDR: number, options?: FormatCurrencyOptions) => string;
  convertCurrency: (amount: number, from: Currency, to: Currency) => number;
  isConverterOpen: boolean;
  openConverter: () => void;
  closeConverter: () => void;
  
  // Data
  categories: BudgetCategory[];
  transactions: Transaction[];
  projects: Project[];
  clients: Client[];
  invoices: Invoice[];
  attentionItems: AttentionItem[];
  insights: AIInsight[];
  aiInsights: AIInsight[];
  setInsights: React.Dispatch<React.SetStateAction<AIInsight[]>>;
  documents: DocumentItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  
  // Modals & View States
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;

  isReceiptModalOpen: boolean;
  openReceiptModal: () => void;
  closeReceiptModal: () => void;

  isQuickActionSheetOpen: boolean;
  openQuickActionSheet: () => void;
  closeQuickActionSheet: () => void;
  
  isClientPortalMode: boolean;
  setIsClientPortalMode: (val: boolean) => void;
  
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (val: boolean) => void;

  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;
  
  // Computed Finances
  totalAvailableBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalPlannedBudget: number;
  totalSpentBudget: number;
  remainingBudget: number;
  budgetProgressPercent: number;
  categorySpendingMap: Record<string, number>;
  outstandingInvoicesTotal: number;

  // Theme mode
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addTransactionWithReceipt: (tx: Omit<Transaction, 'id'>, receipt: ScannedReceiptData) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (tx: Transaction) => void;
  
  addCategory: (cat: Omit<BudgetCategory, 'id'>) => void;
  updateCategoryPlanned: (id: string, planned: number) => void;
  updateCategoryName: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  addProject: (proj: Omit<Project, 'id' | 'paid' | 'outstanding'>) => void;
  updateProjectProgress: (id: string, progress: number) => void;
  updateProjectStatus: (id: string, status: Project['status']) => void;

  addClient: (cli: Omit<Client, 'id' | 'totalRevenue' | 'outstandingBalance' | 'activeProjectsCount' | 'lastActivity'>) => void;

  addInvoice: (inv: Omit<Invoice, 'id' | 'number'>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  sendInvoiceReminder: (invoiceId: string) => void;

  dismissAttentionItem: (id: string) => void;

  // Notes & Task Management
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Omit<NoteItem, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  updateTaskStatus: (id: string, status: TaskItem['status']) => void;
  updateTask: (id: string, task: Partial<Omit<TaskItem, 'id'>>) => void;
  deleteTask: (id: string) => void;

  // Toast
  toasts: ToastNotification[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [workspaceName, setWorkspaceName] = useState('Alex Rivera Studio');
  
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-workspace-type');
      if (saved === 'freelance' || saved === 'student') return saved;
    }
    return 'freelance';
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-notes');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_NOTES;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-tasks');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('flowledger-workspace-type', workspaceType);
    } catch {}
  }, [workspaceType]);

  useEffect(() => {
    try {
      localStorage.setItem('flowledger-notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('flowledger-tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);
  
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(INITIAL_ATTENTION_ITEMS);
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isQuickActionSheetOpen, setIsQuickActionSheetOpen] = useState(false);
  const [isClientPortalMode, setIsClientPortalMode] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Language state (defaults to Indonesian)
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-language');
      if (saved === 'id' || saved === 'en') return saved;
    }
    return 'id';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('flowledger-language', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && (key in langDict)) {
      return (langDict as Record<string, string>)[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && (key in enDict)) {
      return (enDict as Record<string, string>)[key];
    }
    return fallback || key;
  };

  // Currency state (defaults to Rupiah IDR)
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-currency');
      if (saved === 'IDR' || saved === 'USD') return saved;
    }
    return 'IDR';
  });

  const setCurrency = (newCurr: Currency) => {
    setCurrencyState(newCurr);
    try {
      localStorage.setItem('flowledger-currency', newCurr);
    } catch {
      // ignore
    }
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'IDR' ? 'USD' : 'IDR');
  };

  const [exchangeRate, setExchangeRateState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-exchange-rate');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return DEFAULT_EXCHANGE_RATE;
  });

  const setExchangeRate = (rate: number) => {
    setExchangeRateState(rate);
    try {
      localStorage.setItem('flowledger-exchange-rate', String(rate));
    } catch {
      // ignore
    }
  };

  const formatCurrency = (amountInIDR: number, options?: FormatCurrencyOptions) => {
    return formatCurrencyUtil(amountInIDR, currency, exchangeRate, options);
  };

  const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    return convertCurrencyUtil(amount, from, to, exchangeRate);
  };

  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const openConverter = () => setIsConverterOpen(true);
  const closeConverter = () => setIsConverterOpen(false);

  // Theme Mode State: light or dark
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flowledger-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('flowledger-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      return nextTheme;
    });
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dynamically compute category spending from transactions in current month
  const categorySpendingMap = useMemo(() => {
    const map: Record<string, number> = {};
    // Base preset actuals aligned with the user prompt
    // Then add any transactions that reference each category
    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        map[tx.categoryId] = (map[tx.categoryId] || 0) + tx.amount;
      }
    });
    return map;
  }, [transactions]);

  // Derived budget spending
  const totalPlannedBudget = useMemo(() => {
    return categories
      .filter((c) => c.group !== 'income')
      .reduce((sum, c) => sum + c.planned, 0);
  }, [categories]);

  const totalSpentBudget = useMemo(() => {
    return categories
      .filter((c) => c.group !== 'income')
      .reduce((sum, c) => sum + (categorySpendingMap[c.id] || 0), 0);
  }, [categories, categorySpendingMap]);

  const remainingBudget = totalPlannedBudget - totalSpentBudget;
  const budgetProgressPercent = totalPlannedBudget > 0 ? (totalSpentBudget / totalPlannedBudget) * 100 : 0;

  // Monthly income & expense calculations
  const monthlyIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  // Outstanding invoices
  const outstandingInvoicesTotal = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'viewed')
      .reduce((acc, inv) => acc + inv.amount, 0);
  }, [invoices]);

  // Liquid balance
  const totalAvailableBalance = useMemo(() => {
    const baseLiquid = 236320000; // Base IDR balance (Rp 236.320.000)
    return baseLiquid + monthlyIncome - monthlyExpenses;
  }, [monthlyIncome, monthlyExpenses]);

  // Handlers
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const category = categories.find((c) => c.id === txData.categoryId);
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      categoryName: category?.name || txData.categoryName || 'General'
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update project or client if affiliated
    if (txData.projectId && txData.type === 'income') {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === txData.projectId
            ? {
                ...p,
                paid: p.paid + txData.amount,
                outstanding: Math.max(0, p.outstanding - txData.amount)
              }
            : p
        )
      );
    }

    const sign = newTx.type === 'income' ? '+' : '-';
    showToast(
      language === 'id' ? 'Transaksi Dicatat' : 'Transaction recorded',
      `${newTx.description} (${sign}${formatCurrency(newTx.amount)})`
    );
  };

  const addTransactionWithReceipt = (txData: Omit<Transaction, 'id'>, receipt: ScannedReceiptData) => {
    const category = categories.find((c) => c.id === txData.categoryId);
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      categoryName: category?.name || txData.categoryName || 'General',
      receiptData: receipt,
      hasReceipt: true
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Automatically file document receipt into the Documents vault
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      title: `Receipt: ${receipt.merchant} (${formatCurrency(newTx.amount)})`,
      category: 'receipt',
      uploadDate: newTx.date,
      fileSize: '348 KB',
      fileType: 'image/jpeg',
      status: 'Verified OCR'
    };
    setDocuments((prev) => [newDoc, ...prev]);

    showToast(
      language === 'id' ? 'Struk Berhasil Diproses' : 'Receipt Processed',
      `${receipt.merchant} (${formatCurrency(newTx.amount)}) ${language === 'id' ? 'dicatat ke pembukuan.' : 'logged into ledger.'}`
    );
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (target) {
      showToast(
        language === 'id' ? 'Transaksi Dihapus' : 'Transaction removed',
        language === 'id' ? `Menghapus ${target.description}` : `Removed ${target.description}`
      );
    }
  };

  const editTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
    showToast(
      language === 'id' ? 'Transaksi Diperbarui' : 'Transaction updated',
      `${updatedTx.description} ${language === 'id' ? 'telah diperbarui.' : 'was modified.'}`
    );
  };

  const addCategory = (catData: Omit<BudgetCategory, 'id'>) => {
    const newCat: BudgetCategory = {
      ...catData,
      id: 'cat-' + Date.now()
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(
      language === 'id' ? 'Kategori Dibuat' : 'Category created',
      language === 'id' 
        ? `Menambahkan "${newCat.name}" dengan anggaran bulanan ${formatCurrency(newCat.planned)}.`
        : `Added "${newCat.name}" with ${formatCurrency(newCat.planned)} monthly budget.`
    );
  };

  const updateCategoryPlanned = (id: string, planned: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, planned: Math.max(0, planned) } : c))
    );
  };

  const updateCategoryName = (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim() || c.name } : c))
    );
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', `Removed category "${cat?.name || id}"`);
  };

  const addProject = (projData: Omit<Project, 'id' | 'paid' | 'outstanding'>) => {
    const newProj: Project = {
      ...projData,
      id: 'proj-' + Date.now(),
      paid: 0,
      outstanding: projData.value
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast('Project created', `Created project "${newProj.name}" for ${newProj.clientName}.`);
  };

  const updateProjectProgress = (id: string, progress: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress: Math.min(100, Math.max(0, progress)) } : p))
    );
  };

  const updateProjectStatus = (id: string, status: Project['status']) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const addClient = (cliData: Omit<Client, 'id' | 'totalRevenue' | 'outstandingBalance' | 'activeProjectsCount' | 'lastActivity'>) => {
    const newClient: Client = {
      ...cliData,
      id: 'cli-' + Date.now(),
      totalRevenue: 0,
      outstandingBalance: 0,
      activeProjectsCount: 0,
      lastActivity: 'Just added'
    };
    setClients((prev) => [newClient, ...prev]);
    showToast('Client added', `${newClient.name} (${newClient.company}) has been added.`);
  };

  const addInvoice = (invData: Omit<Invoice, 'id' | 'number'>) => {
    const nextNum = 'INV-0' + (invoices.length + 25);
    const newInv: Invoice = {
      ...invData,
      id: 'inv-' + Date.now(),
      number: nextNum
    };
    setInvoices((prev) => [newInv, ...prev]);
    showToast('Invoice created', `${newInv.number} generated for ${newInv.clientName} ($${newInv.amount}).`);
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          return { ...inv, status };
        }
        return inv;
      })
    );
    showToast('Invoice status updated', `Invoice status set to ${status}.`);
  };

  const sendInvoiceReminder = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (inv) {
      showToast('Reminder sent', `A payment reminder for ${inv.number} was sent to ${inv.clientName} (${inv.clientEmail || 'client'}).`);
    }
  };

  const dismissAttentionItem = (id: string) => {
    setAttentionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const switchWorkspace = (type: WorkspaceType) => {
    setWorkspaceType(type);
    if (type === 'student') {
      setWorkspaceName('Alex (Pelajar & Mahasiswa)');
      showToast(
        language === 'id' ? 'Mode Pelajar Aktif 🎓' : 'Student Mode Active 🎓',
        language === 'id' 
          ? 'Beralih ke workspace Pelajar & Mahasiswa (Uang Saku, Tugas & Catatan Kuliah).' 
          : 'Switched to Student workspace (Allowance, Academic Tasks & Lecture Notes).',
        'info'
      );
    } else {
      setWorkspaceName('Alex Rivera Studio');
      showToast(
        language === 'id' ? 'Mode Pekerja Lepas Aktif 💼' : 'Freelance Mode Active 💼',
        language === 'id' 
          ? 'Beralih ke workspace Pekerja Lepas (Proyek, Klien & Invoice Studio).' 
          : 'Switched to Freelance Studio workspace (Client Invoices & Project Billing).',
        'info'
      );
    }
  };

  // Notes CRUD
  const addNote = (noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: NoteItem = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast(
      language === 'id' ? 'Catatan Disimpan' : 'Note Saved',
      language === 'id' ? `"${newNote.title}" berhasil ditambahkan.` : `"${newNote.title}" added successfully.`,
      'success'
    );
  };

  const updateNote = (id: string, updated: Partial<Omit<NoteItem, 'id' | 'createdAt'>>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n))
    );
    showToast(
      language === 'id' ? 'Catatan Diperbarui' : 'Note Updated',
      language === 'id' ? 'Perubahan catatan berhasil disimpan.' : 'Note changes saved.',
      'info'
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast(
      language === 'id' ? 'Catatan Dihapus' : 'Note Deleted',
      language === 'id' ? 'Catatan telah dihapus.' : 'Note removed.',
      'info'
    );
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Task Management CRUD
  const addTask = (taskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(
      language === 'id' ? 'Tugas Ditambahkan' : 'Task Added',
      language === 'id' ? `"${newTask.title}" telah ditambahkan ke jadwal.` : `"${newTask.title}" added to schedule.`,
      'success'
    );
  };

  const updateTaskStatus = (id: string, status: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
    if (status === 'completed') {
      showToast(
        language === 'id' ? 'Tugas Selesai 🎉' : 'Task Completed 🎉',
        language === 'id' ? 'Kerja bagus! Satu tugas terselesaikan.' : 'Great job completing this task!',
        'success'
      );
    }
  };

  const updateTask = (id: string, updated: Partial<Omit<TaskItem, 'id'>>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(
      language === 'id' ? 'Tugas Dihapus' : 'Task Deleted',
      language === 'id' ? 'Tugas telah dihapus dari daftar.' : 'Task removed.',
      'info'
    );
  };

  const openTransactionModal = () => setIsTransactionModalOpen(true);
  const closeTransactionModal = () => setIsTransactionModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        activeTab,
        setActiveTab,
        workspaceName,
        setWorkspaceName,
        workspaceType,
        setWorkspaceType,
        switchWorkspace,
        categories,
        transactions,
        projects,
        clients,
        invoices,
        attentionItems,
        insights,
        aiInsights: insights,
        setInsights,
        documents,
        notes,
        tasks,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        // Language & Localization
        language,
        setLanguage,
        toggleLanguage,
        t,

        // Currency & Converter
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        setExchangeRate,
        formatCurrency,
        convertCurrency,
        isConverterOpen,
        openConverter,
        closeConverter,

        isTransactionModalOpen,
        openTransactionModal,
        closeTransactionModal,
        isReceiptModalOpen,
        openReceiptModal: () => setIsReceiptModalOpen(true),
        closeReceiptModal: () => setIsReceiptModalOpen(false),
        isQuickActionSheetOpen,
        openQuickActionSheet: () => setIsQuickActionSheetOpen(true),
        closeQuickActionSheet: () => setIsQuickActionSheetOpen(false),
        isClientPortalMode,
        setIsClientPortalMode,
        isOnboardingOpen,
        setIsOnboardingOpen,
        selectedClientId,
        setSelectedClientId,
        selectedInvoiceId,
        setSelectedInvoiceId,
        totalAvailableBalance,
        monthlyIncome,
        monthlyExpenses,
        totalPlannedBudget,
        totalSpentBudget,
        remainingBudget,
        budgetProgressPercent,
        categorySpendingMap,
        outstandingInvoicesTotal,
        theme,
        setTheme,
        toggleTheme,
        addTransaction,
        addTransactionWithReceipt,
        deleteTransaction,
        editTransaction,
        addCategory,
        updateCategoryPlanned,
        updateCategoryName,
        deleteCategory,
        addProject,
        updateProjectProgress,
        updateProjectStatus,
        addClient,
        addInvoice,
        updateInvoiceStatus,
        sendInvoiceReminder,
        dismissAttentionItem,
        toasts,
        showToast,
        dismissToast,
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

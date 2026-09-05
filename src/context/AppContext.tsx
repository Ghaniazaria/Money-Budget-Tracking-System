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
  TaskItem,
  UserProfile
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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

  // Supabase Auth & Profile
  user: any;
  userProfile: UserProfile | null;
  authLoading: boolean;
  isGuestDemo: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (
    email: string, 
    password: string, 
    fullName?: string, 
    workspaceChoice?: 'student' | 'freelancer'
  ) => Promise<{ error: any; confirmationRequired?: boolean }>;
  logout: () => Promise<void>;
  bypassDemoAuth: () => void;
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
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Supabase Auth State
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isGuestDemo, setIsGuestDemo] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flowledger-guest-demo') === 'true';
    }
    return false;
  });

  // Load user data from Supabase
  const loadUserData = async (userId: string) => {
    if (!isSupabaseConfigured()) return;
    try {
      // 1. Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let currentWs: WorkspaceType = 'student';
      if (profileData) {
        currentWs = profileData.workspace_type || 'student';
        setUserProfile({
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name,
          workspaceType: profileData.workspace_type,
          currency: profileData.currency || 'IDR',
          language: profileData.language || 'id',
        });
        setWorkspaceType(currentWs);
        if (profileData.full_name) {
          setWorkspaceName(profileData.full_name);
        }
      }

      // 2. Budget Categories
      const { data: catData } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (catData && catData.length > 0) {
        setCategories(catData.map((c: any) => ({
          id: c.id,
          name: c.name,
          group: c.group,
          planned: Number(c.planned),
          iconName: c.icon_name || 'Tag',
          notes: c.notes || undefined
        })));
      } else {
        const seeds = currentWs === 'student' ? STUDENT_BUDGET_CATEGORIES : INITIAL_CATEGORIES;
        setCategories(seeds);
        const toInsert = seeds.map((s) => ({
          user_id: userId,
          name: s.name,
          group: s.group,
          planned: s.planned,
          icon_name: s.iconName || 'Tag',
          workspace: currentWs
        }));
        await supabase.from('budget_categories').insert(toInsert);
      }

      // 3. Transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (txData && txData.length > 0) {
        setTransactions(txData.map((t: any) => ({
          id: t.id,
          description: t.description,
          amount: Number(t.amount),
          type: t.type,
          categoryId: t.category_id || '',
          date: t.date,
          isRecurring: t.is_recurring,
          note: t.note || undefined
        })));
      }

      // 4. Notes
      const { data: noteData } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (noteData && noteData.length > 0) {
        setNotes(noteData.map((n: any) => ({
          id: n.id,
          title: n.title,
          content: n.content || '',
          category: n.category,
          subject: n.subject || undefined,
          tags: n.tags || [],
          pinned: Boolean(n.pinned),
          color: n.color || 'emerald',
          workspace: n.workspace || 'all',
          createdAt: n.created_at,
          updatedAt: n.updated_at
        })));
      }

      // 5. Tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (taskData && taskData.length > 0) {
        setTasks(taskData.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || undefined,
          dueDate: t.due_date,
          dueTime: t.due_time || '23:59',
          priority: t.priority,
          status: t.status,
          category: t.category,
          subjectOrProject: t.subject_or_project || undefined,
          workspace: t.workspace || 'all',
          completedAt: t.completed_at || undefined
        })));
      }
    } catch (err) {
      console.warn('Error syncing data with Supabase:', err);
    }
  };

  // Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.id);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        setIsGuestDemo(false);
        try { localStorage.removeItem('flowledger-guest-demo'); } catch {}
        loadUserData(currentUser.id);
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      const demoUser = { id: 'demo-user-1', email };
      setUser(demoUser);
      setUserProfile({
        id: 'demo-user-1',
        email,
        fullName: email.split('@')[0],
        workspaceType: workspaceType === 'freelance' ? 'freelancer' : (workspaceType as any),
        currency,
        language
      });
      showToast(
        language === 'id' ? 'Login Demo Berhasil' : 'Demo Login Successful', 
        `Masuk sebagai ${email}`, 
        'success'
      );
      return { error: null };
    }
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.error) {
      showToast(
        language === 'id' ? 'Login Gagal' : 'Login Failed', 
        res.error.message, 
        'warning'
      );
    } else {
      showToast(
        language === 'id' ? 'Login Berhasil' : 'Login Successful', 
        language === 'id' ? 'Selamat datang kembali!' : 'Welcome back!', 
        'success'
      );
    }
    return { error: res.error };
  };

  const register = async (
    email: string, 
    password: string, 
    fullName?: string, 
    workspaceChoice: 'student' | 'freelancer' = 'student'
  ) => {
    if (!isSupabaseConfigured()) {
      const demoId = 'demo-user-' + Date.now();
      setUser({ id: demoId, email });
      setUserProfile({
        id: demoId,
        email,
        fullName: fullName || email.split('@')[0],
        workspaceType: workspaceChoice,
        currency,
        language
      });
      switchWorkspace(workspaceChoice);
      showToast(
        language === 'id' ? 'Registrasi Demo Berhasil' : 'Demo Registration Successful',
        language === 'id' ? `Akun ${workspaceChoice} dibuat.` : `${workspaceChoice} account created.`,
        'success'
      );
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          workspace_type: workspaceChoice,
        }
      }
    });

    if (error) {
      showToast(
        language === 'id' ? 'Registrasi Gagal' : 'Registration Failed', 
        error.message, 
        'warning'
      );
      return { error };
    }

    if (data?.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName || email.split('@')[0],
          workspace_type: workspaceChoice,
          currency: 'IDR',
          language: 'id'
        });
        const seeds = workspaceChoice === 'student' ? STUDENT_BUDGET_CATEGORIES : INITIAL_CATEGORIES;
        const toInsert = seeds.map((s) => ({
          user_id: data.user.id,
          name: s.name,
          group: s.group,
          planned: s.planned,
          icon_name: s.iconName || 'Tag',
          workspace: workspaceChoice
        }));
        await supabase.from('budget_categories').insert(toInsert);
      } catch (profileErr) {
        console.warn('Profile creation fallback:', profileErr);
      }
    }

    const confirmationRequired = !data?.session;
    return { error: null, confirmationRequired };
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setUserProfile(null);
    setIsGuestDemo(false);
    try {
      localStorage.removeItem('flowledger-guest-demo');
    } catch {}
    showToast(
      language === 'id' ? 'Berhasil Keluar' : 'Logged out',
      language === 'id' ? 'Sesi Anda telah diakhiri.' : 'You have signed out.',
      'info'
    );
  };

  const bypassDemoAuth = () => {
    setIsGuestDemo(true);
    try {
      localStorage.setItem('flowledger-guest-demo', 'true');
    } catch {}
    showToast(
      language === 'id' ? 'Mode Tamu Aktif' : 'Guest Mode Active',
      language === 'id' ? 'Mengeksplorasi aplikasi dengan data lokal.' : 'Exploring app with local data.',
      'info'
    );
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
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      categoryName: category?.name || txData.categoryName || 'General'
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Supabase persist
    if (user && isSupabaseConfigured()) {
      supabase.from('transactions').insert({
        user_id: user.id,
        description: txData.description,
        amount: txData.amount,
        type: txData.type,
        category_id: (txData.categoryId && !txData.categoryId.startsWith('cat-')) ? txData.categoryId : null,
        date: txData.date,
        is_recurring: Boolean(txData.isRecurring),
        note: txData.note || null,
        workspace: workspaceType
      }).then(({ error }) => {
        if (error) console.warn('Supabase insert transaction error:', error);
      });
    }

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
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      categoryName: category?.name || txData.categoryName || 'General',
      receiptData: receipt,
      hasReceipt: true
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (user && isSupabaseConfigured()) {
      supabase.from('transactions').insert({
        user_id: user.id,
        description: txData.description,
        amount: txData.amount,
        type: txData.type,
        category_id: (txData.categoryId && !txData.categoryId.startsWith('cat-')) ? txData.categoryId : null,
        date: txData.date,
        is_recurring: Boolean(txData.isRecurring),
        note: txData.note || null,
        workspace: workspaceType
      }).then(({ error }) => {
        if (error) console.warn('Supabase insert transaction error:', error);
      });
    }

    // Automatically file document receipt into the Documents vault
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

    if (user && isSupabaseConfigured()) {
      supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id).then(({ error }) => {
        if (error) console.warn('Supabase delete transaction error:', error);
      });
    }

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
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };
    setCategories((prev) => [...prev, newCat]);

    if (user && isSupabaseConfigured()) {
      supabase.from('budget_categories').insert({
        user_id: user.id,
        name: catData.name,
        group: catData.group,
        planned: catData.planned,
        icon_name: catData.iconName || 'Tag',
        workspace: workspaceType
      }).then(({ error }) => {
        if (error) console.warn('Supabase insert category error:', error);
      });
    }

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

    if (user && isSupabaseConfigured() && !id.startsWith('cat-')) {
      supabase.from('budget_categories').update({
        planned: Math.max(0, planned),
        updated_at: new Date().toISOString()
      }).eq('id', id).eq('user_id', user.id).then();
    }
  };

  const updateCategoryName = (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim() || c.name } : c))
    );

    if (user && isSupabaseConfigured() && !id.startsWith('cat-')) {
      supabase.from('budget_categories').update({
        name: name.trim(),
        updated_at: new Date().toISOString()
      }).eq('id', id).eq('user_id', user.id).then();
    }
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (user && isSupabaseConfigured() && !id.startsWith('cat-')) {
      supabase.from('budget_categories').delete().eq('id', id).eq('user_id', user.id).then();
    }

    showToast('Category deleted', `Removed category "${cat?.name || id}"`);
  };

  const addProject = (projData: Omit<Project, 'id' | 'paid' | 'outstanding'>) => {
    const newProj: Project = {
      ...projData,
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      id: `cli-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
    const normalized = type === 'student' ? 'student' : 'freelancer';
    if (user && isSupabaseConfigured()) {
      supabase.from('profiles').update({
        workspace_type: normalized,
        updated_at: new Date().toISOString()
      }).eq('id', user.id).then(({ error }) => {
        if (error) console.warn('Supabase update workspace error:', error);
      });
    }

    if (type === 'student') {
      setWorkspaceName(userProfile?.fullName || 'Alex (Pelajar & Mahasiswa)');
      showToast(
        language === 'id' ? 'Mode Pelajar Aktif 🎓' : 'Student Mode Active 🎓',
        language === 'id' 
          ? 'Beralih ke workspace Pelajar & Mahasiswa (Uang Saku, Tugas & Catatan Kuliah).' 
          : 'Switched to Student workspace (Allowance, Academic Tasks & Lecture Notes).',
        'info'
      );
    } else {
      setWorkspaceName(userProfile?.fullName ? `${userProfile.fullName} Studio` : 'Alex Rivera Studio');
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
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);

    if (user && isSupabaseConfigured()) {
      supabase.from('notes').insert({
        user_id: user.id,
        title: noteData.title,
        content: noteData.content,
        category: noteData.category,
        subject: noteData.subject || null,
        tags: noteData.tags,
        pinned: Boolean(noteData.pinned),
        color: noteData.color || 'emerald',
        workspace: noteData.workspace
      }).then(({ error }) => {
        if (error) console.warn('Supabase insert note error:', error);
      });
    }

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

    if (user && isSupabaseConfigured() && !id.startsWith('note-')) {
      supabase.from('notes').update({
        ...updated,
        updated_at: new Date().toISOString()
      }).eq('id', id).eq('user_id', user.id).then(({ error }) => {
        if (error) console.warn('Supabase update note error:', error);
      });
    }

    showToast(
      language === 'id' ? 'Catatan Diperbarui' : 'Note Updated',
      language === 'id' ? 'Perubahan catatan berhasil disimpan.' : 'Note changes saved.',
      'info'
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));

    if (user && isSupabaseConfigured() && !id.startsWith('note-')) {
      supabase.from('notes').delete().eq('id', id).eq('user_id', user.id).then(({ error }) => {
        if (error) console.warn('Supabase delete note error:', error);
      });
    }

    showToast(
      language === 'id' ? 'Catatan Dihapus' : 'Note Deleted',
      language === 'id' ? 'Catatan telah dihapus.' : 'Note removed.',
      'info'
    );
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newPinned = !n.pinned;
          if (user && isSupabaseConfigured() && !id.startsWith('note-')) {
            supabase.from('notes').update({
              pinned: newPinned,
              updated_at: new Date().toISOString()
            }).eq('id', id).eq('user_id', user.id).then();
          }
          return { ...n, pinned: newPinned };
        }
        return n;
      })
    );
  };

  // Task Management CRUD
  const addTask = (taskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setTasks((prev) => [newTask, ...prev]);

    if (user && isSupabaseConfigured()) {
      supabase.from('tasks').insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description || null,
        due_date: taskData.dueDate,
        due_time: taskData.dueTime || '23:59',
        priority: taskData.priority,
        status: taskData.status,
        category: taskData.category,
        subject_or_project: taskData.subjectOrProject || null,
        workspace: taskData.workspace
      }).then(({ error }) => {
        if (error) console.warn('Supabase insert task error:', error);
      });
    }

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
          const completedAt = status === 'completed' ? new Date().toISOString() : undefined;
          if (user && isSupabaseConfigured() && !id.startsWith('task-')) {
            supabase.from('tasks').update({
              status,
              completed_at: completedAt || null,
              updated_at: new Date().toISOString()
            }).eq('id', id).eq('user_id', user.id).then();
          }
          return {
            ...t,
            status,
            completedAt,
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
    if (user && isSupabaseConfigured() && !id.startsWith('task-')) {
      supabase.from('tasks').update({
        ...updated,
        updated_at: new Date().toISOString()
      }).eq('id', id).eq('user_id', user.id).then();
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (user && isSupabaseConfigured() && !id.startsWith('task-')) {
      supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id).then();
    }
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
        // Supabase Auth
        user,
        userProfile,
        authLoading,
        isGuestDemo,
        login,
        register,
        logout,
        bypassDemoAuth,
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

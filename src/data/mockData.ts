import { 
  BudgetCategory, 
  Transaction, 
  Project, 
  Client, 
  Invoice, 
  AIInsight, 
  DocumentItem,
  AttentionItem,
  NoteItem,
  TaskItem 
} from '../types';

export const INITIAL_CATEGORIES: BudgetCategory[] = [
  // Income
  { id: 'cat-inc-1', name: 'Freelance Projects', group: 'income', planned: 88000000, iconName: 'Briefcase' },
  { id: 'cat-inc-2', name: 'Design Advisory / Retainers', group: 'income', planned: 16000000, iconName: 'Clock' },
  { id: 'cat-inc-3', name: 'Digital Templates & Assets', group: 'income', planned: 4800000, iconName: 'Download' },

  // Needs
  { id: 'cat-need-1', name: 'Studio & Rent', group: 'needs', planned: 19200000, iconName: 'Home' },
  { id: 'cat-need-2', name: 'Groceries & Household', group: 'needs', planned: 6400000, iconName: 'ShoppingBag' },
  { id: 'cat-need-3', name: 'Transportation & Transit', group: 'needs', planned: 3200000, iconName: 'Navigation' },
  { id: 'cat-need-4', name: 'Utilities & Power', group: 'needs', planned: 2880000, iconName: 'Zap' },
  { id: 'cat-need-5', name: 'Internet & Mobile Plan', group: 'needs', planned: 2400000, iconName: 'Wifi' },

  // Wants
  { id: 'cat-want-1', name: 'Dining & Coffee', group: 'wants', planned: 5600000, iconName: 'Coffee' },
  { id: 'cat-want-2', name: 'Software & Subscriptions', group: 'wants', planned: 1600000, iconName: 'Layers' },
  { id: 'cat-want-3', name: 'Entertainment & Culture', group: 'wants', planned: 2720000, iconName: 'Film' },
  { id: 'cat-want-4', name: 'Equipment & Workspace Gear', group: 'wants', planned: 3200000, iconName: 'Monitor' },

  // Financial Goals
  { id: 'cat-goal-1', name: 'Emergency Tax & Reserve', group: 'goals', planned: 8000000, iconName: 'ShieldCheck' },
  { id: 'cat-goal-2', name: 'Index Funds & Savings', group: 'goals', planned: 6400000, iconName: 'TrendingUp' },
  { id: 'cat-goal-3', name: 'Courses & Design Books', group: 'goals', planned: 1600000, iconName: 'BookOpen' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Adobe Creative Cloud',
    amount: 950000,
    type: 'expense',
    categoryId: 'cat-want-2',
    categoryName: 'Software & Subscriptions',
    date: '2026-09-03',
    isRecurring: true,
    note: 'Monthly creative suite subscription'
  },
  {
    id: 'tx-2',
    description: 'Acme Studio — Milestone 1 Payment',
    amount: 24000000,
    type: 'income',
    categoryId: 'cat-inc-1',
    categoryName: 'Freelance Projects',
    date: '2026-09-02',
    clientId: 'cli-1',
    clientName: 'Acme Studio',
    projectId: 'proj-1',
    projectName: 'Website Redesign',
    note: 'Wireframes & Information Architecture sign-off'
  },
  {
    id: 'tx-3',
    description: 'Grab Transport to Client Workshop',
    amount: 295000,
    type: 'expense',
    categoryId: 'cat-need-3',
    categoryName: 'Transportation & Transit',
    date: '2026-09-02',
    projectId: 'proj-1',
    projectName: 'Website Redesign',
    clientId: 'cli-1',
    clientName: 'Acme Studio'
  },
  {
    id: 'tx-4',
    description: 'Figma Professional Team Plan',
    amount: 928000,
    type: 'expense',
    categoryId: 'cat-want-2',
    categoryName: 'Software & Subscriptions',
    date: '2026-09-02',
    isRecurring: true,
    note: 'Plan price updated (+1 seat)'
  },
  {
    id: 'tx-5',
    description: 'Coffee Meeting & Lunch',
    amount: 390000,
    type: 'expense',
    categoryId: 'cat-want-1',
    categoryName: 'Dining & Coffee',
    date: '2026-09-03'
  },
  {
    id: 'tx-6',
    description: 'Studio Workspace Lease',
    amount: 19200000,
    type: 'expense',
    categoryId: 'cat-need-1',
    categoryName: 'Studio & Rent',
    date: '2026-09-01',
    isRecurring: true,
    note: 'September desk & studio space rent'
  },
  {
    id: 'tx-7',
    description: 'Lumina Labs — Brand Sprint Retainer',
    amount: 38400000,
    type: 'income',
    categoryId: 'cat-inc-1',
    categoryName: 'Freelance Projects',
    date: '2026-09-01',
    clientId: 'cli-2',
    clientName: 'Lumina Labs',
    projectId: 'proj-2',
    projectName: 'Brand Identity & Design System'
  },
  {
    id: 'tx-8',
    description: 'Groceries & Household Supplies',
    amount: 2270000,
    type: 'expense',
    categoryId: 'cat-need-2',
    categoryName: 'Groceries & Household',
    date: '2026-09-01'
  },
  {
    id: 'tx-9',
    description: 'Monthly Transit & Commute Pass',
    amount: 1945000,
    type: 'expense',
    categoryId: 'cat-need-3',
    categoryName: 'Transportation & Transit',
    date: '2026-09-01',
    isRecurring: true
  },
  {
    id: 'tx-10',
    description: 'High-Speed Fiber Internet',
    amount: 1520000,
    type: 'expense',
    categoryId: 'cat-need-5',
    categoryName: 'Internet & Mobile Plan',
    date: '2026-09-02',
    isRecurring: true
  },
  {
    id: 'tx-11',
    description: 'Mobile Cellular Plan',
    amount: 880000,
    type: 'expense',
    categoryId: 'cat-need-5',
    categoryName: 'Internet & Mobile Plan',
    date: '2026-09-02',
    isRecurring: true
  },
  {
    id: 'tx-12',
    description: 'Emergency Tax Reserve Allocation',
    amount: 8000000,
    type: 'expense',
    categoryId: 'cat-goal-1',
    categoryName: 'Emergency Tax & Reserve',
    date: '2026-09-01',
    note: 'Automatic quarterly tax transfer'
  },
  {
    id: 'tx-13',
    description: 'Index Funds Investment',
    amount: 6400000,
    type: 'expense',
    categoryId: 'cat-goal-2',
    categoryName: 'Index Funds & Savings',
    date: '2026-09-01'
  },
  {
    id: 'tx-14',
    description: 'Zenith Health Advisory Session',
    amount: 8320000,
    type: 'income',
    categoryId: 'cat-inc-2',
    categoryName: 'Design Advisory / Retainers',
    date: '2026-09-03',
    clientId: 'cli-3',
    clientName: 'Zenith Health'
  },
  {
    id: 'tx-15',
    description: 'Gumroad UI Kit Sales',
    amount: 2880000,
    type: 'income',
    categoryId: 'cat-inc-3',
    categoryName: 'Digital Templates & Assets',
    date: '2026-09-02'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    clientId: 'cli-1',
    clientName: 'Acme Studio',
    status: 'active',
    progress: 72,
    deadline: '2026-09-18',
    value: 38400000,
    paid: 19200000,
    outstanding: 19200000,
    description: 'Modern headless responsive marketing website redesign with motion choreography.',
    milestones: [
      { title: 'Information Architecture & Wireframes', completed: true, dueDate: '2026-08-28' },
      { title: 'High-Fidelity Visual Design', completed: true, dueDate: '2026-09-08' },
      { title: 'Interactive Prototype Review', completed: false, dueDate: '2026-09-14' },
      { title: 'Final Asset Handoff & Launch', completed: false, dueDate: '2026-09-18' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Brand Identity & Design System',
    clientId: 'cli-2',
    clientName: 'Lumina Labs',
    status: 'in_review',
    progress: 45,
    deadline: '2026-10-05',
    value: 76800000,
    paid: 38400000,
    outstanding: 38400000,
    description: 'Comprehensive brand typography, logo suite, token system, and Figma component kit.',
    milestones: [
      { title: 'Moodboards & Creative Direction', completed: true, dueDate: '2026-08-25' },
      { title: 'Primary Mark & Typography System', completed: true, dueDate: '2026-09-02' },
      { title: 'Brand Guidelines PDF Documentation', completed: false, dueDate: '2026-09-20' },
      { title: 'Component Library & Token Export', completed: false, dueDate: '2026-10-05' }
    ]
  },
  {
    id: 'proj-3',
    name: 'Mobile Patient App MVP',
    clientId: 'cli-3',
    clientName: 'Zenith Health',
    status: 'active',
    progress: 90,
    deadline: '2026-09-12',
    value: 56000000,
    paid: 56000000,
    outstanding: 0,
    description: 'UX flows and UI mockups for clinical telemedicine appointment scheduling.',
    milestones: [
      { title: 'Patient User Journeys', completed: true, dueDate: '2026-08-15' },
      { title: 'Dark/Light Telehealth Screens', completed: true, dueDate: '2026-08-30' },
      { title: 'Developer Handoff Specs', completed: false, dueDate: '2026-09-12' }
    ]
  },
  {
    id: 'proj-4',
    name: 'SaaS Analytics Dashboard UI',
    clientId: 'cli-4',
    clientName: 'Kinetix Analytics',
    status: 'active',
    progress: 30,
    deadline: '2026-10-20',
    value: 51200000,
    paid: 16000000,
    outstanding: 35200000,
    description: 'Data density optimization and modern chart UI patterns for enterprise tier.',
    milestones: [
      { title: 'Dashboard Heuristic Audit', completed: true, dueDate: '2026-09-01' },
      { title: 'Widget Architecture & Bento Grids', completed: false, dueDate: '2026-09-25' },
      { title: 'Design System Integration', completed: false, dueDate: '2026-10-20' }
    ]
  },
  {
    id: 'proj-5',
    name: 'E-commerce Checkout Audit',
    clientId: 'cli-5',
    clientName: 'Haven Goods',
    status: 'completed',
    progress: 100,
    deadline: '2026-08-30',
    value: 24000000,
    paid: 24000000,
    outstanding: 0,
    description: 'Friction point analysis and one-step checkout redesign that boosted conversion.',
    milestones: [
      { title: 'Funnel Dropoff Analysis', completed: true, dueDate: '2026-08-15' },
      { title: 'Optimized Checkout Prototypes', completed: true, dueDate: '2026-08-25' },
      { title: 'Final Report & Implementation Guide', completed: true, dueDate: '2026-08-30' }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Sarah Lin',
    company: 'Acme Studio',
    email: 'sarah@acmestudio.design',
    phone: '+1 (415) 892-4190',
    activeProjectsCount: 1,
    totalRevenue: 131200000,
    outstandingBalance: 19200000,
    lastActivity: '2 hours ago',
    notes: 'Long-term client. Prefers updates via Loom and Slack.'
  },
  {
    id: 'cli-2',
    name: 'Marcus Vance',
    company: 'Lumina Labs',
    email: 'marcus@luminalabs.ai',
    phone: '+1 (650) 412-9901',
    activeProjectsCount: 1,
    totalRevenue: 76800000,
    outstandingBalance: 38400000,
    lastActivity: 'Yesterday',
    notes: 'Series A startup. Fast-moving team, prompt payments.'
  },
  {
    id: 'cli-3',
    name: 'Dr. Elena Rostova',
    company: 'Zenith Health',
    email: 'elena@zenithhealth.io',
    phone: '+1 (312) 554-1029',
    activeProjectsCount: 1,
    totalRevenue: 104000000,
    outstandingBalance: 0,
    lastActivity: '3 days ago',
    notes: 'Healthcare regulatory compliance focus. Clear feedback loops.'
  },
  {
    id: 'cli-4',
    name: 'David Chen',
    company: 'Kinetix Analytics',
    email: 'david@kinetix.co',
    phone: '+1 (206) 773-8102',
    activeProjectsCount: 1,
    totalRevenue: 51200000,
    outstandingBalance: 35200000,
    lastActivity: 'Sep 01, 2026',
    notes: 'Net-30 payment terms. Requires detailed milestone invoices.'
  },
  {
    id: 'cli-5',
    name: 'Chloe Morales',
    company: 'Haven Goods',
    email: 'chloe@havengoods.store',
    phone: '+1 (512) 902-3341',
    activeProjectsCount: 0,
    totalRevenue: 48000000,
    outstandingBalance: 0,
    lastActivity: 'Aug 30, 2026',
    notes: 'Completed checkout revamp. Potential Q4 re-engagement.'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-024',
    number: 'INV-024',
    clientId: 'cli-1',
    clientName: 'Acme Studio',
    clientEmail: 'sarah@acmestudio.design',
    projectId: 'proj-1',
    projectName: 'Website Redesign',
    amount: 24000000,
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'sent',
    items: [
      { description: 'Design Milestone 2: High Fidelity Mockups', quantity: 1, rate: 19200000, amount: 19200000 },
      { description: 'Interactive Motion Prototype in Framer', quantity: 1, rate: 4800000, amount: 4800000 }
    ],
    notes: 'Net 14 payment terms. Thank you for your continued partnership!'
  },
  {
    id: 'inv-023',
    number: 'INV-023',
    clientId: 'cli-2',
    clientName: 'Lumina Labs',
    clientEmail: 'marcus@luminalabs.ai',
    projectId: 'proj-2',
    projectName: 'Brand Identity & Design System',
    amount: 38400000,
    issueDate: '2026-09-03',
    dueDate: '2026-10-01',
    status: 'draft',
    items: [
      { description: 'Phase 2: Brand Tokens & Component Kit', quantity: 1, rate: 38400000, amount: 38400000 }
    ],
    notes: 'Scheduled for delivery upon Phase 2 preview.'
  },
  {
    id: 'inv-022',
    number: 'INV-022',
    clientId: 'cli-3',
    clientName: 'Zenith Health',
    clientEmail: 'elena@zenithhealth.io',
    projectId: 'proj-3',
    projectName: 'Mobile Patient App MVP',
    amount: 28800000,
    issueDate: '2026-08-15',
    dueDate: '2026-08-28',
    status: 'paid',
    items: [
      { description: 'Sprint 2: Patient User Flows & Wireframes', quantity: 1, rate: 28800000, amount: 28800000 }
    ]
  },
  {
    id: 'inv-021',
    number: 'INV-021',
    clientId: 'cli-1',
    clientName: 'Acme Studio',
    clientEmail: 'sarah@acmestudio.design',
    projectId: 'proj-1',
    projectName: 'Website Redesign',
    amount: 14400000,
    issueDate: '2026-08-01',
    dueDate: '2026-08-20',
    status: 'overdue',
    items: [
      { description: 'Discovery Workshop & Competitor Benchmarking', quantity: 1, rate: 14400000, amount: 14400000 }
    ],
    notes: 'Past due by 14 days. Please follow up on invoice processing.'
  },
  {
    id: 'inv-020',
    number: 'INV-020',
    clientId: 'cli-4',
    clientName: 'Kinetix Analytics',
    clientEmail: 'david@kinetix.co',
    projectId: 'proj-4',
    projectName: 'SaaS Analytics Dashboard UI',
    amount: 16000000,
    issueDate: '2026-08-18',
    dueDate: '2026-09-01',
    status: 'paid',
    items: [
      { description: 'Initial Deposit & Scope Definition', quantity: 1, rate: 16000000, amount: 16000000 }
    ]
  }
];

export const INITIAL_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'att-1',
    title: '1 invoice overdue (INV-021 Acme Studio)',
    description: 'INV-021 from Acme Studio is past due by 14 days.',
    type: 'invoice',
    actionLabel: 'Send reminder',
    actionTarget: 'invoices',
    priority: 'high'
  },
  {
    id: 'att-2',
    title: 'Dining & Coffee budget almost reached target',
    description: '98.5% used with 27 days remaining in the month.',
    type: 'budget',
    actionLabel: 'Adjust budget',
    actionTarget: 'budget',
    priority: 'high'
  },
  {
    id: 'att-3',
    title: 'Client approval waiting on Lumina Labs',
    description: 'Brand Guidelines PDF awaiting sign-off from Marcus Vance.',
    type: 'approval',
    actionLabel: 'Review status',
    actionTarget: 'projects',
    priority: 'medium'
  },
  {
    id: 'att-4',
    title: 'Subscription expense adjusted',
    description: 'Figma billing adjusted (+1 seat added).',
    type: 'subscription',
    actionLabel: 'Review subscriptions',
    actionTarget: 'transactions',
    priority: 'medium'
  },
  {
    id: 'att-5',
    title: 'Project deadline approaching in 9 days',
    description: 'Mobile Patient App MVP for Zenith Health due on Sep 12.',
    type: 'deadline',
    actionLabel: 'Open project',
    actionTarget: 'projects',
    priority: 'high'
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-1',
    category: 'spending',
    title: 'Software subscriptions increased by 18%',
    observation: 'Your monthly SaaS and digital tool expenses rose from $98 to $118 this month due to an added Figma seat and adjusted Adobe tax.',
    supportingData: 'Planned: $100 | Actual: $118 (+18% variance). 3 recurring subscriptions detected.',
    suggestedActionText: 'Audit subscriptions',
    actionId: 'transactions',
    severity: 'warning'
  },
  {
    id: 'ai-2',
    category: 'budget',
    title: 'You are $1,260 under total planned spending',
    observation: 'Your expense velocity is on track for a healthy month-end surplus. Most core essentials are covered with 27 days remaining.',
    supportingData: 'Monthly Budget: $4,000 | Spent: $2,740 (68.5%) | Target pace: ~70%',
    suggestedActionText: 'View budget breakdown',
    actionId: 'budget',
    severity: 'positive'
  },
  {
    id: 'ai-3',
    category: 'cashflow',
    title: '2 outstanding invoices may affect available cash',
    observation: 'Outstanding receivables total $2,400 across Acme Studio and Lumina Labs. Receiving INV-021 will bolster your liquid reserve.',
    supportingData: 'Overdue: $900 (Acme Studio) | Pending: $1,500 (Due Sep 15)',
    suggestedActionText: 'Send invoice reminders',
    actionId: 'invoices',
    severity: 'warning'
  },
  {
    id: 'ai-4',
    category: 'projects',
    title: 'Two high-value projects reaching milestone reviews',
    observation: 'Website Redesign is 72% done with deadline on Sep 18. Patient App MVP handoff is scheduled for Sep 12.',
    supportingData: 'Combined contract value: $5,900 with $1,200 remaining billing on completion.',
    suggestedActionText: 'Review active milestones',
    actionId: 'projects',
    severity: 'neutral'
  },
  {
    id: 'ai-5',
    category: 'clients',
    title: 'Acme Studio generated 35% of your revenue this quarter',
    observation: 'Sarah Lin is your highest-value ongoing partner with $8,200 in total engagements and consistent monthly scope.',
    supportingData: '3 projects completed, 1 active. Average invoice turnaround: 12 days.',
    suggestedActionText: 'View Acme client profile',
    actionId: 'clients',
    severity: 'positive'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Master Service Agreement — Acme Studio',
    category: 'contract',
    clientId: 'cli-1',
    clientName: 'Acme Studio',
    uploadDate: '2026-08-01',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    status: 'Signed'
  },
  {
    id: 'doc-2',
    title: 'Website Redesign Proposal & SOW',
    category: 'proposal',
    clientId: 'cli-1',
    clientName: 'Acme Studio',
    uploadDate: '2026-08-10',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    status: 'Approved'
  },
  {
    id: 'doc-3',
    title: 'Brand Guidelines Draft v1.2',
    category: 'guidelines',
    clientId: 'cli-2',
    clientName: 'Lumina Labs',
    uploadDate: '2026-09-02',
    fileSize: '8.2 MB',
    fileType: 'PDF',
    status: 'In Review'
  },
  {
    id: 'doc-4',
    title: 'Q3 Tax Deductible Receipts Summary',
    category: 'receipt',
    uploadDate: '2026-09-01',
    fileSize: '890 KB',
    fileType: 'PDF',
    status: 'Archived'
  }
];

export const CASH_FLOW_DATA = {
  '7D': [
    { label: 'Aug 29', income: 0, expense: 720000 },
    { label: 'Aug 30', income: 24000000, expense: 1440000 },
    { label: 'Aug 31', income: 0, expense: 480000 },
    { label: 'Sep 01', income: 38400000, expense: 36208000 },
    { label: 'Sep 02', income: 26880000, expense: 3008000 },
    { label: 'Sep 03', income: 8320000, expense: 1344000 },
    { label: 'Today', income: 5120000, expense: 640000 }
  ],
  '30D': [
    { label: 'Week 1', income: 60800000, expense: 30400000 },
    { label: 'Week 2', income: 19200000, expense: 9920000 },
    { label: 'Week 3', income: 38400000, expense: 13600000 },
    { label: 'Week 4', income: 43200000, expense: 15680000 }
  ],
  '3M': [
    { label: 'July 2026', income: 92800000, expense: 49600000 },
    { label: 'August 2026', income: 113600000, expense: 46240000 },
    { label: 'September 2026 (Est.)', income: 102720000, expense: 43840000 }
  ],
  '12M': [
    { label: 'Oct', income: 76800000, expense: 38400000 },
    { label: 'Nov', income: 83200000, expense: 41600000 },
    { label: 'Dec', income: 97600000, expense: 51200000 },
    { label: 'Jan', income: 72000000, expense: 36800000 },
    { label: 'Feb', income: 94400000, expense: 40000000 },
    { label: 'Mar', income: 108800000, expense: 46400000 },
    { label: 'Apr', income: 86400000, expense: 43200000 },
    { label: 'May', income: 115200000, expense: 49600000 },
    { label: 'Jun', income: 105600000, expense: 44800000 },
    { label: 'Jul', income: 92800000, expense: 49600000 },
    { label: 'Aug', income: 113600000, expense: 46240000 },
    { label: 'Sep', income: 102720000, expense: 43840000 }
  ]
};

export const STUDENT_BUDGET_CATEGORIES: BudgetCategory[] = [
  // Income
  { id: 'cat-stu-inc-1', name: 'Uang Saku Bulanan (Orang Tua)', group: 'income', planned: 3000000, iconName: 'Wallet' },
  { id: 'cat-stu-inc-2', name: 'Beasiswa Pendidikan & Prestasi', group: 'income', planned: 1500000, iconName: 'Award' },
  { id: 'cat-stu-inc-3', name: 'Freelance & Part-time / Asisten', group: 'income', planned: 1200000, iconName: 'Laptop' },

  // Needs
  { id: 'cat-stu-need-1', name: 'Uang Kos & Listrik Kamar', group: 'needs', planned: 1500000, iconName: 'Home' },
  { id: 'cat-stu-need-2', name: 'Makan Harian & Sembako Kos', group: 'needs', planned: 1200000, iconName: 'Utensils' },
  { id: 'cat-stu-need-3', name: 'SPP / Cicilan UKT Kuliah', group: 'needs', planned: 800000, iconName: 'GraduationCap' },
  { id: 'cat-stu-need-4', name: 'Buku, Diktat & Fotokopi Tugas', group: 'needs', planned: 250000, iconName: 'BookOpen' },
  { id: 'cat-stu-need-5', name: 'Transportasi & Bensin Motor', group: 'needs', planned: 300000, iconName: 'Bike' },
  { id: 'cat-stu-need-6', name: 'Kuota Internet & Pulsa', group: 'needs', planned: 150000, iconName: 'Wifi' },

  // Wants
  { id: 'cat-stu-want-1', name: 'Kopi Nugas & Kafe Diskusi', group: 'wants', planned: 350000, iconName: 'Coffee' },
  { id: 'cat-stu-want-2', name: 'Jajan & Hangout Kampus', group: 'wants', planned: 300000, iconName: 'ShoppingBag' },
  { id: 'cat-stu-want-3', name: 'Streaming & Langganan Edukasi', group: 'wants', planned: 100000, iconName: 'Layers' },

  // Goals
  { id: 'cat-stu-goal-1', name: 'Tabungan Magang & Skripsi', group: 'goals', planned: 400000, iconName: 'TrendingUp' },
  { id: 'cat-stu-goal-2', name: 'Dana Darurat Mahasiswa', group: 'goals', planned: 350000, iconName: 'ShieldCheck' },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Catatan Kuliah: Algoritma & Struktur Data (Pertemuan 4)',
    content: 'Materi pembahasan Binary Search Tree & Kompleksitas Algoritma:\n• Waktu pencarian rata-rata O(log n), terburuk O(n) jika skewed.\n• Implementasi AVL Tree untuk self-balancing.\n• Latihan soal praktikum nomor 3 dan 5 harus dikumpulkan Jumat minggu ini.',
    category: 'academic',
    subject: 'CS-201 Pemrograman Lanjut',
    tags: ['Algoritma', 'Ujian Tengah Semester', 'Praktikum'],
    pinned: true,
    color: 'emerald',
    workspace: 'all',
    createdAt: '2026-09-02T10:30:00.000Z',
    updatedAt: '2026-09-03T14:20:00.000Z'
  },
  {
    id: 'note-2',
    title: 'Ide Topik Skripsi: Sistem Manajemen Keuangan Personal Mahasiswa',
    content: 'Latar Belakang:\nBanyak mahasiswa kesulitan mengelola uang saku bulanan dan sering kehabisan dana di pertengahan bulan.\n\nFitur Utama:\n1. Amplop anggaran digital (Needs 50%, Wants 30%, Savings 20%).\n2. AI OCR scanner struk belanja kantin & minimarket.\n3. Integrasi catatan kuliah dan pengingat deadline tugas akademik.',
    category: 'academic',
    subject: 'Tugas Akhir / Capstone',
    tags: ['Skripsi', 'Fintech', 'Riset'],
    pinned: true,
    color: 'blue',
    workspace: 'all',
    createdAt: '2026-08-28T09:15:00.000Z',
    updatedAt: '2026-09-01T11:00:00.000Z'
  },
  {
    id: 'note-3',
    title: 'Brief Proyek Desain UI/UX Klien Studio Acme',
    content: 'Catatan pertemuan kick-off:\n• Klien menginginkan palet warna monokromatik dengan sentuhan aksen emerald.\n• Wireframe selesai dalam 7 hari kerja.\n• Pembayaran termin 1 (50%) sudah diterima masuk ke buku kas studio.',
    category: 'project',
    subject: 'Freelance Studio',
    tags: ['Acme Studio', 'UI/UX', 'Kontrak'],
    pinned: false,
    color: 'amber',
    workspace: 'freelance',
    createdAt: '2026-08-30T16:00:00.000Z',
    updatedAt: '2026-09-02T18:45:00.000Z'
  },
  {
    id: 'note-4',
    title: 'Rencana Anggaran Uang Saku & Biaya Hidup Semester Ini',
    content: 'Target Pengeluaran Harian:\n• Makan siang kampus: Rp 20.000 - Rp 25.000\n• Makan malam kos: Rp 15.000 - Rp 20.000\n• Total harian maks: Rp 45.000\n\nCatatan Penting:\nSisihkan 10% uang saku saat pertama kali ditransfer di awal bulan langsung ke tabungan darurat.',
    category: 'finance',
    subject: 'Budget Mahasiswa',
    tags: ['Hemat', 'Uang Saku', 'Target'],
    pinned: false,
    color: 'purple',
    workspace: 'student',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Kumpulkan Laporan Praktikum Jaringan Komputer',
    description: 'Format PDF, sertakan tangkapan layar simulasi Cisco Packet Tracer Topologi Star.',
    dueDate: '2026-09-06',
    dueTime: '23:59',
    priority: 'high',
    status: 'pending',
    category: 'assignment',
    subjectOrProject: 'Praktikum Jarkom',
    workspace: 'student'
  },
  {
    id: 'task-2',
    title: 'Bayar Uang Kuliah Tunggal (UKT) Semester Gasal',
    description: 'Pembayaran via Virtual Account Bank BNI sebelum batas akhir penutupan KRS.',
    dueDate: '2026-09-10',
    dueTime: '17:00',
    priority: 'high',
    status: 'in_progress',
    category: 'financial',
    subjectOrProject: 'Administrasi Akademik',
    workspace: 'all'
  },
  {
    id: 'task-3',
    title: 'Selesaikan Desain Banner Promosi Klien PT Lumina',
    description: 'Ukuran 1200x630px untuk media sosial & banner web format Figma.',
    dueDate: '2026-09-07',
    dueTime: '18:00',
    priority: 'high',
    status: 'pending',
    category: 'project',
    subjectOrProject: 'PT Lumina Media',
    workspace: 'freelance'
  },
  {
    id: 'task-4',
    title: 'Bimbingan Bab 2 Skripsi & Studi Literatur',
    description: 'Konsultasi dengan Dosen Pembimbing di Gedung Rektorat Lt. 3 jam 10:00 WIB.',
    dueDate: '2026-09-12',
    dueTime: '10:00',
    priority: 'medium',
    status: 'pending',
    category: 'assignment',
    subjectOrProject: 'Skripsi / Tugas Akhir',
    workspace: 'student'
  },
  {
    id: 'task-5',
    title: 'Beli Buku Teks Manajemen Keuangan & Buku Catatan',
    description: 'Cari di toko buku kampus atau fotokopi modul dosen.',
    dueDate: '2026-09-05',
    dueTime: '15:00',
    priority: 'low',
    status: 'completed',
    category: 'personal',
    subjectOrProject: 'Kebutuhan Kuliah',
    workspace: 'all',
    completedAt: '2026-09-03T16:00:00.000Z'
  }
];

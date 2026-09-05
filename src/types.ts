export type ThemeMode = 'light' | 'dark';
export type Language = 'id' | 'en';
export type Currency = 'IDR' | 'USD';

export type CategoryGroup = 'income' | 'needs' | 'wants' | 'goals';

export interface BudgetCategory {
  id: string;
  name: string;
  group: CategoryGroup;
  planned: number;
  iconName?: string;
  notes?: string;
}

export interface ScannedReceiptItem {
  description: string;
  amount: number;
}

export interface ScannedReceiptData {
  merchant: string;
  date: string;
  total: number;
  tax?: number;
  suggestedCategory?: string;
  items?: ScannedReceiptItem[];
  confidence?: number;
  notes?: string;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName?: string;
  date: string; // YYYY-MM-DD
  isRecurring?: boolean;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  note?: string;
  receiptData?: ScannedReceiptData;
  hasReceipt?: boolean;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'active' | 'in_review' | 'completed' | 'on_hold';
  progress: number; // 0 to 100
  deadline: string;
  value: number;
  paid: number;
  outstanding: number;
  description: string;
  milestones?: { title: string; completed: boolean; dueDate: string }[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  activeProjectsCount: number;
  totalRevenue: number;
  outstandingBalance: number;
  lastActivity: string;
  notes?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string; // e.g. "INV-024"
  clientId: string;
  clientName: string;
  clientEmail?: string;
  projectId?: string;
  projectName?: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
}

export interface AIInsight {
  id: string;
  category: 'spending' | 'budget' | 'cashflow' | 'projects' | 'clients';
  title: string;
  observation: string;
  supportingData: string;
  suggestedActionText: string;
  actionId: string;
  severity: 'neutral' | 'warning' | 'positive';
  description?: string;
  actionLabel?: string;
  actionType?: string;
  impact?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'contract' | 'proposal' | 'guidelines' | 'invoice' | 'receipt';
  clientId?: string;
  clientName?: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  status?: string;
}

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  type: 'invoice' | 'budget' | 'approval' | 'subscription' | 'deadline';
  actionLabel: string;
  actionTarget: string; // tab or modal trigger
  priority: 'high' | 'medium';
}

export type WorkspaceType = 'freelance' | 'student';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'project' | 'finance' | 'personal';
  subject?: string;
  tags: string[];
  pinned: boolean;
  color?: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'gray';
  workspace: WorkspaceType | 'all';
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: 'assignment' | 'exam' | 'project' | 'personal' | 'financial';
  subjectOrProject?: string;
  workspace: WorkspaceType | 'all';
  completedAt?: string;
}

export type NavigationTab = 
  | 'overview'
  | 'budget'
  | 'transactions'
  | 'projects'
  | 'notes'
  | 'clients'
  | 'invoices'
  | 'ai-insights'
  | 'documents'
  | 'settings';

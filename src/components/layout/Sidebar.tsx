import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  ArrowLeftRight, 
  FolderKanban, 
  Users, 
  FileText, 
  Sparkles, 
  Files, 
  Settings, 
  Plus, 
  ChevronDown, 
  Check, 
  ExternalLink,
  HelpCircle,
  Sun,
  Moon,
  Receipt,
  Globe,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    openTransactionModal, 
    openReceiptModal,
    workspaceName, 
    setWorkspaceName,
    setIsClientPortalMode,
    setIsOnboardingOpen,
    attentionItems,
    invoices,
    projects,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    currency,
    toggleCurrency,
    openConverter,
    t
  } = useApp();

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const overdueInvoicesCount = invoices.filter((i) => i.status === 'overdue').length;
  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;

  const mainNavItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { 
      tab: 'overview', 
      label: t('overview', 'Overview'), 
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: attentionItems.length > 0 ? attentionItems.length : undefined,
      badgeColor: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
    },
    { 
      tab: 'budget', 
      label: t('budget', 'Budget'), 
      icon: <PieChart className="w-4 h-4" /> 
    },
    { 
      tab: 'transactions', 
      label: t('transactions', 'Transactions'), 
      icon: <ArrowLeftRight className="w-4 h-4" /> 
    },
    { 
      tab: 'projects', 
      label: t('projects', 'Projects'), 
      icon: <FolderKanban className="w-4 h-4" />,
      badge: activeProjectsCount,
      badgeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    },
    { 
      tab: 'clients', 
      label: t('clients', 'Clients'), 
      icon: <Users className="w-4 h-4" /> 
    },
    { 
      tab: 'invoices', 
      label: t('invoices', 'Invoices'), 
      icon: <FileText className="w-4 h-4" />,
      badge: overdueInvoicesCount > 0 ? `${overdueInvoicesCount} ${language === 'id' ? 'jatuh tempo' : 'due'}` : undefined,
      badgeColor: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
    },
    { 
      tab: 'ai-insights', 
      label: t('aiInsights', 'AI Insights'), 
      icon: <Sparkles className="w-4 h-4" /> 
    },
  ];

  const secondaryNavItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'documents', label: t('documents', 'Documents'), icon: <Files className="w-4 h-4" /> },
    { tab: 'settings', label: t('settings', 'Settings'), icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside id="sidebar-main" className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-[#E5E7EB] dark:border-gray-800 flex-col justify-between shrink-0 h-screen select-none transition-colors duration-200">
      {/* Top Header & Workspace Switcher */}
      <div className="p-5 space-y-4">
        {/* Brand logo & name */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-800 dark:bg-emerald-700 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#111827] dark:text-white">FlowLedger</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block leading-tight font-medium uppercase tracking-wider">Calm Finances</span>
            </div>
          </div>
        </div>

        {/* Workspace Switcher Pill */}
        <div className="relative">
          <button
            id="workspace-switcher-button"
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="truncate text-gray-800 dark:text-gray-200">{workspaceName}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
                Workspaces
              </div>
              <button
                onClick={() => {
                  setWorkspaceName('Alex Rivera Studio');
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                <span>Alex Rivera Studio (Business)</span>
                {workspaceName === 'Alex Rivera Studio' && <Check className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />}
              </button>
              <button
                onClick={() => {
                  setWorkspaceName('Personal Finances');
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                <span>Personal Finances</span>
                {workspaceName === 'Personal Finances' && <Check className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Quick Add Actions: Add Transaction & Scan Receipt */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="quick-add-tx-button"
            onClick={openTransactionModal}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-medium tracking-wide shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Tambah Tx' : 'Add Tx'}</span>
          </button>

          <button
            id="quick-scan-receipt-button"
            onClick={openReceiptModal}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{language === 'id' ? 'Pindai Struk' : 'Scan Receipt'}</span>
          </button>
        </div>

        {/* Currency & Language Quick Switcher Bar */}
        <div className="p-1.5 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-200/70 dark:border-gray-700 flex items-center justify-between gap-1 text-xs">
          {/* Currency Toggle + Converter Trigger */}
          <div className="flex items-center gap-1">
            <button
              id="sidebar-currency-toggle"
              onClick={toggleCurrency}
              className="flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-750 hover:shadow-xs transition-all cursor-pointer"
              title={language === 'id' ? 'Klik untuk ganti mata uang (IDR/USD)' : 'Click to switch currency (IDR/USD)'}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold">{currency === 'IDR' ? 'Rp IDR' : '$ USD'}</span>
            </button>
            <button
              id="sidebar-open-converter-btn"
              onClick={openConverter}
              className="p-1 text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-gray-750 rounded-md transition-all cursor-pointer"
              title={language === 'id' ? 'Buka Kalkulator Konverter Kurs' : 'Open Currency Converter Calculator'}
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>

          {/* Language Switcher */}
          <button
            id="sidebar-language-toggle"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md font-semibold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-750 hover:shadow-xs transition-all cursor-pointer ml-auto"
            title={language === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Bahasa Indonesia'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold">
              {language === 'id' ? '🇮🇩 ID' : '🇺🇸 EN'}
            </span>
          </button>
        </div>

        {/* Navigation List */}
        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">
            {language === 'id' ? 'Menu Utama' : 'Main Navigation'}
          </div>
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                id={`nav-${item.tab}`}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                    isActive 
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                      : (item.badgeColor || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">
            {language === 'id' ? 'Sistem' : 'System'}
          </div>
          {secondaryNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                id={`nav-${item.tab}`}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Area: Theme Switcher, Client Portal Preview Banner & User Profile */}
      <div className="p-4 border-t border-[#E5E7EB] dark:border-gray-800 space-y-2.5 bg-white dark:bg-gray-900 mt-auto">
        {/* Quick Theme Toggle Feature */}
        <button
          id="sidebar-theme-toggle"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium transition-colors cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-800" />
            )}
            <span>{theme === 'dark' ? (language === 'id' ? 'Mode Gelap' : 'Dark Mode') : (language === 'id' ? 'Mode Terang' : 'Light Mode')}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </span>
        </button>

        {/* Switch to Client Portal preview */}
        <button
          id="switch-to-client-portal-btn"
          onClick={() => setIsClientPortalMode(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate font-medium">{language === 'id' ? 'Portal Klien (Pratinjau)' : 'Client Portal View'}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
        </button>

        {/* User Profile Card */}
        <div className="relative">
          <button
            id="user-profile-menu-button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-xs hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
                AR
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">Alex Rivera</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">alex@flowledger.com</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  setIsOnboardingOpen(true);
                  setIsProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                <span>{language === 'id' ? 'Ulangi Tur Pengenalan' : 'Rerun Onboarding Tour'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-gray-500" />
                <span>{language === 'id' ? 'Akun & Preferensi' : 'Account & Preferences'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

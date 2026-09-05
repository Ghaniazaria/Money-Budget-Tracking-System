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
  Calculator,
  BookOpen,
  CheckSquare,
  GraduationCap,
  Briefcase,
  LogOut
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
    workspaceType,
    switchWorkspace,
    setIsClientPortalMode,
    setIsOnboardingOpen,
    attentionItems,
    invoices,
    projects,
    notes,
    tasks,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    currency,
    toggleCurrency,
    openConverter,
    user,
    userProfile,
    logout,
    t
  } = useApp();

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const overdueInvoicesCount = invoices.filter((i) => i.status === 'overdue').length;
  const activeProjectsCount = projects.filter((p) => p.status === 'active').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  const isStudent = workspaceType === 'student';

  // Dynamic Navigation Items tailored to Workspace Persona
  const mainNavItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = isStudent
    ? [
        { 
          tab: 'overview', 
          label: t('overview', 'Ringkasan'), 
          icon: <LayoutDashboard className="w-4 h-4" />,
          badge: attentionItems.length > 0 ? attentionItems.length : undefined,
          badgeColor: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
        },
        { 
          tab: 'budget', 
          label: language === 'id' ? 'Anggaran & Saku' : 'Allowance & Budget', 
          icon: <PieChart className="w-4 h-4" /> 
        },
        { 
          tab: 'transactions', 
          label: t('transactions', 'Transaksi'), 
          icon: <ArrowLeftRight className="w-4 h-4" /> 
        },
        { 
          tab: 'notes', 
          label: language === 'id' ? 'Catatan Kuliah' : 'Study Notes', 
          icon: <BookOpen className="w-4 h-4" />,
          badge: notes.length > 0 ? notes.length : undefined,
          badgeColor: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
        },
        { 
          tab: 'tasks', 
          label: language === 'id' ? 'Tugas & Jadwal' : 'Tasks & Deadlines', 
          icon: <CheckSquare className="w-4 h-4" />,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'
        },
        { 
          tab: 'ai-insights', 
          label: t('aiInsights', 'AI Insights'), 
          icon: <Sparkles className="w-4 h-4" /> 
        },
      ]
    : [
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
          tab: 'notes', 
          label: language === 'id' ? 'Catatan & Brief' : 'Notes & Briefs', 
          icon: <BookOpen className="w-4 h-4" />,
          badge: notes.length > 0 ? notes.length : undefined,
          badgeColor: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
        },
        { 
          tab: 'tasks', 
          label: language === 'id' ? 'Tugas Proyek' : 'Project Tasks', 
          icon: <CheckSquare className="w-4 h-4" />,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          badgeColor: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'
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

  const displayName = userProfile?.fullName || (user?.email ? user.email.split('@')[0] : 'Alex Rivera');
  const userInitials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AL';

  return (
    <aside id="sidebar-main" className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-[#E5E7EB] dark:border-gray-800 flex-col justify-between shrink-0 h-screen select-none transition-colors duration-200">
      {/* Top Header & Workspace Switcher */}
      <div className="p-5 space-y-4 overflow-y-auto">
        {/* Brand logo & name */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-800 dark:bg-emerald-700 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#111827] dark:text-white">Fins</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 block leading-tight font-medium uppercase tracking-wider">
                {isStudent ? 'Student Edition' : 'Freelance Edition'}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Switcher Pill */}
        <div className="relative">
          <button
            id="workspace-switcher-button"
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100/80 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              {isStudent ? (
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <span className="truncate text-gray-800 dark:text-gray-200 font-semibold">{workspaceName}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
                {language === 'id' ? 'Pilih Ruang Kerja' : 'Select Workspace'}
              </div>
              <button
                onClick={() => {
                  switchWorkspace('student');
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  <div>
                    <div className="font-semibold">{language === 'id' ? 'Pelajar & Mahasiswa' : 'Student & Academic'}</div>
                    <div className="text-[10px] text-gray-400">{language === 'id' ? 'Uang saku, tugas & catatan kuliah' : 'Allowance, assignments & notes'}</div>
                  </div>
                </div>
                {workspaceType === 'student' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
              <button
                onClick={() => {
                  switchWorkspace('freelancer');
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="font-semibold">{language === 'id' ? 'Pekerja Lepas / Studio' : 'Freelancer / Studio'}</div>
                    <div className="text-[10px] text-gray-400">{language === 'id' ? 'Proyek, klien, invoice & billing' : 'Projects, clients & invoices'}</div>
                  </div>
                </div>
                {workspaceType !== 'student' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
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
            {theme === 'dark' ? (language === 'id' ? 'Terang' : 'Light') : (language === 'id' ? 'Gelap' : 'Dark')}
          </span>
        </button>

        {/* Switch to Client Portal preview (Only in Freelancer Mode) */}
        {!isStudent && (
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
        )}

        {/* User Profile Card */}
        <div className="relative">
          <button
            id="user-profile-menu-button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-xs hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
                {userInitials}
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-semibold text-gray-900 dark:text-gray-100 truncate flex items-center gap-1.5">
                  <span>{displayName}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-medium ${isStudent ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'}`}>
                    {isStudent ? 'Pelajar' : 'Freelance'}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                  {user?.email || (language === 'id' ? 'Tamu (Eksplorasi)' : 'Guest Explorer')}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  switchWorkspace(isStudent ? 'freelancer' : 'student');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                {isStudent ? <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> : <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{isStudent ? (language === 'id' ? 'Ganti ke Pekerja Lepas' : 'Switch to Freelancer') : (language === 'id' ? 'Ganti ke Pelajar' : 'Switch to Student')}</span>
              </button>
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
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Keluar (Logout)' : 'Log Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

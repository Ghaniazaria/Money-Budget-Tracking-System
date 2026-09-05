import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  ArrowLeftRight, 
  FolderKanban, 
  MoreHorizontal, 
  Plus, 
  Users, 
  FileText, 
  Sparkles, 
  Files, 
  Settings, 
  X,
  ExternalLink,
  Sun,
  Moon,
  Receipt,
  Globe,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    openTransactionModal, 
    openReceiptModal,
    openQuickActionSheet,
    workspaceName,
    setIsClientPortalMode,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    currency,
    toggleCurrency,
    openConverter,
    projects,
    t
  } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const leftItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'overview', label: t('overview', 'Overview'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { tab: 'budget', label: t('budget', 'Budget'), icon: <PieChart className="w-5 h-5" /> },
  ];

  const rightItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'transactions', label: language === 'id' ? 'Aktivitas' : t('transactions', 'Activity'), icon: <ArrowLeftRight className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Drawer when "More" is tapped */}
      {isMoreMenuOpen && (
        <div 
          id="mobile-more-drawer-backdrop"
          onClick={() => setIsMoreMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden flex flex-col justify-end animate-in fade-in duration-200"
        >
          <div 
            id="mobile-more-drawer-content"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto border-t border-gray-200 dark:border-gray-800 shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
          >
            {/* Top Drag Pill */}
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-900 dark:text-gray-100 block">
                    {workspaceName}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {language === 'id' ? 'Menu & Pengaturan Cepat' : 'Menu & Quick Settings'}
                  </span>
                </div>
              </div>
              <button 
                id="close-more-drawer-btn"
                onClick={() => setIsMoreMenuOpen(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Settings Toggles Bar */}
            <div className="grid grid-cols-3 gap-2 py-1">
              {/* Currency Toggle */}
              <button
                id="drawer-currency-toggle-btn"
                onClick={toggleCurrency}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500 cursor-pointer transition-colors"
              >
                <span className="text-[10px] text-gray-400 font-medium">{language === 'id' ? 'Mata Uang' : 'Currency'}</span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-0.5">
                  {currency === 'IDR' ? '🇮🇩 IDR (Rp)' : '🇺🇸 USD ($)'}
                </span>
              </button>

              {/* Language Toggle */}
              <button
                id="drawer-language-toggle-btn"
                onClick={toggleLanguage}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500 cursor-pointer transition-colors"
              >
                <span className="text-[10px] text-gray-400 font-medium">{language === 'id' ? 'Bahasa' : 'Language'}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  {language === 'id' ? '🇮🇩 Indonesia' : '🇺🇸 English'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                id="drawer-theme-toggle-btn"
                onClick={toggleTheme}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500 cursor-pointer transition-colors"
              >
                <span className="text-[10px] text-gray-400 font-medium">{language === 'id' ? 'Tema' : 'Theme'}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'id' ? 'Terang' : 'Light'}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-emerald-800" />
                      <span>{language === 'id' ? 'Gelap' : 'Dark'}</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-medium">
              {/* Projects moved to More menu */}
              <button
                id="drawer-projects-btn"
                onClick={() => { setActiveTab('projects'); setIsMoreMenuOpen(false); }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 text-gray-800 dark:text-gray-200 text-left border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  <span>{t('projects', 'Projects')}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                  {projects.length}
                </span>
              </button>
              <button
                onClick={() => { setActiveTab('clients'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 text-gray-800 dark:text-gray-200 text-left border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>{t('clients', 'Clients')}</span>
              </button>
              <button
                onClick={() => { setActiveTab('invoices'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 text-gray-800 dark:text-gray-200 text-left border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>{t('invoices', 'Invoices')}</span>
              </button>
              <button
                onClick={() => { setActiveTab('ai-insights'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 text-gray-800 dark:text-gray-200 text-left border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>{t('aiInsights', 'AI Insights')}</span>
              </button>
              <button
                onClick={() => { setActiveTab('documents'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 text-gray-800 dark:text-gray-200 text-left border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <Files className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>{t('documents', 'Documents')}</span>
              </button>
              <button
                onClick={() => { setActiveTab('settings'); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 text-gray-800 dark:text-gray-200 text-left border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span>{t('settings', 'Settings')}</span>
              </button>
              <button
                onClick={() => { setIsClientPortalMode(true); setIsMoreMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-left border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{language === 'id' ? 'Portal Klien' : 'Client Portal'}</span>
              </button>
            </div>

            {/* Mobile Drawer Currency & Language Controls */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={() => {
                  openConverter();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-semibold text-xs">
                    {language === 'id' ? 'Kalkulator Konversi IDR ⇄ USD' : 'IDR ⇄ USD Currency Converter'}
                  </span>
                </div>
                <span className="text-xs font-bold bg-emerald-800 text-white px-2 py-0.5 rounded">
                  {currency}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Taskbar with Center Add Button */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-[#E5E7EB] dark:border-gray-800 px-3 py-1.5 z-40 flex items-center justify-between transition-colors">
        {/* Left Nav: Overview & Budget */}
        <div className="flex items-center gap-1">
          {leftItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-emerald-800 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400' : ''}`}>
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Add Button - Apple / Elevated Style */}
        <button
          id="mobile-center-add-btn"
          onClick={openQuickActionSheet}
          aria-label={language === 'id' ? 'Tambah Pengeluaran' : 'Add Expense'}
          className="relative -top-3.5 flex flex-col items-center justify-center group cursor-pointer focus:outline-hidden"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/30 dark:shadow-emerald-950/50 border-[3.5px] border-white dark:border-gray-900 group-hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 -mt-0.5 tracking-tight">
            {language === 'id' ? 'Tambah' : 'Add'}
          </span>
        </button>

        {/* Right Nav: Activity & More (contains Projects) */}
        <div className="flex items-center gap-1">
          {rightItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  isActive ? 'text-emerald-800 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400' : ''}`}>
                  {item.icon}
                </div>
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}

          <button
            id="mobile-nav-more-btn"
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
          >
            <div className="p-1 rounded-md">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="mt-0.5">{language === 'id' ? 'Lainnya' : 'More'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};


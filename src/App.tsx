import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { OverviewView } from './components/views/OverviewView';
import { BudgetView } from './components/views/BudgetView';
import { TransactionsView } from './components/views/TransactionsView';
import { ProjectsView } from './components/views/ProjectsView';
import { ClientsView } from './components/views/ClientsView';
import { InvoicesView } from './components/views/InvoicesView';
import { AIInsightsView } from './components/views/AIInsightsView';
import { DocumentsView } from './components/views/DocumentsView';
import { SettingsView } from './components/views/SettingsView';
import { ClientPortalView } from './components/views/ClientPortalView';
import { NotesTasksView } from './components/views/NotesTasksView';
import { AuthScreen } from './components/auth/AuthScreen';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { ScanReceiptModal } from './components/modals/ScanReceiptModal';
import { AppleActionSheetModal } from './components/modals/AppleActionSheetModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { CurrencyConverterModal } from './components/modals/CurrencyConverterModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab, isClientPortalMode, user, isGuestDemo, authLoading } = useApp();

  // Show a minimal smooth loading indicator while checking auth session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-800/30 border-t-emerald-800 dark:border-emerald-500/30 dark:border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-xs text-gray-500 font-medium">Memuat Fins...</span>
        </div>
      </div>
    );
  }

  // Authentication Gate: Require login or guest exploration
  if (!user && !isGuestDemo) {
    return (
      <>
        <AuthScreen />
        <ToastContainer />
      </>
    );
  }

  // If Client Portal preview mode is active, render the dedicated client-facing portal
  if (isClientPortalMode) {
    return (
      <>
        <ClientPortalView />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'budget':
        return <BudgetView />;
      case 'transactions':
        return <TransactionsView />;
      case 'notes':
      case 'tasks':
        return <NotesTasksView />;
      case 'projects':
        return <ProjectsView />;
      case 'clients':
        return <ClientsView />;
      case 'invoices':
        return <InvoicesView />;
      case 'insights':
      case 'ai-insights':
        return <AIInsightsView />;
      case 'documents':
        return <DocumentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F17] flex flex-col md:flex-row text-[#111827] dark:text-gray-100 font-sans selection:bg-emerald-800 selection:text-white transition-colors duration-200">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header Navigation */}
        <MobileNav />

        {/* Scrollable View Container */}
        <div className="flex-1 px-3.5 sm:px-6 md:px-8 pt-3 sm:pt-6 pb-24 md:pb-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </div>
      </main>

      {/* Modals & Notifications */}
      <AddTransactionModal />
      <ScanReceiptModal />
      <AppleActionSheetModal />
      <CurrencyConverterModal />
      <OnboardingModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

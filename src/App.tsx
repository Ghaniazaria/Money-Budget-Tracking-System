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
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { ScanReceiptModal } from './components/modals/ScanReceiptModal';
import { AppleActionSheetModal } from './components/modals/AppleActionSheetModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { CurrencyConverterModal } from './components/modals/CurrencyConverterModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab, isClientPortalMode } = useApp();

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

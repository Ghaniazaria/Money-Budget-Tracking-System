import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Receipt, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Coins,
  Calculator,
  GraduationCap,
  Briefcase,
  CheckSquare,
  Clock,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CASH_FLOW_DATA } from '../../data/mockData';

export const OverviewView: React.FC = () => {
  const { 
    totalAvailableBalance, 
    monthlyIncome, 
    monthlyExpenses, 
    outstandingInvoicesTotal,
    totalPlannedBudget,
    totalSpentBudget,
    remainingBudget,
    budgetProgressPercent,
    setActiveTab,
    openTransactionModal,
    openReceiptModal,
    openQuickActionSheet,
    attentionItems,
    dismissAttentionItem,
    projects,
    tasks,
    notes,
    updateTaskStatus,
    workspaceType,
    user,
    userProfile,
    sendInvoiceReminder,
    formatCurrency,
    currency,
    toggleCurrency,
    openConverter,
    language,
    t
  } = useApp();

  const [cashFlowPeriod, setCashFlowPeriod] = useState<'7D' | '30D' | '3M' | '12M'>('7D');
  const chartPoints = CASH_FLOW_DATA[cashFlowPeriod];

  // Calculate max for bar chart scaling
  const maxVal = Math.max(...chartPoints.map(p => Math.max(p.income, p.expense, 100)));

  const isStudent = workspaceType === 'student';
  const userName = userProfile?.fullName || (user?.email ? user.email.split('@')[0] : 'Alex');

  const upcomingStudentTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 4);

  const handleAttentionAction = (item: typeof attentionItems[0]) => {
    if (item.type === 'invoice') {
      sendInvoiceReminder('inv-021');
      dismissAttentionItem(item.id);
    } else if (item.type === 'budget') {
      setActiveTab('budget');
    } else if (item.type === 'subscription') {
      setActiveTab('transactions');
    } else if (item.type === 'approval' || item.type === 'deadline') {
      setActiveTab('projects');
    } else {
      setActiveTab(item.actionTarget as any);
    }
  };

  return (
    <div id="overview-dashboard-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header - Centered Layout */}
      <div className="flex flex-col items-center text-center justify-center space-y-3 sm:space-y-4 pt-1 sm:pt-2 pb-1">
        <div className="max-w-xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            {isStudent ? (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'id' ? 'Ruang Belajar & Uang Saku' : 'Student & Allowance Workspace'}</span>
              </>
            ) : (
              <>
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'id' ? 'Ruang Kerja Pekerja Lepas' : 'Freelance & Studio Workspace'}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {language === 'id' ? `Selamat Datang, ${userName}` : `Welcome back, ${userName}`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {isStudent
              ? (language === 'id' 
                  ? 'Berikut ringkasan uang saku, alokasi anggaran, dan jadwal tugas kuliah Anda.' 
                  : "Here is your allowance summary, budget allocation, and upcoming course deadlines.")
              : (language === 'id' 
                  ? 'Berikut ringkasan kesehatan finansial studio dan proyek aktif Anda hari ini.' 
                  : "Here's how your studio finances and active client retainers are looking today.")}
          </p>
        </div>

        {/* Centered Actions: Quick Currency, Budget, Scan & Add Transaction */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-0.5">
          {/* Quick Currency Toggle & Converter Pill */}
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-2xs">
            <button
              onClick={toggleCurrency}
              className="px-2.5 py-1 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-emerald-800 dark:hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
              title={language === 'id' ? 'Klik untuk ganti mata uang (IDR/USD)' : 'Click to toggle currency (IDR/USD)'}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{currency === 'IDR' ? 'Rp IDR' : '$ USD'}</span>
            </button>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 mx-0.5"></div>
            <button
              onClick={openConverter}
              className="p-1 text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
              title={language === 'id' ? 'Buka Konverter Dollar ⇄ Rupiah' : 'Open Currency Converter'}
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('budget')}
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            {isStudent ? (language === 'id' ? 'Cek Anggaran Saku' : 'Allowance Budget') : (language === 'id' ? 'Cek Anggaran' : 'Review Budget')}
          </button>
          <button
            onClick={openReceiptModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 rounded-xl transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{language === 'id' ? 'Pindai Struk' : 'Scan Receipt'}</span>
          </button>
          <button
            onClick={openQuickActionSheet}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Catat Transaksi' : 'Add Transaction'}</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight">
              {isStudent ? (language === 'id' ? 'Total Saku & Tabungan' : 'Total Allowance & Cash') : t('availableBalance', 'Available Balance')}
            </span>
            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(totalAvailableBalance)}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{isStudent ? (language === 'id' ? 'Dompet & rekening aktif' : 'Active wallet & accounts') : (language === 'id' ? 'Semua rekening likuid terhubung' : 'All liquid accounts linked')}</span>
            </div>
          </div>
        </div>

        {/* Income this month */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight">
              {isStudent ? (language === 'id' ? 'Uang Saku Masuk' : 'Allowance / Income') : t('monthlyIncome', 'Income this Month')}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-400">
              {formatCurrency(monthlyIncome)}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1">
              {isStudent ? (language === 'id' ? 'Kiriman orang tua & beasiswa' : 'Family transfer & stipend') : (language === 'id' ? 'Dari 3 retainer klien aktif' : 'Across 3 client retainers')}
            </div>
          </div>
        </div>

        {/* Expenses this month */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight">
              {isStudent ? (language === 'id' ? 'Pengeluaran Belajar & Hidup' : 'Living & Study Expenses') : t('monthlyExpenses', 'Expenses this Month')}
            </span>
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-red-500 dark:text-red-400">
              {formatCurrency(monthlyExpenses)}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1">
              {budgetProgressPercent < 100 
                ? (language === 'id' ? `Sisa buffer ${(100 - budgetProgressPercent).toFixed(1)}%` : `${(100 - budgetProgressPercent).toFixed(1)}% buffer left`)
                : (language === 'id' ? 'Melebihi target anggaran' : 'Over budget')}
            </div>
          </div>
        </div>

        {/* 4th Card: Invoices in Freelance, Remaining Allowance in Student */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-tight">
              {isStudent ? (language === 'id' ? 'Sisa Anggaran Saku' : 'Remaining Budget') : t('outstandingInvoices', 'Outstanding Invoices')}
            </span>
            <div className={`p-1.5 rounded-lg ${isStudent ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'}`}>
              {isStudent ? <Coins className="w-3.5 h-3.5" /> : <Receipt className="w-3.5 h-3.5" />}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(isStudent ? remainingBudget : outstandingInvoicesTotal)}
            </div>
            <div className={`text-[11px] font-medium flex items-center gap-1 mt-1 ${isStudent ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {isStudent ? (
                <>
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{remainingBudget >= 0 ? (language === 'id' ? 'Aman hingga akhir bulan' : 'Safe until month end') : (language === 'id' ? 'Defisit anggaran' : 'Budget deficit')}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{language === 'id' ? '2 tagihan klien belum dibayar' : '2 pending client payments'}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Budget Progress & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Budget Progress Card (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {language === 'id' ? 'Progres Anggaran Bulan Ini' : 'Budget Progress'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'Pelacakan real-time otomatis' : 'Automatic real-time tracking'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('budget')}
                className="text-xs text-emerald-800 dark:text-emerald-400 font-medium hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'id' ? 'Lihat anggaran →' : 'View budget →'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {language === 'id' ? 'Target Anggaran:' : 'Monthly Budget:'} <strong>{formatCurrency(totalPlannedBudget)}</strong>
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {budgetProgressPercent.toFixed(1)}% {language === 'id' ? 'terpakai' : 'spent'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mb-5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetProgressPercent > 100 
                    ? 'bg-red-500' 
                    : budgetProgressPercent > 80 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-800 dark:bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, budgetProgressPercent)}%` }}
              />
            </div>

            {/* Core numbers breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="text-[11px] text-gray-400 dark:text-gray-500">{language === 'id' ? 'Terpakai' : 'Spent'}</div>
                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm mt-0.5">
                  {formatCurrency(totalSpentBudget)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="text-[11px] text-gray-400 dark:text-gray-500">{language === 'id' ? 'Sisa Saldo' : 'Remaining'}</div>
                <div className={`font-bold text-sm mt-0.5 ${remainingBudget >= 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-500'}`}>
                  {formatCurrency(remainingBudget)}
                </div>
              </div>
            </div>

            {/* Mini quick insight */}
            <div 
              onClick={() => setActiveTab('ai-insights')}
              className="mt-4 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60 flex items-start justify-between gap-2.5 text-xs text-gray-700 dark:text-gray-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <p className="leading-relaxed text-[11px]">
                  {language === 'id' ? (
                    <>Keuangan sehat dengan <strong className="text-gray-900 dark:text-white">sisa {formatCurrency(remainingBudget)}</strong>. Runway bertahan 4.8 bulan ke depan.</>
                  ) : (
                    <>You're in good shape with <strong className="text-gray-900 dark:text-white">{formatCurrency(remainingBudget)} remaining</strong>. 4.8 months runway available.</>
                  )}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 shrink-0 self-center">
                {language === 'id' ? 'Wawasan AI →' : 'Explore AI →'}
              </span>
            </div>
          </div>

          {/* View budget button */}
          <button
            onClick={() => setActiveTab('budget')}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>{language === 'id' ? 'Lihat Anggaran Lengkap' : 'View Detailed Budget'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Col: Cash Flow Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100">{t('cashFlow', 'Cash Flow')}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'Pemasukan diterima vs pengeluaran terbayar' : 'Income received vs expenses paid'}
                </p>
              </div>

              {/* Period selector */}
              <div className="flex gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-md border border-gray-100 dark:border-gray-700">
                {(['7D', '30D', '3M', '12M'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCashFlowPeriod(p)}
                    className={`px-2.5 py-1 text-[10px] rounded transition-all cursor-pointer ${
                      cashFlowPeriod === p
                        ? 'bg-white dark:bg-gray-700 shadow-xs rounded font-medium text-emerald-800 dark:text-emerald-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-750'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Health summary badge */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3" />
                {language === 'id' 
                  ? `Arus kas positif (+${formatCurrency(monthlyIncome - monthlyExpenses)})` 
                  : `Healthy net cash flow (+${formatCurrency(monthlyIncome - monthlyExpenses)})`}
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                {language === 'id' ? 'Likuiditas stabil dan aman' : 'No liquidity risk detected'}
              </span>
            </div>

            {/* Bar Comparison Visualization with Dark Green Aesthetic */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="h-44 flex items-end justify-between gap-3 px-2">
                {chartPoints.map((pt, idx) => {
                  const incomeHeight = Math.max(8, (pt.income / maxVal) * 100);
                  const expenseHeight = Math.max(8, (pt.expense / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="hidden group-hover:block absolute -top-8 bg-gray-900 dark:bg-gray-800 text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none z-10 whitespace-nowrap border border-gray-700">
                        {language === 'id' ? 'Masuk' : 'In'}: {formatCurrency(pt.income)} | {language === 'id' ? 'Keluar' : 'Out'}: {formatCurrency(pt.expense)}
                      </div>
                      <div className="w-full flex items-end justify-center gap-1.5 h-36">
                        {/* Income bar (Emerald 800) */}
                        <div 
                          className="w-full max-w-[14px] bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 rounded-t-xs transition-all"
                          style={{ height: `${incomeHeight}%` }}
                          title={`Income: ${formatCurrency(pt.income)}`}
                        />
                        {/* Expense bar (Emerald tint) */}
                        <div 
                          className="w-full max-w-[14px] bg-emerald-200 dark:bg-emerald-900/60 hover:bg-emerald-300 dark:hover:bg-emerald-800 rounded-t-xs transition-all"
                          style={{ height: `${expenseHeight}%` }}
                          title={`Expense: ${formatCurrency(pt.expense)}`}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[48px] text-center">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-xs bg-emerald-800 dark:bg-emerald-600"></div>
                  <span>{language === 'id' ? 'Pemasukan' : 'Income'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200 dark:bg-emerald-900/60"></div>
                  <span>{language === 'id' ? 'Pengeluaran' : 'Expenses'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower 2-Column: Needs Attention & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Needs Attention (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {t('needsAttention', 'Needs Attention')}
                </h2>
                <span className="bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {attentionItems.length}
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {language === 'id' ? 'Tindakan diperlukan' : 'Action items'}
              </span>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-800/80 p-2">
              {attentionItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs">
                  {language === 'id' ? 'Semua beres! Tidak ada tagihan jatuh tempo atau peringatan.' : 'All caught up! No urgent alerts or overdue items.'}
                </div>
              ) : (
                attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between gap-3 rounded-lg"
                  >
                    <div className="min-w-0 flex-1 flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        item.priority === 'high' ? 'bg-red-500' : 'bg-orange-400'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAttentionAction(item)}
                      className="shrink-0 text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-600 text-emerald-800 dark:text-emerald-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-800 dark:text-emerald-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Right Card: Upcoming Academic Tasks (Student) or Active Projects (Freelance) */}
        <div className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isStudent ? (
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Briefcase className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                )}
                <h2 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {isStudent
                    ? (language === 'id' ? 'Tugas Kuliah & Deadline' : 'Upcoming Tasks & Deadlines')
                    : (language === 'id' ? 'Proyek Studio Aktif' : 'Active Projects')}
                </h2>
              </div>
              <button
                onClick={() => setActiveTab(isStudent ? 'tasks' : 'projects')}
                className="text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'id' ? 'Kelola semua →' : 'View all →'}</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {isStudent ? (
                upcomingStudentTasks.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-xs">
                    <CheckSquare className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-emerald-600" />
                    <span>{language === 'id' ? 'Semua tugas kuliah sudah selesai!' : 'All academic tasks are completed!'}</span>
                  </div>
                ) : (
                  upcomingStudentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-3"
                    >
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="mt-0.5 text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        title={language === 'id' ? 'Tandai Selesai' : 'Mark Completed'}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {task.title}
                          </h4>
                          {task.category && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium shrink-0">
                              {task.category}
                            </span>
                          )}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>
                              {language === 'id' ? 'Tenggat:' : 'Due:'} {new Date(task.dueDate).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )
              ) : (
                projects.slice(0, 4).map((proj, pIdx) => (
                  <div 
                    key={proj.id}
                    onClick={() => setActiveTab('projects')}
                    className="space-y-1.5 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{proj.name}</span>
                      <span className="text-gray-400 dark:text-gray-500">{proj.progress}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          pIdx % 2 === 0 ? 'bg-emerald-600' : 'bg-emerald-800 dark:bg-emerald-500'
                        }`}
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
                      <span>{proj.clientName}</span>
                      <span>
                        {language === 'id' ? 'Tenggat' : 'Due'} {new Date(proj.deadline).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

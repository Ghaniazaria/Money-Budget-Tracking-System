import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Repeat, 
  Trash2, 
  Briefcase, 
  User, 
  Download,
  Receipt,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransactionsView: React.FC = () => {
  const { 
    transactions, 
    categories, 
    projects, 
    openTransactionModal, 
    openReceiptModal,
    deleteTransaction,
    showToast,
    formatCurrency,
    t,
    language,
    currency,
    toggleCurrency,
    openConverter
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.categoryName && tx.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.projectName && tx.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.clientName && tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Type
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;

      // Category
      const matchesCat = categoryFilter === 'all' || tx.categoryId === categoryFilter;

      // Project
      const matchesProj = projectFilter === 'all' || tx.projectId === projectFilter;

      return matchesSearch && matchesType && matchesCat && matchesProj;
    }).sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === 'amount-high') return b.amount - a.amount;
      if (sortOrder === 'amount-low') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter, projectFilter, sortOrder]);

  // Totals for the current filtered list
  const filteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const filteredExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Date,Description,Category,Type,Amount,Project,Client,Recurring"]
        .concat(filteredTransactions.map(tx => 
          `"${tx.date}","${tx.description}","${tx.categoryName || ''}","${tx.type}","${tx.amount}","${tx.projectName || ''}","${tx.clientName || ''}","${tx.isRecurring ? 'Yes' : 'No'}"`
        )).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flowledger_transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(
      language === 'id' ? 'Ekspor Selesai' : 'Export complete', 
      language === 'id' ? `Berhasil mengunduh CSV berisi ${filteredTransactions.length} transaksi.` : `Downloaded CSV containing ${filteredTransactions.length} transactions.`
    );
  };

  return (
    <div id="transactions-page-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {t('nav.transactions', 'Transactions')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'id' 
              ? 'Buku kas real-time yang terhubung ke anggaran, proyek, dan bukti struk scan.' 
              : 'Real-time ledger connected to your budget, projects, and scanned receipts.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Ganti Mata Uang"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{currency === 'IDR' ? 'Rp IDR' : '$ USD'}</span>
          </button>

          <button
            onClick={openConverter}
            className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Buka Konverter Kurs"
          >
            <Calculator className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Ekspor CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={openReceiptModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{t('action.scanReceipt', 'Scan Receipt')}</span>
          </button>

          <button
            onClick={openTransactionModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('action.addTransaction', 'Add Transaction')}</span>
          </button>
        </div>
      </div>

      {/* Summary Bar for current query */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {language === 'id' ? 'Transaksi Terfilter' : 'Filtered Transactions'}
          </span>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {filteredTransactions.length} {language === 'id' ? 'data' : 'records'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {language === 'id' ? 'Pemasukan Terpilih' : 'Income in View'}
          </span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            +{formatCurrency(filteredIncome)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {language === 'id' ? 'Pengeluaran Terpilih' : 'Expenses in View'}
          </span>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            -{formatCurrency(filteredExpense)}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'id' ? 'Cari deskripsi, kategori, proyek, atau klien...' : 'Search description, category, project, or client...'}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700 text-xs font-medium w-full md:w-auto shrink-0 justify-between">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                typeFilter === 'all' 
                  ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {language === 'id' ? 'Semua' : 'All'}
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                typeFilter === 'income' 
                  ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t('type.income', 'Income')}
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                typeFilter === 'expense' 
                  ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t('type.expense', 'Expenses')}
            </button>
          </div>
        </div>

        {/* Second Row: Category & Project Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Filter:' : 'Filter by:'}</span>
          </div>

          {/* Category dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-xs focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
          >
            <option value="all">{language === 'id' ? 'Semua Kategori' : 'All Categories'}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Project dropdown */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-xs focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
          >
            <option value="all">{language === 'id' ? 'Semua Proyek' : 'All Projects'}</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Sort order */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-gray-400 text-[11px]">{language === 'id' ? 'Urutkan:' : 'Sort:'}</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-xs focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
            >
              <option value="newest">{language === 'id' ? 'Paling Baru' : 'Newest first'}</option>
              <option value="oldest">{language === 'id' ? 'Paling Lama' : 'Oldest first'}</option>
              <option value="amount-high">{language === 'id' ? 'Nominal Tertinggi' : 'Highest amount'}</option>
              <option value="amount-low">{language === 'id' ? 'Nominal Terendah' : 'Lowest amount'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List / Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {language === 'id' ? 'Tidak ada transaksi yang cocok' : 'No transactions found'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {language === 'id' 
                ? 'Mulai catat keuangan studio Anda dengan menambahkan transaksi baru atau atur ulang filter pencarian.' 
                : 'Start tracking your money by adding your first transaction or resetting your active search filters.'}
            </p>
            <button
              onClick={openTransactionModal}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('action.addTransaction', 'Add Transaction')}</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 font-semibold border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="py-3 px-5">{language === 'id' ? 'Transaksi & Keterangan' : 'Transaction & Memo'}</th>
                    <th className="py-3 px-4">{language === 'id' ? 'Kategori' : 'Category'}</th>
                    <th className="py-3 px-4">{language === 'id' ? 'Proyek / Klien' : 'Project / Client'}</th>
                    <th className="py-3 px-4">{language === 'id' ? 'Tanggal' : 'Date'}</th>
                    <th className="py-3 px-5 text-right">{language === 'id' ? 'Nominal' : 'Amount'}</th>
                    <th className="py-3 px-4 text-center w-14">{language === 'id' ? 'Aksi' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors group">
                        {/* Description & Note */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                              {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{tx.description}</span>
                                {tx.hasReceipt && (
                                  <span 
                                    title={language === 'id' ? 'Struk fisik telah diverifikasi oleh Gemini OCR' : 'Scanned receipt verified by Gemini OCR'}
                                    className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200/60 dark:border-emerald-800 flex items-center gap-0.5 shrink-0"
                                  >
                                    <Receipt className="w-2.5 h-2.5 text-emerald-700 dark:text-emerald-400" /> 
                                    {language === 'id' ? 'Struk' : 'Receipt'}
                                  </span>
                                )}
                                {tx.isRecurring && (
                                  <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-300 font-medium flex items-center gap-0.5">
                                    <Repeat className="w-2.5 h-2.5" /> 
                                    {language === 'id' ? 'Rutin' : 'Recurring'}
                                  </span>
                                )}
                              </div>
                              {tx.note && (
                                <span className="text-[11px] text-gray-400 dark:text-gray-500 block truncate">{tx.note}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-gray-700 dark:text-gray-300 font-medium">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-medium">
                            {tx.categoryName || 'General'}
                          </span>
                        </td>

                        {/* Project / Client */}
                        <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 text-[11px]">
                          {tx.projectName ? (
                            <div className="flex items-center gap-1 font-medium text-gray-900 dark:text-gray-100">
                              <Briefcase className="w-3 h-3 text-gray-400" />
                              <span className="truncate max-w-[140px]">{tx.projectName}</span>
                            </div>
                          ) : tx.clientName ? (
                            <div className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-300">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="truncate max-w-[140px]">{tx.clientName}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600">—</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-5 text-right font-bold text-xs whitespace-nowrap">
                          <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}>
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </td>

                        {/* Delete Action */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title={language === 'id' ? 'Hapus transaksi' : 'Delete transaction'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {tx.description}
                        </div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {tx.categoryName} • {new Date(tx.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xs font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-600 mt-0.5 cursor-pointer"
                      >
                        {language === 'id' ? 'Hapus' : 'Remove'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

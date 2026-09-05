import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryGroup, BudgetCategory } from '../../types';

export const BudgetView: React.FC = () => {
  const {
    currentMonth,
    setCurrentMonth,
    categories,
    categorySpendingMap,
    totalPlannedBudget,
    totalSpentBudget,
    remainingBudget,
    budgetProgressPercent,
    updateCategoryPlanned,
    updateCategoryName,
    deleteCategory,
    addCategory,
    openTransactionModal,
    formatCurrency,
    t,
    language,
    currency,
    toggleCurrency,
    openConverter
  } = useApp();

  const [activeGroupFilter, setActiveGroupFilter] = useState<'all' | CategoryGroup>('all');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingPlannedVal, setEditingPlannedVal] = useState<string>('');
  const [editingNameVal, setEditingNameVal] = useState<string>('');

  // Add category mini form state
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatGroup, setNewCatGroup] = useState<CategoryGroup>('wants');
  const [newCatPlanned, setNewCatPlanned] = useState('');

  // Month switcher helper
  const monthsEN = ['August 2026', 'September 2026', 'October 2026', 'November 2026'];
  const monthsID = ['Agustus 2026', 'September 2026', 'Oktober 2026', 'November 2026'];
  const months = language === 'id' ? monthsID : monthsEN;

  const currentIdx = monthsEN.indexOf(currentMonth) >= 0 
    ? monthsEN.indexOf(currentMonth) 
    : monthsID.indexOf(currentMonth) >= 0 
    ? monthsID.indexOf(currentMonth) 
    : 1;

  const handlePrevMonth = () => {
    if (currentIdx > 0) setCurrentMonth(months[currentIdx - 1]);
  };
  const handleNextMonth = () => {
    if (currentIdx < months.length - 1) setCurrentMonth(months[currentIdx + 1]);
  };

  const startEditing = (cat: BudgetCategory) => {
    setEditingCategoryId(cat.id);
    setEditingPlannedVal(cat.planned.toString());
    setEditingNameVal(cat.name);
  };

  const saveEditing = (id: string) => {
    const num = parseFloat(editingPlannedVal);
    if (!isNaN(num) && num >= 0) {
      updateCategoryPlanned(id, num);
    }
    if (editingNameVal.trim()) {
      updateCategoryName(id, editingNameVal.trim());
    }
    setEditingCategoryId(null);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const plannedNum = parseFloat(newCatPlanned) || 0;
    addCategory({
      name: newCatName.trim(),
      group: newCatGroup,
      planned: plannedNum
    });
    setNewCatName('');
    setNewCatPlanned('');
    setIsAddCatOpen(false);
  };

  // Group definitions for clear structure
  const groups: { key: CategoryGroup; title: string; subtitle: string; badge: string }[] = language === 'id' ? [
    { key: 'income', title: 'Sumber Pendapatan', subtitle: 'Honor Proyek & Retainer Bulanan', badge: 'Pendapatan' },
    { key: 'needs', title: 'Kebutuhan Pokok & Operasional', subtitle: 'Sewa, workstation & overhead tetap', badge: 'Wajib' },
    { key: 'wants', title: 'Keinginan & Fleksibel', subtitle: 'Kopi, makan luar, gadget & kenyamanan', badge: 'Fleksibel' },
    { key: 'goals', title: 'Tujuan Finansial & Cadangan', subtitle: 'Pajak PPh, dana darurat & tabungan masa depan', badge: 'Masa Depan' },
  ] : [
    { key: 'income', title: 'Income Sources', subtitle: 'Earnings & Retainers', badge: 'Revenue' },
    { key: 'needs', title: 'Needs & Essentials', subtitle: 'Fixed living & operational overhead', badge: 'Non-negotiable' },
    { key: 'wants', title: 'Wants & Discretionary', subtitle: 'Dining, gear, comfort & leisure', badge: 'Flexible' },
    { key: 'goals', title: 'Financial Goals & Reserves', subtitle: 'Taxes, retirement, savings & education', badge: 'Future' },
  ];

  // Filter categories
  const filteredGroups = activeGroupFilter === 'all' 
    ? groups 
    : groups.filter(g => g.key === activeGroupFilter);

  const displayMonth = months[currentIdx] || currentMonth;

  return (
    <div id="budget-feature-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. Budget Month Header & Navigation */}
      <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {language === 'id' ? `Anggaran ${displayMonth}` : `${displayMonth} Budget`}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {language === 'id' ? 'Metode Zero-Based' : 'Zero-Based Method'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {language === 'id'
                ? 'Rencanakan sekali → catat transaksi & struk → Fins otomatis menghitung sisa.'
                : 'Set it once → record transactions & receipts → Fins automatically recalculates.'}
            </p>
          </div>

          {/* Controls: Currency switcher, Converter, Month Stepper */}
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

            {/* Month Stepper Buttons */}
            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 bg-gray-50 dark:bg-gray-800">
              <button
                id="prev-month-button"
                onClick={handlePrevMonth}
                disabled={currentIdx === 0}
                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={language === 'id' ? 'Bulan Sebelumnya' : 'Previous Month'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 px-2 min-w-[110px] text-center select-none">
                {displayMonth}
              </span>
              <button
                id="next-month-button"
                onClick={handleNextMonth}
                disabled={currentIdx === months.length - 1}
                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={language === 'id' ? 'Bulan Berikutnya' : 'Next Month'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Financial High-Level Summary Figures */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Total Budget Target */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight">
              {language === 'id' ? 'Total Target Alokasi' : 'Total Target'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {formatCurrency(totalPlannedBudget)}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {language === 'id' ? 'Batas rencana bulanan' : 'Monthly allocation cap'}
            </div>
          </div>

          {/* Planned */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight">
              {language === 'id' ? 'Terencana' : 'Planned Total'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {formatCurrency(totalPlannedBudget)}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {language === 'id' ? 'Terbagi ke semua pos' : 'Assigned across groups'}
            </div>
          </div>

          {/* Spent */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight">
              {language === 'id' ? 'Pengeluaran Aktual' : 'Actual Spent'}
            </div>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {formatCurrency(totalSpentBudget)}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {budgetProgressPercent.toFixed(1)}% {language === 'id' ? 'dari plafon anggaran' : 'of total limit'}
            </div>
          </div>

          {/* Remaining */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tight">
              {language === 'id' ? 'Sisa Anggaran' : 'Remaining'}
            </div>
            <div className={`text-lg sm:text-xl font-bold mt-1 ${remainingBudget >= 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-500'}`}>
              {formatCurrency(remainingBudget)}
            </div>
            <div className={`text-[11px] font-medium mt-0.5 ${remainingBudget >= 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-500'}`}>
              {remainingBudget >= 0 
                ? (language === 'id' ? 'Tersedia untuk dibelanjakan' : 'Available for discretionary') 
                : (language === 'id' ? 'Melebihi alokasi rencana' : 'Over planned allocation')}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-2 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {language === 'id' ? 'Kemajuan Anggaran Bulan Ini' : 'Monthly Budget Progress'}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{budgetProgressPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetProgressPercent > 100 ? 'bg-red-500' : budgetProgressPercent > 80 ? 'bg-amber-500' : 'bg-emerald-800 dark:bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, budgetProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Budget Insights Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
            <span>{language === 'id' ? 'Makanan & Kopi' : 'Food & Groceries'}</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'id' 
              ? 'Terpakai 80% dari kuota bulanan dengan sisa 27 hari.' 
              : "You've used 80% of your Food budget with 27 days remaining."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
            <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
            <span>{language === 'id' ? 'Langganan SaaS' : 'Subscriptions'}</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'id'
              ? 'Pos SaaS 18% melampaui estimasi awal karena tambahan lisensi Figma Pro.'
              : 'Subscriptions are 18% higher than planned due to Figma seat addition.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'id' ? 'Laju Terkendali' : 'Under Planned Rate'}</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'id'
              ? 'Pengeluaran mingguan Anda masih di bawah batas rata-rata aman.'
              : 'You are currently safely under your planned spending run-rate.'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
            <span>{language === 'id' ? 'Transportasi & Logistik' : 'Transportation Pace'}</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'id'
              ? 'Biaya langganan transportasi awal bulan meng-cover mobilitas penuh 30 hari.'
              : 'Transit pass covers full calendar month mobility without unexpected charges.'}
          </p>
        </div>
      </div>

      {/* 3. Filter Bar & Add Category Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Category Group Filter Tabs */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800/80 p-1 rounded-lg border border-gray-100 dark:border-gray-700 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveGroupFilter('all')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              activeGroupFilter === 'all' 
                ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Semua Kategori' : 'All Categories'}
          </button>
          <button
            onClick={() => setActiveGroupFilter('income')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              activeGroupFilter === 'income' 
                ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Pendapatan' : 'Income'}
          </button>
          <button
            onClick={() => setActiveGroupFilter('needs')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              activeGroupFilter === 'needs' 
                ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Kebutuhan' : 'Needs'}
          </button>
          <button
            onClick={() => setActiveGroupFilter('wants')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              activeGroupFilter === 'wants' 
                ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Keinginan' : 'Wants'}
          </button>
          <button
            onClick={() => setActiveGroupFilter('goals')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              activeGroupFilter === 'goals' 
                ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Tujuan Finansial' : 'Financial Goals'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddCatOpen(!isAddCatOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Tambah Kategori' : 'Add Category'}</span>
          </button>
          <button
            onClick={openTransactionModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('action.addTransaction', 'Log Transaction')}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Category Drawer/Form */}
      {isAddCatOpen && (
        <form 
          onSubmit={handleAddCategorySubmit}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-3 animate-in fade-in duration-150 text-xs"
        >
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
            {language === 'id' ? 'Buat Kategori Anggaran Baru' : 'Create New Budget Category'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {language === 'id' ? 'Nama Kategori' : 'Category Name'}
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Coworking Space, Cloud Hosting' : 'e.g. Co-working Pass, Cloud Hosting'}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {language === 'id' ? 'Kelompok' : 'Group'}
              </label>
              <select
                value={newCatGroup}
                onChange={(e) => setNewCatGroup(e.target.value as CategoryGroup)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
              >
                <option value="needs">{language === 'id' ? 'Kebutuhan Pokok (Operasional & esensial)' : 'Needs (Essential living & ops)'}</option>
                <option value="wants">{language === 'id' ? 'Keinginan (Discretionary & kenyamanan)' : 'Wants (Discretionary & comforts)'}</option>
                <option value="goals">{language === 'id' ? 'Tujuan Finansial (Pajak, tabungan, investasi)' : 'Financial Goals (Taxes, savings, index)'}</option>
                <option value="income">{language === 'id' ? 'Pendapatan (Pemasukan)' : 'Income (Revenue sources)'}</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                {language === 'id' ? `Alokasi Rencana (${currency})` : `Monthly Planned Budget (${currency})`}
              </label>
              <input
                type="number"
                step={currency === 'IDR' ? '50000' : '10'}
                min="0"
                required
                value={newCatPlanned}
                onChange={(e) => setNewCatPlanned(e.target.value)}
                placeholder={currency === 'IDR' ? '1500000' : '250'}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddCatOpen(false)}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-xs font-medium cursor-pointer"
            >
              {language === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              {language === 'id' ? 'Simpan Kategori' : 'Create Category'}
            </button>
          </div>
        </form>
      )}

      {/* 4. The Core Budget Tables Organized by Category Groups */}
      <div className="space-y-6">
        {filteredGroups.map((grp) => {
          const groupCategories = categories.filter(c => c.group === grp.key);
          if (groupCategories.length === 0) return null;

          const groupPlannedTotal = groupCategories.reduce((sum, c) => sum + c.planned, 0);
          const groupActualTotal = groupCategories.reduce((sum, c) => sum + (categorySpendingMap[c.id] || 0), 0);
          const groupRemaining = groupPlannedTotal - groupActualTotal;

          return (
            <div 
              key={grp.key}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden"
            >
              {/* Group Header */}
              <div className="px-5 py-3.5 bg-gray-50/70 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{grp.title}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-200/70 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                    {grp.badge}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">• {grp.subtitle}</span>
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-3">
                  <span>{language === 'id' ? 'Rencana:' : 'Planned:'} <strong className="text-gray-900 dark:text-gray-100">{formatCurrency(groupPlannedTotal)}</strong></span>
                  <span>{language === 'id' ? 'Aktual:' : 'Actual:'} <strong className="text-gray-900 dark:text-gray-100">{formatCurrency(groupActualTotal)}</strong></span>
                  {grp.key !== 'income' && (
                    <span className={groupRemaining >= 0 ? 'text-emerald-800 dark:text-emerald-400 font-semibold' : 'text-red-500 font-semibold'}>
                      {groupRemaining >= 0 
                        ? `${formatCurrency(groupRemaining)} ${language === 'id' ? 'sisa' : 'left'}` 
                        : `${formatCurrency(Math.abs(groupRemaining))} ${language === 'id' ? 'melebihi' : 'over'}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Table Body (Desktop View) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 font-medium border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="py-2.5 px-5 font-semibold">{language === 'id' ? 'Kategori' : 'Category'}</th>
                      <th className="py-2.5 px-4 font-semibold text-right">{language === 'id' ? 'Rencana' : 'Planned'}</th>
                      <th className="py-2.5 px-4 font-semibold text-right">{language === 'id' ? 'Aktual' : 'Actual'}</th>
                      <th className="py-2.5 px-4 font-semibold text-right">{language === 'id' ? 'Sisa' : 'Remaining'}</th>
                      <th className="py-2.5 px-5 font-semibold text-left">{language === 'id' ? 'Status & Progres' : 'Status & Progress'}</th>
                      <th className="py-2.5 px-4 font-semibold text-center w-16">{language === 'id' ? 'Aksi' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {groupCategories.map((cat) => {
                      const actual = categorySpendingMap[cat.id] || 0;
                      const remaining = cat.planned - actual;
                      const progress = cat.planned > 0 ? (actual / cat.planned) * 100 : 0;
                      const isEditing = editingCategoryId === cat.id;

                      // Status state
                      const isOverBudget = cat.group !== 'income' && actual > cat.planned;
                      const isApproaching = cat.group !== 'income' && !isOverBudget && progress >= 80;

                      return (
                        <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors group">
                          {/* Category Name */}
                          <td className="py-3 px-5 font-medium text-gray-900 dark:text-gray-100">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingNameVal}
                                onChange={(e) => setEditingNameVal(e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded text-xs text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>{cat.name}</span>
                              </div>
                            )}
                          </td>

                          {/* Planned Amount (Editable) */}
                          <td className="py-3 px-4 text-right font-medium text-gray-700 dark:text-gray-300">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingPlannedVal}
                                onChange={(e) => setEditingPlannedVal(e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded text-xs text-right text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                              />
                            ) : (
                              <button
                                onClick={() => startEditing(cat)}
                                className="hover:underline hover:text-emerald-800 dark:hover:text-emerald-400 text-gray-700 dark:text-gray-300 cursor-pointer"
                                title="Klik untuk mengedit"
                              >
                                {formatCurrency(cat.planned)}
                              </button>
                            )}
                          </td>

                          {/* Actual Amount */}
                          <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(actual)}
                          </td>

                          {/* Remaining Amount */}
                          <td className="py-3 px-4 text-right font-semibold">
                            {cat.group === 'income' ? (
                              <span className="text-gray-500 dark:text-gray-400">
                                {(actual - cat.planned) >= 0 ? `+${formatCurrency(actual - cat.planned)}` : `-${formatCurrency(Math.abs(actual - cat.planned))}`}
                              </span>
                            ) : isOverBudget ? (
                              <span className="text-red-500 font-bold">
                                -{formatCurrency(Math.abs(remaining))}
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(remaining)}
                              </span>
                            )}
                          </td>

                          {/* Progress & Human Readable Status */}
                          <td className="py-3 px-5">
                            <div className="space-y-1.5 max-w-[210px]">
                              <div className="flex items-center justify-between text-[11px]">
                                {cat.group === 'income' ? (
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    {progress.toFixed(0)}% {language === 'id' ? 'dari target' : 'of goal'}
                                  </span>
                                ) : isOverBudget ? (
                                  <span className="text-red-500 font-semibold flex items-center gap-1">
                                    <AlertOctagon className="w-3 h-3" />
                                    {language === 'id' ? 'Lewat anggaran' : 'Over budget'}
                                  </span>
                                ) : isApproaching ? (
                                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {(100 - progress).toFixed(0)}% {language === 'id' ? 'sisa' : 'remaining'}
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {(100 - progress).toFixed(0)}% {language === 'id' ? 'sisa' : 'remaining'}
                                  </span>
                                )}
                                <span className="text-gray-400 dark:text-gray-500 font-medium">
                                  {progress.toFixed(0)}%
                                </span>
                              </div>

                              <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    cat.group === 'income' 
                                      ? 'bg-emerald-500' 
                                      : isOverBudget 
                                      ? 'bg-red-500' 
                                      : isApproaching 
                                      ? 'bg-amber-500' 
                                      : 'bg-emerald-800 dark:bg-emerald-600'
                                  }`}
                                  style={{ width: `${Math.min(100, progress)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <button
                                onClick={() => saveEditing(cat.id)}
                                className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[10px] font-semibold cursor-pointer"
                              >
                                {language === 'id' ? 'Simpan' : 'Save'}
                              </button>
                            ) : (
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditing(cat)}
                                  className="p-1 text-gray-400 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors cursor-pointer"
                                  title="Edit category"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteCategory(cat.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                                  title="Delete category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Cards */}
              <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {groupCategories.map((cat) => {
                  const actual = categorySpendingMap[cat.id] || 0;
                  const remaining = cat.planned - actual;
                  const progress = cat.planned > 0 ? (actual / cat.planned) * 100 : 0;
                  const isOverBudget = cat.group !== 'income' && actual > cat.planned;

                  return (
                    <div key={cat.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{cat.name}</span>
                        <span className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
                          {formatCurrency(actual)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                        <span>{language === 'id' ? 'Rencana:' : 'Planned:'} {formatCurrency(cat.planned)}</span>
                        <span>
                          {isOverBudget 
                            ? `${language === 'id' ? 'Lewat' : 'Over by'} ${formatCurrency(Math.abs(remaining))}` 
                            : `${formatCurrency(remaining)} ${language === 'id' ? 'sisa' : 'left'}`}
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOverBudget ? 'bg-red-500' : progress >= 80 ? 'bg-amber-500' : 'bg-emerald-800 dark:bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Budget vs Actual Comparison Visualizer */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {language === 'id' ? 'Analisis Varians Anggaran vs Aktual' : 'Budget vs. Actual Variance'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'id' 
                ? 'Evaluasi apakah pengeluaran aktual studio lebih hemat atau melampaui rencana.' 
                : '"Did I spend more or less than I planned?"'}
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Total varians sisa:' : 'Total variance:'} <strong className="text-emerald-700 dark:text-emerald-400">+{formatCurrency(remainingBudget)} surplus</strong>
          </div>
        </div>

        {/* Visual comparison rows */}
        <div className="space-y-3 pt-2">
          {categories
            .filter(c => c.group !== 'income')
            .slice(0, 6)
            .map((cat) => {
              const actual = categorySpendingMap[cat.id] || 0;
              const planned = cat.planned;
              const maxRange = Math.max(actual, planned, 100);
              const actualPct = (actual / maxRange) * 100;
              const plannedPct = (planned / maxRange) * 100;
              const isOver = actual > planned;

              return (
                <div key={cat.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-gray-400 dark:text-gray-500">{language === 'id' ? 'Rencana:' : 'Planned:'} {formatCurrency(planned)}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{language === 'id' ? 'Aktual:' : 'Actual:'} {formatCurrency(actual)}</span>
                      {isOver ? (
                        <span className="text-red-500 font-bold">+{formatCurrency(actual - planned)} {language === 'id' ? 'lewat' : 'over'}</span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">-{formatCurrency(planned - actual)} {language === 'id' ? 'hemat' : 'under'}</span>
                      )}
                    </div>
                  </div>

                  {/* Dual comparison track */}
                  <div className="h-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-0.5 relative border border-gray-100 dark:border-gray-700 flex items-center">
                    {/* Planned marker line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-gray-900 dark:bg-gray-100 z-10"
                      style={{ left: `${plannedPct}%` }}
                      title={`Target: ${formatCurrency(planned)}`}
                    />
                    {/* Actual fill */}
                    <div
                      className={`h-full rounded-md transition-all ${
                        isOver ? 'bg-red-400' : 'bg-emerald-800 dark:bg-emerald-600'
                      }`}
                      style={{ width: `${actualPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

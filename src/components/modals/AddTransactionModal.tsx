import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, Tag, FileText, Repeat, Briefcase, User, Sparkles, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddTransactionModal: React.FC = () => {
  const { 
    isTransactionModalOpen, 
    closeTransactionModal, 
    openReceiptModal,
    categories, 
    projects, 
    clients, 
    addTransaction,
    categorySpendingMap,
    formatCurrency,
    t,
    language,
    currency,
    exchangeRate
  } = useApp();

  const [amountStr, setAmountStr] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [categoryId, setCategoryId] = useState(
    categories.find(c => c.group === 'wants')?.id || categories[0]?.id || ''
  );
  const [date, setDate] = useState('2026-09-04');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [clientId, setClientId] = useState('');
  const [note, setNote] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isTransactionModalOpen) return null;

  const numericAmountInput = parseFloat(amountStr) || 0;
  // If user entered in USD while viewing USD, internal calculations are normalized to base IDR
  const normalizedAmount = currency === 'USD' ? (numericAmountInput * exchangeRate) : numericAmountInput;

  const selectedCat = categories.find(c => c.id === categoryId);
  const currentSpent = selectedCat ? (categorySpendingMap[selectedCat.id] || 0) : 0;
  const plannedBudget = selectedCat ? selectedCat.planned : 0;
  const simulatedRemaining = plannedBudget - (type === 'expense' ? (currentSpent + normalizedAmount) : currentSpent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountStr || numericAmountInput <= 0) return;
    if (!description.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId);
    const selectedCli = clients.find(c => c.id === clientId) || (selectedProj ? clients.find(c => c.id === selectedProj.clientId) : undefined);

    addTransaction({
      amount: normalizedAmount,
      type,
      categoryId,
      categoryName: selectedCat?.name,
      date,
      description: description.trim(),
      isRecurring,
      projectId: projectId || undefined,
      projectName: selectedProj?.name,
      clientId: selectedCli?.id || undefined,
      clientName: selectedCli?.name || selectedCli?.company,
      note: note.trim() || undefined
    });

    // Reset form
    setAmountStr('');
    setDescription('');
    setNote('');
    setProjectId('');
    setClientId('');
    closeTransactionModal();
  };

  // Quick preset buttons for common amounts based on active currency
  const quickAmounts = currency === 'IDR'
    ? [50000, 100000, 250000, 500000, 1000000, 5000000]
    : [15, 25, 50, 100, 250, 1000];

  const formatQuickChip = (val: number) => {
    if (currency === 'IDR') {
      if (val >= 1000000) return `Rp ${val / 1000000} jt`;
      return `Rp ${val / 1000} rb`;
    }
    return `$${val}`;
  };

  return (
    <div id="add-transaction-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="add-transaction-modal" 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-lg overflow-hidden transition-all transform animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${type === 'expense' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'}`}>
              {type === 'expense' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {language === 'id' ? 'Catat Transaksi Baru' : 'Add Transaction'}
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'id' ? 'Pencatatan cepat ke buku besar dan amplop anggaran' : 'Fast recording into your ledger and budget'}
              </p>
            </div>
          </div>
          <button
            onClick={closeTransactionModal}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Scan Option */}
          <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 block">
                  {language === 'id' ? 'Punya struk fisik atau e-receipt?' : 'Have a physical or digital receipt?'}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
                  {language === 'id' ? 'Ekstraksi otomatis nominal, toko, & item via Gemini OCR' : 'Auto-fill amount & merchant via Gemini OCR'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                closeTransactionModal();
                openReceiptModal();
              }}
              className="px-2.5 py-1 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              {language === 'id' ? 'Pindai Struk →' : 'Scan Receipt →'}
            </button>
          </div>

          {/* Type Toggle: Expense / Income */}
          <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
              <span>{language === 'id' ? 'Pengeluaran' : 'Expense'}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'id' ? 'Pemasukan' : 'Income'}</span>
            </button>
          </div>

          {/* Amount Input with big numbers */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                {language === 'id' ? `Nominal (${currency})` : `Amount (${currency})`}
              </label>
              {currency === 'USD' && (
                <span className="text-[10px] text-gray-400">
                  ≈ {formatCurrency(normalizedAmount)}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xl font-medium text-gray-400 select-none">
                {currency === 'IDR' ? 'Rp' : '$'}
              </span>
              <input
                id="tx-amount-input"
                type="number"
                step={currency === 'IDR' ? '100' : '0.01'}
                min="0.01"
                required
                autoFocus
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder={currency === 'IDR' ? '150000' : '15.00'}
                className={`w-full ${currency === 'IDR' ? 'pl-12' : 'pl-9'} pr-4 py-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-800 dark:focus:ring-emerald-500 transition-all placeholder:text-gray-400`}
              />
            </div>
            {/* Quick amount chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountStr(val.toString())}
                  className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/70 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors cursor-pointer"
                >
                  {formatQuickChip(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {language === 'id' ? 'Keterangan Transaksi' : 'Description'}
            </label>
            <div className="relative">
              <input
                id="tx-description-input"
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Pembayaran Klien Acme, Makan Siang, Langganan Figma' : 'e.g. Client Payment, Lunch, Adobe Creative Cloud'}
                className="w-full px-3.5 py-2.5 text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-800 dark:focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Category & Date in 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                {language === 'id' ? 'Kategori Pos Anggaran' : 'Category'}
              </label>
              <div className="relative">
                <select
                  id="tx-category-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-800 dark:focus:ring-emerald-500 transition-all"
                >
                  {type === 'income' ? (
                    <optgroup label={language === 'id' ? 'Sumber Pemasukan' : 'Income Sources'}>
                      {categories.filter(c => c.group === 'income').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                  ) : (
                    <>
                      <optgroup label={language === 'id' ? 'Kebutuhan Pokok (Needs)' : 'Needs'}>
                        {categories.filter(c => c.group === 'needs').map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({formatCurrency(c.planned)})</option>
                        ))}
                      </optgroup>
                      <optgroup label={language === 'id' ? 'Keinginan & Gaya Hidup (Wants)' : 'Wants'}>
                        {categories.filter(c => c.group === 'wants').map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({formatCurrency(c.planned)})</option>
                        ))}
                      </optgroup>
                      <optgroup label={language === 'id' ? 'Target Finansial & Tabungan' : 'Financial Goals'}>
                        {categories.filter(c => c.group === 'goals').map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({formatCurrency(c.planned)})</option>
                        ))}
                      </optgroup>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                {language === 'id' ? 'Tanggal Transaksi' : 'Date'}
              </label>
              <div className="relative">
                <input
                  id="tx-date-input"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-800 dark:focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Real-time Budget Impact Helper */}
          {type === 'expense' && selectedCat && selectedCat.group !== 'income' && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedCat.name} {language === 'id' ? 'status sisa:' : 'budget status:'}</span>
              </div>
              <div className="font-medium">
                {numericAmountInput > 0 ? (
                  simulatedRemaining >= 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      {formatCurrency(simulatedRemaining)} {language === 'id' ? 'tersisa' : 'remaining'}
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      {language === 'id' ? 'Melebihi anggaran sebesar' : 'Over budget by'} {formatCurrency(Math.abs(simulatedRemaining))}
                    </span>
                  )
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatCurrency(plannedBudget - currentSpent)} {language === 'id' ? 'tersisa' : 'remaining'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Toggle Advanced / Optional fields */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1 cursor-pointer"
            >
              <span>
                {showAdvanced
                  ? (language === 'id' ? 'Sembunyikan detail tambahan' : 'Hide optional details')
                  : (language === 'id' ? '+ Hubungkan dengan proyek, klien, atau memo' : '+ Add project, client, or note')}
              </span>
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-3">
                {/* Project selector */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    {language === 'id' ? 'Hubungkan Proyek (Opsional)' : 'Assign Project (Optional)'}
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      const proj = projects.find(p => p.id === e.target.value);
                      if (proj) setClientId(proj.clientId);
                    }}
                    className="w-full px-2.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
                  >
                    <option value="">{language === 'id' ? 'Tidak Ada (Umum)' : 'None (General)'}</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                    ))}
                  </select>
                </div>

                {/* Client selector */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    {language === 'id' ? 'Hubungkan Klien (Opsional)' : 'Assign Client (Optional)'}
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
                  >
                    <option value="">{language === 'id' ? 'Tidak Ada' : 'None'}</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recurring Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-emerald-800 focus:ring-emerald-700 w-3.5 h-3.5"
                />
                <span className="text-gray-700 dark:text-gray-300 text-xs">
                  {language === 'id' ? 'Tandai sebagai pengeluaran/pemasukan rutin bulanan' : 'Mark as recurring monthly expense / income'}
                </span>
              </label>

              {/* Note */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                  {language === 'id' ? 'Catatan Pribadi / Memo' : 'Private Memo / Note'}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={language === 'id' ? 'Contoh: Faktur pajak atau bukti transfer tersimpan di Drive' : 'e.g. Tax deductible receipt saved in Google Drive'}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={closeTransactionModal}
              className="px-4 py-2.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              {language === 'id' ? 'Batal' : 'Cancel'}
            </button>
            <button
              id="save-tx-submit-button"
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {language === 'id' ? 'Simpan Transaksi' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

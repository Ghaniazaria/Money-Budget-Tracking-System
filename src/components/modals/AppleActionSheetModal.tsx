import React, { useState, useRef } from 'react';
import { 
  PenLine, 
  Camera, 
  UploadCloud, 
  FileText, 
  ChevronRight, 
  X, 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Copy, 
  Check, 
  ArrowRight,
  Receipt,
  FileCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppleActionSheetModal: React.FC = () => {
  const { 
    isQuickActionSheetOpen, 
    closeQuickActionSheet, 
    openTransactionModal, 
    openReceiptModal, 
    language,
    showToast,
    formatCurrency,
    addTransactionWithReceipt
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<'main' | 'sendReceipt'>('main');
  const [copiedType, setCopiedType] = useState<'email' | 'whatsapp' | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isQuickActionSheetOpen) return null;

  const handleManual = () => {
    closeQuickActionSheet();
    setActiveSubView('main');
    openTransactionModal();
  };

  const handleScan = () => {
    closeQuickActionSheet();
    setActiveSubView('main');
    openReceiptModal();
  };

  const handleCopy = (text: string, type: 'email' | 'whatsapp') => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    showToast(
      language === 'id' ? 'Berhasil Disalin' : 'Copied to Clipboard',
      language === 'id' ? `${text} disalin ke clipboard.` : `${text} copied to clipboard.`
    );
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      showToast(
        language === 'id' ? 'Berkas Struk Diterima' : 'Receipt Received',
        language === 'id' 
          ? `Membuka AI OCR Scanner untuk memproses "${file.name}"...`
          : `Launching AI OCR Scanner to process "${file.name}"...`
      );
      setTimeout(() => {
        closeQuickActionSheet();
        setActiveSubView('main');
        openReceiptModal();
      }, 600);
    }
  };

  const handleQuickDemoSend = (merchant: string, amount: number, category: string) => {
    closeQuickActionSheet();
    setActiveSubView('main');
    addTransactionWithReceipt(
      {
        amount,
        type: 'expense',
        categoryId: 'cat-digital-tools',
        date: '2026-09-04',
        description: `${merchant} (E-Receipt Upload)`,
        isRecurring: false,
        note: 'Struk elektronik terkirim via Quick Upload FlowLedger'
      },
      {
        merchant,
        amount,
        date: '2026-09-04',
        category,
        confidence: 0.98,
        tax: amount * 0.11,
        items: [
          { description: `${merchant} Service Order`, amount }
        ],
        rawText: `${merchant}\nTotal: Rp ${amount.toLocaleString()}\nStatus: Paid via E-Wallet`
      }
    );
  };

  return (
    <div 
      id="apple-action-sheet-backdrop" 
      onClick={() => {
        closeQuickActionSheet();
        setActiveSubView('main');
      }}
      className="fixed inset-0 z-50 bg-black/45 dark:bg-black/65 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="apple-action-sheet-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-t-[32px] sm:rounded-[28px] border-t sm:border border-white/50 dark:border-white/10 shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Apple iOS Grabber Pill */}
        <div className="w-10 h-1.2 rounded-full bg-gray-300/80 dark:bg-gray-600/80 mx-auto -mt-1 mb-3 select-none" />

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFilePicked}
          accept="image/*,application/pdf" 
          className="hidden" 
        />

        {activeSubView === 'main' ? (
          <>
            {/* Header */}
            <div className="text-center px-2 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'id' ? 'Pencatatan Cepat' : 'Quick Capture'}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {language === 'id' ? 'Tambah Pengeluaran & Transaksi' : 'Record Expense & Transaction'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                {language === 'id' 
                  ? 'Pilih metode yang Anda inginkan untuk mencatat ke buku besar FlowLedger' 
                  : 'Select your preferred method to record this transaction into your studio ledger'}
              </p>
            </div>

            {/* Apple iOS Grouped Action Cells */}
            <div className="space-y-2.5 pt-2">
              {/* Option 1: Manual Entry */}
              <button
                id="apple-sheet-manual-btn"
                onClick={handleManual}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/70 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 border border-gray-200/70 dark:border-gray-700/80 active:scale-[0.99] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <PenLine className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                      {language === 'id' ? 'Catat Secara Manual' : 'Manual Entry'}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block line-clamp-1">
                      {language === 'id' 
                        ? 'Input nominal, kategori anggaran, tanggal, & catatan' 
                        : 'Input amount, budget envelope, date, and description'}
                    </span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Option 2: Scan Receipt OCR */}
              <button
                id="apple-sheet-scan-btn"
                onClick={handleScan}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/70 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 border border-gray-200/70 dark:border-gray-700/80 active:scale-[0.99] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {language === 'id' ? 'Pindai Struk (AI Scanner)' : 'Scan Paper Receipt'}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                        OCR
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block line-clamp-1">
                      {language === 'id' 
                        ? 'Foto fisik nota belanja, vendor & total terbaca otomatis' 
                        : 'Capture paper receipt photo, auto-extract items & total'}
                    </span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-amber-600 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Option 3: Send or Upload Receipt */}
              <button
                id="apple-sheet-send-btn"
                onClick={() => setActiveSubView('sendReceipt')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/70 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 border border-gray-200/70 dark:border-gray-700/80 active:scale-[0.99] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                      {language === 'id' ? 'Kirim / Unggah Berkas Struk' : 'Send or Upload Receipt'}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block line-clamp-1">
                      {language === 'id' 
                        ? 'Unggah dari galeri HP, atau kirim via WhatsApp & Email' 
                        : 'Upload from mobile photo album or forward via WhatsApp/Email'}
                    </span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-600 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Sub-View: Kirim atau Unggah Struk Details */
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubView('main')}
                  className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  ← {language === 'id' ? 'Kembali' : 'Back'}
                </button>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {language === 'id' ? 'Kirim / Unggah Struk' : 'Send or Upload'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400">FlowLedger Hub</span>
            </div>

            {/* Direct Mobile Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-xs hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block">
                  {language === 'id' ? 'Pilih Gambar dari Galeri HP' : 'Select from Mobile Gallery'}
                </span>
                <span className="text-[11px] text-emerald-100 block truncate">
                  {language === 'id' ? 'Mendukung foto JPG, PNG, atau berkas PDF' : 'Supports JPG, PNG photos or PDF invoices'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-75" />
            </button>

            {/* Channels: WhatsApp & Email Forwarding */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {/* WhatsApp Bot Card */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                      WhatsApp Receipt Bot
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono block">
                      +62 812-8900-FLOW
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy('+6281289003569', 'whatsapp')}
                    className="p-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-emerald-700 text-xs font-medium border border-gray-200 dark:border-gray-600 cursor-pointer"
                    title="Copy Number"
                  >
                    {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href="https://wa.me/6281289003569?text=Halo%20FlowLedger%2C%20saya%20kirimkan%20struk%20pengeluaran%20studio"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors"
                  >
                    Chat
                  </a>
                </div>
              </div>

              {/* Email Forwarding Card */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">
                      Forward E-Receipt Email
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono block truncate max-w-[160px]">
                      receipts@alexrivera.studio
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('receipts@alexrivera.studio', 'email')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 text-[11px] font-semibold border border-gray-200 dark:border-gray-600 cursor-pointer"
                >
                  {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'email' ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fill Presets */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider mb-1.5">
                {language === 'id' ? 'Uji Cepat E-Receipt Digital' : 'Quick Demo Digital Receipts'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemoSend('Tokopedia Stationeries', 245000, 'Hardware & Office')}
                  className="p-2 text-left rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-800 dark:text-gray-200 text-[11px] border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                >
                  <span className="font-semibold block truncate">Tokopedia Struk</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">{formatCurrency(245000)}</span>
                </button>
                <button
                  onClick={() => handleQuickDemoSend('Gojek Food & Coffee', 65000, 'Dining & Coffee')}
                  className="p-2 text-left rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-800 dark:text-gray-200 text-[11px] border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                >
                  <span className="font-semibold block truncate">GoFood E-Receipt</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">{formatCurrency(65000)}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standalone Apple-style Cancel Button */}
        <div className="pt-2">
          <button
            id="apple-sheet-cancel-btn"
            onClick={() => {
              closeQuickActionSheet();
              setActiveSubView('main');
            }}
            className="w-full py-3 bg-gray-100/90 dark:bg-gray-800/90 hover:bg-gray-200/90 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-2xl transition-colors cursor-pointer active:scale-[0.99]"
          >
            {language === 'id' ? 'Batal' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

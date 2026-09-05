import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  CreditCard, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Eye, 
  Check, 
  ExternalLink,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientPortalView: React.FC = () => {
  const { 
    setIsClientPortalMode, 
    showToast,
    formatCurrency,
    t,
    language,
    currency,
    toggleCurrency,
    openConverter
  } = useApp();

  const [hasApprovedWork, setHasApprovedWork] = useState(false);
  const [hasPaidInvoice, setHasPaidInvoice] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: 'alex' | 'sarah'; text: string; time: string }[]>([
    { 
      sender: 'alex', 
      text: language === 'id' 
        ? 'Halo Sarah, saya sudah mengunggah dek konsep terbaru dan pratinjau motion untuk perancangan ulang.' 
        : 'Hi Sarah, uploaded the latest concept deck and motion preview for the redesign.', 
      time: language === 'id' ? 'Kemarin 15:45 WIB' : 'Yesterday 3:45 PM' 
    },
    { 
      sender: 'sarah', 
      text: language === 'id' 
        ? 'Terima kasih Alex! Kami sedang meninjau bersama tim direksi pagi ini.' 
        : 'Thanks Alex! Reviewing with the executive team this morning.', 
      time: language === 'id' ? 'Hari ini 09:15 WIB' : 'Today 9:15 AM' 
    }
  ]);

  const invoiceAmount = 1500;

  const handleApprove = () => {
    setHasApprovedWork(true);
    showToast(
      language === 'id' ? 'Hasil Kerja Disetujui' : 'Work approved',
      language === 'id' ? 'Terima kasih! Anda menyetujui milestone Final Concept Review.' : 'Thank you! You approved the Final Concept Review milestone.'
    );
  };

  const handlePayInvoice = () => {
    setHasPaidInvoice(true);
    showToast(
      language === 'id' ? 'Pembayaran Berhasil' : 'Payment confirmed',
      language === 'id' ? `Faktur INV-024 (${formatCurrency(invoiceAmount)}) berhasil dilunasi.` : `Invoice INV-024 (${formatCurrency(invoiceAmount)}) marked as paid via client card.`
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages(prev => [...prev, {
      sender: 'sarah',
      text: chatMessage.trim(),
      time: language === 'id' ? 'Baru saja' : 'Just now'
    }]);
    setChatMessage('');
    showToast(
      language === 'id' ? 'Pesan Terkirim' : 'Message sent',
      language === 'id' ? 'Pesan telah diteruskan ke Alex Rivera.' : 'Message forwarded to Alex Rivera.'
    );
  };

  return (
    <div id="client-portal-container" className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20 select-none">
      {/* Top Banner indicating Client Portal Preview Mode */}
      <div className="bg-gray-900 dark:bg-black text-white px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">
            {language === 'id' ? 'Pratinjau Portal Klien:' : 'Client Portal Preview Mode:'}
          </span>
          <span className="text-gray-300">
            {language === 'id' ? 'Melihat sebagai Sarah Lin (Acme Studio)' : 'Viewing as Sarah Lin (Acme Studio)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors cursor-pointer"
          >
            <Coins className="w-3 h-3 text-amber-400" />
            <span>{currency}</span>
          </button>
          <button
            onClick={() => setIsClientPortalMode(false)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Kembali ke Dasbor Studio' : 'Exit to Freelancer Workspace'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {language === 'id' ? 'Halo Sarah 👋' : 'Hi Sarah 👋'}
            </h1>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
              Acme Studio Hub
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            {language === 'id'
              ? 'Berikut seluruh berkas proyek, review deliverable, kontrak kerja, dan rincian penagihan termin Anda.'
              : "Here's everything related to your project, milestone reviews, contracts, and billing."}
          </p>
        </div>

        {/* 1. Active Project Card */}
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {language === 'id' ? 'Proyek Aktif' : 'Active Project'}
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                Brand Identity & Website Redesign
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                {language === 'id' ? 'Sedang Berjalan' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'id' ? 'Kemajuan Proyek' : 'Project Progress'}
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-bold">
                {hasApprovedWork ? '75%' : '65%'} {language === 'id' ? 'selesai' : 'complete'}
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-emerald-800 dark:bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: hasApprovedWork ? '75%' : '65%' }}
              />
            </div>
          </div>

          {/* Next milestone box */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {language === 'id' ? 'Milestone Selanjutnya' : 'Next Milestone'}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                {language === 'id' ? 'Tinjauan Konsep Akhir & Panduan Tipografi' : 'Final Concept Review & Typography Specs'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {language === 'id' 
                  ? 'Siap untuk persetujuan klien guna membuka tahap implementasi produksi.' 
                  : 'Ready for stakeholder approval to unlock production development.'}
              </p>
            </div>

            {hasApprovedWork ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800">
                <Check className="w-4 h-4" /> {language === 'id' ? 'Disetujui oleh Sarah' : 'Approved by Sarah'}
              </span>
            ) : (
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Setujui Desain' : 'Approve Work'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Grid: Invoices & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Invoices */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  {language === 'id' ? 'Tagihan Berjalan' : 'Current Invoice'}
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {language === 'id' ? 'Jatuh tempo 15 Sep 2026' : 'Due Sep 15, 2026'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 block">INV-024</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {language === 'id' ? 'Pengiriman Termin 2 Desain' : 'Milestone 2 Design Delivery'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100 block">
                      {formatCurrency(invoiceAmount)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${hasPaidInvoice ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {hasPaidInvoice ? (language === 'id' ? 'Lunas' : 'Paid') : (language === 'id' ? 'Menunggu Pembayaran' : 'Pending Payment')}
                    </span>
                  </div>
                </div>

                {hasPaidInvoice ? (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg flex items-center gap-2 border border-emerald-200/60 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'id' ? 'Pelunasan diverifikasi pada 3 September 2026' : 'Payment completed on September 3, 2026'}</span>
                  </div>
                ) : (
                  <button
                    onClick={handlePayInvoice}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{language === 'id' ? `Bayar ${formatCurrency(invoiceAmount)} dengan Kartu/Transfer` : `Pay ${formatCurrency(invoiceAmount)} with Card`}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
              {language === 'id' ? 'Kuitansi resmi terenkripsi & sesuai standar akuntansi' : 'Secured bank-grade receipt & encrypted transfer'}
            </div>
          </div>

          {/* Project Documents */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {language === 'id' ? 'Dokumen & Kontrak' : 'Project Documents'}
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                3 {language === 'id' ? 'Berkas' : 'Files'}
              </span>
            </div>

            <div className="space-y-2">
              {[
                { name: language === 'id' ? 'Perjanjian Kerja Sama & Kontrak Layanan' : 'Master Services Agreement & Contract', type: 'PDF', size: '1.4 MB' },
                { name: language === 'id' ? 'Proposal Ruang Lingkup Perancangan Ulang Web' : 'Website Redesign Scope of Work Proposal', type: 'PDF', size: '3.8 MB' },
                { name: language === 'id' ? 'Rilis Panduan Identitas Brand v1.2' : 'Brand Guidelines v1.2 Release', type: 'PDF', size: '8.2 MB' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{doc.name}</div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{doc.size} • {doc.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast(language === 'id' ? 'Membuka Berkas' : 'Opening document', doc.name)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md cursor-pointer"
                    title="Download document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Recent Activity & Direct Communication with Alex */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {language === 'id' ? 'Pembaruan Proyek Terkini' : 'Recent Project Updates'}
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold block">
                    {language === 'id' ? 'Alex mengunggah 3 aset desain baru' : 'Alex uploaded 3 new design assets'}
                  </strong>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                    {language === 'id' ? 'Konsep final siap untuk ditinjau dan diberikan masukan.' : 'Final concept ready for review and feedback.'}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-[10px] block mt-1">
                    {language === 'id' ? 'Hari ini pukul 11:20 WIB' : 'Today at 11:20 AM'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold block">
                    {language === 'id' ? 'Milestone 1 Telah Selesai' : 'Milestone 1 Completed'}
                  </strong>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                    {language === 'id' ? 'Arsitektur Informasi & Penyerahan Wireframe.' : 'Information Architecture & Wireframe handoff.'}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-[10px] block mt-1">
                    {language === 'id' ? '28 Agu 2026' : 'Aug 28, 2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Messaging Channel */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <MessageSquare className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {language === 'id' ? 'Pesan Langsung dengan Alex' : 'Direct Message with Alex'}
                </h3>
              </div>

              {/* Chat thread */}
              <div className="space-y-2.5 pt-3 max-h-48 overflow-y-auto pr-1 text-xs">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'sarah' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-xl max-w-[85%] ${
                      msg.sender === 'sarah' ? 'bg-emerald-800 dark:bg-emerald-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={language === 'id' ? 'Tulis pesan atau pertanyaan untuk Alex...' : 'Ask Alex a question...'}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

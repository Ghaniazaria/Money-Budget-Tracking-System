import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Send, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Search,
  Filter,
  X,
  Printer,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';

export const InvoicesView: React.FC = () => {
  const { 
    invoices, 
    clients, 
    projects, 
    addInvoice, 
    updateInvoiceStatus, 
    sendInvoiceReminder,
    showToast,
    formatCurrency,
    t,
    language,
    currency,
    toggleCurrency,
    openConverter
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  // New Invoice Form State
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [itemDesc, setItemDesc] = useState('Milestone 2 Design Delivery');
  const [itemRate, setItemRate] = useState('1500');

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch = 
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.projectName && inv.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalOutstanding = invoices
    .filter(i => i.status === 'sent' || i.status === 'viewed' || i.status === 'overdue')
    .reduce((s, i) => s + i.amount, 0);

  const totalOverdue = invoices
    .filter(i => i.status === 'overdue')
    .reduce((s, i) => s + i.amount, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((s, i) => s + i.amount, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    const project = projects.find(p => p.id === projectId);
    const rateNum = parseFloat(itemRate) || 0;

    addInvoice({
      clientId,
      clientName: client?.name || client?.company || (language === 'id' ? 'Klien' : 'Client'),
      clientEmail: client?.email,
      projectId,
      projectName: project?.name,
      amount: rateNum,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate,
      status: 'sent',
      items: [
        { description: itemDesc.trim(), quantity: 1, rate: rateNum, amount: rateNum }
      ],
      notes: language === 'id' ? 'Syarat pembayaran 14 hari kerja. Terima kasih atas kepercayaan Anda!' : 'Net 14 payment terms. Thank you for your continued business!'
    });

    setIsNewInvoiceModalOpen(false);
    showToast(
      language === 'id' ? 'Faktur Dibuat' : 'Invoice Generated',
      language === 'id' ? 'Faktur termin berhasil diterbitkan dan siap dikirim.' : 'Invoice has been generated and ready for client.'
    );
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">{language === 'id' ? 'Lunas' : 'Paid'}</span>;
      case 'overdue':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">{language === 'id' ? 'Terlambat' : 'Overdue'}</span>;
      case 'sent':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">{language === 'id' ? 'Terkirim' : 'Sent'}</span>;
      case 'viewed':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">{language === 'id' ? 'Dilihat' : 'Viewed'}</span>;
      case 'draft':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{language === 'id' ? 'Draf' : 'Draft'}</span>;
    }
  };

  return (
    <div id="invoices-page-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {language === 'id' ? 'Faktur & Penagihan Termin' : 'Invoices & Billing'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'id'
              ? 'Terbitkan faktur profesional, pantau status pelunasan, dan kirim pengingat ramah ke klien.'
              : 'Issue, track, and collect client payments with clear milestone transparency.'}
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
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Terbitkan Faktur' : 'New Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Total Piutang Berjalan' : 'Total Outstanding'}
          </span>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] text-gray-400 dark:text-gray-500">
            {language === 'id' ? 'Menunggu pelunasan klien' : 'Awaiting client fulfillment'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Faktur Melewati Tenggat' : 'Overdue Balances'}
          </span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {formatCurrency(totalOverdue)}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            {language === 'id' ? 'Disarankan kirim pengingat ramah' : 'Follow-up reminder suggested'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Pendapatan Telah Diterima' : 'Collected Revenue'}
          </span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(totalPaid)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {language === 'id' ? 'Sudah masuk rekening kas studio' : 'Settled to bank accounts'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'id' ? 'Cari nomor faktur, klien...' : 'Search invoice number, client...'}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700 text-xs font-medium overflow-x-auto w-full sm:w-auto">
          {(['all', 'draft', 'sent', 'viewed', 'paid', 'overdue'] as const).map(st => {
            const label = language === 'id'
              ? (st === 'all' ? 'Semua' : st === 'draft' ? 'Draf' : st === 'sent' ? 'Terkirim' : st === 'viewed' ? 'Dilihat' : st === 'paid' ? 'Lunas' : 'Terlambat')
              : st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md capitalize whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3 px-5">{language === 'id' ? 'No. Faktur' : 'Invoice #'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Klien & Proyek' : 'Client & Project'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Jatuh Tempo' : 'Due Date'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Status' : 'Status'}</th>
                <th className="py-3 px-5 text-right">{language === 'id' ? 'Nominal' : 'Amount'}</th>
                <th className="py-3 px-4 text-center">{language === 'id' ? 'Aksi' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors group">
                  <td className="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-100">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="hover:underline text-emerald-800 dark:text-emerald-400 font-semibold cursor-pointer"
                    >
                      {inv.number}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{inv.clientName}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                      {inv.projectName || (language === 'id' ? 'Layanan Desain & Advisory' : 'Advisory Services')}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(inv.dueDate).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        title={language === 'id' ? 'Lihat pratayang faktur' : 'View invoice preview'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => sendInvoiceReminder(inv.id)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                          title={language === 'id' ? 'Kirim pengingat ke klien' : 'Send reminder to client'}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                          className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                          title={language === 'id' ? 'Tandai lunas' : 'Mark as paid'}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail / Printable Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal actions bar */}
            <div className="px-6 py-3.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">{selectedInvoice.number}</span>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(language === 'id' ? 'PDF Diunduh' : 'PDF Exported', `${selectedInvoice.number} siap diunduh.`)}
                  className="px-2.5 py-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" /> {language === 'id' ? 'Unduh PDF' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document body */}
            <div className="p-8 space-y-6 text-xs text-gray-800 dark:text-gray-200">
              {/* Top Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">Fins Studio</div>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">Alex Rivera • Design & Advisory</p>
                  <p className="text-gray-400 dark:text-gray-500 text-[11px]">alex@riveradesign.io • Jakarta / San Francisco</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold block">
                    {language === 'id' ? 'FAKTUR' : 'INVOICE'}
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.number}</span>
                </div>
              </div>

              {/* Billed To and Dates */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider block">
                    {language === 'id' ? 'Ditagihkan Kepada' : 'Billed To'}
                  </span>
                  <div className="font-bold text-gray-900 dark:text-gray-100 mt-1">{selectedInvoice.clientName}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-[11px]">{selectedInvoice.clientEmail}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 mr-2">{language === 'id' ? 'Diterbitkan:' : 'Issued:'}</span>
                    <strong className="text-gray-800 dark:text-gray-200">{selectedInvoice.issueDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 mr-2">{language === 'id' ? 'Jatuh Tempo:' : 'Due Date:'}</span>
                    <strong className="text-gray-900 dark:text-gray-100">{selectedInvoice.dueDate}</strong>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-700 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">{language === 'id' ? 'Deskripsi Layanan' : 'Item Description'}</th>
                      <th className="py-2.5 px-3 text-center">{language === 'id' ? 'Jml' : 'Qty'}</th>
                      <th className="py-2.5 px-3 text-right">{language === 'id' ? 'Tarif Satuan' : 'Rate'}</th>
                      <th className="py-2.5 px-4 text-right">{language === 'id' ? 'Total' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{item.description}</td>
                        <td className="py-3 px-3 text-center text-gray-500 dark:text-gray-400">{item.quantity}</td>
                        <td className="py-3 px-3 text-right text-gray-500 dark:text-gray-400">{formatCurrency(item.rate)}</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-gray-100">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Balance */}
              <div className="flex justify-end pt-2">
                <div className="w-56 space-y-1.5 text-right">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                    <span>{language === 'id' ? 'Pajak PPN (0%):' : 'Tax (0%):'}</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                    <span>{language === 'id' ? 'Total Tagihan:' : 'Total Due:'}</span>
                    <span>{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-0.5">
                    {language === 'id' ? 'Catatan & Instruksi Pembayaran:' : 'Notes & Terms:'}
                  </span>
                  {selectedInvoice.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {language === 'id' ? 'Terbitkan Faktur Baru' : 'Generate Invoice'}
              </h3>
              <button 
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Pilih Klien' : 'Select Client'}
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Pilih Proyek Terkait' : 'Select Project'}
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {language === 'id' ? `Nominal Tagihan (${currency})` : `Amount (${currency})`}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={itemRate}
                    onChange={(e) => setItemRate(e.target.value)}
                    placeholder={currency === 'IDR' ? '15000000' : '1500'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {language === 'id' ? 'Tanggal Jatuh Tempo' : 'Payment Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Keterangan Layanan / Termin' : 'Milestone / Deliverable Description'}
                </label>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder={language === 'id' ? 'Contoh: Pelunasan Termin 2 - Desain Sistem' : 'e.g. Milestone 2 Design Delivery'}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-3.5 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium cursor-pointer"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  {language === 'id' ? 'Terbitkan & Kirim' : 'Create & Send Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Mail, 
  Phone, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Files,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';

export const ClientsView: React.FC = () => {
  const { 
    clients, 
    projects, 
    invoices, 
    documents, 
    transactions, 
    addClient, 
    selectedClientId, 
    setSelectedClientId,
    setActiveTab,
    setIsClientPortalMode,
    formatCurrency,
    t,
    language,
    currency,
    toggleCurrency,
    openConverter,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // New client form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Active client for detail view
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    addClient({
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: phone.trim() || '+62 812-3456-7890',
      notes: notes.trim()
    });

    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setNotes('');
    setIsAddClientModalOpen(false);
    showToast(
      language === 'id' ? 'Klien Ditambahkan' : 'Client Added',
      language === 'id' ? `Kontak "${name}" (${company}) berhasil tersimpan.` : `Client "${name}" (${company}) saved.`
    );
  };

  // Associated client data
  const clientProjects = projects.filter(p => p.clientId === currentClient?.id);
  const clientInvoices = invoices.filter(i => i.clientId === currentClient?.id);
  const clientDocuments = documents.filter(d => d.clientId === currentClient?.id);
  const clientPayments = transactions.filter(t => t.clientId === currentClient?.id && t.type === 'income');

  return (
    <div id="clients-crm-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {language === 'id' ? 'Direktori Klien & CRM' : 'Client Directory & CRM'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'id'
              ? 'Pusat manajemen relasi klien yang menghubungkan kontrak kerja, riwayat invoice, dan total omzet.'
              : 'Lightweight relationship hub connecting contracts, invoices, and revenue.'}
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
            onClick={() => setIsAddClientModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Tambah Klien' : 'Add Client'}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Client List */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'id' ? 'Cari nama klien, instansi...' : 'Search clients by name, company...'}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500 transition-all"
            />
          </div>

          {/* List items */}
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredClients.map((client) => {
              const isSelected = currentClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-gray-900 dark:text-gray-100 shadow-2xs' 
                      : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-emerald-800 dark:bg-emerald-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                        <span className={isSelected ? 'text-emerald-950 dark:text-emerald-200 font-bold' : 'text-gray-900 dark:text-gray-100'}>{client.name}</span>
                        {client.outstandingBalance > 0 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                            {language === 'id' ? 'Ada Tagihan' : 'Due'}
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {client.company} • {client.activeProjectsCount} {language === 'id' ? 'proyek aktif' : 'active projects'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold ${isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-gray-900 dark:text-gray-100'}`}>
                      {formatCurrency(client.totalRevenue)}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {client.lastActivity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Client Detail Profile View */}
        {currentClient && (
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 dark:bg-emerald-700 text-white font-bold text-base flex items-center justify-center shadow-2xs">
                  {currentClient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span>{currentClient.name}</span>
                    <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {currentClient.company}
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {currentClient.email}
                    </span>
                    {currentClient.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {currentClient.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Portal preview shortcut if Acme Studio */}
              {currentClient.company.includes('Acme') && (
                <button
                  onClick={() => setIsClientPortalMode(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{language === 'id' ? 'Pratayang Portal Klien' : 'Preview Client Portal'}</span>
                </button>
              )}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'Total Nilai Kontrak' : 'Total Lifetime Revenue'}
                </span>
                <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  {formatCurrency(currentClient.totalRevenue)}
                </div>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'Proyek Aktif' : 'Active Projects'}
                </span>
                <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  {clientProjects.length}
                </div>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'Sisa Piutang' : 'Outstanding Balance'}
                </span>
                <div className={`text-sm sm:text-base font-bold mt-0.5 ${currentClient.outstandingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formatCurrency(currentClient.outstandingBalance)}
                </div>
              </div>
            </div>

            {/* Client Projects List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  {language === 'id' ? 'Proyek Terkait' : 'Associated Projects'}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{clientProjects.length} {language === 'id' ? 'proyek' : 'projects'}</span>
              </div>

              {clientProjects.length === 0 ? (
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-center">
                  {language === 'id' ? 'Belum ada proyek tercatat untuk klien ini.' : 'No active projects currently logged for this client.'}
                </div>
              ) : (
                clientProjects.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        {p.progress}% {language === 'id' ? 'selesai • Tenggat' : 'complete • Due'} {p.deadline}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(p.value)}</div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {formatCurrency(p.paid)} {language === 'id' ? 'lunas' : 'paid'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Invoices Associated */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  {language === 'id' ? 'Faktur & Riwayat Termin' : 'Invoices & Billing'}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{clientInvoices.length} {language === 'id' ? 'faktur' : 'invoices'}</span>
              </div>

              {clientInvoices.length === 0 ? (
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-center">
                  {language === 'id' ? 'Belum ada faktur yang diterbitkan untuk klien ini.' : 'No invoices generated yet for this client.'}
                </div>
              ) : (
                clientInvoices.map((inv) => (
                  <div key={inv.id} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{inv.number}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">{language === 'id' ? 'Jatuh tempo' : 'Due'} {inv.dueDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inv.status === 'paid' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                          : inv.status === 'overdue' 
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' 
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      }`}>
                        {inv.status === 'paid' ? (language === 'id' ? 'Lunas' : 'Paid') : inv.status === 'overdue' ? (language === 'id' ? 'Terlambat' : 'Overdue') : inv.status}
                      </span>
                      <strong className="text-gray-900 dark:text-gray-100 font-bold">{formatCurrency(inv.amount)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recent Timeline / Activity */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {language === 'id' ? 'Catatan Interaksi Terkini' : 'Recent Relationship Activity'}
              </h3>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {language === 'id' ? 'Berkas pratinjau milestone dikirimkan' : 'Delivered milestone preview files'}
                    </span>
                    <span className="text-[11px] text-gray-400 block">{language === 'id' ? 'Kemarin pada 16:15 WIB' : 'Yesterday at 4:15 PM'}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {language === 'id' ? 'Faktur termin 1 disetujui & telah dilunasi' : 'Milestone 1 invoice approved & settled'}
                    </span>
                    <span className="text-[11px] text-gray-400 block">{language === 'id' ? '02 Sep 2026' : 'Sep 02, 2026'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Client Modal */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {language === 'id' ? 'Tambah Kontak Klien Baru' : 'Add New Client'}
              </h3>
              <button 
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {language === 'id' ? 'Nama Kontak' : 'Contact Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'id' ? 'Contoh: Maya Lin' : 'e.g. Maya Lin'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {language === 'id' ? 'Instansi / Perusahaan' : 'Company'}
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={language === 'id' ? 'Contoh: PT Studio Digital' : 'e.g. Apex Design Co'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Alamat Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@studio.com"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Nomor Telepon / WA' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Catatan & Preferensi' : 'Notes / Preferences'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'id' ? 'Termin pembayaran, saluran komunikasi utama...' : 'Payment terms, communication preference...'}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-3.5 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium cursor-pointer"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  {language === 'id' ? 'Simpan Klien' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Plus, 
  FolderKanban, 
  Clock, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  User, 
  ArrowUpRight,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    clients, 
    addProject, 
    updateProjectProgress, 
    updateProjectStatus, 
    setActiveTab, 
    setSelectedClientId,
    showToast,
    formatCurrency,
    t,
    language,
    currency,
    toggleCurrency,
    openConverter
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_review' | 'completed'>('all');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // New Project Form State
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [value, setValue] = useState('');
  const [deadline, setDeadline] = useState('2026-10-15');
  const [description, setDescription] = useState('');

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const totalContractValue = projects.reduce((acc, p) => acc + p.value, 0);
  const totalPaidRevenue = projects.reduce((acc, p) => acc + p.paid, 0);
  const totalOutstanding = projects.reduce((acc, p) => acc + p.outstanding, 0);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value) return;
    const client = clients.find(c => c.id === clientId);

    addProject({
      name: name.trim(),
      clientId,
      clientName: client?.name || client?.company || (language === 'id' ? 'Klien' : 'Client'),
      status: 'active',
      progress: 0,
      deadline,
      value: parseFloat(value) || 0,
      description: description.trim() || (language === 'id' ? 'Pekerjaan proyek klien baru' : 'New client project engagement'),
      milestones: [
        { title: language === 'id' ? 'Kickoff & Validasi Ruang Lingkup' : 'Project Kickoff & Scope Validation', completed: true, dueDate: deadline },
        { title: language === 'id' ? 'Pengiriman Hasil Milestone 1' : 'Milestone 1 Deliverables', completed: false, dueDate: deadline }
      ]
    });

    setName('');
    setValue('');
    setDescription('');
    setIsNewProjectModalOpen(false);
    showToast(
      language === 'id' ? 'Proyek Dibuat' : 'Project Created',
      language === 'id' ? `Proyek "${name}" berhasil ditambahkan ke pipeline.` : `Project "${name}" added to pipeline.`
    );
  };

  const activeProjectDetail = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div id="projects-page-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {language === 'id' ? 'Manajemen Proyek & Klien' : 'Project Management'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'id' 
              ? 'Pantau progres pengerjaan, nilai kontrak kerja, dan penagihan termin faktur.' 
              : 'Connect your deliverables to clients, revenue, and pending milestone invoices.'}
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
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'id' ? 'Buat Proyek Baru' : 'New Project'}</span>
          </button>
        </div>
      </div>

      {/* Revenue & Pipeline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Total Pipeline Kontrak' : 'Total Contract Pipeline'}
          </span>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {formatCurrency(totalContractValue)}
          </div>
          <div className="text-[11px] text-gray-400 dark:text-gray-500">
            {language === 'id' ? `Dari ${projects.length} kontrak tercatat` : `Across ${projects.length} recorded contracts`}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Pendapatan Diterima (Lunas)' : 'Revenue Billed & Collected'}
          </span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(totalPaidRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {((totalPaidRevenue / (totalContractValue || 1)) * 100).toFixed(0)}% {language === 'id' ? 'teralisasi saat ini' : 'realized to date'}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === 'id' ? 'Piutang Menunggu Pelunasan' : 'Outstanding Receivable Scope'}
          </span>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0.5">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {language === 'id' ? 'Ditagihkan sesuai milestone' : 'To be invoiced on completion'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-100 dark:border-gray-700 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Semua' : 'All'} ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'active' ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Sedang Berjalan' : 'Active'} ({projects.filter(p => p.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('in_review')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'in_review' ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Review Klien' : 'In Review'} ({projects.filter(p => p.status === 'in_review').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'completed' ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {language === 'id' ? 'Selesai' : 'Completed'} ({projects.filter(p => p.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`bg-white dark:bg-gray-900 p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-md ${
                isSelected 
                  ? 'border-emerald-800 dark:border-emerald-500 ring-1 ring-emerald-800 dark:ring-emerald-500 shadow-xs' 
                  : 'border-gray-100 dark:border-gray-800 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Name and Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{proj.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{proj.clientName}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md shrink-0 uppercase tracking-wider ${
                    proj.status === 'active' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' 
                      : proj.status === 'in_review'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                  }`}>
                    {proj.status === 'active' ? (language === 'id' ? 'Aktif' : 'Active') : proj.status === 'in_review' ? (language === 'id' ? 'Review' : 'In Review') : (language === 'id' ? 'Selesai' : 'Completed')}
                  </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-gray-500 dark:text-gray-400">{language === 'id' ? 'Kemajuan' : 'Progress'}</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        proj.progress === 100 ? 'bg-emerald-500' : 'bg-emerald-800 dark:bg-emerald-600'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Deadline Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 block">{language === 'id' ? 'Nilai' : 'Value'}</span>
                    <strong className="text-gray-900 dark:text-gray-100 font-semibold">{formatCurrency(proj.value)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 block">{language === 'id' ? 'Dibayar' : 'Paid'}</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(proj.paid)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 block">{language === 'id' ? 'Sisa' : 'Due'}</span>
                    <strong className="text-gray-700 dark:text-gray-300 font-semibold">{formatCurrency(proj.outstanding)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {language === 'id' ? 'Tenggat' : 'Due'} {new Date(proj.deadline).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateProjectProgress(proj.id, Math.min(100, proj.progress + 10));
                    }}
                    className="text-emerald-800 dark:text-emerald-400 hover:underline font-semibold text-[10px] cursor-pointer"
                  >
                    +10% {language === 'id' ? 'progres' : 'progress'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Milestone & Connection Drawer */}
      {activeProjectDetail && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{activeProjectDetail.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                  {activeProjectDetail.clientName}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activeProjectDetail.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('invoices');
                }}
                className="px-3.5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <span>{language === 'id' ? 'Buat Faktur Termin' : 'Create Milestone Invoice'}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedClientId(activeProjectDetail.clientId);
                  setActiveTab('clients');
                }}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Buka CRM Klien' : 'View Client CRM'}</span>
              </button>
            </div>
          </div>

          {/* Milestone checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {language === 'id' ? 'Milestone & Serah Terima Proyek' : 'Project Milestones & Deliverables'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProjectDetail.milestones?.map((m, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    m.completed ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-750'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${m.completed ? 'text-emerald-600' : 'text-gray-300 dark:text-gray-600'}`} />
                    <span className={`truncate font-medium ${m.completed ? 'text-gray-900 dark:text-gray-100 line-through opacity-70' : 'text-gray-800 dark:text-gray-200'}`}>
                      {m.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 font-medium">{m.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {language === 'id' ? 'Buat Proyek Kontrak Baru' : 'Create New Project'}
              </h3>
              <button 
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Nama Proyek' : 'Project Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'id' ? 'Contoh: Redesign Aplikasi Mobile Bank XYZ' : 'e.g. Mobile App Redesign'}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Klien' : 'Client'}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {language === 'id' ? `Nilai Kontrak (${currency})` : `Project Value (${currency})`}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={currency === 'IDR' ? '35000000' : '2500'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    {language === 'id' ? 'Target Tenggat' : 'Target Deadline'}
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {language === 'id' ? 'Deskripsi Singkat' : 'Brief Description'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'id' ? 'Ruang lingkup, deliverable, dan ekspektasi klien...' : 'Scope, deliverables, and expectations...'}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden focus:border-emerald-800 dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-3.5 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium cursor-pointer"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  {language === 'id' ? 'Simpan Proyek' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

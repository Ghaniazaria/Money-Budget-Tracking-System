import React, { useState } from 'react';
import { 
  Files, 
  Search, 
  Upload, 
  FileText, 
  Receipt, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Plus,
  Filter,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, openReceiptModal, language, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDocPreview, setActiveDocPreview] = useState<DocumentItem | null>(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.clientName && doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: language === 'id' ? 'Semua Berkas' : 'All Documents' },
    { id: 'contract', label: language === 'id' ? 'Kontrak & PKS' : 'Contracts' },
    { id: 'proposal', label: language === 'id' ? 'Proposal & SOW' : 'Proposals' },
    { id: 'receipt', label: language === 'id' ? 'Struk & Bukti Bayar' : 'Receipts' },
    { id: 'guidelines', label: language === 'id' ? 'Panduan & Aset' : 'Guidelines' },
  ];

  const handleDownload = (doc: DocumentItem) => {
    showToast(
      language === 'id' ? 'Mengunduh Berkas' : 'Downloading Document',
      language === 'id' ? `Menyiapkan ${doc.title} (${doc.fileSize})` : `Preparing ${doc.title} (${doc.fileSize})`
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Files className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <span>{language === 'id' ? 'Brankas Dokumen & Struk' : 'Document Vault & Receipts'}</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'id' 
              ? 'Arsip kontrak klien, proposal proyek, dan bukti pengeluaran tersinkronisasi aman.'
              : 'Secure repository for client agreements, project proposals, and tax receipts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openReceiptModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>{language === 'id' ? 'Pindai Struk Baru' : 'Scan New Receipt'}</span>
          </button>
          <button
            onClick={() => showToast(
              language === 'id' ? 'Unggah Berkas' : 'Upload Document',
              language === 'id' ? 'Fitur seret dan lepas dokumen siap digunakan.' : 'Drag-and-drop file upload is ready.'
            )}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{language === 'id' ? 'Unggah Berkas' : 'Upload Document'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari nama dokumen atau klien...' : 'Search document title or client...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:border-emerald-800"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-2xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="bg-white dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 font-semibold">
              <tr>
                <th className="py-3 px-4">{language === 'id' ? 'Judul Dokumen' : 'Document Title'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Kategori' : 'Category'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Klien Terkait' : 'Client'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Ukuran & Format' : 'Size / Format'}</th>
                <th className="py-3 px-4">{language === 'id' ? 'Status' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'id' ? 'Aksi' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Files className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>{language === 'id' ? 'Tidak ada dokumen yang sesuai kriteria pencarian.' : 'No documents matching your search filter.'}</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                            {doc.category === 'receipt' ? <Receipt className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 block">{doc.title}</span>
                            <span className="text-[10px] text-gray-400">
                              {language === 'id' ? 'Diunggah pada' : 'Uploaded'} {doc.uploadDate}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 capitalize">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-700 dark:text-gray-300">
                        {doc.clientName || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                        <span className="font-mono text-[11px]">{doc.fileType}</span> • {doc.fileSize}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          doc.status === 'Signed' || doc.status === 'Approved'
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                        }`}>
                          {doc.status === 'Signed' || doc.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{doc.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveDocPreview(doc)}
                            className="p-1.5 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            title={language === 'id' ? 'Lihat Berkas' : 'Preview Document'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 text-gray-500 hover:text-emerald-800 dark:hover:text-emerald-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            title={language === 'id' ? 'Unduh Berkas' : 'Download Document'}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {activeDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{activeDocPreview.title}</h3>
              </div>
              <button
                onClick={() => setActiveDocPreview(null)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'id' ? 'Tipe Berkas' : 'File Type'}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{activeDocPreview.fileType} ({activeDocPreview.fileSize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'id' ? 'Kategori' : 'Category'}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{activeDocPreview.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'id' ? 'Klien Terkait' : 'Client'}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{activeDocPreview.clientName || 'General Studio'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'id' ? 'Tanggal Unggah' : 'Upload Date'}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{activeDocPreview.uploadDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{language === 'id' ? 'Status Berkas' : 'Status'}:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{activeDocPreview.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveDocPreview(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                {language === 'id' ? 'Tutup' : 'Close'}
              </button>
              <button
                onClick={() => {
                  handleDownload(activeDocPreview);
                  setActiveDocPreview(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg cursor-pointer"
              >
                {language === 'id' ? 'Unduh Salinan' : 'Download Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

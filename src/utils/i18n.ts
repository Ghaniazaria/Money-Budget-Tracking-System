import { Language, Currency } from '../types';

export const DEFAULT_EXCHANGE_RATE = 16000; // 1 USD = 16.000 IDR

export interface FormatCurrencyOptions {
  compact?: boolean;
  showSecondary?: boolean;
  forceCurrency?: Currency;
  hideSymbol?: boolean;
}

/**
 * Format currency amount with base currency being IDR (Rupiah).
 * If target currency is USD, it converts using the exchangeRate.
 */
export function formatCurrency(
  amountInIDR: number,
  currency: Currency = 'IDR',
  exchangeRate: number = DEFAULT_EXCHANGE_RATE,
  options: FormatCurrencyOptions = {}
): string {
  const activeCurrency = options.forceCurrency || currency;
  const safeRate = exchangeRate > 0 ? exchangeRate : DEFAULT_EXCHANGE_RATE;

  if (activeCurrency === 'IDR') {
    if (options.compact) {
      if (Math.abs(amountInIDR) >= 1_000_000_000) {
        return `Rp ${(amountInIDR / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
      }
      if (Math.abs(amountInIDR) >= 1_000_000) {
        return `Rp ${(amountInIDR / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
      }
      if (Math.abs(amountInIDR) >= 1_000) {
        return `Rp ${(amountInIDR / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`;
      }
    }

    const formattedIDR = `Rp ${Math.round(amountInIDR).toLocaleString('id-ID')}`;

    if (options.showSecondary) {
      const usdVal = amountInIDR / safeRate;
      const formattedUSD = `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      return `${formattedIDR} (${formattedUSD})`;
    }

    return formattedIDR;
  } else {
    // USD Mode: Convert IDR -> USD
    const usdValue = amountInIDR / safeRate;

    if (options.compact) {
      if (Math.abs(usdValue) >= 1_000_000) {
        return `$${(usdValue / 1_000_000).toFixed(1)}M`;
      }
      if (Math.abs(usdValue) >= 1_000) {
        return `$${(usdValue / 1_000).toFixed(1)}k`;
      }
    }

    const formattedUSD = `$${usdValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    if (options.showSecondary) {
      const formattedIDR = `Rp ${Math.round(amountInIDR).toLocaleString('id-ID')}`;
      return `${formattedUSD} (${formattedIDR})`;
    }

    return formattedUSD;
  }
}

/**
 * Direct converter between IDR and USD
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): number {
  const safeRate = exchangeRate > 0 ? exchangeRate : DEFAULT_EXCHANGE_RATE;
  if (from === to) return amount;
  if (from === 'IDR' && to === 'USD') {
    return amount / safeRate;
  }
  if (from === 'USD' && to === 'IDR') {
    return amount * safeRate;
  }
  return amount;
}

export const TRANSLATIONS = {
  id: {
    // Navigation
    nav_overview: 'Ikhtisar',
    nav_budget: 'Anggaran',
    nav_transactions: 'Transaksi',
    nav_projects: 'Proyek',
    nav_clients: 'Klien',
    nav_invoices: 'Faktur',
    nav_insights: 'Kecerdasan AI',
    nav_documents: 'Dokumen',
    nav_settings: 'Pengaturan',
    nav_client_portal: 'Portal Klien',

    // Currency & Converter
    currency_idr: 'Rupiah (IDR)',
    currency_usd: 'Dollar AS (USD)',
    currency_converter_title: 'Konverter Mata Uang',
    currency_converter_subtitle: 'Ubah & bandingkan nilai Rupiah (IDR) dan US Dollar (USD)',
    exchange_rate_label: 'Kurs Acuan (USD ke IDR)',
    rate_disclaimer: 'Kurs acuan digunakan untuk mengonversi nilai transaksi luar negeri, invoice klien asing, dan display anggaran.',
    rate_preset_bi: 'Kurs Rata-rata (Rp 16.000)',
    rate_preset_market: 'Kurs Pasar (Rp 16.200)',
    rate_preset_custom: 'Kustomisasi Kurs',
    amount_in_idr: 'Jumlah dalam Rupiah (IDR)',
    amount_in_usd: 'Jumlah dalam Dollar AS (USD)',
    display_currency: 'Mata Uang Tampilan',
    switch_to_usd: 'Tampilkan dalam USD ($)',
    switch_to_idr: 'Tampilkan dalam Rupiah (Rp)',
    active_currency_info: 'Mata uang utama saat ini:',

    // Language Toggle
    lang_indonesian: 'Bahasa Indonesia',
    lang_english: 'English',
    switch_language: 'Ubah Bahasa',

    // Header & Quick Actions
    quick_add: 'Tambah',
    scan_receipt: 'Scan Struk',
    scan_receipt_sub: 'OCR AI Otomatis',
    export_csv: 'Ekspor CSV',
    review_budget: 'Tinjau Anggaran',
    add_transaction: 'Tambah Transaksi',

    // Overview Cards
    available_liquid_cash: 'Saldo Kas Tersedia',
    monthly_inflow: 'Pemasukan Bulan Ini',
    monthly_outflow: 'Pengeluaran Bulan Ini',
    operational_runway: 'Ketahanan Kas (Runway)',
    daily_safe_spend: 'Batas Belanja Harian Aman',
    remaining_budget: 'Sisa Anggaran Belanja',
    budget_pacing: 'Realisasi Anggaran',
    tax_reserve_est: 'Cadangan Pajak (Est.)',
    pending_receivables: 'Piutang Belum Tertagih',
    attention_required: 'Perlu Perhatian Anda',
    financial_vitality: 'Status Kesehatan Keuangan',

    // Budget View
    income_planned: 'Rencana Pemasukan',
    needs_budget: 'Kebutuhan Pokok (Needs)',
    wants_budget: 'Gaya Hidup & Keinginan (Wants)',
    goals_budget: 'Tabungan & Investasi (Goals)',
    budget_status_ontrack: 'Sesuai Rencana',
    budget_status_warning: 'Mendekati Batas',
    budget_status_exceeded: 'Melebihi Anggaran',
    add_category: 'Tambah Kategori',
    planned_amount: 'Target Anggaran',
    actual_spent: 'Realisasi Pengeluaran',
    percentage: 'Persentase',

    // Transactions View
    all_transactions: 'Semua Transaksi',
    search_transactions: 'Cari deskripsi, kategori, atau klien...',
    filter_all: 'Semua',
    filter_income: 'Pemasukan',
    filter_expense: 'Pengeluaran',
    date: 'Tanggal',
    description: 'Deskripsi',
    category: 'Kategori',
    project_client: 'Proyek / Klien',
    amount: 'Jumlah',
    actions: 'Aksi',
    no_transactions: 'Belum ada transaksi yang sesuai.',

    // Modal Add Transaction
    modal_add_tx_title: 'Catat Transaksi Baru',
    modal_have_receipt: 'Punya struk fisik atau digital?',
    modal_ocr_hint: 'Auto-fill otomatis nama toko & jumlah via OCR AI',
    type_expense: 'Pengeluaran',
    type_income: 'Pemasukan',
    tx_amount_label: 'Nominal',
    tx_desc_label: 'Keterangan Transaksi',
    tx_cat_label: 'Kategori Anggaran',
    tx_date_label: 'Tanggal Transaksi',
    tx_client_opt: 'Kaitkan Klien (Opsional)',
    tx_project_opt: 'Kaitkan Proyek (Opsional)',
    tx_recurring: 'Jadikan transaksi rutin bulanan',
    tx_submit: 'Simpan Transaksi',
    tx_cancel: 'Batal',

    // Receipt Scanner
    receipt_scanner_title: 'Pemindai Struk & Nota AI',
    receipt_scanner_subtitle: 'Ekstraksi otomatis nominal, toko, tanggal, dan PPN langsung ke pembukuan',
    upload_tab: 'Unggah Gambar',
    camera_tab: 'Kamera Langsung',
    samples_tab: 'Contoh Struk',
    drag_drop_receipt: 'Tarik & lepas foto struk di sini, atau klik untuk memilih berkas',
    analyzing_receipt: 'Sedang membaca struk dengan Gemini AI OCR...',
    extracted_details: 'Rincian Hasil Pindai Struk',
    merchant_name: 'Nama Toko / Penjual',
    receipt_date: 'Tanggal Pembelian',
    receipt_total: 'Total Tagihan',
    receipt_tax: 'Pajak / PPN',
    receipt_category: 'Rekomendasi Kategori',
    verify_and_save: 'Konfirmasi & Masukkan ke Pembukuan',

    // Projects & Clients
    projects_title: 'Manajemen Proyek',
    clients_title: 'Daftar Klien',
    invoices_title: 'Faktur & Tagihan',
    create_invoice: 'Buat Faktur',
    invoice_status_paid: 'Lunas',
    invoice_status_sent: 'Terkirim',
    invoice_status_overdue: 'Jatuh Tempo',
    invoice_status_draft: 'Draf',

    // AI Insights
    ai_insights_title: 'Kecerdasan AI & Penasihat Keuangan',
    ai_insights_subtitle: 'Analisis cerdas arus kas, efisiensi pajak, dan proyeksi keuangan freelancer',
    runway_simulator: 'Simulator Ketahanan Kas',
    ask_financial_advisor: 'Konsultasi Penasihat Keuangan AI',
    ask_placeholder: 'Tanyakan strategi penetapan harga proyek, cara menghemat pajak, atau proyeksi kas...',
    send_question: 'Kirim',

    // Settings
    settings_title: 'Pengaturan & Preferensi',
    settings_subtitle: 'Kelola preferensi mata uang, bahasa, tampilan, dan profil studio Anda',
    currency_settings: 'Pengaturan Mata Uang',
    language_settings: 'Pengaturan Bahasa',
    theme_settings: 'Mode Tampilan',
    profile_settings: 'Profil Studio / Freelancer',
    save_settings: 'Simpan Perubahan',
    settings_saved: 'Pengaturan berhasil diperbarui',

    // Common
    loading: 'Memuat...',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    status: 'Status',
    close: 'Tutup',
    copy: 'Salin',
    download: 'Unduh',
    success: 'Berhasil',
    months: 'bulan',
    days: 'hari'
  },
  en: {
    // Navigation
    nav_overview: 'Overview',
    nav_budget: 'Budget',
    nav_transactions: 'Transactions',
    nav_projects: 'Projects',
    nav_clients: 'Clients',
    nav_invoices: 'Invoices',
    nav_insights: 'AI Insights',
    nav_documents: 'Documents',
    nav_settings: 'Settings',
    nav_client_portal: 'Client Portal',

    // Currency & Converter
    currency_idr: 'Indonesian Rupiah (IDR)',
    currency_usd: 'US Dollar (USD)',
    currency_converter_title: 'Currency Converter',
    currency_converter_subtitle: 'Convert and compare values between Indonesian Rupiah (IDR) and US Dollar (USD)',
    exchange_rate_label: 'Exchange Rate (USD to IDR)',
    rate_disclaimer: 'Reference rate used to convert international client invoices, overseas expenses, and budget displays.',
    rate_preset_bi: 'Standard Rate (Rp 16,000)',
    rate_preset_market: 'Market Rate (Rp 16,200)',
    rate_preset_custom: 'Custom Rate',
    amount_in_idr: 'Amount in Rupiah (IDR)',
    amount_in_usd: 'Amount in US Dollar (USD)',
    display_currency: 'Display Currency',
    switch_to_usd: 'Show in USD ($)',
    switch_to_idr: 'Show in Rupiah (Rp)',
    active_currency_info: 'Current primary display currency:',

    // Language Toggle
    lang_indonesian: 'Bahasa Indonesia',
    lang_english: 'English',
    switch_language: 'Switch Language',

    // Header & Quick Actions
    quick_add: 'Quick Add',
    scan_receipt: 'Scan Receipt',
    scan_receipt_sub: 'Instant AI OCR',
    export_csv: 'Export CSV',
    review_budget: 'Review Budget',
    add_transaction: 'Add Transaction',

    // Overview Cards
    available_liquid_cash: 'Available Liquid Cash',
    monthly_inflow: 'Monthly Inflow',
    monthly_outflow: 'Monthly Outflow',
    operational_runway: 'Operational Runway',
    daily_safe_spend: 'Daily Safe Spend',
    remaining_budget: 'Remaining Budget',
    budget_pacing: 'Budget Pacing',
    tax_reserve_est: 'Estimated Tax Reserve',
    pending_receivables: 'Pending Receivables',
    attention_required: 'Requires Attention',
    financial_vitality: 'Financial Health Status',

    // Budget View
    income_planned: 'Planned Inflow',
    needs_budget: 'Needs Budget',
    wants_budget: 'Wants & Discretionary',
    goals_budget: 'Savings & Reserves',
    budget_status_ontrack: 'On Track',
    budget_status_warning: 'Approaching Limit',
    budget_status_exceeded: 'Over Budget',
    add_category: 'Add Category',
    planned_amount: 'Planned Target',
    actual_spent: 'Actual Spent',
    percentage: 'Percentage',

    // Transactions View
    all_transactions: 'All Transactions',
    search_transactions: 'Search description, category, or client...',
    filter_all: 'All',
    filter_income: 'Income',
    filter_expense: 'Expense',
    date: 'Date',
    description: 'Description',
    category: 'Category',
    project_client: 'Project / Client',
    amount: 'Amount',
    actions: 'Actions',
    no_transactions: 'No transactions found matching your filters.',

    // Modal Add Transaction
    modal_add_tx_title: 'Record New Transaction',
    modal_have_receipt: 'Have a physical or digital receipt?',
    modal_ocr_hint: 'Auto-fill merchant & amount via Gemini OCR',
    type_expense: 'Expense',
    type_income: 'Income',
    tx_amount_label: 'Amount',
    tx_desc_label: 'Description',
    tx_cat_label: 'Budget Category',
    tx_date_label: 'Date',
    tx_client_opt: 'Link Client (Optional)',
    tx_project_opt: 'Link Project (Optional)',
    tx_recurring: 'Mark as recurring monthly expense',
    tx_submit: 'Save Transaction',
    tx_cancel: 'Cancel',

    // Receipt Scanner
    receipt_scanner_title: 'AI Receipt Scanner',
    receipt_scanner_subtitle: 'Auto-extract merchant, total, date, and tax directly into your ledger',
    upload_tab: 'Upload Image',
    camera_tab: 'Live Camera',
    samples_tab: 'Receipt Samples',
    drag_drop_receipt: 'Drag & drop a receipt photo here, or click to browse',
    analyzing_receipt: 'Reading receipt with Gemini AI OCR...',
    extracted_details: 'Extracted Receipt Details',
    merchant_name: 'Merchant / Vendor',
    receipt_date: 'Purchase Date',
    receipt_total: 'Total Amount',
    receipt_tax: 'Tax / VAT',
    receipt_category: 'Suggested Category',
    verify_and_save: 'Verify & Add to Ledger',

    // Projects & Clients
    projects_title: 'Projects Management',
    clients_title: 'Clients Directory',
    invoices_title: 'Invoices & Billing',
    create_invoice: 'Create Invoice',
    invoice_status_paid: 'Paid',
    invoice_status_sent: 'Sent',
    invoice_status_overdue: 'Overdue',
    invoice_status_draft: 'Draft',

    // AI Insights
    ai_insights_title: 'AI Intelligence & Advisory',
    ai_insights_subtitle: 'Smart cashflow analysis, tax projections, and freelance pricing strategy',
    runway_simulator: 'Cash Runway Simulator',
    ask_financial_advisor: 'Ask AI Financial Advisor',
    ask_placeholder: 'Ask about client retainer pricing, tax deductions, or cashflow optimization...',
    send_question: 'Send',

    // Settings
    settings_title: 'Settings & Preferences',
    settings_subtitle: 'Manage your currency, language, visual appearance, and studio profile',
    currency_settings: 'Currency Settings',
    language_settings: 'Language Preferences',
    theme_settings: 'Theme Appearance',
    profile_settings: 'Studio / Freelancer Profile',
    save_settings: 'Save Changes',
    settings_saved: 'Settings updated successfully',

    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    status: 'Status',
    close: 'Close',
    copy: 'Copy',
    download: 'Download',
    success: 'Success',
    months: 'months',
    days: 'days'
  }
};

import React from 'react';
import { 
  Sun, 
  Moon, 
  Check, 
  Palette, 
  Sparkles, 
  Building, 
  HelpCircle,
  Globe,
  Coins,
  ArrowLeftRight,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    toggleTheme, 
    workspaceName, 
    setWorkspaceName,
    setIsOnboardingOpen,
    language,
    setLanguage,
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
    openConverter,
    formatCurrency,
    showToast,
    t
  } = useApp();

  const handleLanguageChange = (lang: 'id' | 'en') => {
    setLanguage(lang);
    showToast(
      lang === 'id' ? 'Bahasa Diubah' : 'Language Changed',
      lang === 'id' ? 'Bahasa antarmuka sekarang Bahasa Indonesia.' : 'Interface language is now English.'
    );
  };

  const handleCurrencyChange = (curr: 'IDR' | 'USD') => {
    setCurrency(curr);
    showToast(
      language === 'id' ? 'Mata Uang Diubah' : 'Currency Changed',
      language === 'id' 
        ? `Mata uang tampilan aktif sekarang ${curr === 'IDR' ? 'Rupiah (IDR)' : 'US Dollar (USD)'}.`
        : `Active display currency is now ${curr === 'IDR' ? 'Indonesian Rupiah (IDR)' : 'US Dollar (USD)'}.`
    );
  };

  return (
    <div id="settings-view" className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {language === 'id' ? 'Pengaturan & Preferensi' : 'Settings & Preferences'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {language === 'id' 
              ? 'Kelola bahasa (ID/EN), mata uang Rupiah/USD, kurs konversi, dan tema tampilan.' 
              : 'Customize language (ID/EN), currency Rupiah/USD, exchange rates, and themes.'}
          </p>
        </div>

        <button
          onClick={() => {
            toggleTheme();
            showToast(
              theme === 'light' ? (language === 'id' ? 'Mode Gelap Aktif' : 'Switched to Dark Mode') : (language === 'id' ? 'Mode Terang Aktif' : 'Switched to Light Mode'),
              language === 'id' ? `Tema saat ini: ${theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}.` : `Active theme is now ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}.`
            );
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{language === 'id' ? `Ganti Tema (${theme === 'dark' ? 'Terang' : 'Gelap'})` : `Toggle Theme (${theme === 'dark' ? 'Light' : 'Dark'})`}</span>
        </button>
      </div>

      {/* Regional & Localization Settings (Language & Currency) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>{language === 'id' ? 'Bahasa & Lokalisasi Indonesia' : 'Language & Regional Localization'}</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {language === 'id' 
                ? 'Disesuaikan khusus untuk freelancer dan agensi di Indonesia dengan klien lokal & global.' 
                : 'Optimized for Indonesian freelancers & agencies working with local and global clients.'}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            {language === 'id' ? '🇮🇩 Bahasa Indonesia Aktif' : '🇺🇸 English Active'}
          </span>
        </div>

        {/* Language Selection Cards */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {language === 'id' ? 'Pilihan Bahasa Antarmuka (Language Switch)' : 'Interface Language'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Indonesian */}
            <div 
              onClick={() => handleLanguageChange('id')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex items-center justify-between ${
                language === 'id' 
                  ? 'border-emerald-800 dark:border-emerald-500 bg-emerald-50/20 dark:bg-gray-800/60 shadow-xs' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇩</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Bahasa Indonesia</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Istilah keuangan & format Indonesia baku</p>
                </div>
              </div>
              {language === 'id' && (
                <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* English */}
            <div 
              onClick={() => handleLanguageChange('en')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex items-center justify-between ${
                language === 'en' 
                  ? 'border-emerald-800 dark:border-emerald-500 bg-emerald-50/20 dark:bg-gray-800/60 shadow-xs' 
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇺🇸</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">English (US)</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">International financial nomenclature</p>
                </div>
              </div>
              {language === 'en' && (
                <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Currency & Exchange Rate Section */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>{language === 'id' ? 'Mata Uang & Kurs Konverter Dollar US' : 'Currency & US Dollar Converter'}</span>
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                {language === 'id' 
                  ? 'Default utama berbasis Rupiah (IDR) dengan konverter instan ke US Dollar (USD).' 
                  : 'Indonesian Rupiah (IDR) primary ledger base with instant live US Dollar (USD) conversion.'}
              </p>
            </div>

            <button
              onClick={openConverter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Buka Kalkulator Kurs' : 'Open Converter Tool'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Currency Choice */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                {language === 'id' ? 'Mata Uang Tampilan' : 'Display Currency'}
              </label>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 p-1 gap-1">
                <button
                  onClick={() => handleCurrencyChange('IDR')}
                  className={`flex-1 py-1.5 font-bold rounded-md transition-all cursor-pointer ${
                    currency === 'IDR'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  IDR (Rp)
                </button>
                <button
                  onClick={() => handleCurrencyChange('USD')}
                  className={`flex-1 py-1.5 font-bold rounded-md transition-all cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Exchange Rate Input */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                {language === 'id' ? 'Kurs Nilai Tukar (1 USD)' : 'Exchange Rate (1 USD)'}
              </label>
              <div className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span className="text-xs text-gray-400 font-bold mr-1.5">Rp</span>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value) || 16000)}
                  className="w-full bg-transparent font-bold text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Sample Live Preview */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                {language === 'id' ? 'Contoh Format Tampilan' : 'Sample Formatted Value'}
              </label>
              <div className="px-3 py-2 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900 rounded-lg flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">10 Juta Rupiah:</span>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  {formatCurrency(10000000)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>{language === 'id' ? 'Mode Tema Tampilan & Warna' : 'Appearance & Color Theme Mode'}</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {language === 'id' 
                ? 'FlowLedger menggunakan palet aksen Hijau Tua (Dark Green) yang menenangkan mata.' 
                : 'FlowLedger uses a tranquil dark green ("Hijau Tua") palette.'}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            {theme === 'dark' ? (language === 'id' ? 'Mode Gelap Aktif' : 'Dark Mode Active') : (language === 'id' ? 'Mode Terang Aktif' : 'Light Mode Active')}
          </span>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Mode Card */}
          <div 
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              theme === 'light' 
                ? 'border-emerald-800 dark:border-emerald-500 bg-emerald-50/20 dark:bg-gray-800/60 shadow-xs' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {language === 'id' ? 'Mode Terang (Light Mode)' : 'Light Mode'}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {language === 'id' ? 'Kanvas minimalis bersih bernuansa lembut' : 'Crisp, clean minimalist off-white canvas'}
                  </p>
                </div>
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>

          {/* Dark Mode Card */}
          <div 
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              theme === 'dark' 
                ? 'border-emerald-800 dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-850'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-300 flex items-center justify-center border border-emerald-850">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {language === 'id' ? 'Mode Gelap (Dark Mode)' : 'Dark Mode'}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {language === 'id' ? 'Permukaan slate gelap, nyaman di malam hari' : 'Deep slate surfaces, low-glare evening work'}
                  </p>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-emerald-800 dark:bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Configuration */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <span>{language === 'id' ? 'Profil Studio & Ruang Kerja' : 'Workspace & Studio Profile'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'id' 
              ? 'Rincian yang tercantum pada faktur, estimasi proyek, dan komunikasi klien.' 
              : 'Details shown on exported invoices, estimates, and client communications.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              {language === 'id' ? 'Nama Studio / Usaha' : 'Studio / Business Name'}
            </label>
            <input 
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:border-emerald-800 dark:focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-gray-700 dark:text-gray-300">
              {language === 'id' ? 'Mata Uang Utama' : 'Base Currency'}
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 flex items-center justify-between font-bold">
              <span>{currency === 'IDR' ? 'Rupiah Indonesia (Rp IDR)' : 'US Dollar ($ USD)'}</span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 uppercase font-semibold">
                {language === 'id' ? 'Aktif' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-800 dark:hover:text-emerald-400 font-medium cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'id' ? 'Ulangi Tur Pengenalan Aplikasi' : 'Rerun Onboarding Setup Tour'}</span>
          </button>

          <button
            onClick={() => showToast(
              language === 'id' ? 'Pengaturan Disimpan' : 'Settings Saved',
              language === 'id' ? 'Preferensi bahasa, mata uang, dan tema berhasil diperbarui.' : 'Workspace preferences and theme updated successfully.'
            )}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {language === 'id' ? 'Simpan Perubahan' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  TrendingUp, 
  Copy, 
  Check, 
  DollarSign, 
  Coins, 
  RefreshCw,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CurrencyConverterModal: React.FC = () => {
  const { 
    isConverterOpen, 
    closeConverter, 
    currency, 
    setCurrency, 
    exchangeRate, 
    setExchangeRate, 
    language,
    formatCurrency
  } = useApp();

  const [idrValue, setIdrValue] = useState<string>('16000000');
  const [usdValue, setUsdValue] = useState<string>('1000');
  const [activeInput, setActiveInput] = useState<'idr' | 'usd'>('usd');
  const [customRate, setCustomRate] = useState<string>(String(exchangeRate));
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync inputs on open or when exchange rate changes
  useEffect(() => {
    if (activeInput === 'usd') {
      const numericUsd = parseFloat(usdValue) || 0;
      setIdrValue(Math.round(numericUsd * exchangeRate).toString());
    } else {
      const numericIdr = parseFloat(idrValue) || 0;
      setUsdValue((numericIdr / exchangeRate).toFixed(2));
    }
  }, [exchangeRate]);

  if (!isConverterOpen) return null;

  const handleUsdChange = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, '');
    setUsdValue(clean);
    setActiveInput('usd');
    const numeric = parseFloat(clean) || 0;
    setIdrValue(Math.round(numeric * exchangeRate).toString());
  };

  const handleIdrChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    setIdrValue(clean);
    setActiveInput('idr');
    const numeric = parseFloat(clean) || 0;
    setUsdValue((numeric / exchangeRate).toFixed(2));
  };

  const handleRatePreset = (rate: number) => {
    setExchangeRate(rate);
    setCustomRate(String(rate));
  };

  const handleCustomRateChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    setCustomRate(clean);
    const numeric = parseFloat(clean);
    if (numeric > 0) {
      setExchangeRate(numeric);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const presets = [
    { label: 'Rp 15.800', rate: 15800 },
    { label: 'Rp 16.000', rate: 16000 },
    { label: 'Rp 16.250', rate: 16250 },
    { label: 'Rp 16.500', rate: 16500 },
  ];

  const quickRates = [
    { usd: 15, idr: 15 * exchangeRate, note: language === 'id' ? 'Langganan SaaS Umum (Figma, Midjourney)' : 'General SaaS Sub (Figma, Midjourney)' },
    { usd: 50, idr: 50 * exchangeRate, note: language === 'id' ? 'Rate Desain / Jam Pemula' : 'Junior Hourly Design Rate' },
    { usd: 100, idr: 100 * exchangeRate, note: language === 'id' ? 'Rate Konsultasi Senior / Jam' : 'Senior Advisory Rate / Hr' },
    { usd: 500, idr: 500 * exchangeRate, note: language === 'id' ? 'Sprint UI / Proyek Kecil' : 'Mini UI Sprint / Micro Project' },
    { usd: 1500, idr: 1500 * exchangeRate, note: language === 'id' ? 'Retainer Bulanan Klien Luar Negeri' : 'Monthly International Retainer' },
    { usd: 3000, idr: 3000 * exchangeRate, note: language === 'id' ? 'Paket Desain Sistem Skala Menengah' : 'Full Design System Sprint' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="currency-converter-modal" 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {language === 'id' ? 'Konverter Mata Uang (IDR ⇄ USD)' : 'Currency Converter (IDR ⇄ USD)'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id' 
                  ? 'Konversi cepat rupiah ke dollar US untuk klien internasional' 
                  : 'Fast conversion between Indonesian Rupiah and US Dollars'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeConverter}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-5 space-y-5 pr-1 text-sm">
          {/* Active Ledger Currency Pill & Toggle */}
          <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {language === 'id' ? 'Mata Uang Tampilan Aplikasi:' : 'Active Display Currency:'}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                {currency === 'IDR' 
                  ? (language === 'id' ? 'Rupiah Indonesia (Rp) aktif' : 'Indonesian Rupiah (IDR) active')
                  : (language === 'id' ? 'Dollar Amerika Serikat ($) aktif' : 'US Dollar (USD) active')}
              </div>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrency('IDR')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  currency === 'IDR'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                IDR (Rp)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          {/* Interactive Calculator Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USD Input */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  US Dollar (USD)
                </span>
                <button
                  onClick={() => copyToClipboard(`$${usdValue}`, 'usd')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy amount"
                >
                  {copiedField === 'usd' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[10px]">{copiedField === 'usd' ? (language === 'id' ? 'Tersalin' : 'Copied') : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-400">$</span>
                <input
                  id="converter-input-usd"
                  type="text"
                  value={usdValue}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xl font-bold text-gray-900 dark:text-white bg-transparent outline-none"
                />
              </div>
            </div>

            {/* IDR Input */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  Indonesian Rupiah (IDR)
                </span>
                <button
                  onClick={() => copyToClipboard(`Rp ${Number(idrValue || 0).toLocaleString('id-ID')}`, 'idr')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy amount"
                >
                  {copiedField === 'idr' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[10px]">{copiedField === 'idr' ? (language === 'id' ? 'Tersalin' : 'Copied') : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-400">Rp</span>
                <input
                  id="converter-input-idr"
                  type="text"
                  value={idrValue ? Number(idrValue).toLocaleString('id-ID') : ''}
                  onChange={(e) => handleIdrChange(e.target.value)}
                  placeholder="0"
                  className="w-full text-xl font-bold text-gray-900 dark:text-white bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Current Rate Setting */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{language === 'id' ? 'Kurs Nilai Tukar Saat Ini' : 'Current Exchange Rate'}</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                1 USD = Rp {exchangeRate.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {language === 'id' ? 'Preset Kurs:' : 'Rate Presets:'}
              </span>
              {presets.map((p) => (
                <button
                  key={p.rate}
                  onClick={() => handleRatePreset(p.rate)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                    exchangeRate === p.rate
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'Kustom:' : 'Custom:'}
                </span>
                <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-0.5">
                  <span className="text-xs text-gray-400 mr-1">Rp</span>
                  <input
                    type="text"
                    value={customRate}
                    onChange={(e) => handleCustomRateChange(e.target.value)}
                    className="w-18 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Freelancer Quick Reference Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                {language === 'id' ? 'Tabel Acuan Cepat Freelancer / Studio' : 'Freelancer Quick Reference Table'}
              </h3>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-850">
              {quickRates.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 dark:text-white w-14">
                      ${item.usd}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400 w-28">
                      Rp {item.idr.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {item.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-emerald-600" />
            <span>{language === 'id' ? 'Kurs tersimpan otomatis di perangkat Anda' : 'Rate saved locally on this device'}</span>
          </div>
          <button
            onClick={closeConverter}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'id' ? 'Tutup Konverter' : 'Close Converter'}
          </button>
        </div>
      </div>
    </div>
  );
};

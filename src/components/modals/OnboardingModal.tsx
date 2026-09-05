import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, X, Briefcase, DollarSign, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, showToast, language } = useApp();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Designer');
  const [manageGoals, setManageGoals] = useState<string[]>(['Budget', 'Expenses', 'Projects', 'Invoices']);
  const [currentTool, setCurrentTool] = useState('Spreadsheet');

  if (!isOnboardingOpen) return null;

  const roles = language === 'id' 
    ? ['Freelancer', 'Desainer', 'Pengembang Web', 'Konsultan', 'Kreator Konten', 'Agensi Studio', 'Lainnya']
    : ['Freelancer', 'Designer', 'Developer', 'Consultant', 'Creator', 'Agency', 'Other'];

  const manageOptions = language === 'id'
    ? ['Anggaran & Budget', 'Catatan Pengeluaran', 'Manajemen Proyek', 'Klien & CRM', 'Faktur & Invoice', 'Semuanya']
    : ['Budget', 'Expenses', 'Projects', 'Clients', 'Invoices', 'Everything'];

  const tools = language === 'id'
    ? ['Spreadsheet (Excel / Sheets)', 'Beberapa Aplikasi Terpisah', 'Buku Catatan / Kertas', 'Belum Ada Sistem', 'Lainnya']
    : ['Spreadsheet', 'Multiple apps', 'Notes', 'Nothing', 'Other'];

  const toggleGoal = (goal: string) => {
    const everythingKey = language === 'id' ? 'Semuanya' : 'Everything';
    if (goal === everythingKey) {
      if (manageGoals.includes(everythingKey)) {
        setManageGoals([manageOptions[0], manageOptions[1]]);
      } else {
        setManageGoals([...manageOptions]);
      }
      return;
    }
    if (manageGoals.includes(goal)) {
      setManageGoals(manageGoals.filter(g => g !== goal));
    } else {
      setManageGoals([...manageGoals, goal]);
    }
  };

  const handleFinish = () => {
    setIsOnboardingOpen(false);
    showToast(
      language === 'id' ? 'Ruang Kerja Terkonfigurasi' : 'Workspace customized',
      language === 'id' ? `Disesuaikan untuk ${role} mengelola keuangan studio.` : `Configured for ${role} managing ${manageGoals.slice(0, 3).join(', ')}.`
    );
  };

  return (
    <div id="onboarding-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with step progress indicator */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              {step}
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {language === 'id' ? `Langkah ${step} dari 3` : `Step ${step} of 3`}
            </span>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
          <div 
            className="bg-emerald-800 dark:bg-emerald-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Step 1: What do you do? */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-base">
                <Briefcase className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <h3>{language === 'id' ? 'Apa profesi atau bidang keahlian Anda?' : 'What do you do?'}</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id'
                  ? 'FlowLedger akan menyesuaikan pos kategori anggaran dan ruang lingkup proyek sesuai profesi Anda.'
                  : 'FlowLedger will optimize your budget categories and project scopes for your craft.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {roles.map((r) => {
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 text-left rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-800 bg-emerald-800 dark:border-emerald-700 dark:bg-emerald-700 text-white shadow-2xs' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-50/60 dark:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{r}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: What do you want to manage? */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-base">
                <DollarSign className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <h3>{language === 'id' ? 'Modul apa saja yang ingin Anda kelola?' : 'What do you want to manage?'}</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id'
                  ? 'Pilih modul yang Anda butuhkan saat ini. Anda dapat mengaktifkannya kapan saja.'
                  : 'Choose the tools you need right now. You can always turn modules on or off anytime.'}
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {manageOptions.map((opt) => {
                  const isSelected = manageGoals.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleGoal(opt)}
                      className={`p-3 text-left rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-800 bg-emerald-800 dark:border-emerald-700 dark:bg-emerald-700 text-white shadow-2xs' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-50/60 dark:bg-gray-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: How do you currently manage your finances? */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-base">
                <Layers className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <h3>{language === 'id' ? 'Bagaimana Anda mencatat keuangan saat ini?' : 'How do you currently manage your finances?'}</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id'
                  ? 'Kami menyiapkan antarmuka yang ramah dan konverter mata uang Rupiah ⇄ Dollar otomatis.'
                  : "We'll prepare simple import bridges and smart templates tailored to your background."}
              </p>
              <div className="space-y-2 pt-2">
                {tools.map((t) => {
                  const isSelected = currentTool === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCurrentTool(t)}
                      className={`w-full p-3 text-left rounded-lg border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-800 bg-emerald-800 dark:border-emerald-700 dark:bg-emerald-700 text-white shadow-2xs' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-50/60 dark:bg-gray-800/60'
                      }`}
                    >
                      <span>{t}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
              >
                {language === 'id' ? 'Kembali' : 'Back'}
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <span>{language === 'id' ? 'Lanjutkan' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Mulai Gunakan FlowLedger' : 'Launch FlowLedger'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

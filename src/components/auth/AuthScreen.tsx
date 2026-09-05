import React, { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Wallet,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthScreenProps {
  onBypassDemo?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBypassDemo }) => {
  const { login, register, language } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<'student' | 'freelancer'>('student');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await login(email, password);
        if (error) {
          setErrorMessage(error.message || 'Login gagal. Periksa kembali email dan password.');
        }
      } else {
        if (!email || !password) {
          setErrorMessage('Email dan password wajib diisi.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password minimal 6 karakter.');
          setLoading(false);
          return;
        }
        const { error, confirmationRequired } = await register(
          email, 
          password, 
          fullName || undefined, 
          selectedWorkspace
        );
        if (error) {
          setErrorMessage(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
        } else if (confirmationRequired) {
          setSuccessMessage(
            language === 'id'
              ? 'Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk verifikasi.'
              : 'Registration successful! Please check your inbox for verification link.'
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan pada sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 text-[#111827] dark:text-gray-100">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-800 text-white shadow-sm mb-1">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            Fins
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'id' 
              ? 'Sistem Manajemen Anggaran, Catatan & Tugas Terpadu'
              : 'Smart Budget, Notes & Task Management Workspace'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-5">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {language === 'id' ? 'Masuk (Login)' : 'Sign In'}
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {language === 'id' ? 'Daftar Akun Baru' : 'Create Account'}
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!supabaseReady && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{language === 'id' ? 'Konfigurasi Supabase' : 'Supabase Setup'}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {language === 'id'
                  ? 'Kredensial Supabase URL & Anon Key belum diisi di .env. Anda dapat masuk menggunakan akun demo atau login langsung.'
                  : 'Supabase credentials are not set yet. You can sign in using Guest Demo mode.'}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-fullname-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Workspace Type Selector (Only on Register) */}
            {mode === 'register' && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  {language === 'id' ? 'Pilih Mode Workspace Anda *' : 'Choose Your Workspace *'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Student Option */}
                  <div
                    id="select-workspace-student"
                    onClick={() => setSelectedWorkspace('student')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWorkspace === 'student'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className={`w-4 h-4 ${selectedWorkspace === 'student' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500'}`} />
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        Student
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                      {language === 'id' ? 'Uang saku, tugas kuliah/PR & catatan pelajaran' : 'Allowance, coursework & lecture notes'}
                    </p>
                  </div>

                  {/* Freelancer Option */}
                  <div
                    id="select-workspace-freelancer"
                    onClick={() => setSelectedWorkspace('freelancer')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedWorkspace === 'freelancer'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className={`w-4 h-4 ${selectedWorkspace === 'freelancer' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500'}`} />
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        Freelancer
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                      {language === 'id' ? 'Invoice klien, deadline proyek & catatan kerja' : 'Client invoices, project deadlines & meeting notes'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? (language === 'id' ? 'Masuk ke Akun' : 'Sign In')
                      : (language === 'id' ? 'Daftar & Mulai Workspace' : 'Sign Up & Get Started')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Guest / Demo Explorer Mode */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-center">
            <button
              type="button"
              id="auth-guest-demo-btn"
              onClick={onBypassDemo}
              className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {language === 'id'
                ? '⚡ Lanjutkan sebagai Tamu (Mode Demo Eksplorasi)'
                : '⚡ Continue as Guest (Demo Exploration Mode)'}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-center text-gray-400 mt-4">
          {language === 'id'
            ? 'Supabase Auth & PostgreSQL Row Level Security (RLS) terisolasi per pengguna.'
            : 'Protected by Supabase Auth and Row Level Security (RLS).'}
        </p>
      </div>
    </div>
  );
};

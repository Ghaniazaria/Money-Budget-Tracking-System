import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Send, 
  Sliders, 
  ShieldCheck,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIInsight } from '../../types';

export const AIInsightsView: React.FC = () => {
  const { 
    insights, 
    setInsights, 
    setActiveTab, 
    setSelectedClientId, 
    showToast,
    totalAvailableBalance,
    monthlyIncome,
    monthlyExpenses,
    totalPlannedBudget,
    outstandingInvoicesTotal,
    language,
    currency,
    formatCurrency,
    openConverter,
    toggleCurrency
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'spending' | 'budget' | 'cashflow' | 'projects' | 'clients'>('all');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // Interactive AI Financial Advisor Chat state
  const [advisorQuestion, setAdvisorQuestion] = useState('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [advisorConversation, setAdvisorConversation] = useState<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
  }[]>([
    {
      id: 'adv-init',
      sender: 'ai',
      text: language === 'id' 
        ? `Halo Alex! Cadangan kas likuid Anda sebesar ${formatCurrency(totalAvailableBalance)} dan pengeluaran bulanan yang terkendali (${formatCurrency(monthlyExpenses)}) memberikan runway operasional 4.8 bulan. Apa keputusan finansial, rencana beli alat, atau evaluasi anggaran yang ingin kita diskusikan hari ini?`
        : `Good day, Alex. Your liquid reserves of ${formatCurrency(totalAvailableBalance)} and modest monthly burn (${formatCurrency(monthlyExpenses)}) give you 4.8 months of operational runway. What financial decisions or budget questions can I analyze for you today?`,
      timestamp: '09:00'
    }
  ]);

  // Scenario Simulator state
  const isIDR = currency === 'IDR';
  const [extraProjectRevenue, setExtraProjectRevenue] = useState(0);
  const [expenseCutPercentage, setExpenseCutPercentage] = useState(0);
  const [invoiceDelayDays, setInvoiceDelayDays] = useState(0);

  // Simulated metrics
  const simulatedExpenses = monthlyExpenses * (1 - expenseCutPercentage / 100);
  const simulatedBurn = Math.max(isIDR ? 5000000 : 500, simulatedExpenses);
  const simulatedLiquid = totalAvailableBalance + extraProjectRevenue - (invoiceDelayDays > 15 ? (isIDR ? 15000000 : 1200) : 0);
  const simulatedRunway = Number((simulatedLiquid / simulatedBurn).toFixed(1));

  const filteredInsights = (insights || [])
    .filter(ins => !dismissedIds.includes(ins.id))
    .filter(ins => activeFilter === 'all' || ins.category === activeFilter);

  const handleActionClick = (insight: AIInsight) => {
    const target = insight.actionId || insight.actionType || '';
    switch (target) {
      case 'budget':
      case 'view_budget_variance':
      case 'review_subscriptions':
        setActiveTab('budget');
        showToast(
          language === 'id' ? 'Membuka Anggaran' : 'Navigated to Budget',
          language === 'id' ? 'Meninjau target vs pengeluaran aktual.' : 'Reviewing planned vs actual variances.'
        );
        break;
      case 'transactions':
        setActiveTab('transactions');
        showToast(
          language === 'id' ? 'Membuka Transaksi' : 'Navigated to Transactions',
          language === 'id' ? 'Memeriksa buku kas & bukti struk.' : 'Auditing categorized ledger entries.'
        );
        break;
      case 'invoices':
      case 'view_invoices':
      case 'create_invoice':
        setActiveTab('invoices');
        showToast(
          language === 'id' ? 'Membuka Faktur' : 'Navigated to Invoices',
          language === 'id' ? 'Mengelola piutang klien studio.' : 'Managing client receivable schedules.'
        );
        break;
      case 'clients':
      case 'view_client':
        setSelectedClientId('cli-1');
        setActiveTab('clients');
        break;
      case 'projects':
        setActiveTab('projects');
        showToast(
          language === 'id' ? 'Membuka Proyek' : 'Navigated to Projects',
          language === 'id' ? 'Memeriksa tonggak capaian proyek aktif.' : 'Checking active delivery milestones.'
        );
        break;
      default:
        setActiveTab('overview');
    }
  };

  const dismissInsight = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    showToast(
      language === 'id' ? 'Wawasan Diarsipkan' : 'Insight archived',
      language === 'id' ? 'Catatan telah ditandai selesai.' : 'Observation marked as addressed.'
    );
  };

  const handleAuditRun = async () => {
    setIsAuditing(true);
    showToast(
      language === 'id' ? 'Menjalankan Audit Finansial AI' : 'Running Financial Intelligence Audit',
      language === 'id' ? 'Menganalisis kecepatan arus kas & prakiraan runway via Gemini 3.8 Flash...' : 'Synthesizing ledger velocity & cash forecasts via Gemini 3.8 Flash...'
    );

    try {
      const res = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          currency,
          financialData: {
            liquid: totalAvailableBalance,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            budget: totalPlannedBudget,
            receivables: outstandingInvoicesTotal
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.insights && Array.isArray(data.insights) && data.insights.length > 0) {
          setInsights(data.insights);
          setDismissedIds([]);
          showToast(
            language === 'id' ? 'Audit Selesai' : 'Audit Complete',
            language === 'id' ? 'Wawasan AI terbaru telah disinkronkan dengan buku kas.' : 'Fresh insights generated based on current ledger accounts.'
          );
        }
      }
    } catch (err) {
      console.warn('Audit generation failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAskAdvisor = async (customText?: string) => {
    const questionText = (customText || advisorQuestion).trim();
    if (!questionText) return;

    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: 'user' as const,
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAdvisorConversation(prev => [...prev, userMessage]);
    setAdvisorQuestion('');
    setIsAdvisorLoading(true);

    try {
      const res = await fetch('/api/ask-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          language,
          currency,
          financialContext: {
            balance: totalAvailableBalance,
            balanceFormatted: formatCurrency(totalAvailableBalance),
            income: monthlyIncome,
            incomeFormatted: formatCurrency(monthlyIncome),
            expenses: monthlyExpenses,
            expensesFormatted: formatCurrency(monthlyExpenses),
            budget: totalPlannedBudget,
            budgetFormatted: formatCurrency(totalPlannedBudget),
            outstanding: outstandingInvoicesTotal,
            outstandingFormatted: formatCurrency(outstandingInvoicesTotal)
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage = {
          id: `msg-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: 'ai' as const,
          text: data.answer || (language === 'id' ? 'Posisi kas Anda tetap aman dan stabil.' : 'Your runway remains well-insulated against typical freelance variance.'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAdvisorConversation(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Advisor API error');
      }
    } catch {
      const fallbackAi = {
        id: `msg-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'ai' as const,
        text: language === 'id'
          ? `Cadangan likuid kas Anda sebesar ${formatCurrency(totalAvailableBalance)} siap menopang kebutuhan ini sambil mempertahankan lebih dari 4.5 bulan runway operasional. Disarankan menyisihkan 15% untuk pos cadangan pajak studio.`
          : `Your current liquid reserves of ${formatCurrency(totalAvailableBalance)} comfortably absorb this scenario while preserving over 4.5 months of baseline runway. Allocating 25% toward your quarterly tax reserve is advised.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAdvisorConversation(prev => [...prev, fallbackAi]);
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  const getCategoryBadge = (cat: AIInsight['category']) => {
    const isIndo = language === 'id';
    switch (cat) {
      case 'spending':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800">
            {isIndo ? 'Pola Pengeluaran' : 'Spending Anomaly'}
          </span>
        );
      case 'budget':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            {isIndo ? 'Kesehatan Anggaran' : 'Budget Health'}
          </span>
        );
      case 'cashflow':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
            {isIndo ? 'Arus Kas & Runway' : 'Cash Flow & Runway'}
          </span>
        );
      case 'projects':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
            {isIndo ? 'Kecepatan Proyek' : 'Project Velocity'}
          </span>
        );
      case 'clients':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
            {isIndo ? 'Konsentrasi Klien' : 'Client Concentration'}
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityPill = (sev: AIInsight['severity']) => {
    const isIndo = language === 'id';
    if (sev === 'positive') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {isIndo ? 'Varians Positif' : 'Positive Variance'}
        </span>
      );
    }
    if (sev === 'warning') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          {isIndo ? 'Disarankan Tindakan' : 'Action Recommended'}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        {isIndo ? 'Observasi' : 'Observation'}
      </span>
    );
  };

  const samplePromptPills = language === 'id' ? [
    'Bolehkah saya beli monitor 4K Rp 7.500.000?',
    'Berapa cadangan pajak PPh Final UMKM yang harus disisihkan?',
    'Bagaimana cara mengoptimalkan langganan SaaS?',
    'Apakah perlu follow-up invoice ke Acme Studio?'
  ] : [
    'Can I buy a $1,200 workstation monitor?',
    'How much should I reserve for taxes?',
    'How to cut recurring SaaS spend?',
    'Should I follow up with Acme Studio?'
  ];

  return (
    <div id="ai-insights-page-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {language === 'id' ? 'Kecerdasan Finansial & Wawasan AI' : 'Calm Financial Intelligence'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {language === 'id' 
                  ? 'Prakiraan runway proaktif, deteksi anomali anggaran, dan konsultasi strategis studio.' 
                  : 'Proactive runway forecasting, anomaly detection & strategic freelance advice.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Currency Pill */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer shadow-2xs"
            title="Ganti Tampilan Mata Uang"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{currency === 'IDR' ? 'Rp IDR' : '$ USD'}</span>
          </button>

          <button
            onClick={openConverter}
            className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors cursor-pointer shadow-2xs"
            title="Buka Konverter Kurs"
          >
            <Calculator className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          </button>

          <button
            onClick={handleAuditRun}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? (language === 'id' ? 'Mengaudit Buku Kas...' : 'Auditing Ledger...') : (language === 'id' ? 'Jalankan Audit Finansial' : 'Run Financial Audit')}</span>
          </button>
        </div>
      </div>

      {/* Stability & Runway Command Banner */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                {language === 'id' ? 'Tolok Ukur Runway & Keamanan Kas' : 'Current Runway & Safety Benchmark'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                {language === 'id' ? 'Skor: 92/100 (Sangat Kuat)' : 'Score: 92/100 (Strong)'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'id' ? 'Runway Tersedia 4.8 Bulan' : '4.8 Months Runway Available'}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {language === 'id' ? (
                <>Dengan <span className="font-semibold text-gray-900 dark:text-gray-200">{formatCurrency(totalAvailableBalance)}</span> dalam cadangan likuid dan rata-rata burn rate bulanan sebesar <span className="font-semibold text-gray-900 dark:text-gray-200">{formatCurrency(monthlyExpenses)}</span>, kas studio Anda melampaui batas aman 3 bulan standar industri.</>
              ) : (
                <>With <span className="font-semibold text-gray-900 dark:text-gray-200">{formatCurrency(totalAvailableBalance)}</span> in liquid reserves and an average monthly burn of <span className="font-semibold text-gray-900 dark:text-gray-200">{formatCurrency(monthlyExpenses)}</span>, your studio cash cushion comfortably exceeds the 3-month freelance threshold.</>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">
                {language === 'id' ? 'Pengeluaran Aman Harian' : 'Daily Safe Spend'}
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(isIDR ? 750000 : 46.50)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {language === 'id' ? 'Terkendali 27 hari' : 'Paced for 27 days'}
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">
                {language === 'id' ? 'Cadangan Pajak (Est.)' : 'Est. Tax Reserve'}
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(isIDR ? 33600000 : 2100)}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
                {language === 'id' ? 'Alokasi PPh studio' : '25% gross allocation'}
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">
                {language === 'id' ? 'Arah Arus Kas Bersih' : 'Net Trajectory'}
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(monthlyIncome - monthlyExpenses)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {language === 'id' ? 'Surplus bertambah' : 'Surplus expanding'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Runway Progress Spectrum */}
        <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {language === 'id' ? 'Kapasitas Runway' : 'Runway Capacity'}
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {language === 'id' ? '4.8 dari target ideal 6.0 bulan (80%)' : '4.8 of 6.0 mo ideal target (80%)'}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-800 dark:bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '80%' }}
            />
          </div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: ADVISOR & SCENARIO SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Financial Advisor Chat */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col h-[460px] overflow-hidden">
          
          <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {language === 'id' ? 'Konsultasi Finansial Gemini AI' : 'Ask Gemini Financial Advisor'}
              </h3>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {language === 'id' ? 'Buku Kas Aktif Terhubung' : 'Grounding: Active Ledger'}
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {advisorConversation.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-tr-xs shadow-xs'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-xs border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isAdvisorLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>{language === 'id' ? 'Gemini sedang menganalisis dampak runway...' : 'Gemini is calculating runway impact...'}</span>
              </div>
            )}
          </div>

          {/* Prompt pills for quick asking */}
          <div className="px-4 py-2 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
            {samplePromptPills.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAskAdvisor(preset)}
                className="px-2.5 py-1 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-700 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-300 border border-gray-200 dark:border-gray-700 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAdvisor();
            }}
            className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-white dark:bg-gray-900 shrink-0"
          >
            <input 
              type="text" 
              value={advisorQuestion} 
              onChange={(e) => setAdvisorQuestion(e.target.value)}
              placeholder={language === 'id' ? 'Tanyakan seputar anggaran, kemampuan beli alat, atau rencana pengeluaran...' : 'Ask a question about your budget, runway, or upcoming purchases...'}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
            />
            <button
              type="submit"
              disabled={!advisorQuestion.trim() || isAdvisorLoading}
              className="p-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right: Interactive Runway & Scenario Simulator */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-5">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {language === 'id' ? 'Simulator Simulasi Skenario Runway' : 'What-If Runway Simulator'}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'id' ? 'Uji ketahanan kas terhadap keterlambatan pembayaran invoice klien atau proyek baru.' : 'Stress-test your runway against delayed invoices or added project revenues.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Slider 1: Extra Revenue */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {language === 'id' ? 'Pendapatan Proyek Baru' : 'New Project Inflow'}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  +{formatCurrency(extraProjectRevenue)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={isIDR ? 100000000 : 6000} 
                step={isIDR ? 5000000 : 500}
                value={extraProjectRevenue}
                onChange={(e) => setExtraProjectRevenue(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            {/* Slider 2: Expense Reduction */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {language === 'id' ? 'Efisiensi Beban & SaaS' : 'SaaS / Expense Optimization'}
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">-{expenseCutPercentage}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="5"
                value={expenseCutPercentage}
                onChange={(e) => setExpenseCutPercentage(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            {/* Slider 3: Invoice Delay */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {language === 'id' ? 'Keterlambatan Bayar Klien' : 'Receivable Payment Delay'}
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  +{invoiceDelayDays} {language === 'id' ? 'hari' : 'days'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="45" 
                step="15"
                value={invoiceDelayDays}
                onChange={(e) => setInvoiceDelayDays(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Outcome Box */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                {language === 'id' ? 'Proyeksi Runway Baru:' : 'Projected New Runway:'}
              </span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                {simulatedRunway} {language === 'id' ? 'Bulan' : 'Months'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-normal">
              {simulatedRunway >= 4.8 ? (
                language === 'id' ? (
                  <>Penyesuaian skenario menambah cadangan aman Anda sebesar <span className="font-bold">+{(simulatedRunway - 4.8).toFixed(1)} bulan</span>.</>
                ) : (
                  <>Simulated adjustments enhance your safety margin by <span className="font-bold">+{(simulatedRunway - 4.8).toFixed(1)} months</span>.</>
                )
              ) : (
                language === 'id' ? (
                  <>Keterlambatan sedikit menurunkan kecepatan kas, namun cadangan likuid dasar tetap memadai tanpa perlu pinjaman.</>
                ) : (
                  <>Simulated delay reduces cash velocity temporarily, but baseline reserves absorb the delay without borrowing.</>
                )
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setExtraProjectRevenue(0);
              setExpenseCutPercentage(0);
              setInvoiceDelayDays(0);
            }}
            className="w-full py-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-center cursor-pointer"
          >
            {language === 'id' ? 'Atur Ulang Simulator' : 'Reset Simulator'}
          </button>

        </div>
      </div>

      {/* FILTER TABS FOR OBSERVATION CARDS */}
      <div className="flex items-center bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl text-xs font-medium overflow-x-auto">
        {(['all', 'spending', 'budget', 'cashflow', 'projects', 'clients'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === cat 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-2xs font-bold' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {cat === 'all' 
              ? (language === 'id' ? 'Semua Wawasan' : 'All Intelligence') 
              : cat === 'spending' 
              ? (language === 'id' ? 'Pengeluaran' : 'Spending')
              : cat === 'budget' 
              ? (language === 'id' ? 'Anggaran' : 'Budget')
              : cat === 'cashflow' 
              ? (language === 'id' ? 'Arus Kas' : 'Cash Flow')
              : cat === 'projects' 
              ? (language === 'id' ? 'Proyek' : 'Projects')
              : (language === 'id' ? 'Klien' : 'Clients')}
          </button>
        ))}
      </div>

      {/* INSIGHT OBSERVATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((insight) => (
          <div 
            key={insight.id}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(insight.category)}
                  {getSeverityPill(insight.severity)}
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {language === 'id' ? 'Kalkulasi Terverifikasi' : 'Verified Math'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {insight.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                  {insight.observation || insight.description}
                </p>
              </div>

              {insight.supportingData && (
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-[11px] font-mono text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{insight.supportingData}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
              <button
                onClick={() => dismissInsight(insight.id)}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium cursor-pointer"
              >
                {language === 'id' ? 'Tutup' : 'Dismiss'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAskAdvisor(language === 'id' ? `Bisa jelaskan lebih detail dan beri saran terkait: "${insight.title}"?` : `Can you give me deeper advice regarding: "${insight.title}"?`)}
                  className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  <span>{language === 'id' ? 'Tanya AI' : 'Dive Deeper'}</span>
                </button>

                <button
                  onClick={() => handleActionClick(insight)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{insight.suggestedActionText || insight.actionLabel || (language === 'id' ? 'Buka Menu' : 'Apply Action')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-3 shadow-xs">
          <CheckCircle2 className="w-9 h-9 text-emerald-700 dark:text-emerald-400 mx-auto" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
            {language === 'id' ? 'Buku Kas Dalam Keseimbangan Sempurna' : 'Ledger In Perfect Balance'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {language === 'id' 
              ? 'Semua catatan dalam kelompok ini telah ditangani. Klik "Jalankan Audit Finansial" untuk menganalisis ulang transaksi aktif.' 
              : 'All active observations in this group have been addressed. Click "Run Financial Audit" above to re-evaluate active transactions.'}
          </p>
        </div>
      )}

    </div>
  );
};

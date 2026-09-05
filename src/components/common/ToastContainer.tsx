import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-16 md:bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={`${toast.id}-${index}`}
          className="pointer-events-auto bg-neutral-900 text-white p-3.5 rounded-xl shadow-xl border border-neutral-800 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-neutral-100">{toast.title}</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-400 hover:text-neutral-200 p-0.5 rounded shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

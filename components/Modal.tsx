import React from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ open, onClose, title, children }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-400 hover:text-slate-700 p-2 -mr-2"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5 overflow-y-auto custom-scrollbar text-sm text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

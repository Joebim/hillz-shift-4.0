'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  description?: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (options: string | ToastOptions, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (options: string | ToastOptions, type: ToastType = 'info', duration: number = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);

      let toastMessage: string;
      let toastType: ToastType = type;
      let toastDuration: number = duration;

      if (typeof options === 'object') {
        toastMessage = options.message || options.description || options.title || '';
        if (options.type) toastType = options.type;
        if (options.duration !== undefined) toastDuration = options.duration;
      } else {
        toastMessage = options;
      }

      const newToast: Toast = { id, message: toastMessage, type: toastType, duration: toastDuration };

      setToasts((prev) => [...prev, newToast]);

      if (toastDuration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, toastDuration);
      }
    },
    [removeToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm sm:max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  removeToast,
}: {
  toast: Toast;
  removeToast: (id: string) => void;
}) {
  const { message, type, id } = toast;

  const config = {
    success: {
      icon: CheckCircle2,
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600',
      title: 'Success',
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600',
      title: 'Error',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600',
      title: 'Info',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      title: 'Warning',
    },
  };

  const { icon: Icon, bg, text, iconColor, title } = config[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300',
        bg,
        text
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm mt-0.5 wrap-break-word">{message}</p>
      </div>
      <button
        onClick={() => removeToast(id)}
        className={cn(
          'shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors',
          text
        )}
        aria-label="Close toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
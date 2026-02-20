'use client';

import { useConfirmModal } from '@/src/hooks/useConfirmModal';
import { Button } from '@/src/components/ui/Button';
import { AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function ConfirmModal() {
    const { isOpen, title, description, confirmText, cancelText, variant, onConfirm, onCancel, close } = useConfirmModal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                            variant === 'danger' ? "bg-red-100 text-red-600" :
                                variant === 'warning' ? "bg-amber-100 text-amber-600" :
                                    "bg-blue-100 text-blue-600"
                        )}>
                            {variant === 'danger' || variant === 'warning' ? (
                                <AlertTriangle className="w-6 h-6" />
                            ) : (
                                <Info className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="mt-2 text-sm text-gray-500">{description}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (onCancel) onCancel();
                            close();
                        }}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'secondary' : 'primary'}
                        onClick={() => {
                            onConfirm();
                            close();
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

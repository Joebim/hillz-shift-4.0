'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/src/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
}: ModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => {
            clearTimeout(timer);
            setMounted(false);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative bg-white rounded-2xl shadow-2xl',
                    'max-h-[90vh] overflow-y-auto',
                    'animate-in fade-in zoom-in duration-200',

                    // Sizes
                    size === 'sm' && 'w-full max-w-md mx-4',
                    size === 'md' && 'w-full max-w-lg mx-4',
                    size === 'lg' && 'w-full max-w-2xl mx-4',
                    size === 'xl' && 'w-full max-w-4xl mx-4',
                    size === 'full' && 'w-full h-full m-0 rounded-none',
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 border-b border-[#E5E7EB]">
                        <div>
                            {title && (
                                <h2 className="text-2xl font-bold text-[#1F2937]">{title}</h2>
                            )}
                            {description && (
                                <p className="mt-1 text-[#6B7280]">{description}</p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
    return (
        <div
            className={cn(
                'flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]',
                className
            )}
        >
            {children}
        </div>
    );
};

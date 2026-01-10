import React from 'react';
import { cn } from '@/src/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
                <textarea
                    ref={ref}
                    className={cn(
                        'flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 resize-y',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

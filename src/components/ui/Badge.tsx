import { HTMLAttributes } from 'react';
import { cn } from '@/src/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
}

export const Badge = ({
    children,
    className,
    variant = 'default',
    size = 'md',
    ...props
}: BadgeProps) => {
    return (
        <span
            className={cn(
                // Base styles
                'inline-flex items-center font-medium rounded-full',
                'transition-all duration-200',

                // Variants
                variant === 'default' && 'bg-slate-100 text-slate-600 border border-slate-200',
                variant === 'primary' && 'bg-violet-50 text-violet-700 border border-violet-200',
                variant === 'secondary' && 'bg-amber-50 text-amber-700 border border-amber-200',
                variant === 'success' && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                variant === 'warning' && 'bg-orange-50 text-orange-700 border border-orange-200',
                variant === 'danger' && 'bg-red-50 text-red-700 border border-red-200',
                variant === 'info' && 'bg-blue-50 text-blue-700 border border-blue-200',

                // Sizes
                size === 'sm' && 'px-2 py-0.5 text-xs',
                size === 'md' && 'px-2.5 py-0.5 text-sm',
                size === 'lg' && 'px-3 py-1 text-base',

                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

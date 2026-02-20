import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'bordered' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card = ({
    children,
    className,
    variant = 'glass', // Default to glass
    padding = 'md',
    hover = false,
    ...props
}: CardProps) => {
    return (
        <div
            className={cn(
                // Base styles
                'rounded-3xl transition-all duration-300 relative overflow-hidden',

                // Variants
                variant === 'default' && 'bg-white border border-slate-200 shadow-sm',
                variant === 'elevated' && 'bg-white shadow-xl border border-slate-100',
                variant === 'bordered' && 'bg-transparent border border-slate-200',
                variant === 'glass' && 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm',

                // Padding
                padding === 'none' && 'p-0',
                padding === 'sm' && 'p-4',
                padding === 'md' && 'p-6 md:p-8',
                padding === 'lg' && 'p-8 md:p-10',

                // Hover effect
                hover && 'hover:bg-white hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-violet-200',

                className
            )}
            {...props}
        >
            {/* Optional inner glow/gradient for depth */}
            {variant === 'glass' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export const CardHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('mb-6 space-y-2', className)} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className, as: Component = 'h3', ...props }: any) => {
    return (
        <Component
            className={cn('text-2xl font-bold text-white tracking-tight', className)}
            {...props}
        >
            {children}
        </Component>
    );
};

export const CardDescription = ({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <p className={cn('text-slate-400 text-sm leading-relaxed', className)} {...props}>
            {children}
        </p>
    );
};

export const CardContent = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('space-y-4', className)} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('mt-8 pt-6 border-t border-white/5 flex items-center justify-between', className)} {...props}>
            {children}
        </div>
    );
};

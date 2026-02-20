import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center font-semibold transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',

                    // Variants
                    variant === 'primary' && [
                        'bg-violet-600 text-white',
                        'hover:bg-violet-700',
                        'focus:ring-violet-600',
                        'shadow-lg shadow-violet-200',
                        'hover:shadow-xl hover:shadow-violet-300',
                    ],
                    variant === 'secondary' && [
                        'bg-amber-400 text-slate-900',
                        'hover:bg-amber-500',
                        'focus:ring-amber-400',
                        'shadow-lg shadow-amber-200',
                        'hover:shadow-xl hover:shadow-amber-300',
                    ],
                    variant === 'outline' && [
                        'border-2 border-violet-600 text-violet-600 bg-transparent',
                        'hover:bg-violet-50',
                        'focus:ring-violet-600',
                    ],
                    variant === 'ghost' && [
                        'text-violet-600 bg-transparent',
                        'hover:bg-violet-50',
                        'focus:ring-violet-600',
                    ],
                    variant === 'danger' && [
                        'bg-red-600 text-white',
                        'hover:bg-red-700',
                        'focus:ring-red-600',
                        'shadow-lg shadow-red-200',
                    ],

                    // Sizes
                    size === 'sm' && 'px-4 py-2 text-sm rounded-lg',
                    size === 'md' && 'px-6 py-3 text-base rounded-lg',
                    size === 'lg' && 'px-8 py-3.5 text-lg rounded-xl',
                    size === 'xl' && 'px-10 py-4 text-xl rounded-2xl',

                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

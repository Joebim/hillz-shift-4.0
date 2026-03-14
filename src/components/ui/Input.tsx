import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/src/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, endAdornment, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300"
                    >
                        {label}
                        {props.required && <span className="text-pink-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full px-4 py-3 rounded-xl transition-all duration-300',
                            'bg-white border border-slate-200 shadow-sm',
                            'text-slate-800 placeholder:text-slate-400',
                            'focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',

                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'hover:border-slate-300',

                            'disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50',
                            endAdornment ? 'pr-10' : '',
                            className
                        )}
                        {...props}
                    />
                    {endAdornment && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {endAdornment}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="flex items-center gap-1.5 text-sm text-red-400 animate-in slide-in-from-left-1 duration-200">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-slate-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

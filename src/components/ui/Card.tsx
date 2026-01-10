import React from 'react';
import { cn } from '@/src/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'glass' | 'default' | 'outline';
}

export const Card = ({ className, children, variant = 'default', ...props }: CardProps) => {
    const variants = {
        default: 'bg-white shadow-sm border border-gray-100',
        glass: 'glass',
        outline: 'border-2 border-gray-100 bg-transparent'
    };

    return (
        <div
            className={cn(
                'rounded-2xl p-6 md:rounded-3xl md:p-8 transition-all hover:shadow-md',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;

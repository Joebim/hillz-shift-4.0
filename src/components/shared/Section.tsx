import { cn } from '@/src/lib/utils';
import { ReactNode } from 'react';

export interface SectionProps {
    id?: string;
    className?: string;
    containerClassName?: string;
    bg?: 'white' | 'gray' | 'purple' | 'none';
    children: ReactNode;
}

export const Section = ({
    id,
    className,
    containerClassName,
    bg = 'white',
    children,
}: SectionProps) => {
    return (
        <section
            id={id}
            className={cn(
                'py-16 md:py-24 relative overflow-hidden',
                bg === 'white' && 'bg-white',
                bg === 'gray' && 'bg-slate-50',
                bg === 'purple' && 'bg-linear-to-br from-violet-600 to-violet-400 text-white',
                className
            )}
        >
            <div className={cn('container mx-auto px-4', containerClassName)}>
                {children}
            </div>
        </section>
    );
};

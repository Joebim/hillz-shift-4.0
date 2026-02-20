
import React from 'react';
import { cn } from '@/src/lib/utils';



import { StatusBadge } from './StatusBadge';

export { StatusBadge };

export function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{children}</p>;
}

export function Divider() { return <div className="border-t border-gray-100 my-6" />; }

export function InfoCard({ icon: Icon, label, value, accent = false }: {
    icon: React.ElementType; label: string; value: string; accent?: boolean;
}) {
    return (
        <div className={cn('rounded-2xl p-4 border flex flex-col gap-1.5',
            accent ? 'bg-violet-50 border-violet-100' : 'bg-gray-50 border-gray-100')}>
            <div className="flex items-center gap-1.5">
                <Icon className={cn('w-3.5 h-3.5 shrink-0', accent ? 'text-violet-400' : 'text-gray-400')} />
                <p className={cn('text-[10px] font-bold uppercase tracking-widest', accent ? 'text-violet-400' : 'text-gray-400')}>{label}</p>
            </div>
            <p className={cn('text-sm font-semibold leading-snug', accent ? 'text-violet-800' : 'text-gray-800')}>{value}</p>
        </div>
    );
}

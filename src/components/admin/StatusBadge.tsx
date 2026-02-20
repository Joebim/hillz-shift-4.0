import { cn } from '@/src/lib/utils';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const map: Record<string, string> = {
        published: 'bg-emerald-100 text-emerald-700',
        draft: 'bg-gray-100 text-gray-600',
        upcoming: 'bg-blue-100 text-blue-700',
        ongoing: 'bg-violet-100 text-violet-700',
        completed: 'bg-slate-100 text-slate-600',
        archived: 'bg-orange-100 text-orange-700',
        active: 'bg-emerald-100 text-emerald-700',
        inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
        waitlist: 'bg-cyan-100 text-cyan-700',
        sent: 'bg-blue-100 text-blue-700',
        accepted: 'bg-emerald-100 text-emerald-700',
        declined: 'bg-red-100 text-red-700',
    };

    const normalizedStatus = status.toLowerCase();
    const style = map[normalizedStatus] || 'bg-gray-100 text-gray-600';
    const label = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none inline-flex items-center', style, className)}>
            {label}
        </span>
    );
};

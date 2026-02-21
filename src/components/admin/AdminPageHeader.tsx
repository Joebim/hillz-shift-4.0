import { Button } from '@/src/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        href: string;
    };
}

export const AdminPageHeader = ({ title, description, action }: AdminPageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 tracking-tight">{title}</h1>
                {description && <p className="text-slate-500 mt-2 text-lg font-medium">{description}</p>}
            </div>

            {action && (
                <Link href={action.href}>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 border border-transparent transition-all hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" />
                        {action.label}
                    </Button>
                </Link>
            )}
        </div>
    );
};


import Link from 'next/link';
import { Search, Bell, Plus, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserDropdown } from './UserDropdown';

export interface AdminTopNavProps {
    title: string;
    searchPlaceholder?: string;
    action?: {
        label: string;
        href: string;
    };
    showSearch?: boolean;
}

export function AdminTopNav({ title, searchPlaceholder = 'Search...', action, showSearch = true }: AdminTopNavProps) {
    const { data: session } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const res = await fetch('/api/auth/session');
            if (!res.ok) return null;
            const json = await res.json();
            return json.data;
        }
    });

    return (
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-sm/50">
            {}
            <h1 className="text-xl font-bold tracking-tight text-gray-900 lg:hidden">{title}</h1>

            {}
            {showSearch && (
                <div className="hidden md:flex flex-1 max-w-sm relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm font-medium text-gray-600 focus:ring-0 focus:outline-none placeholder:text-gray-400 hover:bg-gray-100 transition-colors"
                    />
                </div>
            )}

            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {action && (
                    <Link
                        href={action.href}
                        className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-slate-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{action.label}</span>
                    </Link>
                )}

                <div className="hidden lg:block h-8 w-px bg-gray-100 mx-1" />
                <div className="hidden lg:block">
                    <UserDropdown session={session} />
                </div>

                <Link href="/admin/profile" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 lg:hidden hover:bg-gray-200 transition-colors">
                    <User className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

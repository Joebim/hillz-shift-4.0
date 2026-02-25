'use client';

import { AdminSidebar } from '@/src/components/admin/AdminSidebar';
import { ToastProvider } from '@/src/contexts/ToastContext';
import QueryProvider from '@/src/providers/QueryProvider';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return (
            <QueryProvider>
                <ToastProvider>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        {children}
                    </div>
                </ToastProvider>
            </QueryProvider>
        );
    }

    return (
        <QueryProvider>
            <ToastProvider>
                <div className="flex h-screen bg-slate-50 overflow-hidden">
                    <AdminSidebar />
                    <main className="flex-1 overflow-y-auto pl-14 lg:pl-0">
                        {children}
                    </main>
                </div>
            </ToastProvider>
        </QueryProvider>
    );
}

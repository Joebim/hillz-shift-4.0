'use client';

import React from 'react';
import { Card } from '@/src/components/ui/Card';
import { Skeleton } from '@/src/components/ui/Skeleton';
import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';
import { Users, UserPlus, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

import { DashboardStats } from '@/src/types/Admin';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
    const {
        data: stats,
        isLoading: loading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: async (): Promise<DashboardStats> => {
            const res = await fetch('/api/dashboard');
            const json = await res.json().catch(() => null);
            if (!res.ok || (json as any)?.success === false) {
                throw new Error((json as any)?.error || 'Failed to fetch dashboard data');
            }
            return json as DashboardStats;
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    });

    if (loading) return (
        <div className="space-y-10 py-6">
            {/* Header Skeleton */}
            <header className="flex flex-col gap-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-64 md:h-10 md:w-80" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            </header>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <Skeleton className="h-16 w-16 rounded-2xl" />
                                <Skeleton className="h-1 w-10 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-32 mb-2" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Cards Skeleton */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i} className="border-none shadow-xl ring-1 ring-gray-100">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((j) => (
                                <div key={j} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/50">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Skeleton className="h-3 w-16 ml-auto" />
                                        <Skeleton className="h-2 w-12 ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="glass mx-auto max-w-2xl rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border-red-100">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Activity size={32} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Connection Issue</h2>
            <p className="text-gray-500 mb-8">{error instanceof Error ? error.message : 'Failed to load dashboard'}</p>
            <button
                onClick={() => refetch()}
                className="rounded-2xl bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
                Try Again
            </button>
        </div>
    );

    if (!stats) return null;

    const statCards = [
        { title: 'Total Registrations', value: stats.totalRegistrations, icon: Users, color: 'text-primary', bg: 'bg-primary/10', glow: 'shadow-primary/20' },
        { title: 'Total Invitations', value: stats.totalInvitations, icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-100', glow: 'shadow-purple-500/20' },
        { title: 'Conversion Rate', value: `${((stats.totalRegistrations / (stats.totalInvitations || 1)) * 100).toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', glow: 'shadow-emerald-500/20' },
    ];

    const recentRegistrations = [...stats.registrations]
        .sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
        })
        .slice(0, 6);

    const recentInvitations = [...stats.invitations]
        .sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime;
        })
        .slice(0, 6);

    return (
        <div className="space-y-10 py-6">
            <header className="flex flex-col gap-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-primary-dark md:text-4xl">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm font-medium text-gray-500">
                            Hillz Shift 4.0 registrations and invitations.
                            {isFetching && <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Refreshing…</span>}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={ROUTES.ADMIN.REGISTRATIONS}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            View Registrations
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href={ROUTES.ADMIN.INVITATIONS}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            View Invitations
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {statCards.map((stat, i) => (
                    <Card key={i} className={cn("relative overflow-hidden group", stat.glow)}>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                                    <stat.icon size={28} className={stat.color} />
                                </div>
                                <div className="h-1 w-10 bg-gray-100 rounded-full"></div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.title}</p>
                            <h2 className="text-4xl font-black text-primary-dark mt-2 tracking-tighter">{stat.value}</h2>
                        </div>
                        {/* Decorative background element */}
                        <div className={cn("absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-5 blur-2xl transition-all group-hover:scale-150 group-hover:opacity-10", stat.bg)}></div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* Recent Invitations */}
                <Card className="border-none shadow-xl ring-1 ring-gray-100">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700 shadow-sm">
                                <UserPlus size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark">Recent Invitations</h3>
                        </div>
                        <Link href={ROUTES.ADMIN.INVITATIONS} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
                            View All
                        </Link>
                    </div>
                    {recentInvitations.length === 0 ? (
                        <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
                            No invitations yet.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentInvitations.map((inv: any, i) => (
                                <div
                                    key={inv.id || i}
                                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="min-w-0">
                                        <p className="font-bold text-primary-dark truncate">
                                            {inv.inviterName || 'Someone'} invited {inv.inviteeName || 'a guest'}
                                        </p>
                                        <p className="text-xs font-medium text-gray-400 truncate">
                                            {inv.inviteeEmail || inv.inviteePhone || inv.location || ''}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-primary-dark">
                                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase">{inv.status || 'sent'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Recent Registrations */}
                <Card className="border-none shadow-xl ring-1 ring-gray-100">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary shadow-sm">
                                <Activity size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-primary-dark">Recent Registrations</h3>
                        </div>
                        <Link href={ROUTES.ADMIN.REGISTRATIONS} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-1">
                        {recentRegistrations.map((reg: any, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary/5 to-primary/20 flex items-center justify-center font-bold text-primary">
                                        {reg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary-dark leading-tight">{reg.name}</p>
                                        <p className="text-xs font-medium text-gray-400">{reg.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-primary-dark">
                                        {new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase">registered</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}


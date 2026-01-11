'use client';

import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';

type AnalyticsResponse = {
    success: boolean;
    rangeDays: number;
    series: { date: string; label: string; registrations: number; invitations: number }[];
    totals: { registrations: number; invitations: number };
    error?: string;
};

export default function AnalyticsPage() {
    const {
        data,
        isLoading: loading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey: ['admin', 'analytics', 14],
        queryFn: async (): Promise<AnalyticsResponse> => {
            const res = await fetch('/api/analytics?days=14');
            const json = (await res.json().catch(() => ({}))) as AnalyticsResponse;
            if (!res.ok || json?.success === false) {
                throw new Error(json?.error || 'Failed to load analytics');
            }
            return json;
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    });

    const series = useMemo(() => data?.series || [], [data]);
    const totals = data?.totals;
    const yAxisConfig = useMemo(() => {
        // Fixed Y-axis range from 0 to 50
        const yMax = 50;
        const ticks = [0, 10, 20, 30, 40, 50];
        return { yMax, ticks };
    }, []);

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
                <div className="flex flex-col gap-2">
                    <p className="font-bold text-red-700">Failed to load analytics</p>
                    <p className="text-sm text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-3 inline-flex w-fit items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="space-y-8">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <Skeleton className="h-3 w-32 mb-4" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl md:rounded-3xl bg-white p-6 md:p-8 border border-gray-100 shadow-sm">
                        <Skeleton className="h-6 w-48 mb-6" />
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
    if (error) return <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">{error}</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Registrations and invitations over the last 14 days.</p>
            </div>

            {totals && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Registrations (14d)</div>
                        <div className="mt-2 text-3xl font-black text-gray-900">{totals.registrations}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Invitations (14d)</div>
                        <div className="mt-2 text-3xl font-black text-gray-900">{totals.invitations}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Conversion (14d)</div>
                        <div className="mt-2 text-3xl font-black text-gray-900">
                            {totals.invitations > 0 ? `${((totals.registrations / totals.invitations) * 100).toFixed(1)}%` : '—'}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Registration Trend */}
                <div className="rounded-2xl md:rounded-3xl bg-white p-6 md:p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Daily Registrations</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={series}>
                                <defs>
                                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    allowDecimals={false}
                                    domain={[0, yAxisConfig.yMax]}
                                    ticks={yAxisConfig.ticks}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Invitations vs Registrations */}
                <div className="rounded-2xl md:rounded-3xl bg-white p-6 md:p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Invitations vs Registrations</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={series}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    allowDecimals={false}
                                    domain={[0, yAxisConfig.yMax]}
                                    ticks={yAxisConfig.ticks}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="invitations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="registrations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}


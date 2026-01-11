'use client';

import React from 'react';
import { Registration } from '@/src/types/Registration';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Users, Mail, Phone, Calendar, MapPin, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

function getApiErrorMessage(json: unknown, fallback: string) {
    if (json && typeof json === 'object') {
        const rec = json as Record<string, unknown>;
        const err = rec.error;
        if (typeof err === 'string' && err.trim()) return err;
    }
    return fallback;
}

export default function RegistrationsTable() {
    const {
        data = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey: ['admin', 'registrations'],
        queryFn: async (): Promise<Registration[]> => {
            const res = await fetch('/api/registrations');
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                const message = getApiErrorMessage(json, 'Failed to load registrations');
                throw new Error(message);
            }
            return (json || []) as Registration[];
        },
        staleTime: 60 * 1000, // avoid refetching on every route change
        refetchOnWindowFocus: true, // refresh when coming back to the tab
    });

    if (isLoading) return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-linear-to-r from-primary/5 to-primary/10 border-b border-gray-200 px-4 md:px-6 py-4">
                    <Skeleton className="h-5 w-48" />
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 md:p-6">
                            <Skeleton className="h-6 w-40 mb-2" />
                            <div className="flex flex-wrap gap-4 mt-3">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <div className="flex flex-col gap-2">
                <p className="font-bold text-red-700">Failed to load registrations</p>
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

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary-dark tracking-tight">Registered Participants</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Total: <span className="font-bold text-primary">{data.length}</span> registrations
                        {isFetching && <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Refreshing…</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold">
                    <Users size={20} />
                    <span>{data.length}</span>
                </div>
            </div>

            {/* Scrollable Table Container */}
            <div className="w-full overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg min-w-[900px]">
                    {/* Table Header - Sticky on scroll */}
                    <div className="bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 border-b-2 border-primary/20 px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Users size={20} className="text-primary" />
                            <h2 className="text-lg font-bold text-primary-dark">All Registrations</h2>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                            <tr>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 min-w-[180px] w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} />
                                        <span>Participant</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} />
                                        <span>Contact</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Globe size={14} />
                                        <span>Method</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>Source</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>Registered</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <Users size={48} className="opacity-30" />
                                            <p className="font-medium">No registrations yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((reg) => (
                                    <tr
                                        key={reg.id}
                                        className="hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group"
                                    >
                                        {/* Participant Info */}
                                        <td className="px-4 md:px-6 py-5 min-w-[180px] w-[180px]">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center font-black text-primary text-sm group-hover:scale-110 transition-transform shrink-0">
                                                    {reg.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-gray-900 truncate">{reg.name}</div>
                                                    {reg.address && (
                                                        <div className="text-xs text-gray-500 mt-0.5 truncate">{reg.address}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact Info */}
                                        <td className="px-4 md:px-6 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail size={12} className="text-gray-400" />
                                                    <a href={`mailto:${reg.email}`} className="text-gray-700 hover:text-primary hover:underline font-medium">
                                                        {reg.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone size={12} className="text-gray-400" />
                                                    <a href={`tel:${reg.phone}`} className="text-gray-600 hover:text-primary">
                                                        {reg.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Joining Method */}
                                        <td className="px-4 md:px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${reg.joiningMethod === 'online'
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : reg.joiningMethod === 'in-person'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                                                }`}>
                                                {reg.joiningMethod === 'online' ? (
                                                    <>
                                                        <Globe size={12} />
                                                        <span>Online</span>
                                                    </>
                                                ) : reg.joiningMethod === 'in-person' ? (
                                                    <>
                                                        <Users size={12} />
                                                        <span>In Person</span>
                                                    </>
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </span>
                                        </td>

                                        {/* Source */}
                                        <td className="px-4 md:px-6 py-5">
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200">
                                                {reg.heardFrom || 'N/A'}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 md:px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {new Date(reg.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(reg.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


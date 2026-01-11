'use client';

import React from 'react';
import { Invitation } from '@/src/types/Invitation';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { UserPlus, Mail, Phone, MapPin, Calendar, Send, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

function getApiErrorMessage(json: unknown, fallback: string) {
    if (json && typeof json === 'object') {
        const rec = json as Record<string, unknown>;
        const err = rec.error;
        if (typeof err === 'string' && err.trim()) return err;
    }
    return fallback;
}

export default function InvitationsTable() {
    const {
        data = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey: ['admin', 'invitations'],
        queryFn: async (): Promise<Invitation[]> => {
            const res = await fetch('/api/invitations');
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                const message = getApiErrorMessage(json, 'Failed to load invitations');
                throw new Error(message);
            }
            return (json || []) as Invitation[];
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    });

    if (isLoading) return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-linear-to-r from-purple-50 to-purple-100 border-b border-gray-200 px-4 md:px-6 py-4">
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
                <p className="font-bold text-red-700">Failed to load invitations</p>
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
                    <h1 className="text-3xl font-black text-primary-dark tracking-tight">Sent Invitations</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Total: <span className="font-bold text-purple-600">{data.length}</span> invitations sent
                        {isFetching && <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Refreshing…</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold">
                    <UserPlus size={20} />
                    <span>{data.length}</span>
                </div>
            </div>

            {/* Scrollable Table Container */}
            <div className="w-full overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg min-w-[700px]">
                    {/* Table Header - Sticky on scroll */}
                    <div className="bg-linear-to-r from-purple-50 via-purple-100 to-purple-50 border-b-2 border-purple-200 px-4 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                            <UserPlus size={20} className="text-purple-600" />
                            <h2 className="text-lg font-bold text-primary-dark">All Invitations</h2>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                            <tr>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <UserPlus size={14} />
                                        <span>Invited Person</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Send size={14} />
                                        <span>Invited By</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <span>Location</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} />
                                        <span>Status</span>
                                    </div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>Sent</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <UserPlus size={48} className="opacity-30" />
                                            <p className="font-medium">No invitations sent yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((inv) => (
                                    <tr
                                        key={inv.id}
                                        className="hover:bg-linear-to-r hover:from-purple-50/50 hover:to-transparent transition-all duration-200 group"
                                    >
                                        {/* Invited Person */}
                                        <td className="px-4 md:px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-200 to-purple-400 flex items-center justify-center font-black text-white text-sm group-hover:scale-110 transition-transform">
                                                    {inv.inviteeName?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{inv.inviteeName || 'Unknown'}</div>
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        {inv.inviteeEmail && (
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Mail size={10} className="text-gray-400" />
                                                                <a href={`mailto:${inv.inviteeEmail}`} className="text-gray-600 hover:text-purple-600 hover:underline">
                                                                    {inv.inviteeEmail}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {inv.inviteePhone && (
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Phone size={10} className="text-gray-400" />
                                                                <a href={`tel:${inv.inviteePhone}`} className="text-gray-600 hover:text-purple-600">
                                                                    {inv.inviteePhone}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Invited By */}
                                        <td className="px-4 md:px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center font-black text-primary text-sm group-hover:scale-110 transition-transform">
                                                    {inv.inviterName?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{inv.inviterName || 'Unknown'}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-4 md:px-6 py-5">
                                            {inv.location ? (
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span className="font-medium">{inv.location}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">Not provided</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 md:px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200">
                                                <CheckCircle2 size={12} />
                                                <span>{inv.status || 'sent'}</span>
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 md:px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {new Date(inv.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(inv.createdAt).toLocaleDateString('en-US', {
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


'use client';

import React, { useEffect, useState } from 'react';
import { Invitation } from '@/src/types/Invitation';
import { Skeleton } from '@/src/components/ui/Skeleton';

export default function InvitationsTable() {
    const [data, setData] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/invitations')
            .then(res => res.json())
            .then(items => {
                setData(items);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <Skeleton className="h-8 w-64" />

            {/* Table Skeleton */}
            <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4 px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Sent Invitations ({data.length})</h1>

            <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Invited Person</th>
                            <th className="px-6 py-4">Invited By</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{inv.inviteeName}</div>
                                    <div className="text-xs text-gray-500">{inv.inviteeEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{inv.inviterName}</div>
                                    <div className="text-xs text-gray-500">{(inv as any).inviterEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(inv.createdAt).toLocaleDateString('en-US')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


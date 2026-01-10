'use client';

import React, { useEffect, useState } from 'react';
import { Registration } from '@/src/types/Registration';
import { Skeleton } from '@/src/components/ui/Skeleton';

export default function RegistrationsTable() {
    const [data, setData] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/registrations')
            .then(res => res.json())
            .then(items => {
                setData(items);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <Skeleton className="h-8 w-72" />

            {/* Table Skeleton */}
            <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-4 px-6 py-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Registered Participants ({data.length})</h1>

            <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{reg.name}</td>
                                <td className="px-6 py-4 text-gray-600">{reg.email}</td>
                                <td className="px-6 py-4 text-gray-600">{reg.phone}</td>
                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                                        {reg.heardFrom}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(reg.createdAt).toLocaleDateString('en-US')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


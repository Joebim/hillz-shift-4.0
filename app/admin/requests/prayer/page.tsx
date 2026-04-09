'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminTable } from '@/src/components/admin/AdminTable';
import { SkeletonDashboard } from '@/src/components/skeletons/SkeletonDashboard';
import { format } from 'date-fns';
import { useState } from 'react';
import { AdminTopNav } from '@/src/components/admin/AdminTopNav';
import { Heart } from 'lucide-react';

interface PrayerRequest {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    category?: string;
    request: string;
    isPrivate: boolean;
    createdAt: string | Date;
}

export default function PrayerRequestsPage() {
    const { data: requests, isLoading } = useQuery({
        queryKey: ['admin-prayer-requests'],
        queryFn: async () => {
            const res = await fetch('/api/admin/requests/prayer');
            if (!res.ok) throw new Error('Failed to fetch prayer requests');
            const json = await res.json();
            return json.data;
        }
    });

    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) return <SkeletonDashboard />;

    const filteredRequests = (requests as PrayerRequest[])?.filter((req: PrayerRequest) => 
        req.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        req.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.request?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <AdminTopNav 
                title="Prayer Requests"
                subtitle="Support our community through prayer"
                titleIcon={<Heart className="w-5 h-5" />}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search prayers..."
            />
            
            <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AdminTable
                    data={filteredRequests}
                    columns={[
                        {
                            header: 'Name',
                            cell: (req: PrayerRequest) => (
                                <div>
                                    <p className="font-semibold text-gray-900">{req.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{req.email || req.phone}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Category',
                            cell: (req: PrayerRequest) => (
                                <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase">
                                    {req.category || 'General'}
                                </span>
                            )
                        },
                        {
                            header: 'Request',
                            cell: (req: PrayerRequest) => (
                                <p className="text-sm text-gray-600 line-clamp-2 max-w-sm" title={req.request}>
                                    {req.request}
                                </p>
                            )
                        },
                        {
                            header: 'Private',
                            cell: (req: PrayerRequest) => (
                                <span className={`text-xs font-bold ${req.isPrivate ? 'text-red-500' : 'text-gray-400'}`}>
                                    {req.isPrivate ? 'PRIVATE' : 'PUBLIC'}
                                </span>
                            )
                        },
                        {
                            header: 'Date',
                            cell: (req: PrayerRequest) => (
                                <span className="text-xs text-gray-500 font-medium">
                                    {req.createdAt ? format(new Date(req.createdAt), 'MMM d, yyyy') : 'Unknown'}
                                </span>
                            )
                        }
                    ]}
                />
            </div>
            </div>
        </div>
    );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminTable } from '@/src/components/admin/AdminTable';
import { SkeletonDashboard } from '@/src/components/skeletons/SkeletonDashboard';
import { format } from 'date-fns';
import { useState } from 'react';
import { AdminTopNav } from '@/src/components/admin/AdminTopNav';
import { MessageSquare } from 'lucide-react';

interface ContactRequest {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string | Date;
}

export default function ContactRequestsPage() {
    const { data: requests, isLoading } = useQuery({
        queryKey: ['admin-contact-requests'],
        queryFn: async () => {
            const res = await fetch('/api/admin/requests/contact');
            if (!res.ok) throw new Error('Failed to fetch contact requests');
            const json = await res.json();
            return json.data;
        }
    });

    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) return <SkeletonDashboard />;

    const filteredRequests = (requests as ContactRequest[])?.filter((req: ContactRequest) => 
        req.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        req.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <AdminTopNav 
                title="Contact Requests"
                subtitle="Review and manage inquiries"
                titleIcon={<MessageSquare className="w-5 h-5" />}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search messages..."
            />
            
            <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AdminTable
                    data={filteredRequests}
                    columns={[
                        {
                            header: 'Name',
                            cell: (req: ContactRequest) => (
                                <div>
                                    <p className="font-semibold text-gray-900">{req.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{req.email}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Subject',
                            cell: (req: ContactRequest) => <p className="text-sm font-medium text-gray-700">{req.subject}</p>
                        },
                        {
                            header: 'Message',
                            cell: (req: ContactRequest) => (
                                <p className="text-sm text-gray-600 line-clamp-2 max-w-sm" title={req.message}>
                                    {req.message}
                                </p>
                            )
                        },
                        {
                            header: 'Date',
                            cell: (req: ContactRequest) => (
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

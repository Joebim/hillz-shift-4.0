'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminTable } from '@/src/components/admin/AdminTable';
import { SkeletonDashboard } from '@/src/components/skeletons/SkeletonDashboard';
import { format } from 'date-fns';

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

    if (isLoading) return <SkeletonDashboard />;

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Contact Requests</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AdminTable
                    data={requests || []}
                    columns={[
                        {
                            header: 'Name',
                            cell: (req: any) => (
                                <div>
                                    <p className="font-semibold text-gray-900">{req.name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{req.email}</p>
                                </div>
                            )
                        },
                        {
                            header: 'Subject',
                            cell: (req: any) => <p className="text-sm font-medium text-gray-700">{req.subject}</p>
                        },
                        {
                            header: 'Message',
                            cell: (req: any) => (
                                <p className="text-sm text-gray-600 line-clamp-2 max-w-sm" title={req.message}>
                                    {req.message}
                                </p>
                            )
                        },
                        {
                            header: 'Date',
                            cell: (req: any) => (
                                <span className="text-xs text-gray-500 font-medium">
                                    {req.createdAt ? format(new Date(req.createdAt), 'MMM d, yyyy') : 'Unknown'}
                                </span>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
}

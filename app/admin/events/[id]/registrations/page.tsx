'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Registration } from '@/src/types/registration';
import { AdminTopNav } from '@/src/components/admin/AdminTopNav';
import { AdminTable } from '@/src/components/admin/AdminTable';
import { SkeletonDashboard } from '@/src/components/skeletons/SkeletonDashboard';
import { Users, ArrowLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toJsDate } from '@/src/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { AddRegistrationModal } from '../modals';
import { Event } from '@/src/types/event';

function toDate(value: unknown): Date {
    if (!value) return new Date();
    if (typeof value === 'object' && value !== null && '_seconds' in value) {
        return new Date((value as { _seconds: number })._seconds * 1000);
    }
    try {
        return toJsDate(value as string | number | Date | null | undefined);
    } catch {
        return new Date();
    }
}

export default function RegistrationsDataPage() {
    const params = useParams();
    const eventId = params?.id as string;
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: event } = useQuery<Event>({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}`);
            if (!res.ok) throw new Error('Failed to fetch event');
            return (await res.json()).data;
        },
        enabled: !!eventId,
    });

    const { data: registrations, isLoading } = useQuery<Registration[]>({
        queryKey: ['registrations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/registrations`);
            if (!res.ok) return [];
            return (await res.json()).data || [];
        },
        enabled: !!eventId,
    });

    const deleteMutation = useMutation({
        mutationFn: async (regId: string) => {
            const res = await fetch(`/api/events/${eventId}/registrations/${regId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete registration');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event-metrics'] });
        }
    });

    if (isLoading) return <SkeletonDashboard />;

    const filteredData = registrations?.filter(r => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            r.name?.toLowerCase().includes(q) ||
            r.email?.toLowerCase().includes(q) ||
            r.attendee?.firstName?.toLowerCase().includes(q) ||
            r.attendee?.lastName?.toLowerCase().includes(q) ||
            r.attendee?.email?.toLowerCase().includes(q)
        );
    }) || [];

    const columns = [
        {
            header: 'Attendee',
            cell: (req: Registration) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs shrink-0">
                        {(req.name || req.attendee?.firstName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">
                            {req.name || (req.attendee && `${req.attendee.firstName} ${req.attendee.lastName}`) || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{req.email || req.attendee?.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Phone',
            cell: (req: Registration) => <span className="text-sm">{req.attendee?.phone || '—'}</span>
        },
        {
            header: 'Status',
            cell: (req: Registration) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    req.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    req.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                    'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                    {req.status || 'unknown'}
                </span>
            )
        },
        {
            header: 'Check-In',
            cell: (req: Registration) => (
                <span className={`text-xs font-semibold ${req.checkedIn ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {req.checkedIn ? 'Yes' : 'No'}
                </span>
            )
        },
        {
            header: 'Date',
            cell: (req: Registration) => (
                <span className="text-sm text-gray-500">
                    {req.createdAt ? format(toDate(req.createdAt), 'MMM d, yyyy') : '—'}
                </span>
            )
        },
    ];

    const renderExpandableContent = (req: Registration) => {
        if (!req.attendee?.customFields || Object.keys(req.attendee.customFields).length === 0) {
            return <p className="text-sm text-gray-400 italic">No custom fields filled.</p>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(req.attendee.customFields).map(([key, value]) => (
                    <div key={key}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{key}</p>
                        <p className="text-sm font-medium text-gray-800">{String(value) || '—'}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            <AdminTopNav 
                title="Registration Data"
                subtitle="Comprehensive view of all attendee responses"
                titleIcon={<Users className="w-5 h-5" />}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search attendees..."
                action={{
                    label: "Add Attendee",
                    onClick: () => setIsModalOpen(true),
                    icon: <Plus className="w-4 h-4" />
                }}
                customAction={
                    <Link href={`/admin/events/${eventId}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                }
            />
            
            <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
                <AdminTable 
                    data={filteredData} 
                    columns={columns} 
                    expandableRowContent={renderExpandableContent}
                    actions={{
                        delete: async (item) => {
                            await deleteMutation.mutateAsync(item.id);
                        }
                    }}
                />
            </div>

            {event && (
                <AddRegistrationModal 
                    event={event} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}

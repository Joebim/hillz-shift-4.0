'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Invitation } from '@/src/types/invitation';
import { AdminTopNav } from '@/src/components/admin/AdminTopNav';
import { AdminTable } from '@/src/components/admin/AdminTable';
import { SkeletonDashboard } from '@/src/components/skeletons/SkeletonDashboard';
import { Mail, ArrowLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toJsDate } from '@/src/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { AddInvitationModal } from '../modals';
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

export default function InvitationsDataPage() {
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

    const { data: invitations, isLoading } = useQuery<Invitation[]>({
        queryKey: ['invitations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/invitations`);
            if (!res.ok) return [];
            return (await res.json()).data || [];
        },
        enabled: !!eventId,
    });

    const deleteMutation = useMutation({
        mutationFn: async (invId: string) => {
            const res = await fetch(`/api/events/${eventId}/invitations/${invId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete invitation');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event-metrics'] });
        }
    });

    if (isLoading) return <SkeletonDashboard />;

    const filteredData = invitations?.filter(i => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            i.recipientName?.toLowerCase().includes(q) ||
            i.recipientEmail?.toLowerCase().includes(q) ||
            i.inviteeName?.toLowerCase().includes(q) ||
            i.inviteeEmail?.toLowerCase().includes(q) ||
            i.senderName?.toLowerCase().includes(q)
        );
    }) || [];

    const columns = [
        {
            header: 'Invitee',
            cell: (req: Invitation) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                        {(req.recipientName || req.inviteeName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">
                            {req.recipientName || req.inviteeName || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{req.recipientEmail || req.inviteeEmail || '—'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Sender',
            cell: (req: Invitation) => (
                <div>
                    <p className="text-sm font-medium text-gray-800">{req.senderName || req.inviterName || '—'}</p>
                    <p className="text-[10px] text-gray-500">{req.senderEmail || req.inviterEmail}</p>
                </div>
            )
        },
        {
            header: 'Status',
            cell: (req: Invitation) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    req.status === 'declined' ? 'bg-red-50 text-red-700 border border-red-100' :
                    'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                    {req.status || 'pending'}
                </span>
            )
        },
        {
            header: 'Date',
            cell: (req: Invitation) => (
                <span className="text-sm text-gray-500">
                    {req.createdAt ? format(toDate(req.createdAt), 'MMM d, yyyy') : '—'}
                </span>
            )
        },
    ];

    const renderExpandableContent = (req: Invitation) => {
        return (
            <div className="space-y-4">
                {req.personalMessage && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Personal Message</p>
                        <p className="text-sm text-gray-700 bg-gray-50/50 p-3 rounded-lg border border-gray-100 italic">
                            &quot;{req.personalMessage}&quot;
                        </p>
                    </div>
                )}
                
                {req.customFields && Object.keys(req.customFields).length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Object.entries(req.customFields).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{key}</p>
                                <p className="text-sm font-medium text-gray-800">{String(value) || '—'}</p>
                            </div>
                        ))}
                    </div>
                )}

                {(!req.personalMessage && (!req.customFields || Object.keys(req.customFields).length === 0)) && (
                    <p className="text-sm text-gray-400 italic">No extra details available.</p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            <AdminTopNav 
                title="Invitation Data"
                subtitle="Comprehensive view of all invitations and responses"
                titleIcon={<Mail className="w-5 h-5" />}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search invitations..."
                action={{
                    label: "Send Invitation",
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
                <AddInvitationModal 
                    event={event} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}

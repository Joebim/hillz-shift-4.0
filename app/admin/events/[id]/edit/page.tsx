'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';
import { Event } from '@/src/types/event';
import { createEventSchema } from '@/src/schemas/event.schema';
import { EventForm } from '@/src/components/admin/events/EventForm';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type EventFormData = z.infer<typeof createEventSchema>;

import { SkeletonForm } from '@/src/components/skeletons/SkeletonForm';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params?.id as string;
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}`);
            if (!res.ok) throw new Error('Failed to fetch event');
            const json = await res.json();
            return (json.data ?? json) as Event;
        },
        enabled: !!eventId,
    });

    const updateMutation = useMutation({
        mutationFn: async (data: EventFormData) => {
            const res = await fetch(`/api/events/${eventId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to update event');
            }
            return res.json();
        },
        onSuccess: () => {
            toast({ title: 'Event updated successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            router.push(`/admin/events/${eventId}`);
        },
        onError: (error) => {
            toast({ title: 'Failed to update event', description: error.message, type: 'error' });
        },
    });

    if (isLoading) return <SkeletonForm />;

    if (isError || !event) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-gray-600 font-medium">Event not found</p>
            <p className="text-gray-400 text-sm">This event may have been removed or the link is invalid.</p>
            <Link href="/admin/events"
                className="mt-2 text-violet-600 text-sm font-medium hover:underline">
                ← Back to Events
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {}
            <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2 min-w-0">
                    <Link
                        href={`/admin/events/${eventId}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-violet-600 transition-colors uppercase tracking-wider shrink-0"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <span className="text-gray-200 mx-1 hidden sm:inline">/</span>
                    <div className="min-w-0">
                        <h1 className="text-sm md:text-base font-bold text-gray-900 truncate">
                            {event.title}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider hidden md:block">
                            Edit Event
                        </p>
                    </div>
                </div>

                {}
                <div className="flex items-center gap-3">
                    <span className={cn(
                        'hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        event.status === 'published' ? 'bg-emerald-100 text-emerald-700'
                            : event.status === 'draft' ? 'bg-gray-100 text-gray-600'
                                : 'bg-violet-100 text-violet-700'
                    )}>
                        {event.status}
                    </span>
                    <Link
                        href={`/events/${event.slug || eventId}`}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 bg-gray-100 hover:bg-violet-50 border border-gray-200 hover:border-violet-200 px-3 py-2 rounded-xl transition-all font-medium"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Event</span>
                    </Link>
                </div>
            </header>

            {}
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
                <EventForm
                    initialData={event}
                    onSubmit={async (data) => await updateMutation.mutateAsync(data)}
                    isLoading={updateMutation.isPending}
                />
            </div>
        </div>
    );
}
'use client';

import { AdminPageHeader } from '@/src/components/admin/AdminPageHeader';
import { EventForm } from '@/src/components/admin/events/EventForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';

export default function CreateEventPage() {
    const router = useRouter();
    const { toast } = useToast();

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create event');
            return res.json();
        },
        onSuccess: () => {
            toast({ title: 'Event created successfully', type: 'success' });
            router.push('/admin/events');
        },
        onError: () => {
            toast({ title: 'Failed to create event', type: 'error' });
        },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <AdminPageHeader
                title="Create New Event"
                description="Add a new event to your calendar"
            />
            <EventForm onSubmit={async (data) => await createMutation.mutateAsync(data)} />
        </div>
    );
}

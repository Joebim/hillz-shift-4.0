'use client';

import { MinistryForm } from '@/src/components/admin/ministries/MinistryForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';

export default function CreateMinistryPage() {
    const router = useRouter();
    const { toast } = useToast();

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/ministries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create ministry');
            return res.json();
        },
        onSuccess: () => {
            toast({ title: 'Ministry added successfully', type: 'success' });
            router.push('/admin/ministries');
        },
        onError: () => {
            toast({ title: 'Failed to add ministry', type: 'error' });
        },
    });

    return (
        <div className="p-4 md:p-8">
            <MinistryForm onSubmit={async (data) => await createMutation.mutateAsync(data)} />
        </div>
    );
}

'use client';

import { MinistryForm } from '@/src/components/admin/ministries/MinistryForm';
import { Ministry } from '@/src/types/ministry';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';
import { Spinner } from '@/src/components/ui/Loading';

export default function EditMinistryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: ministry, isLoading } = useQuery({
        queryKey: ['admin-ministry', id],
        queryFn: async () => {
            const res = await fetch(`/api/ministries/${id}`);
            if (!res.ok) throw new Error('Failed to fetch ministry');
            const json = await res.json();
            return json.data as Ministry;
        },
        enabled: !!id,
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const res = await fetch(`/api/ministries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update ministry');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-ministries'] });
            queryClient.invalidateQueries({ queryKey: ['admin-ministries', id] });
            toast({ title: 'Ministry updated successfully', type: 'success' });
            router.push('/admin/ministries');
        },
        onError: () => {
            toast({ title: 'Failed to update ministry', type: 'error' });
        },
    });

    if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
    if (!ministry) return <div className="p-8 text-center text-gray-500 font-medium">Ministry not found</div>;

    return (
        <div className="p-4 md:p-8">
            <MinistryForm
                initialData={ministry}
                onSubmit={async (data) => await updateMutation.mutateAsync(data)}
            />
        </div>
    );
}

'use client';

import { SermonForm } from '@/src/components/admin/sermons/SermonForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';
import { Spinner } from '@/src/components/ui/Loading';

export default function EditSermonPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: sermon, isLoading } = useQuery({
        queryKey: ['admin-sermon', id],
        queryFn: async () => {
            const res = await fetch(`/api/sermons/${id}`);
            if (!res.ok) throw new Error('Failed to fetch sermon');
            const json = await res.json();
            return json.data;
        },
        enabled: !!id,
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`/api/sermons/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update sermon');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
            queryClient.invalidateQueries({ queryKey: ['admin-sermon', id] });
            toast({ title: 'Sermon updated successfully', type: 'success' });
            router.push('/admin/sermons');
        },
        onError: () => {
            toast({ title: 'Failed to update sermon', type: 'error' });
        },
    });

    if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
    if (!sermon) return <div className="p-8 text-center text-gray-500 font-medium">Sermon not found</div>;

    return (
        <div className="p-4 md:p-8">
            <SermonForm
                initialData={sermon}
                onSubmit={async (data) => await updateMutation.mutateAsync(data)}
            />
        </div>
    );
}

'use client';

import { SermonForm } from '@/src/components/admin/sermons/SermonForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';

export default function CreateSermonPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create sermon');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Sermon added successfully', type: 'success' });
      router.push('/admin/sermons');
    },
    onError: () => {
      toast({ title: 'Failed to add sermon', type: 'error' });
    },
  });

  return (
    <div className="p-4 md:p-8">
      <SermonForm onSubmit={async (data) => await createMutation.mutateAsync(data)} />
    </div>
  );
}

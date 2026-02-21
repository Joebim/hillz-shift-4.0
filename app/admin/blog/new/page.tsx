'use client';

import { BlogPostForm } from '@/src/components/admin/blog/BlogPostForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';

export default function CreateBlogPostPage() {
    const router = useRouter();
    const { toast } = useToast();

    const createMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const res = await fetch('/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create post');
            return res.json();
        },
        onSuccess: () => {
            toast({ title: 'Post added successfully', type: 'success' });
            router.push('/admin/blog');
        },
        onError: () => {
            toast({ title: 'Failed to add post', type: 'error' });
        },
    });

    return (
        <div className="p-4 md:p-8">
            <BlogPostForm onSubmit={async (data) => await createMutation.mutateAsync(data)} />
        </div>
    );
}

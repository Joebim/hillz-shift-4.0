'use client';

import { BlogPostForm } from '@/src/components/admin/blog/BlogPostForm';
import { BlogPost } from '@/src/types/blog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/src/contexts/ToastContext';
import { Spinner } from '@/src/components/ui/Loading';

export default function EditBlogPostPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: post, isLoading } = useQuery({
        queryKey: ['admin-blog-post', id],
        queryFn: async () => {
            const res = await fetch(`/api/blog/${id}`);
            if (!res.ok) throw new Error('Failed to fetch post');
            const json = await res.json();
            return json.data as BlogPost;
        },
        enabled: !!id,
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update post');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
            queryClient.invalidateQueries({ queryKey: ['admin-blog-post', id] });
            toast({ title: 'Post updated successfully', type: 'success' });
            router.push('/admin/blog');
        },
        onError: () => {
            toast({ title: 'Failed to update post', type: 'error' });
        },
    });

    if (isLoading) return <div className="flex justify-center p-12"><Spinner /></div>;
    if (!post) return <div className="p-8 text-center text-gray-500 font-medium">Post not found</div>;

    return (
        <div className="p-4 md:p-8">
            <BlogPostForm
                initialData={post}
                onSubmit={async (data) => await updateMutation.mutateAsync(data)}
            />
        </div>
    );
}

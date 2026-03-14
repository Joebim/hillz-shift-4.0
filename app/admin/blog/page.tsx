'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogPost } from '@/src/types/blog';
import { formatDate, cn } from '@/src/lib/utils';
import { useToast } from '@/src/contexts/ToastContext';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search, Plus, FileText, Eye, Calendar,
    MoreHorizontal, Trash2, Edit2, Tag,
    Clock, CheckCircle2, Pencil
} from 'lucide-react';
import { StatusBadge } from '@/src/components/admin/StatusBadge';
import { useConfirmModal } from '@/src/hooks/useConfirmModal';

export default function AdminBlogPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const confirmCheck = useConfirmModal();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: posts, isLoading } = useQuery<BlogPost[]>({
        queryKey: ['admin-blog'],
        queryFn: async () => {
            const res = await fetch('/api/blog');
            if (!res.ok) throw new Error('Failed to fetch posts');
            const json = await res.json();
            return json.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete post');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
            toast({ title: 'Post deleted successfully', type: 'success' });
        },
        onError: () => {
            toast({ title: 'Failed to delete post', type: 'error' });
        },
    });

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        confirmCheck.open({
            title: 'Delete Post',
            description: 'Are you sure you want to delete this blog post? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate(id)
        });
    };

    const filteredPosts = posts?.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            {}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center transition-transform hover:scale-105">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Blog Posts</h1>
                        <p className="text-xs text-gray-500 font-medium">Manage your articles and stories</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
                    <div className="relative flex-1 max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all placeholder:text-gray-400 shadow-sm/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link
                        href="/admin/blog/new"
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Post</span>
                    </Link>
                </div>
            </div>

            <main className="p-6 max-w-[1600px] mx-auto space-y-8">
                {}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Posts</p>
                            <p className="text-2xl font-bold text-gray-900">{posts?.length || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Published</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {posts?.filter(p => p.status === 'published').length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Pencil className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Drafts</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {posts?.filter(p => p.status === 'draft').length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 space-y-4 border border-gray-100 animate-pulse">
                                <div className="aspect-video bg-gray-100 rounded-xl w-full" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPosts?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No blog posts found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">Try adjusting your search terms or create a new blog post.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPosts?.map((post) => (
                            <Link
                                key={post.id}
                                href={`/admin/blog/${post.id}`}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {}
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    {post.featuredImage ? (
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <StatusBadge status={post.status} />
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-white text-[10px] font-bold bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                                                {post.publishedDate ? formatDate(post.publishedDate, 'short') : 'Draft'}
                                            </span>
                                            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 hover:bg-white hover:text-blue-600 transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                                {post.category || 'General'}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readingTime || '5 min'}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1" title={post.title}>
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                                            {post.excerpt || 'No excerpt available for this post.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                {post.author.name.charAt(0)}
                                            </div>
                                            <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">{post.author.name}</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(post.id, e)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sermon } from '@/src/types/sermon';
import { formatDate } from '@/src/lib/utils';
import { useToast } from '@/src/contexts/ToastContext';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search, Plus, Mic, Play, Calendar,
    MoreHorizontal, Trash2, Edit2, Eye
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useConfirmModal } from '@/src/hooks/useConfirmModal';

export default function AdminSermonsPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const confirmCheck = useConfirmModal();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: sermons, isLoading } = useQuery<Sermon[]>({
        queryKey: ['admin-sermons'],
        queryFn: async () => {
            const res = await fetch('/api/sermons');
            if (!res.ok) throw new Error('Failed to fetch sermons');
            const json = await res.json();
            return json.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/sermons/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete sermon');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
            toast({ title: 'Sermon deleted successfully', type: 'success' });
        },
        onError: () => {
            toast({ title: 'Failed to delete sermon', type: 'error' });
        },
    });

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        confirmCheck.open({
            title: 'Delete Sermon',
            description: 'Are you sure you want to delete this sermon? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate(id)
        });
    };

    const filteredSermons = sermons?.filter(sermon =>
        sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.series?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                        <Mic className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sermons</h1>
                        <p className="text-xs text-gray-500 font-medium">Manage your media library</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
                    <div className="relative flex-1 max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search sermons..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link
                        href="/admin/sermons/new"
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Upload Sermon</span>
                    </Link>
                </div>
            </div>

            <main className="p-6 max-w-[1600px] mx-auto space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                            <Mic className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Sermons</p>
                            <p className="text-2xl font-bold text-gray-900">{sermons?.length || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Views</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {sermons?.reduce((acc, s) => acc + (s.viewCount || 0), 0).toLocaleString() || 0}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Latest Upload</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">
                                {sermons?.[0] ? formatDate(sermons[0].date, 'short') : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
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
                ) : filteredSermons?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No sermons found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">Try adjusting your search terms or upload a new sermon to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSermons?.map((sermon) => (
                            <Link
                                key={sermon.id}
                                href={`/admin/sermons/${sermon.id}`}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    {sermon.thumbnailUrl ? (
                                        <Image
                                            src={sermon.thumbnailUrl}
                                            alt={sermon.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <Mic className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                                        <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                                            {formatDate(sermon.date, 'short')}
                                        </span>
                                    </div>
                                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 hover:bg-white hover:text-violet-600 hover:scale-110 transition-all">
                                            <Edit2 className="w-5 h-5 pl-0.5" />
                                        </div>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        {sermon.series && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                {sermon.series}
                                            </span>
                                        )}
                                        <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1 mb-1" title={sermon.title}>
                                            {sermon.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mb-3">{sermon.speaker}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>{sermon.viewCount || 0}</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(sermon.id, e)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Sermon"
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

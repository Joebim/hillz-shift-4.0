'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ministry } from '@/src/types/ministry';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/contexts/ToastContext';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search, Plus, Building, Users, Calendar,
    MoreHorizontal, Trash2, Edit2, MapPin,
    CheckCircle2, XCircle, User
} from 'lucide-react';
import { StatusBadge } from '@/src/components/admin/StatusBadge';
import { useConfirmModal } from '@/src/hooks/useConfirmModal';

export default function AdminMinistriesPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const confirmCheck = useConfirmModal();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: ministries, isLoading } = useQuery<Ministry[]>({
        queryKey: ['admin-ministries'],
        queryFn: async () => {
            const res = await fetch('/api/ministries');
            if (!res.ok) throw new Error('Failed to fetch ministries');
            const json = await res.json();
            return json.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/ministries/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete ministry');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-ministries'] });
            toast({ title: 'Ministry deleted successfully', type: 'success' });
        },
        onError: () => {
            toast({ title: 'Failed to delete ministry', type: 'error' });
        },
    });

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        confirmCheck.open({
            title: 'Delete Ministry',
            description: 'Are you sure you want to delete this ministry? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate(id)
        });
    };

    const filteredMinistries = ministries?.filter(ministry =>
        ministry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ministry.leader?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                        <Building className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Ministries</h1>
                        <p className="text-xs text-gray-500 font-medium">Manage your community groups</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
                    <div className="relative flex-1 max-w-sm hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search ministries..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link
                        href="/admin/ministries/new"
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Ministry</span>
                    </Link>
                </div>
            </div>

            <main className="p-6 max-w-[1600px] mx-auto space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:bg-gray-50/50">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Building className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Groups</p>
                            <p className="text-2xl font-bold text-gray-900">{ministries?.length || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:bg-gray-50/50">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {ministries?.filter(m => m.active).length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:bg-gray-50/50">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Leadership</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {[...new Set(ministries?.map(m => m.leader?.name).filter(Boolean))].length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 space-y-4 border border-gray-100 animate-pulse">
                                <div className="h-40 bg-gray-100 rounded-xl w-full" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMinistries?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No ministries found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">Try adjusting your search terms or create a new ministry.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMinistries?.map((ministry) => (
                            <Link
                                key={ministry.id}
                                href={`/admin/ministries/${ministry.id}`}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
                            >
                                {/* Cover Photo or Icon */}
                                <div className="relative h-40 bg-linear-to-br from-indigo-500 to-indigo-700 overflow-hidden">
                                    {ministry.image ? (
                                        <Image
                                            src={ministry.image}
                                            alt={ministry.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Building className="w-20 h-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
                                            {ministry.icon || '⛪'}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full ring-4 ring-black/10",
                                            ministry.active ? "bg-emerald-400" : "bg-red-400"
                                        )} />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-white text-[10px] font-bold bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 uppercase tracking-widest">
                                                {(ministry as any).category || 'Ministry'}
                                            </span>
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl hover:scale-110 transition-transform">
                                                <Edit2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-lg mb-1" title={ministry.name}>
                                            {ministry.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed h-8">
                                            {ministry.description || 'Dedicated to spiritual growth and community service.'}
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                                                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                                <span className="truncate">{ministry.meetingSchedule || 'Contact for schedule'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                                                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                                <span className="truncate">{ministry.location || 'Multiple Locations'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-5">
                                        <div className="flex items-center gap-2.5">
                                            {ministry.leader?.photo ? (
                                                <Image
                                                    src={ministry.leader.photo}
                                                    alt={ministry.leader.name}
                                                    width={28}
                                                    height={28}
                                                    className="rounded-full ring-2 ring-slate-100"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                    <User className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-0.5">Leader</span>
                                                <span className="text-xs text-slate-700 font-bold truncate max-w-[120px]">{ministry.leader?.name || 'Unassigned'}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(ministry.id, e)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Ministry"
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

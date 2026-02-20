
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Search, Loader2, Image as ImageIcon, Video, 
    Check, Trash2, X, Upload, Info, 
    Copy, ExternalLink, Filter, Grid, List as ListIcon,
    File, FileVideo, FileImage, Calendar, Box
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { useConfirmModal } from '@/src/hooks/useConfirmModal';
import { useToast } from '@/src/contexts/ToastContext';
import { format } from 'date-fns';

export interface Media {
    _id: string;
    public_id: string;
    url: string;
    secure_url: string;
    format: string;
    resource_type: string;
    width: number;
    height: number;
    bytes: number;
    createdAt: string;
    folder: string;
}

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    multiple?: boolean;
}

export function MediaLibrary({ onSelect, selectionMode = false }: { onSelect?: (url: string) => void, selectionMode?: boolean }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const queryClient = useQueryClient();
    const confirmCheck = useConfirmModal();
    const { toast } = useToast();

    // Fetch Media
    const { data: mediaList, isLoading } = useQuery({
        queryKey: ['uploads', searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            const res = await fetch(`/api/uploads?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch media');
            const json = await res.json();
            return json.data as Media[];
        }
    });

    // Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: async (files: File[]) => {
            const promises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', 'hillz-shift/uploads');

                const res = await fetch('/api/uploads', {
                    method: 'POST',
                    body: formData,
                });
                if (!res.ok) throw new Error('Upload failed');
                return res.json();
            });
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] });
            toast({ title: 'Upload successful', type: 'success' });
        },
        onError: () => {
            toast({ title: 'Upload failed', type: 'error' });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/uploads/${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Delete failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] });
            setSelectedMedia(null);
            toast({ title: 'File deleted', type: 'success' });
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            uploadMutation.mutate(files);
        }
    };

    const handleDelete = (id: string) => {
        confirmCheck.open({
            title: 'Delete Asset?',
            description: 'This file will be permanently removed from Cloudinary. This action cannot be undone.',
            confirmText: 'Delete Forever',
            variant: 'danger',
            onConfirm: () => {
                deleteMutation.mutate(id);
            }
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'URL Copied', type: 'success' });
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="flex h-full bg-white transition-all overflow-hidden">
            {/* Left Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-gray-100">
                {/* Header / Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or tag..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/10 placeholder:text-gray-400 font-medium transition-all"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-1.5 rounded-lg transition-all",
                                    viewMode === 'grid' ? "bg-white text-violet-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-1.5 rounded-lg transition-all",
                                    viewMode === 'list' ? "bg-white text-violet-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-violet-600 text-white px-5 py-2 rounded-2xl text-sm font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />
                            <Upload className="w-4 h-4" />
                            <span>Upload Asset</span>
                        </label>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Box className="w-4 h-4 text-violet-200" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">Scanning library...</p>
                        </div>
                    ) : mediaList?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-gray-100 mb-6 group hover:rotate-6 transition-transform">
                                <ImageIcon className="w-10 h-10 text-gray-200 group-hover:text-violet-200 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Empty Gallery</h4>
                            <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed">
                                You haven&apos;t uploaded any media yet. Use the upload button to get started.
                            </p>
                        </div>
                    ) : (
                        <div className={cn(
                            viewMode === 'grid' 
                                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-6"
                                : "flex flex-col gap-2"
                        )}>
                            {uploadMutation.isPending && (
                                <div className="aspect-square bg-white rounded-3xl border border-dashed border-violet-300 flex items-center justify-center flex-col gap-2 animate-pulse overflow-hidden relative">
                                    <div className="absolute inset-0 bg-violet-50/30 backdrop-blur-[1px]" />
                                    <Loader2 className="w-6 h-6 animate-spin text-violet-600 relative z-10" />
                                    <span className="text-[10px] text-violet-600 font-bold uppercase relative z-10">Uploading...</span>
                                </div>
                            )}
                            {mediaList?.map((media) => (
                                <div
                                    key={media._id}
                                    className={cn(
                                        "group rounded-3xl overflow-hidden transition-all cursor-pointer relative",
                                        viewMode === 'grid' ? "aspect-square" : "flex items-center gap-4 p-3 bg-white border border-transparent shadow-sm hover:border-violet-100",
                                        selectedMedia?._id === media._id 
                                            ? viewMode === 'grid' ? "ring-4 ring-violet-500/20" : "bg-violet-50/50 border-violet-200"
                                            : "hover:shadow-xl hover:shadow-gray-200/50"
                                    )}
                                    onClick={() => {
                                        setSelectedMedia(media);
                                        if (onSelect) onSelect(media.secure_url);
                                    }}
                                >
                                    {viewMode === 'grid' ? (
                                        <>
                                            <div className="w-full h-full bg-white relative">
                                                {media.resource_type === 'video' ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                        <video src={media.secure_url} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                                                            <FileVideo className="w-8 h-8 text-white drop-shadow-lg" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={media.secure_url}
                                                        alt={media.public_id}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-110 duration-500"
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                    />
                                                )}
                                                
                                                {/* Selection Badge */}
                                                <div className={cn(
                                                    "absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all",
                                                    selectedMedia?._id === media._id ? "bg-violet-600 scale-110" : "bg-black/20 opacity-0 group-hover:opacity-100"
                                                )}>
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>

                                                {/* Meta Overlay */}
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white text-[10px] font-bold uppercase tracking-wider truncate mb-1">{media.public_id.split('/').pop()}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/80 text-[8px] font-medium">{media.format.toUpperCase()} • {media.width}x{media.height}</span>
                                                        <span className="text-white/80 text-[8px] font-medium">{formatSize(media.bytes)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-gray-100 shrink-0">
                                                {media.resource_type === 'video' ? (
                                                    <FileVideo className="w-full h-full p-3 text-gray-400" />
                                                ) : (
                                                    <Image src={media.secure_url} alt="" fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm font-bold text-gray-900 truncate">{media.public_id.split('/').pop()}</h5>
                                                <p className="text-[10px] text-gray-500 flex gap-2">
                                                    <span>{media.format.toUpperCase()}</span>
                                                    <span>•</span>
                                                    <span>{media.width}x{media.height}</span>
                                                    <span>•</span>
                                                    <span>{formatSize(media.bytes)}</span>
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-gray-400 text-[10px] font-medium px-4">
                                                {format(new Date(media.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Details */}
            <div className={cn(
                "w-80 bg-white flex flex-col transition-all duration-300 transform",
                selectedMedia ? "translate-x-0" : "translate-x-full absolute right-0"
            )}>
                {selectedMedia ? (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                            <h4 className="font-bold text-gray-900">Asset Details</h4>
                            <button 
                                onClick={() => setSelectedMedia(null)}
                                className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Preview */}
                            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-50 relative border border-gray-100 shadow-inner">
                                {selectedMedia.resource_type === 'video' ? (
                                    <video src={selectedMedia.secure_url} controls className="w-full h-full object-contain" />
                                ) : (
                                    <Image 
                                        src={selectedMedia.secure_url} 
                                        alt="" 
                                        fill 
                                        className="object-contain p-2" 
                                    />
                                )}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => copyToClipboard(selectedMedia.secure_url)}
                                    className="flex items-center justify-center gap-2 p-3 bg-violet-50 text-violet-700 rounded-2xl text-xs font-bold hover:bg-violet-100 transition-colors active:scale-95"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy URL
                                </button>
                                <a 
                                    href={selectedMedia.secure_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors active:scale-95"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    View Full
                                </a>
                            </div>

                            {/* Metadata */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Info className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Metadata</span>
                                </div>
                                
                                <MetadataItem icon={File} label="File Name" value={selectedMedia.public_id.split('/').pop() || ''} />
                                <MetadataItem icon={ImageIcon} label="Dimensions" value={`${selectedMedia.width} × ${selectedMedia.height}`} />
                                <MetadataItem icon={Box} label="File Size" value={formatSize(selectedMedia.bytes)} />
                                <MetadataItem icon={Calendar} label="Uploaded At" value={format(new Date(selectedMedia.createdAt), 'MMM d, yyyy HH:mm')} />
                                <MetadataItem icon={Check} label="Extension" value={selectedMedia.format.toUpperCase()} />
                            </div>

                            <button 
                                onClick={() => handleDelete(selectedMedia.public_id)}
                                className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-4 opacity-50">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <Box className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Select an asset to view its detailed properties and actions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function MetadataItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-gray-400 font-bold uppercase">{label}</span>
                <span className="text-xs text-gray-700 font-bold truncate">{value}</span>
            </div>
        </div>
    );
}

// Modal Wrapper for Usage in Forms
export function UploadModal({ isOpen, onClose, onSelect }: UploadModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Select Asset</h3>
                            <p className="text-xs text-gray-400 font-medium">Choose a file from your library or upload a new one.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <MediaLibrary onSelect={(url) => {
                        onSelect(url);
                        onClose();
                    }} selectionMode={true} />
                </div>
            </div>
        </div>
    );
}


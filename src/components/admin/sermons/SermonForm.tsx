'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sermon } from '@/src/types/sermon';
import { createSermonSchema } from '@/src/schemas/sermon.schema';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Card } from '@/src/components/ui/Card';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/src/contexts/ToastContext';
import { toJsDate, cn } from '@/src/lib/utils';
import { z } from 'zod';
import {
    Mic, Video, Music, Calendar,
    Type, AlignLeft, Image as ImageIcon,
    Settings, Sparkles, ChevronLeft, Save
} from 'lucide-react';

type SermonFormData = z.infer<typeof createSermonSchema>;

interface SermonFormProps {
    initialData?: Sermon;
    onSubmit: (data: SermonFormData) => Promise<void>;
    isLoading?: boolean;
}

export const SermonForm = ({ initialData, onSubmit, isLoading }: SermonFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SermonFormData>({
        resolver: zodResolver(createSermonSchema),
        defaultValues: (initialData ? {
            ...initialData,
            date: toJsDate(initialData.date).toISOString().slice(0, 16), // datetime-local format
        } : {
            mediaType: 'video',
            status: 'draft',
            date: new Date().toISOString().slice(0, 16),
            speaker: 'Pastor',
            featured: false,
        }) as unknown as SermonFormData,
    });

    const thumbnailUrl = watch('thumbnailUrl');
    const mediaType = watch('mediaType');

    const submitHandler = async (data: SermonFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                title: 'Error',
                description: 'Failed to save sermon. Please check your inputs.',
                type: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="max-w-6xl mx-auto pb-20">
            {/* Header / Actions Sidebar alternative - Sticky bar */}
            <div className="flex items-center justify-between mb-8 sticky top-0 z-30 bg-gray-50/80 backdrop-blur-md py-4 border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {initialData ? 'Edit Sermon' : 'Add New Sermon'}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            {initialData ? `Modify: ${initialData.title}` : 'Upload a new message to the library'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting || isLoading}
                        className="hidden sm:flex border-gray-200 hover:bg-white"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting || isLoading}
                        className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200 rounded-xl px-6"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <Card variant="glass" padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-violet-600">
                            <Type className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-gray-900">General Information</h3>
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="Sermon Title"
                                placeholder="Enter a descriptive title..."
                                {...register('title')}
                                error={errors.title?.message}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Speaker / Minister"
                                    placeholder="Who delivered the message?"
                                    {...register('speaker')}
                                    error={errors.speaker?.message}
                                    required
                                />
                                <Input
                                    label="Sermon Series"
                                    placeholder="e.g. Kingdom Living (Optional)"
                                    {...register('series')}
                                    error={errors.series?.message}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Date & Time Preached"
                                    type="datetime-local"
                                    {...register('date')}
                                    error={errors.date?.message}
                                    required
                                />
                                <Input
                                    label="Scripture Reference"
                                    placeholder="e.g. John 3:16-17"
                                    {...register('scripture')}
                                    error={errors.scripture?.message}
                                    required
                                />
                            </div>

                            <Textarea
                                label="Description"
                                rows={6}
                                placeholder="Write a summary of the sermon..."
                                {...register('description')}
                                error={errors.description?.message}
                                required
                            />
                        </div>
                    </Card>

                    {/* Media Content */}
                    <Card variant="glass" padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-violet-600">
                            <Video className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-gray-900">Media & Resources</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="YouTube / Vimeo Video URL"
                                    placeholder="https://youtube.com/watch?v=..."
                                    {...register('videoUrl')}
                                    error={errors.videoUrl?.message}
                                />
                                <Input
                                    label="Audio File URL (MP3)"
                                    placeholder="https://cdn.example.com/audio.mp3"
                                    {...register('audioUrl')}
                                    error={errors.audioUrl?.message}
                                />
                            </div>

                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Media Type</label>
                                <div className="flex flex-wrap gap-3">
                                    {['video', 'audio', 'both'].map((type) => (
                                        <label
                                            key={type}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border-2 transition-all",
                                                mediaType === type
                                                    ? "bg-violet-50 border-violet-200 text-violet-700 shadow-sm shadow-violet-100"
                                                    : "bg-white border-transparent hover:border-gray-100 text-gray-500"
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                value={type}
                                                {...register('mediaType')}
                                                className="hidden"
                                            />
                                            <span className="capitalize font-bold text-sm">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Thumbnail */}
                    <Card variant="glass" padding="md">
                        <div className="flex items-center gap-2 mb-4 text-violet-600">
                            <ImageIcon className="w-5 h-5" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Thumbnail</h3>
                        </div>
                        <ImageUpload
                            value={thumbnailUrl}
                            onChange={(url) => setValue('thumbnailUrl', url)}
                            folder="sermons/thumbnails"
                            aspectRatio="video"
                        />
                        {errors.thumbnailUrl && (
                            <p className="text-red-500 text-xs mt-2 font-medium">{errors.thumbnailUrl.message}</p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-3 italic leading-relaxed">
                            Recommended: 1280x720px (16:9). This image will represent the sermon in the library.
                        </p>
                    </Card>

                    {/* Settings Card */}
                    <Card variant="glass" padding="md">
                        <div className="flex items-center gap-2 mb-4 text-violet-600">
                            <Settings className="w-5 h-5" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Publishing</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-violet-100 transition-colors group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">Featured</span>
                                    <span className="text-[10px] text-gray-500">Show on homepage</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('featured')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                </div>
                            </div>

                            <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100/50">
                                <div className="flex gap-2 text-violet-600 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Visibility Hint</span>
                                </div>
                                <p className="text-[10px] text-violet-900/70 leading-relaxed font-medium">
                                    Marking a sermon as featured will place it in the hero or spotlight section of the public website.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
};

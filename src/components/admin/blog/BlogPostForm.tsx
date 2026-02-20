'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogPost } from '@/src/types/blog';
import { createBlogPostSchema } from '@/src/schemas/blog.schema';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Card } from '@/src/components/ui/Card';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toJsDate, cn } from '@/src/lib/utils';
import { useToast } from '@/src/contexts/ToastContext';
import { z } from 'zod';
import {
    FileText, Image as ImageIcon, Tag,
    Calendar, User, Settings, Sparkles,
    ChevronLeft, Save, Globe, Info
} from 'lucide-react';

type BlogFormData = z.infer<typeof createBlogPostSchema>;

interface BlogPostFormProps {
    initialData?: BlogPost;
    onSubmit: (data: BlogFormData) => Promise<void>;
    isLoading?: boolean;
}

export const BlogPostForm = ({ initialData, onSubmit, isLoading }: BlogPostFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tagInput, setTagInput] = useState(initialData?.tags?.join(', ') || '');

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BlogFormData>({
        resolver: zodResolver(createBlogPostSchema),
        defaultValues: (initialData ? {
            ...initialData,
            publishedDate: initialData.publishedDate ? toJsDate(initialData.publishedDate).toISOString().slice(0, 16) : undefined,
        } : {
            status: 'draft',
            publishedDate: new Date().toISOString().slice(0, 16),
            author: {
                id: 'admin',
                name: 'Admin User',
            },
            tags: [],
        }) as unknown as BlogFormData,
    });

    const featuredImage = watch('featuredImage');
    const status = watch('status');

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        setValue('tags', tags);
    };

    const submitHandler = async (data: BlogFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                title: 'Error',
                description: 'Failed to save post. Please check your inputs.',
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
                            {initialData ? 'Edit Blog Post' : 'New Article'}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            {initialData ? `Editing: ${initialData.title}` : 'Draft a new story for the community'}
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
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl px-6"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Post
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <Card variant="glass" padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <FileText className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-gray-900">Article Content</h3>
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="Post Title"
                                placeholder="Enter a catchy title..."
                                {...register('title')}
                                error={errors.title?.message}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Category"
                                    placeholder="e.g. Community, Faith..."
                                    {...register('category')}
                                    error={errors.category?.message}
                                    required
                                />
                                <Input
                                    label="Tags (split by comma)"
                                    placeholder="news, events, church"
                                    value={tagInput}
                                    onChange={handleTagsChange}
                                    error={errors.tags?.message}
                                />
                            </div>

                            <Textarea
                                label="Excerpt / Summary"
                                rows={3}
                                placeholder="Write a short summary to hook readers..."
                                {...register('excerpt')}
                                error={errors.excerpt?.message}
                                required
                            />

                            <Textarea
                                label="Main Body Content"
                                rows={20}
                                placeholder="Tell your story... Markdown is supported."
                                {...register('content')}
                                error={errors.content?.message}
                                required
                                className="font-mono text-sm leading-relaxed"
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Thumbnail */}
                    <Card variant="glass" padding="md">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <ImageIcon className="w-5 h-5" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Cover Image</h3>
                        </div>
                        <ImageUpload
                            value={featuredImage}
                            onChange={(url) => setValue('featuredImage', url)}
                            folder="blog/covers"
                            aspectRatio="wide"
                        />
                        {errors.featuredImage && (
                            <p className="text-red-500 text-xs mt-2 font-medium">{errors.featuredImage?.message}</p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-3 italic leading-relaxed">
                            Recommended: 1200x630px. This image will be shown at the top of the post and in search results.
                        </p>
                    </Card>

                    {/* Settings Card */}
                    <Card variant="glass" padding="md">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <Globe className="w-5 h-5" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Publishing</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Article Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['draft', 'published'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setValue('status', s as any)}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                                                status === s
                                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                                    : "bg-white border-transparent text-gray-400 hover:border-gray-100"
                                            )}
                                        >
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Input
                                label="Published Date"
                                type="datetime-local"
                                {...register('publishedDate')}
                                error={errors.publishedDate?.message}
                                className="text-sm"
                            />

                            <Input
                                label="Author Display Name"
                                {...register('author.name')}
                                error={errors.author?.name?.message}
                                required
                                className="text-sm"
                            />

                            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                <div className="flex gap-2 text-blue-600 mb-2">
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Visibility Tip</span>
                                </div>
                                <p className="text-[10px] text-blue-900/70 leading-relaxed font-medium">
                                    Set status to "Published" to make this post visible to all visitors on the public blog.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
};

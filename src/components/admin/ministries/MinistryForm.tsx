'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ministry } from '@/src/types/ministry';
import { createMinistrySchema } from '@/src/schemas/ministry.schema';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Card } from '@/src/components/ui/Card';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/src/contexts/ToastContext';
import { cn } from '@/src/lib/utils';
import { z } from 'zod';
import {
    Users, Image as ImageIcon, Sparkles,
    Settings, ChevronLeft, Save, Info,
    Clock, MapPin, Mail, Smile
} from 'lucide-react';

type MinistryFormData = z.infer<typeof createMinistrySchema>;

interface MinistryFormProps {
    initialData?: Ministry;
    onSubmit: (data: MinistryFormData) => Promise<void>;
    isLoading?: boolean;
}

export const MinistryForm = ({ initialData, onSubmit, isLoading }: MinistryFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MinistryFormData>({
        resolver: zodResolver(createMinistrySchema),
        defaultValues: (initialData || {
            active: true,
            order: 0,
            leader: {
                name: '',
                role: 'Team Lead',
                email: '',
            },
        }) as unknown as MinistryFormData,
    });

    const active = watch('active');
    const image = watch('image');

    const submitHandler = async (data: MinistryFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                title: 'Error',
                description: 'Failed to save ministry. Please check your inputs.',
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
                            {initialData ? 'Edit Ministry' : 'Add Ministry'}
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            {initialData ? `Configuring: ${initialData.name}` : 'Create a new ministry group or outreach'}
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
                        className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-xl px-6"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Ministry
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <Card variant="glass" padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <Users className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-gray-900">Ministry Overview</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-3">
                                    <Input
                                        label="Ministry Name"
                                        placeholder="e.g. Worship Team, Youth Ministry..."
                                        {...register('name')}
                                        error={errors.name?.message}
                                        required
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Icon (Emoji)"
                                        placeholder="🙌"
                                        {...register('icon')}
                                        error={errors.icon?.message}
                                        className="text-center text-xl"
                                    />
                                </div>
                            </div>

                            <Textarea
                                label="Description"
                                rows={4}
                                placeholder="Describe the purpose and goals of this ministry..."
                                {...register('description')}
                                error={errors.description?.message}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Schedule</span>
                                    </div>
                                    <Input
                                        placeholder="Every Sunday at 10AM"
                                        {...register('meetingSchedule')}
                                        error={errors.meetingSchedule?.message}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                                    </div>
                                    <Input
                                        placeholder="Main Sanctuary"
                                        {...register('location' as any)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Leadership */}
                    <Card variant="glass" padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <Smile className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-gray-900">Leadership Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Leader Name"
                                placeholder="FullName"
                                {...register('leader.name')}
                                error={errors.leader?.name?.message}
                                required
                            />
                            <Input
                                label="Leader Role"
                                placeholder="e.g. Team Lead"
                                {...register('leader.role')}
                                error={errors.leader?.role?.message}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Contact Email"
                                    placeholder="leader@church.org"
                                    {...register('leader.email')}
                                    error={errors.leader?.email?.message}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Thumbnail */}
                    <Card variant="glass" padding="md">
                        <div className="flex items-center gap-2 mb-4 text-emerald-600">
                            <ImageIcon className="w-5 h-5" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Cover Media</h3>
                        </div>
                        <ImageUpload
                            value={image}
                            onChange={(url) => setValue('image', url)}
                            folder="ministries/covers"
                            aspectRatio="wide"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-2 font-medium">{errors.image.message}</p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-3 italic leading-relaxed">
                            A high-quality cover photo representing the ministry group.
                        </p>
                    </Card>

                    {/* Settings Card */}
                    <Card variant="glass" padding="md">
                        <div className="flex items-center gap-2 mb-4 text-emerald-600">
                            <Settings className="w-5 h-5" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Status & Order</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-100 transition-colors group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">Active</span>
                                    <span className="text-[10px] text-gray-500">Visible to public</span>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('active')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </div>
                            </div>

                            <Input
                                label="Display Order"
                                type="number"
                                {...register('order', { valueAsNumber: true })}
                                className="text-sm"
                            />

                            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                <div className="flex gap-2 text-emerald-600 mb-2">
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Visibility</span>
                                </div>
                                <p className="text-[10px] text-emerald-900/70 leading-relaxed font-medium">
                                    Inactive ministries are hidden from the public website but remain editable in the admin dashboard.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
};

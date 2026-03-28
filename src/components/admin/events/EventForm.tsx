'use client';

import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Event } from '@/src/types/event';
import { createEventSchema } from '@/src/schemas/event.schema';
import { Button } from '@/src/components/ui/Button';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/src/contexts/ToastContext';
import { toJsDate, cn } from '@/src/lib/utils';
import { z } from 'zod';
import {
    Plus, Trash2, Link as LinkIcon, User, Image as ImageIcon,
    Calendar, Radio, ClipboardList, ChevronRight, AlignLeft,
    Hash, MapPin, Save, X, Check, Mail, BookOpen
} from 'lucide-react';
import { DynamicFormBuilder } from './DynamicFormBuilder';
import { MapboxSelector } from './MapboxSelector';

type EventFormData = z.infer<typeof createEventSchema>;

interface EventFormProps {
    initialData?: Event;
    onSubmit: (data: EventFormData) => Promise<void>;
    isLoading?: boolean;
}

const NAV_SECTIONS = [
    { id: 'visuals', label: 'Visuals', icon: ImageIcon },
    { id: 'details', label: 'Details', icon: AlignLeft },
    { id: 'schedule', label: 'Schedule & Venue', icon: Calendar },
    { id: 'ministers', label: 'Ministers', icon: User },
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'registration', label: 'Registration', icon: ClipboardList },
    { id: 'invitation', label: 'Invitation', icon: Mail },
];

function Section({ id, title, icon: Icon, children, action }: {
    id: string; title: string; icon: React.ElementType;
    children: React.ReactNode; action?: React.ReactNode;
}) {
    return (
        <div id={id} className="scroll-mt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-violet-600" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                </div>
                {action}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-5">
                {children}
            </div>
        </div>
    );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            {children}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
}

function Select({ label, required, error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string; required?: boolean; error?: string;
}) {
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <select
                className={cn(
                    'w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                )}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function ColorField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 hover:border-gray-300 transition-colors">
                <input
                    type="color"
                    value={value || '#7C3AED'}
                    onChange={e => onChange(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-sm text-gray-600 font-mono">{value || '#7C3AED'}</span>
            </div>
        </div>
    );
}

function FormInput({ label, required, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string; required?: boolean; error?: string;
}) {
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <input
                className={cn(
                    'w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function FormTextarea({ label, required, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string; required?: boolean; error?: string;
}) {
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <textarea
                className={cn(
                    'w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative w-10 h-6 rounded-full transition-colors duration-200',
                    checked ? 'bg-violet-600' : 'bg-gray-200'
                )}
            >
                <div className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                    checked ? 'translate-x-5' : 'translate-x-1'
                )} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    );
}

export const EventForm = ({ initialData, onSubmit, isLoading }: EventFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('visuals');
    const [isMapOpen, setIsMapOpen] = useState(false);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<EventFormData>({
        resolver: zodResolver(createEventSchema),
        defaultValues: (initialData ? {
            ...initialData,
            startDate: initialData.startDate ? toJsDate(initialData.startDate).toISOString().slice(0, 16) : undefined,
            endDate: initialData.endDate ? toJsDate(initialData.endDate).toISOString().slice(0, 16) : undefined,
            registrationOpenDate: initialData.registrationOpenDate ? toJsDate(initialData.registrationOpenDate).toISOString().slice(0, 16) : undefined,
            registrationCloseDate: initialData.registrationCloseDate ? toJsDate(initialData.registrationCloseDate).toISOString().slice(0, 16) : undefined,
        } : {
            status: 'draft',
            category: 'service',
            title: '',
            shortDescription: '',
            description: '',
            footerText: '',
            bannerText: '',
            startDate: '',
            endDate: '',
            registrationConfig: { enabled: false },
            invitationConfig: { enabled: false, fields: [] },
            branding: { primaryColor: '#7C3AED' },
            featured: false,
            channels: [],
            contacts: [],
            links: [],
            tags: [],
            venue: {
                name: '',
                address: '',
                city: '',
                country: '',
            },
            ministers: [],
            faqs: [],
            schedule: [],
            sponsors: [],
            mediaLinks: {},
        }) as unknown as EventFormData,
    });

    const { fields: channelFields, append: appendChannel, remove: removeChannel } = useFieldArray({ control, name: 'channels' });
    const { fields: ministerFields, append: appendMinister, remove: removeMinister } = useFieldArray({ control, name: 'ministers' });

    const handleStringArrayChange = (field: 'contacts' | 'links', value: string) => {
        setValue(field, value.split(',').map(s => s.trim()).filter(Boolean));
    };

    useEffect(() => {
        const observer = new IntersectionObserver(

            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.3, rootMargin: '-60px 0px -60% 0px' }
        );
        document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(id);
    };

    const registrationEnabled = watch('registrationConfig.enabled');
    const invitationEnabled = watch('invitationConfig.enabled');

    const onError = (errors: FieldErrors<EventFormData>) => {
        const errorDetails = Object.entries(errors).map(([key, value]) => `${key}: ${(value as { message?: string })?.message || 'Invalid'}`).join(', ');

        toast({
            title: 'Validation Error',
            description: `Please check errors: ${errorDetails}`,
            type: 'error'
        });

        const firstErrorSection = NAV_SECTIONS.find(section => hasError(section.id));
        if (firstErrorSection) {
            scrollTo(firstErrorSection.id);
        }
    };

    const submitHandler = async (data: EventFormData) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save event.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasError = (sectionId: string) => {
        switch (sectionId) {
            case 'visuals':
                return !!(errors.branding);
            case 'details':
                return !!(errors.title || errors.status || errors.category || errors.shortDescription || errors.description || errors.footerText || errors.bannerText || errors.theme || errors.themeBibleVerse || errors.eventBibleVerse || errors.tags || errors.featured || errors.contacts || errors.links);
            case 'schedule':
                return !!(errors.startDate || errors.endDate || errors.venue);
            case 'ministers':
                return !!(errors.ministers);
            case 'channels':
                return !!(errors.channels);
            case 'registration':
                return !!(errors.registrationConfig || errors.registrationOpenDate || errors.registrationCloseDate);
            default:
                return false;
        }
    };

    return (
        <div className="flex gap-0 min-h-screen">

            {}
            <aside className="hidden lg:flex w-52 shrink-0 flex-col sticky top-0 self-start h-screen pt-4 pr-4">
                <nav className="flex-1 space-y-0.5">
                    {NAV_SECTIONS.map(({ id, label, icon: Icon }) => {
                        const isError = hasError(id);
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => scrollTo(id)}
                                className={cn(
                                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150 relative',
                                    activeSection === id
                                        ? 'bg-violet-600 text-white shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
                                    isError && activeSection !== id && 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                )}
                            >
                                <Icon className={cn("w-4 h-4 shrink-0", isError && activeSection !== id ? "text-red-500" : "")} />
                                {label}
                                {isError && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
                                )}
                                {activeSection === id && !isError && <ChevronRight className="w-3 h-3 ml-auto" />}
                            </button>
                        );
                    })}
                </nav>

                {}
                <div className="pb-6 pt-4 space-y-2 border-t border-gray-100 mt-4">
                    <button
                        type="button"
                        onClick={handleSubmit(submitHandler, onError)}
                        disabled={isSubmitting || isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-sm shadow-violet-200 disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting || isLoading ? 'Saving…' : (initialData ? 'Update' : 'Create')}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </aside>

            {}
            <form
                onSubmit={handleSubmit(submitHandler, onError)}
                className="flex-1 min-w-0 space-y-6 pb-32 lg:pb-8"
            >

                {}
                <div id="visuals" data-section="visuals" className="scroll-mt-4">
                    <Section id="visuals-inner" title="Event Visuals" icon={ImageIcon}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {}
                            <div className="md:col-span-2">
                                <FieldLabel>Banner Image</FieldLabel>
                                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                                    <ImageUpload
                                        value={watch('branding.bannerImage')}
                                        onChange={(url) => setValue('branding.bannerImage', url)}
                                        folder="events/banners"
                                    />
                                </div>
                                {errors.branding?.bannerImage?.message && (
                                    <p className="text-xs text-red-500 mt-1">{errors.branding.bannerImage.message}</p>
                                )}
                            </div>
                            {}
                            <div>
                                <FieldLabel>Thumbnail</FieldLabel>
                                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square max-w-[160px]">
                                    <ImageUpload
                                        value={watch('branding.thumbnail')}
                                        onChange={(url) => setValue('branding.thumbnail', url)}
                                        folder="events/thumbnails"
                                        aspectRatio="square"
                                    />
                                </div>
                                {errors.branding?.thumbnail?.message && (
                                    <p className="text-xs text-red-500 mt-1">{errors.branding.thumbnail.message}</p>
                                )}
                            </div>
                        </div>
                        {}
                        <div>
                            <FieldLabel>Brand Colours</FieldLabel>
                            <div className="grid grid-cols-3 gap-3">
                                <ColorField label="Primary" value={watch('branding.primaryColor')} onChange={v => setValue('branding.primaryColor', v)} />
                                <ColorField label="Secondary" value={watch('branding.secondaryColor')} onChange={v => setValue('branding.secondaryColor', v)} />
                                <ColorField label="Accent" value={watch('branding.accentColor')} onChange={v => setValue('branding.accentColor', v)} />
                            </div>
                        </div>
                    </Section>
                </div>

                {}
                <div id="details" data-section="details" className="scroll-mt-4">
                    <Section id="details-inner" title="Event Details" icon={AlignLeft}>
                        {}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <FormInput
                                    label="Event Title"
                                    required
                                    placeholder="e.g. Leadership Conference 2025"
                                    error={errors.title?.message}
                                    {...register('title')}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Select label="Status" {...register('status')}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
                                </Select>
                                <Select label="Category" {...register('category')}>
                                    <option value="service">Service</option>
                                    <option value="conference">Conference</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="retreat">Retreat</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="other">Other</option>
                                </Select>
                            </div>
                        </div>

                        {}
                        <FormInput
                            label="Short Description"
                            placeholder="Brief summary shown on cards…"
                            maxLength={200}
                            error={errors.shortDescription?.message}
                            {...register('shortDescription')}
                        />

                        {}
                        <FormInput
                            label="Banner Text"
                            placeholder="A very short message for the top page banner…"
                            error={errors.bannerText?.message}
                            {...register('bannerText')}
                        />

                        {}
                        <FormTextarea
                            label="Full Description"
                            required
                            rows={5}
                            placeholder="Detailed information about this event…"
                            error={errors.description?.message}
                            {...register('description')}
                        />
                        <FormTextarea
                            label="Footer Text"
                            rows={3}
                            placeholder="A short message shown in the page footer for this event…"
                            error={errors.footerText?.message}
                            {...register('footerText')}
                        />

                        {}
                        <div className="bg-violet-50 rounded-xl p-4 border border-violet-100 space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="w-4 h-4 text-violet-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Theme & Scripture</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormInput label="Event Theme" placeholder="e.g. Visionary Leadership" {...register('theme')} />
                                <FormInput label="Theme Bible Verse" placeholder="e.g. Proverbs 11:14" {...register('themeBibleVerse')} />
                                <div className="md:col-span-2">
                                    <FormInput label="Event Bible Verse" placeholder="e.g. Proverbs 11:14" {...register('eventBibleVerse')} />
                                </div>
                            </div>
                        </div>

                        {}
                        <div>
                            <FieldLabel>Tags</FieldLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {watch('tags')?.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full">
                                        <Hash className="w-2.5 h-2.5" />{tag}
                                        <button type="button" onClick={() => {
                                            const tags = watch('tags') || [];
                                            setValue('tags', tags.filter((_, idx) => idx !== i));
                                        }}>
                                            <X className="w-3 h-3 hover:text-violet-900" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                                placeholder="Type a tag and press Enter"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val) {
                                            setValue('tags', [...(watch('tags') || []), val]);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />
                        </div>

                        {}
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Membership Form</p>
                                <p className="text-xs text-gray-400 mt-0.5">Use this event as the primary &quot;JOIN US&quot; registration</p>
                            </div>
                            <Toggle
                                checked={watch('isMembershipForm') || false}
                                onChange={v => setValue('isMembershipForm', v)}
                                label=""
                            />
                        </div>

                        {}
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Featured Event</p>
                                <p className="text-xs text-gray-400 mt-0.5">Pin this event to the top of listings</p>
                            </div>
                            <Toggle
                                checked={watch('featured') || false}
                                onChange={v => setValue('featured', v)}
                                label=""
                            />
                        </div>

                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormTextarea
                                label="Contacts (comma separated)"
                                rows={2}
                                placeholder="email@example.com, +1234567890"
                                onChange={e => handleStringArrayChange('contacts', e.target.value)}
                                defaultValue={initialData?.contacts?.join(', ')}
                            />
                            <FormTextarea
                                label="External Links (comma separated)"
                                rows={2}
                                placeholder="https://website.com, https://form.com"
                                onChange={e => handleStringArrayChange('links', e.target.value)}
                                defaultValue={initialData?.links?.join(', ')}
                            />
                        </div>
                    </Section>
                </div>

                {}
                <div id="schedule" data-section="schedule" className="scroll-mt-4">
                    <Section id="schedule-inner" title="Schedule & Venue" icon={Calendar}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Start Date & Time"
                                required
                                type="datetime-local"
                                error={errors.startDate?.message}
                                {...register('startDate')}
                            />
                            <FormInput
                                label="End Date & Time"
                                required
                                type="datetime-local"
                                error={errors.endDate?.message}
                                {...register('endDate')}
                            />
                        </div>

                        {}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Venue Details</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <FormInput
                                    label="Venue Name"
                                    required
                                    placeholder="e.g. Conference Hall"
                                    error={errors.venue?.name?.message}
                                    {...register('venue.name')}
                                />
                                <FormInput
                                    label="Address"
                                    required
                                    placeholder="Street address"
                                    error={errors.venue?.address?.message}
                                    {...register('venue.address')}
                                />
                                <FormInput
                                    label="City"
                                    required
                                    placeholder="City"
                                    error={errors.venue?.city?.message}
                                    {...register('venue.city')}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput label="State" placeholder="State" {...register('venue.state')} />
                                    <FormInput label="Country" required placeholder="Country" error={errors.venue?.country?.message} {...register('venue.country')} />
                                </div>
                                <FormInput label="Postal Code" placeholder="Postal code" {...register('venue.postalCode')} />
                                <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                                    <FieldLabel>Map Coordinates</FieldLabel>
                                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex-1 flex flex-col md:flex-row gap-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 text-xs font-semibold uppercase">Latitude</span>
                                                <span className="font-mono text-gray-700">{watch('venue.coordinates.lat') || 'Not set'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 text-xs font-semibold uppercase">Longitude</span>
                                                <span className="font-mono text-gray-700">{watch('venue.coordinates.lng') || 'Not set'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => setIsMapOpen(true)}
                                            className="bg-violet-100 hover:bg-violet-200 text-violet-700 whitespace-nowrap"
                                        >
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Pin Location
                                        </Button>
                                    </div>
                                    {(errors.venue?.coordinates?.lat?.message || errors.venue?.coordinates?.lng?.message) && (
                                        <p className="text-xs text-red-500 mt-1">Both latitude and longitude are required if pinning a location.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {}
                        {isMapOpen && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">Select Venue Location</h3>
                                        <button type="button" onClick={() => setIsMapOpen(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <MapboxSelector
                                            initialLat={watch('venue.coordinates.lat')}
                                            initialLng={watch('venue.coordinates.lng')}
                                            onSelect={(lat, lng) => {
                                                setValue('venue.coordinates.lat', lat);
                                                setValue('venue.coordinates.lng', lng);
                                            }}
                                            onClose={() => setIsMapOpen(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Section>
                </div>

                {}
                <div id="ministers" data-section="ministers" className="scroll-mt-4">
                    <Section
                        id="ministers-inner"
                        title="Ministers & Speakers"
                        icon={User}
                        action={
                            <button
                                type="button"
                                onClick={() => appendMinister({ id: crypto.randomUUID(), name: '', position: '', type: 'guest' })}
                                className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />Add Minister
                            </button>
                        }
                    >
                        {ministerFields.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <User className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No ministers added yet.</p>
                                <p className="text-xs mt-0.5 text-gray-300">Click &quot;Add Minister&quot; to feature speakers.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ministerFields.map((field, index) => (
                                    <div key={field.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 relative group hover:border-violet-200 transition-colors">
                                        <button
                                            type="button"
                                            onClick={() => removeMinister(index)}
                                            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-2">
                                                <FieldLabel>Photo</FieldLabel>
                                                <div className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-200">
                                                    <ImageUpload
                                                        value={watch(`ministers.${index}.photo`)}
                                                        onChange={url => setValue(`ministers.${index}.photo`, url)}
                                                        folder="ministers"
                                                        aspectRatio="square"
                                                    />
                                                </div>
                                                {errors.ministers?.[index]?.photo?.message && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.ministers[index]?.photo?.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-10 space-y-3">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    <FormInput
                                                        label="Name"
                                                        required
                                                        placeholder="Full name"
                                                        error={errors.ministers?.[index]?.name?.message}
                                                        {...register(`ministers.${index}.name`)}
                                                    />
                                                    <FormInput
                                                        label="Position"
                                                        required
                                                        placeholder="e.g. Senior Pastor"
                                                        error={errors.ministers?.[index]?.position?.message}
                                                        {...register(`ministers.${index}.position`)}
                                                    />
                                                    <Select
                                                        label="Type"
                                                        {...register(`ministers.${index}.type`)}
                                                        error={errors.ministers?.[index]?.type?.message}
                                                    >
                                                        <option value="primary">Primary Host</option>
                                                        <option value="secondary">Co-Host / Worship</option>
                                                        <option value="guest">Guest Speaker</option>
                                                        <option value="other">Other</option>
                                                    </Select>
                                                </div>
                                                <FormInput
                                                    label="Bio"
                                                    placeholder="Brief bio (optional)"
                                                    error={errors.ministers?.[index]?.bio?.message}
                                                    {...register(`ministers.${index}.bio`)}
                                                />
                                                <div className="grid grid-cols-3 gap-3">
                                                    <FormInput
                                                        label="Twitter"
                                                        placeholder="@handle"
                                                        error={errors.ministers?.[index]?.socialLinks?.twitter?.message}
                                                        {...register(`ministers.${index}.socialLinks.twitter`)}
                                                    />
                                                    <FormInput
                                                        label="Instagram"
                                                        placeholder="@handle"
                                                        error={errors.ministers?.[index]?.socialLinks?.instagram?.message}
                                                        {...register(`ministers.${index}.socialLinks.instagram`)}
                                                    />
                                                    <FormInput
                                                        label="Facebook"
                                                        placeholder="Profile URL"
                                                        error={errors.ministers?.[index]?.socialLinks?.facebook?.message}
                                                        {...register(`ministers.${index}.socialLinks.facebook`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                {}
                <div id="channels" data-section="channels" className="scroll-mt-4">
                    <Section
                        id="channels-inner"
                        title="Channels & Streaming"
                        icon={Radio}
                        action={
                            <button
                                type="button"
                                onClick={() => appendChannel({ name: '', id: crypto.randomUUID(), color: '#7c3aed' })}
                                className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />Add Channel
                            </button>
                        }
                    >
                        {channelFields.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <LinkIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No channels added yet.</p>
                                <p className="text-xs mt-0.5 text-gray-300">Add streaming platforms or watch resources here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {channelFields.map((field, index) => (
                                    <div key={field.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 relative hover:border-violet-200 transition-colors">
                                        <button
                                            type="button"
                                            onClick={() => removeChannel(index)}
                                            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-2">
                                                <FieldLabel>Icon/Logo</FieldLabel>
                                                <div className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-200">
                                                    <ImageUpload
                                                        value={watch(`channels.${index}.image`)}
                                                        onChange={url => setValue(`channels.${index}.image`, url)}
                                                        folder="channels"
                                                        aspectRatio="square"
                                                    />
                                                </div>
                                                {errors.channels?.[index]?.image?.message && (
                                                    <p className="text-xs text-red-500 mt-1">{errors.channels[index]?.image?.message}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-10 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <FormInput
                                                        label="Platform Name"
                                                        required
                                                        placeholder="e.g. YouTube Live"
                                                        error={errors.channels?.[index]?.name?.message}
                                                        {...register(`channels.${index}.name`)}
                                                    />
                                                    <FormInput
                                                        label="Display Title"
                                                        placeholder="e.g. Live Stream"
                                                        error={errors.channels?.[index]?.title?.message}
                                                        {...register(`channels.${index}.title`)}
                                                    />
                                                    <FormInput
                                                        label="Barcode / ID"
                                                        placeholder="Optional ID"
                                                        error={errors.channels?.[index]?.barcode?.message}
                                                        {...register(`channels.${index}.barcode`)}
                                                    />
                                                    <ColorField 
                                                        label="Theme Color" 
                                                        value={watch(`channels.${index}.color`) || '#7c3aed'} 
                                                        onChange={v => setValue(`channels.${index}.color`, v)} 
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <FormInput
                                                        label="Stream Link"
                                                        placeholder="https://…"
                                                        error={errors.channels?.[index]?.link?.message}
                                                        {...register(`channels.${index}.link`)}
                                                    />
                                                    <FormInput
                                                        label="Description"
                                                        placeholder="Short info"
                                                        error={errors.channels?.[index]?.description?.message}
                                                        {...register(`channels.${index}.description`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                {}
                <div id="registration" data-section="registration" className="scroll-mt-4">
                    <Section id="registration-inner" title="Registration" icon={ClipboardList}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Enable Registration</p>
                                <p className="text-xs text-gray-400 mt-0.5">Allow attendees to register for this event</p>
                            </div>
                            <Toggle
                                checked={registrationEnabled || false}
                                onChange={v => setValue('registrationConfig.enabled', v)}
                                label=""
                            />
                        </div>

                        {registrationEnabled && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormInput
                                        label="Price (0 = Free)"
                                        type="number"
                                        placeholder="0"
                                        error={errors.registrationConfig?.price?.message}
                                        {...register('registrationConfig.price', {
                                            setValueAs: v => v === '' || isNaN(v) ? 0 : Number(v)
                                        })}
                                    />
                                    <FormInput
                                        label="Currency"
                                        placeholder="NGN"
                                        error={errors.registrationConfig?.currency?.message}
                                        {...register('registrationConfig.currency')}
                                    />
                                    <FormInput
                                        label="Capacity"
                                        type="number"
                                        placeholder="Unlimited"
                                        error={errors.registrationConfig?.capacity?.message}
                                        {...register('registrationConfig.capacity', {
                                            setValueAs: v => v === '' || isNaN(v) ? undefined : Number(v)
                                        })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Registration Opens"
                                        type="datetime-local"
                                        error={errors.registrationOpenDate?.message}
                                        {...register('registrationOpenDate', {
                                            setValueAs: v => v === '' ? undefined : v
                                        })}
                                    />
                                    <FormInput
                                        label="Registration Closes"
                                        type="datetime-local"
                                        error={errors.registrationCloseDate?.message}
                                        {...register('registrationCloseDate', {
                                            setValueAs: v => v === '' ? undefined : v
                                        })}
                                    />
                                </div>
                                <div className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">Requires Admin Approval</p>
                                        <p className="text-xs text-amber-600 mt-0.5">Registrations will be reviewed before confirmation</p>
                                    </div>
                                    <Toggle
                                        checked={watch('registrationConfig.requiresApproval') || false}
                                        onChange={v => setValue('registrationConfig.requiresApproval', v)}
                                        label=""
                                    />
                                </div>
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-gray-900">Custom Form Fields</h4>
                                    </div>
                                    {}
                                    <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-violet-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-violet-800">Default fields are always collected</p>
                                            <p className="text-xs text-violet-600 mt-0.5">Name, Email, Phone, and &quot;Who Invited You?&quot; are automatically required on every registration form. Add custom fields below for event-specific questions.</p>
                                        </div>
                                    </div>
                                    <DynamicFormBuilder
                                        control={control}
                                        register={register}
                                        errors={errors}
                                        path="registrationConfig.fields"
                                        watch={watch}
                                        setValue={setValue}
                                    />
                                </div>
                            </div>
                        )}
                    </Section>
                </div>

                {}
                <div id="invitation" data-section="invitation" className="scroll-mt-4">
                    <Section id="invitation-inner" title="Invitation Setup" icon={Mail}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Enable Invitations</p>
                                <p className="text-xs text-gray-400 mt-0.5">Collect customized invitations from users</p>
                            </div>
                            <Toggle
                                checked={invitationEnabled || false}
                                onChange={v => setValue('invitationConfig.enabled', v)}
                                label=""
                            />
                        </div>

                        {invitationEnabled && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-bold text-gray-900">Custom Form Fields</h4>
                                </div>
                                {}
                                <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-violet-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-violet-800">Default fields are always collected</p>
                                        <p className="text-xs text-violet-600 mt-0.5">Inviter name, Guest name, Phone, Email, and a Personal Note are automatically included. Add custom fields below for event-specific questions.</p>
                                    </div>
                                </div>
                                <DynamicFormBuilder
                                    control={control}
                                    register={register}
                                    errors={errors}
                                    path="invitationConfig.fields"
                                    watch={watch}
                                    setValue={setValue}
                                />
                            </div>
                        )}
                    </Section>
                </div>

                {}
                <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-3 flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-600 text-sm font-semibold py-3 rounded-xl transition-colors"
                    >
                        <X className="w-4 h-4" />Cancel
                    </button>
                    <button
                        type="submit"

                        disabled={isSubmitting || isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting || isLoading ? 'Saving…' : (initialData ? 'Update Event' : 'Create Event')}
                    </button>
                </div>
            </form>
        </div>
    );
};
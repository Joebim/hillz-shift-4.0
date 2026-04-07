'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event } from '@/src/types/event';
import { Registration } from '@/src/types/registration';
import { Invitation } from '@/src/types/invitation';
import { format, subDays } from 'date-fns';
import { toJsDate, cn } from '@/src/lib/utils';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import {
    ArrowLeft, Star, Link2, Paperclip, X, MapPin,
    Users, Mail, Globe, Phone, BookOpen,
    Edit, Share2, ExternalLink, Calendar,
    DollarSign, Hash, Building2, Search,
    BarChart3, TrendingUp, CheckCircle2,
} from 'lucide-react';
import { AddRegistrationModal, AddInvitationModal } from './modals';
import { StatusBadge, SectionLabel, Divider, InfoCard } from '@/src/components/admin/AdminSharedUI';
import { SkeletonDetail } from '@/src/components/skeletons/SkeletonDetail';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type RightTab = 'registrations' | 'invitations';
type MobilePanel = 'details' | 'people';

function toDate(value: unknown): Date {
    if (!value) return new Date();
    if (typeof value === 'object' && value !== null && '_seconds' in value) return new Date((value as { _seconds: number })._seconds * 1000);
    try { return toJsDate(value as string | number | Date | null | undefined); } catch { return new Date(); }
}

function AnalyticsDrawer({
    open, onClose, eventId, event,
    registrations, invitations,
}: {
    open: boolean;
    onClose: () => void;
    eventId: string;
    event: Event;
    registrations: Registration[];
    invitations: Invitation[];
}) {
    
    const days = 30;
    const now = new Date();
    const labels = Array.from({ length: days }, (_, i) => {
        const d = subDays(now, days - 1 - i);
        return format(d, 'yyyy-MM-dd');
    });

    function bucketByDate(items: { createdAt?: unknown }[]) {
        const map: Record<string, number> = {};
        labels.forEach(l => { map[l] = 0; });
        items.forEach(item => {
            try {
                const d = format(toDate(item.createdAt), 'yyyy-MM-dd');
                if (d in map) map[d]++;
            } catch {  }
        });
        return labels.map(l => [new Date(l).getTime(), map[l]]);
    }

    const regSeries = bucketByDate(registrations as { createdAt?: unknown }[]);
    const invSeries = bucketByDate(invitations as { createdAt?: unknown }[]);

    const baseOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 180,
            toolbar: { show: false },
            fontFamily: 'inherit',
            animations: { enabled: true, speed: 400 },
            sparkline: { enabled: false },
        },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02, stops: [0, 100] },
        },
        dataLabels: { enabled: false },
        xaxis: {
            type: 'datetime',
            labels: { format: 'MMM d', style: { fontSize: '10px', colors: '#9ca3af' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: { style: { fontSize: '10px', colors: '#9ca3af' } },
            min: 0,
        },
        grid: { borderColor: '#f3f4f6', strokeDashArray: 4, xaxis: { lines: { show: false } } },
        tooltip: {
            theme: 'light',
            x: { show: true, format: 'MMM d, yyyy' },
            y: { title: { formatter: () => '' } },
        },
    };

    const regOptions: ApexOptions = { ...baseOptions, colors: ['#8b5cf6'] };
    const invOptions: ApexOptions = { ...baseOptions, colors: ['#3b82f6'] };

    const totalReg = registrations.length;
    const totalInv = invitations.length;
    const acceptedInv = invitations.filter(i => i.status === 'accepted').length;
    const convRate = totalInv > 0 ? Math.round((acceptedInv / totalInv) * 100) : 0;

    return (
        <>
            {}
            <div
                className={cn(
                    'fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300',
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />
            {}
            <div className={cn(
                'fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out',
                open ? 'translate-x-0' : 'translate-x-full'
            )}>
                {}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="font-bold text-gray-900 text-base">Event Analytics</h2>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{event.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Registrations', value: totalReg, icon: Users, color: 'bg-violet-50 text-violet-600' },
                            { label: 'Invitations', value: totalInv, icon: Mail, color: 'bg-blue-50 text-blue-600' },
                            { label: 'Accept Rate', value: `${convRate}%`, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-gray-900">{value}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{label}</p>
                            </div>
                        ))}
                    </div>

                    {}
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Registrations</p>
                                <p className="font-bold text-gray-800 text-sm">Last 30 days</p>
                            </div>
                            <span className="text-2xl font-black text-violet-600">{totalReg}</span>
                        </div>
                        <ReactApexChart
                            options={regOptions}
                            series={[{ name: 'Registrations', data: regSeries }]}
                            type="area"
                            height={160}
                        />
                    </div>

                    {}
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Invitations</p>
                                <p className="font-bold text-gray-800 text-sm">Last 30 days</p>
                            </div>
                            <span className="text-2xl font-black text-blue-600">{totalInv}</span>
                        </div>
                        <ReactApexChart
                            options={invOptions}
                            series={[{ name: 'Invitations', data: invSeries }]}
                            type="area"
                            height={160}
                        />
                    </div>

                    {}
                    {totalInv > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Invitation Status Breakdown</p>
                            {(['accepted', 'pending', 'declined', 'sent'] as const).map(status => {
                                const count = invitations.filter(i => i.status === status).length;
                                const pct = totalInv > 0 ? Math.round((count / totalInv) * 100) : 0;
                                const colors: Record<string, string> = {
                                    accepted: 'bg-emerald-500',
                                    pending: 'bg-amber-400',
                                    declined: 'bg-red-400',
                                    sent: 'bg-blue-400',
                                };
                                return (
                                    <div key={status} className="flex items-center gap-3 py-1.5">
                                        <span className="capitalize text-xs font-medium text-gray-700 w-16">{status}</span>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn('h-full rounded-full transition-all duration-700', colors[status])}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function DetailsPanel({ event, attachmentsRef }: { event: Event; attachmentsRef?: React.RefObject<HTMLDivElement | null> }) {
    const startDate = toDate(event.startDate);
    const endDate = toDate(event.endDate);
    const regConfig = event.registrationConfig;
    const regOpen = toDate(event.registrationOpenDate);
    const regClose = toDate(event.registrationCloseDate);
    const priceDisplay = (regConfig?.price || 0) > 0
        ? `${regConfig.currency ? regConfig.currency + ' ' : ''}${regConfig.price}`
        : 'Free';

    return (
        <div className="flex-1 overflow-y-auto">

            {}
            <div className="relative h-44 md:h-56 w-full bg-linear-to-br from-violet-700 to-indigo-900 shrink-0">
                {event.branding?.bannerImage && (
                    <img
                        src={event.branding.bannerImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                {event.branding?.primaryColor && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <span className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                            style={{ backgroundColor: event.branding.primaryColor }} />
                        <span className="text-[10px] text-white/80 font-mono">{event.branding.primaryColor}</span>
                    </div>
                )}
                <div className="absolute bottom-4 left-4 md:left-6 flex items-center gap-2 flex-wrap">
                    <StatusBadge status={event.status} />
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/20 capitalize">
                        {event.category}
                    </span>
                    {event.featured && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/90 text-amber-900 flex items-center gap-0.5">
                            <Star className="w-3 h-3" fill="currentColor" />Featured
                        </span>
                    )}
                </div>
            </div>

            {}
            <div className="px-4 md:px-6 py-6 space-y-6">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{event.title}</h1>
                    {event.shortDescription && (
                        <p className="text-sm text-gray-500 mt-1.5 italic">{event.shortDescription}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InfoCard icon={Calendar} label="Start" value={event.startDate ? format(startDate, 'MMM d, yyyy • h:mm a') : 'TBA'} accent />
                    <InfoCard icon={Calendar} label="End" value={event.endDate ? format(endDate, 'MMM d, yyyy • h:mm a') : 'Indefinite'} />
                    <InfoCard icon={DollarSign} label="Price" value={priceDisplay} />
                    {regConfig?.capacity && <InfoCard icon={Users} label="Capacity" value={`${regConfig.capacity} attendees`} />}
                </div>

                <div>
                    <SectionLabel>About this event</SectionLabel>
                    <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                {(event.theme || event.eventBibleVerse) && (
                    <div className="bg-violet-50 rounded-2xl p-5 border border-violet-100 space-y-3">
                        {event.theme && (
                            <div>
                                <SectionLabel>Theme</SectionLabel>
                                <p className="text-base font-bold text-violet-900 italic">&quot;{event.theme}&quot;</p>
                                {event.themeBibleVerse && (
                                    <p className="text-xs text-violet-500 mt-1 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3 shrink-0" />{event.themeBibleVerse}
                                    </p>
                                )}
                            </div>
                        )}
                        {event.eventBibleVerse && (
                            <div className={event.theme ? 'border-t border-violet-100 pt-3' : ''}>
                                <SectionLabel>Bible Verse</SectionLabel>
                                <p className="text-sm text-violet-800 italic">&quot;{event.eventBibleVerse}&quot;</p>
                            </div>
                        )}
                    </div>
                )}

                {event.tags?.length > 0 && (
                    <div>
                        <SectionLabel>Tags</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map(tag => (
                                <span key={tag}
                                    className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full border border-violet-100">
                                    <Hash className="w-2.5 h-2.5" />{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <Divider />

                <div>
                    <SectionLabel>Registration Window</SectionLabel>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        {[
                            { label: 'Opens', date: regOpen, raw: event.registrationOpenDate },
                            { label: 'Closes', date: regClose, raw: event.registrationCloseDate },
                        ].map(({ label, date, raw }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-xs font-semibold text-gray-800">{raw ? format(date, 'MMM d, yyyy') : 'No Date'}</p>
                                <p className="text-xs text-gray-500">{raw ? format(date, 'h:mm a') : 'TBA'}</p>
                            </div>
                        ))}
                    </div>
                    {regConfig?.enabled && (
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-2.5 h-2.5" />Registration Open
                        </span>
                    )}
                    {regConfig?.requiresApproval && (
                        <span className="inline-block mt-2 ml-2 text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            Requires Approval
                        </span>
                    )}
                </div>

                <Divider />

                <div>
                    <SectionLabel>Venue &amp; Location</SectionLabel>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{event.venue?.name}</p>
                                <p className="text-xs text-gray-500 flex items-start gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span>
                                        {[event.venue?.address, event.venue?.city, event.venue?.state, event.venue?.country]
                                            .filter(Boolean).join(', ')}
                                        {event.venue?.postalCode && ` ${event.venue.postalCode}`}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {(event.ministers?.length ?? 0) > 0 && (
                    <div>
                        <SectionLabel>Ministers</SectionLabel>
                        <div className="space-y-2 mt-1">
                            {event.ministers?.map((m) => (
                                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    {m.photo
                                        ? <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                        : <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm shrink-0">{m.name.charAt(0)}</div>
                                    }
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.position}</p>
                                    </div>
                                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0',
                                        m.type === 'primary' ? 'bg-violet-100 text-violet-700'
                                            : m.type === 'guest' ? 'bg-amber-100 text-amber-700'
                                                : 'bg-gray-100 text-gray-600'
                                    )}>{m.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(event.channels?.length ?? 0) > 0 && (
                    <div>
                        <SectionLabel>Channels</SectionLabel>
                        <div className="space-y-2 mt-1">
                            {event.channels?.map((ch, i) => (
                                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-violet-200 transition-colors">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="text-sm font-semibold text-gray-800">{ch.name}</p>
                                        {ch.title && (
                                            <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                                                {ch.title}
                                            </span>
                                        )}
                                    </div>
                                    {ch.description && <p className="text-xs text-gray-500">{ch.description}</p>}
                                    {ch.link && (
                                        <a href={ch.link} target="_blank" rel="noopener noreferrer"
                                            className="text-xs text-violet-500 hover:text-violet-700 mt-1.5 flex items-center gap-1 truncate">
                                            <Globe className="w-3 h-3 shrink-0" />{ch.link}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {event.contacts && event.contacts.length > 0 && (
                    <div>
                        <SectionLabel>Contacts</SectionLabel>
                        <div className="space-y-1 mt-1">
                            {event.contacts.map((c: string, i: number) => (
                                <p key={i} className="text-sm text-gray-700 flex items-center gap-1.5">
                                    <Phone className="w-3 h-3 text-gray-400 shrink-0" />{c}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {event.links && event.links.length > 0 && (
                    <div>
                        <SectionLabel>Links</SectionLabel>
                        <div className="space-y-1 mt-1">
                            {event.links.map((l: string, i: number) => (
                                <a key={i} href={l} target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-violet-600 hover:text-violet-800 flex items-center gap-1.5 truncate">
                                    <ExternalLink className="w-3 h-3 shrink-0" />{l}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <Divider />

                {}
                <div ref={attachmentsRef}>
                    <SectionLabel>Attachments</SectionLabel>
                    <button className="w-full text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl py-5 hover:border-violet-300 hover:text-violet-500 transition-colors flex items-center justify-center gap-2">
                        <Paperclip className="w-3.5 h-3.5" />Add attachments
                    </button>
                </div>

                <div className="h-4" />
            </div>
        </div>
    );
}

function PeoplePanel({ event, rightTab, setRightTab }: {
    event: Event; rightTab: RightTab; setRightTab: (t: RightTab) => void;
}) {
    const { id: eventId } = event;
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [isInvModalOpen, setIsInvModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleTabChange = (tab: RightTab) => {
        setRightTab(tab);
        setSearchTerm('');
    };

    const { data: registrations, isLoading: isRegLoading } = useQuery({
        queryKey: ['registrations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/registrations`);
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || [];
        }
    });

    const { data: invitations, isLoading: isInvLoading } = useQuery({
        queryKey: ['invitations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/invitations`);
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || [];
        }
    });

    const startDate = toDate(event.startDate);
    const regConfig = event.registrationConfig;

    const regCount = registrations?.length || 0;
    const acceptedCount = invitations?.filter((i: Invitation) => i.status === 'accepted').length || 0;

    const filteredRegistrations = registrations?.filter((r: Registration) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (r.name?.toLowerCase()?.includes(term) ?? false) ||
            (r.email?.toLowerCase()?.includes(term) ?? false) ||
            (r.attendee?.firstName?.toLowerCase()?.includes(term) ?? false) ||
            (r.attendee?.lastName?.toLowerCase()?.includes(term) ?? false) ||
            (r.attendee?.email?.toLowerCase()?.includes(term) ?? false)
        );
    });

    const filteredInvitations = invitations?.filter((i: Invitation) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            (i.recipientName?.toLowerCase()?.includes(term) ?? false) ||
            (i.recipientEmail?.toLowerCase()?.includes(term) ?? false) ||
            (i.senderName?.toLowerCase()?.includes(term) ?? false) ||
            (i.inviteeName?.toLowerCase()?.includes(term) ?? false) ||
            (i.inviteeEmail?.toLowerCase()?.includes(term) ?? false)
        );
    });

    const isLoading = rightTab === 'registrations' ? isRegLoading : isInvLoading;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <AddRegistrationModal event={event} isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
            <AddInvitationModal event={event} isOpen={isInvModalOpen} onClose={() => setIsInvModalOpen(false)} />

            {}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex gap-2 shrink-0">
                <button
                    onClick={() => handleTabChange('registrations')}
                    className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200',
                        rightTab === 'registrations'
                            ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    )}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>Registrations</span>
                    <span className={cn('text-[10px] font-black ml-0.5',
                        rightTab === 'registrations' ? 'text-violet-200' : 'text-gray-400')}>
                        {regCount}
                    </span>
                </button>
                <button
                    onClick={() => handleTabChange('invitations')}
                    className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200',
                        rightTab === 'invitations'
                            ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    )}
                >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Invitations</span>
                    <span className={cn('text-[10px] font-black ml-0.5',
                        rightTab === 'invitations' ? 'text-violet-200' : 'text-gray-400')}>
                        {invitations?.length || 0}
                    </span>
                </button>
            </div>

            {}
            <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: '#6c63d5' }}>

                <div className="px-5 md:px-6 pt-5 pb-4 shrink-0">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                        {rightTab === 'registrations' ? 'Attendees' : 'Invitations'}
                    </p>
                    <h3 className="text-2xl md:text-[26px] font-bold text-white leading-tight mb-1">
                        {event.startDate ? format(startDate, 'd EEEE, MMMM') : 'Any Time Open Registration'}
                    </h3>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                        {rightTab === 'registrations'
                            ? `${regCount}/${regConfig?.capacity ?? '—'} Attending`
                            : `${acceptedCount}/${invitations?.length || 0} Accepted`
                        }
                    </p>

                    <div className="mt-5 flex gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full bg-white/10 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all font-medium"
                            />
                        </div>
                        <Link
                            href={rightTab === 'registrations' ? `/admin/events/${eventId}/registrations` : `/admin/events/${eventId}/invitations`}
                            className="bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-white/30 transition-all shadow-md shrink-0 active:scale-95 border border-white/20 flex items-center justify-center"
                        >
                            View Data
                        </Link>
                        <button
                            onClick={() => rightTab === 'registrations' ? setIsRegModalOpen(true) : setIsInvModalOpen(true)}
                            className="bg-white text-violet-700 text-xs font-bold py-2 px-4 rounded-lg hover:bg-gray-50 hover:shadow-lg transition-all shadow-md shrink-0 active:scale-95"
                        >
                            {rightTab === 'registrations' ? 'Add Attendee' : 'Send Invite'}
                        </button>
                    </div>
                </div>

                <div className="h-px bg-white/10 mx-5 md:mx-6 shrink-0" />

                <div className="flex-1 overflow-y-auto py-4 px-5 md:px-6 space-y-4 custom-scrollbar">

                    {isLoading && (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-9 h-9 rounded-full bg-white/20 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-white/20 rounded w-1/3" />
                                    <div className="h-2 bg-white/10 rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    )}

                    {!isLoading && rightTab === 'registrations' && (
                        <>
                            {filteredRegistrations?.length === 0 && (
                                <div className="text-center py-8 opacity-50">
                                    <p className="text-white text-sm italic">{searchTerm ? 'No matches found.' : 'No registrations yet.'}</p>
                                </div>
                            )}
                            {filteredRegistrations?.map((a: Registration, i: number) => (
                                <div key={a.id || i} className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 rounded-full bg-violet-400/50 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                                        {(a.name || a.attendee?.firstName || a.email || a.attendee?.email || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm text-white font-medium block truncate group-hover:text-violet-100 transition-colors">
                                            {a.name || (a.attendee ? `${a.attendee.firstName} ${a.attendee.lastName}` : 'Unknown')}
                                        </span>
                                        <span className="text-xs text-white/50 block truncate group-hover:text-white/70 transition-colors">
                                            {a.email || a.attendee?.email}
                                        </span>
                                    </div>
                                    {a.checkedIn && (
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" title="Checked In" />
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {!isLoading && rightTab === 'invitations' && (
                        <>
                            {filteredInvitations?.length === 0 && (
                                <div className="text-center py-8 opacity-50">
                                    <p className="text-white text-sm italic">{searchTerm ? 'No matches found.' : 'No invitations sent yet.'}</p>
                                </div>
                            )}
                            {filteredInvitations?.map((inv: Invitation, i: number) => (
                                <div key={inv.id || i} className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 rounded-full bg-violet-400/50 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                                        {(inv.recipientName || inv.inviteeName || inv.recipientEmail || inv.senderName || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-medium truncate group-hover:text-violet-100 transition-colors">{inv.recipientName || inv.inviteeName || 'Unknown'}</p>
                                        <p className="text-[10px] text-white/50 truncate group-hover:text-white/70 transition-colors">{inv.recipientEmail || inv.inviteeEmail}</p>
                                    </div>
                                    <div className="shrink-0">
                                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border border-white/20 capitalize font-medium',
                                            inv.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' :
                                                inv.status === 'declined' ? 'bg-red-500/20 text-red-100 border-red-500/30' :
                                                    'bg-white/10 text-white/60'
                                        )}>
                                            {inv.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ActionButtonsProps {
    event: Event;
    size?: 'sm' | 'md';
    featuredMutation: any;
    copySuccess: boolean;
    copyEventLink: () => void;
    scrollToAttachments: () => void;
    setAnalyticsOpen: (open: boolean) => void;
    shareEvent: () => void;
}

const ActionButtons = ({
    event,
    size = 'md',
    featuredMutation,
    copySuccess,
    copyEventLink,
    scrollToAttachments,
    setAnalyticsOpen,
    shareEvent
}: ActionButtonsProps) => {
    const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const showLabel = size === 'md';
    const btnBase = 'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150';
    return (
        <div className="flex items-center gap-1.5">
            {/* Featured */}
            <button
                onClick={() => featuredMutation.mutate(!event.featured)}
                disabled={featuredMutation.isPending}
                title={event.featured ? 'Remove from featured' : 'Mark as featured'}
                className={cn(
                    btnBase,
                    'disabled:opacity-50',
                    event.featured
                        ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-500'
                )}
            >
                <Star className={s} fill={event.featured ? 'currentColor' : 'none'} />
                {showLabel && <span>{event.featured ? 'Featured' : 'Feature'}</span>}
            </button>

            {/* Copy link */}
            <button
                onClick={copyEventLink}
                title={copySuccess ? 'Copied!' : 'Copy public event link'}
                className={cn(
                    btnBase,
                    copySuccess
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600'
                )}
            >
                <Link2 className={s} />
                {showLabel && <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>}
            </button>

            {/* Attachments */}
            <button
                onClick={scrollToAttachments}
                title="Attachments"
                className={cn(btnBase, 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600')}
            >
                <Paperclip className={s} />
                {showLabel && <span>Attachments</span>}
            </button>

            {/* Analytics */}
            <button
                onClick={() => setAnalyticsOpen(true)}
                title="View Analytics"
                className={cn(btnBase, 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600')}
            >
                <BarChart3 className={s} />
                {showLabel && <span>Analytics</span>}
            </button>

            {/* Edit */}
            <Link
                href={`/admin/events/${event.id}/edit`}
                title="Edit event"
                className={cn(btnBase, 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600')}
            >
                <Edit className={s} />
                {showLabel && <span>Edit</span>}
            </Link>

            {/* Share */}
            <button
                onClick={shareEvent}
                title="Share event"
                className={cn(btnBase, 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600')}
            >
                <Share2 className={s} />
                {showLabel && <span>Share</span>}
            </button>
        </div>
    );
};

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params?.id as string;
    const queryClient = useQueryClient();

    const [rightTab, setRightTab] = useState<RightTab>('registrations');
    const [mobilePanel, setMobilePanel] = useState<MobilePanel>('details');
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const attachmentsRef = useRef<HTMLDivElement>(null);

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}`);
            if (!res.ok) throw new Error('Failed to fetch event');
            const json = await res.json();
            return (json.data ?? json) as Event;
        },
        enabled: !!eventId,
    });

    const { data: registrations = [] } = useQuery<Registration[]>({
        queryKey: ['registrations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/registrations`);
            if (!res.ok) return [];
            return (await res.json()).data || [];
        },
        enabled: !!eventId,
    });

    const { data: invitations = [] } = useQuery<Invitation[]>({
        queryKey: ['invitations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/invitations`);
            if (!res.ok) return [];
            return (await res.json()).data || [];
        },
        enabled: !!eventId,
    });

    const featuredMutation = useMutation({
        mutationFn: async (featured: boolean) => {
            const res = await fetch(`/api/events/${eventId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured }),
            });
            if (!res.ok) throw new Error('Failed to update');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    const copyEventLink = async () => {
        const url = `${window.location.origin}/e/${event?.slug || eventId}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            
            const ta = document.createElement('textarea');
            ta.value = url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const shareEvent = async () => {
        const url = `${window.location.origin}/e/${event?.slug || eventId}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event?.title || 'Event',
                    text: event?.shortDescription || event?.description || '',
                    url,
                });
            } catch {  }
        } else {
            
            copyEventLink();
        }
    };

    const scrollToAttachments = () => {
        attachmentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (isLoading) return <SkeletonDetail />;

    if (isError || !event) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center space-y-2">
                <p className="text-gray-400 text-lg font-medium">Event not found</p>
                <p className="text-gray-300 text-sm">The event may have been removed or the link is invalid.</p>
                <Link href="/admin/events" className="inline-block mt-2 text-violet-600 text-sm hover:underline font-medium">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );

    const actionButtonProps = {
        event,
        featuredMutation,
        copySuccess,
        copyEventLink,
        scrollToAttachments,
        setAnalyticsOpen,
        shareEvent
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans">

            {}
            <AnalyticsDrawer
                open={analyticsOpen}
                onClose={() => setAnalyticsOpen(false)}
                eventId={eventId}
                event={event}
                registrations={registrations}
                invitations={invitations}
            />

            {}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
                <Link href="/admin/events"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-violet-600 transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-3.5 h-3.5" />Events
                </Link>
                <ActionButtons {...actionButtonProps} size="sm" />
            </div>

            {}
            <div className="lg:hidden flex bg-white border-b border-gray-100 px-4 gap-1.5 py-2 shrink-0">
                {([
                    { id: 'details' as MobilePanel, label: 'Details' },
                    { id: 'people' as MobilePanel, label: rightTab === 'registrations' ? 'Registrations' : 'Invitations' },
                ]).map(tab => (
                    <button key={tab.id} onClick={() => setMobilePanel(tab.id)}
                        className={cn('flex-1 py-2 px-3 text-[11px] font-bold rounded-lg transition-all',
                            mobilePanel === tab.id
                                ? 'bg-violet-600 text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100')}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {}
            <div className={cn('lg:hidden flex-1 flex flex-col overflow-hidden bg-white', mobilePanel === 'details' ? 'flex' : 'hidden')}>
                <DetailsPanel event={event} attachmentsRef={attachmentsRef} />
            </div>
            <div className={cn('lg:hidden flex-1 flex flex-col overflow-hidden', mobilePanel === 'people' ? 'flex' : 'hidden')}>
                <PeoplePanel event={event} rightTab={rightTab} setRightTab={setRightTab} />
            </div>

            {}

            {}
            <div className="hidden lg:flex flex-1 bg-white flex-col overflow-hidden border-r border-gray-200 min-w-0">
                <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <Link href="/admin/events"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-violet-600 transition-colors uppercase tracking-wider">
                        <ArrowLeft className="w-3.5 h-3.5" />Events
                    </Link>
                    <ActionButtons {...actionButtonProps} />
                </div>
                <DetailsPanel event={event} attachmentsRef={attachmentsRef} />
            </div>

            {}
            <div className="hidden lg:flex w-96 shrink-0 flex-col overflow-hidden">
                <PeoplePanel event={event} rightTab={rightTab} setRightTab={setRightTab} />
            </div>
        </div>
    );
}
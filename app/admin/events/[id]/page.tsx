'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/src/types/event';
import { Registration } from '@/src/types/registration';
import { Invitation } from '@/src/types/invitation';
import { format } from 'date-fns';
import { toJsDate, cn } from '@/src/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import {
    ArrowLeft, Star, Link2, Paperclip, X, MapPin,
    Users, Mail, Globe, Phone, BookOpen,
    Edit, Share2, ExternalLink, Calendar, Tag,
    DollarSign, Hash, Building2, Layers, Search,
} from 'lucide-react';
import { AddRegistrationModal, AddInvitationModal } from './modals';
import { StatusBadge, SectionLabel, Divider, InfoCard } from '@/src/components/admin/AdminSharedUI';
import { SkeletonDetail } from '@/src/components/skeletons/SkeletonDetail';

// ─── Types ────────────────────────────────────────────────────────────────────

type RightTab = 'registrations' | 'invitations';
type MobilePanel = 'details' | 'people';

// ─── Mock people data ─────────────────────────────────────────────────────────

const mockAttendees = [
    { name: 'Wendy Williams', confirmed: true },
    { name: 'Jenny Ferris', confirmed: true },
    { name: 'John McIntyre', confirmed: false },
    { name: 'Susie McIntyre', confirmed: true },
    { name: 'Cindy Johnston', confirmed: true },
    { name: 'Lou Walters', confirmed: false },
    { name: 'Sam Walters', confirmed: true },
    { name: 'Ben Smith', confirmed: false },
];

const mockInvitations = [
    { name: 'Alex Thompson', email: 'alex@example.com', sent: '2 days ago', status: 'accepted' },
    { name: 'Maria Garcia', email: 'maria@example.com', sent: '3 days ago', status: 'pending' },
    { name: 'David Park', email: 'david@example.com', sent: '5 days ago', status: 'declined' },
    { name: 'Rachel Kim', email: 'rachel@example.com', sent: '1 week ago', status: 'pending' },
    { name: 'Tom Wilson', email: 'tom@example.com', sent: '1 week ago', status: 'accepted' },
];

// ─── Date helper ──────────────────────────────────────────────────────────────

function toDate(value: unknown): Date {
    if (!value) return new Date();
    if (typeof value === 'object' && value !== null && '_seconds' in value) return new Date((value as { _seconds: number })._seconds * 1000);
    try { return toJsDate(value as string | number | Date | null | undefined); } catch { return new Date(); }
}

// ─── Main Details Panel ───────────────────────────────────────────────────────

function DetailsPanel({ event }: { event: Event }) {
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

            {/* ── Banner hero image ── */}
            <div className="relative h-44 md:h-56 w-full bg-linear-to-br from-violet-700 to-indigo-900 shrink-0">
                {event.branding?.bannerImage && (
                    <img
                        src={event.branding.bannerImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                {/* Brand colour swatch */}
                {event.branding?.primaryColor && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <span className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                            style={{ backgroundColor: event.branding.primaryColor }} />
                        <span className="text-[10px] text-white/80 font-mono">{event.branding.primaryColor}</span>
                    </div>
                )}
                {/* Status + category overlay bottom-left */}
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

            {/* ── Content area ── */}
            <div className="px-4 md:px-6 py-6 space-y-6">

                {/* Title + short description */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{event.title}</h1>
                    {event.shortDescription && (
                        <p className="text-sm text-gray-500 mt-1.5 italic">{event.shortDescription}</p>
                    )}
                </div>

                {/* At-a-glance info grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <InfoCard icon={Calendar} label="Start" value={format(startDate, 'MMM d, yyyy • h:mm a')} accent />
                    <InfoCard icon={Calendar} label="End" value={format(endDate, 'MMM d, yyyy • h:mm a')} />
                    <InfoCard icon={DollarSign} label="Price" value={priceDisplay} />
                    {regConfig?.capacity && <InfoCard icon={Users} label="Capacity" value={`${regConfig.capacity} attendees`} />}
                </div>

                {/* Description */}
                <div>
                    <SectionLabel>About this event</SectionLabel>
                    <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                {/* Theme & Bible verse */}
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

                {/* Tags */}
                {event.tags?.length > 0 && (
                    <div>
                        <SectionLabel>Tags</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map(tag => (
                                <span key={tag}
                                    className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full border border-violet-100">
                                    <Hash className="w-2.5 h-2.5" />{tag}
                                    <X className="w-3 h-3 cursor-pointer hover:text-violet-900" />
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <Divider />

                {/* Registration dates */}
                <div>
                    <SectionLabel>Registration Window</SectionLabel>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        {[
                            { label: 'Opens', date: regOpen },
                            { label: 'Closes', date: regClose },
                        ].map(({ label, date }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-xs font-semibold text-gray-800">{format(date, 'MMM d, yyyy')}</p>
                                <p className="text-xs text-gray-500">{format(date, 'h:mm a')}</p>
                            </div>
                        ))}
                    </div>
                    {regConfig?.enabled && (
                        <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            Registration Open
                        </span>
                    )}
                    {regConfig?.requiresApproval && (
                        <span className="inline-block mt-2 ml-2 text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            Requires Approval
                        </span>
                    )}
                </div>

                <Divider />

                {/* Venue */}
                <div>
                    <SectionLabel>Venue & Location</SectionLabel>
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

                {/* Ministers */}
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

                {/* Channels */}
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

                {/* Contacts */}
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

                {/* External links */}
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

                {/* Attachments */}
                <div>
                    <SectionLabel>Attachments</SectionLabel>
                    <button className="w-full text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl py-5 hover:border-violet-300 hover:text-violet-500 transition-colors flex items-center justify-center gap-2">
                        <Paperclip className="w-3.5 h-3.5" />Add attachments
                    </button>
                </div>

                {/* Bottom padding */}
                <div className="h-4" />
            </div>
        </div>
    );
}

// ─── People Panel ─────────────────────────────────────────────────────────────

function PeoplePanel({ event, rightTab, setRightTab }: {
    event: Event; rightTab: RightTab; setRightTab: (t: RightTab) => void;
}) {
    const { id: eventId } = event;
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [isInvModalOpen, setIsInvModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Reset search when tab changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleTabChange = (tab: RightTab) => {
        setRightTab(tab);
        setSearchTerm('');
    };

    // Fetch Registrations
    const { data: registrations, isLoading: isRegLoading } = useQuery({
        queryKey: ['registrations', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/registrations`);
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || [];
        }
    });

    // Fetch Invitations
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

    // Counts
    const regCount = registrations?.length || 0;
    const acceptedCount = invitations?.filter((i: Invitation) => i.status === 'accepted').length || 0;

    // Filter Logic
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
            (i.name?.toLowerCase()?.includes(term) ?? false) || // fallback
            (i.email?.toLowerCase()?.includes(term) ?? false) ||
            (i.inviteeName?.toLowerCase()?.includes(term) ?? false) ||
            (i.inviteeEmail?.toLowerCase()?.includes(term) ?? false)
        );
    });

    const isLoading = rightTab === 'registrations' ? isRegLoading : isInvLoading;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Modals */}
            <AddRegistrationModal eventId={eventId} isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
            <AddInvitationModal eventId={eventId} isOpen={isInvModalOpen} onClose={() => setIsInvModalOpen(false)} />

            {/* ── Tab switcher row (above purple pane) ── */}
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

            {/* ── Purple pane ── */}
            <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: '#6c63d5' }}>

                {/* Header block */}
                <div className="px-5 md:px-6 pt-5 pb-4 shrink-0">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                        {rightTab === 'registrations' ? 'Attendees' : 'Invitations'}
                    </p>
                    <h3 className="text-2xl md:text-[26px] font-bold text-white leading-tight mb-1">
                        {format(startDate, 'd EEEE, MMMM')}
                    </h3>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                        {rightTab === 'registrations'
                            ? `${regCount}/${regConfig?.capacity ?? '—'} Attending`
                            : `${acceptedCount}/${invitations?.length || 0} Accepted`
                        }
                    </p>

                    {/* Actions Row */}
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
                        <button
                            onClick={() => rightTab === 'registrations' ? setIsRegModalOpen(true) : setIsInvModalOpen(true)}
                            className="bg-white text-violet-700 text-xs font-bold py-2 px-4 rounded-lg hover:bg-gray-50 hover:shadow-lg transition-all shadow-md shrink-0 active:scale-95"
                        >
                            {rightTab === 'registrations' ? 'Add Attendee' : 'Send Invite'}
                        </button>
                    </div>
                </div>

                <div className="h-px bg-white/10 mx-5 md:mx-6 shrink-0" />

                {/* List */}
                <div className="flex-1 overflow-y-auto py-4 px-5 md:px-6 space-y-4 custom-scrollbar">

                    {/* Loading State */}
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

                    {/* Content */}
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
                                        {(inv.recipientName || inv.inviteeName || inv.recipientEmail || inv.email || '?').charAt(0).toUpperCase()}
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EventDetailsPage() {
    const params = useParams();
    const eventId = params?.id as string;
    const [rightTab, setRightTab] = useState<RightTab>('registrations');
    const [mobilePanel, setMobilePanel] = useState<MobilePanel>('details');

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

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans">

            {/* ── Mobile top bar ───────────────────────────────────────────── */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
                <Link href="/admin/events"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-violet-600 transition-colors uppercase tracking-wider">
                    <ArrowLeft className="w-3.5 h-3.5" />Events
                </Link>
                <div className="flex items-center gap-3 text-gray-400">
                    <button className={cn('hover:text-amber-500 transition-colors', event.featured && 'text-amber-400')}>
                        <Star className="w-4 h-4" fill={event.featured ? 'currentColor' : 'none'} />
                    </button>
                    <Link href={`/admin/events/${event.id}/edit`} className="hover:text-violet-600 transition-colors">
                        <Edit className="w-4 h-4" />
                    </Link>
                    <button className="hover:text-violet-500 transition-colors"><Share2 className="w-4 h-4" /></button>
                </div>
            </div>

            {/* ── Mobile panel tab bar ─────────────────────────────────────── */}
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

            {/* ── Mobile panels ────────────────────────────────────────────── */}
            <div className={cn('lg:hidden flex-1 flex flex-col overflow-hidden bg-white', mobilePanel === 'details' ? 'flex' : 'hidden')}>
                <DetailsPanel event={event} />
            </div>
            <div className={cn('lg:hidden flex-1 flex flex-col overflow-hidden', mobilePanel === 'people' ? 'flex' : 'hidden')}>
                <PeoplePanel event={event} rightTab={rightTab} setRightTab={setRightTab} />
            </div>

            {/* ── Desktop: two panels ──────────────────────────────────────── */}

            {/* Left panel — event details */}
            <div className="hidden lg:flex flex-1 bg-white flex-col overflow-hidden border-r border-gray-200 min-w-0">
                {/* Sticky header bar */}
                <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <Link href="/admin/events"
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-violet-600 transition-colors uppercase tracking-wider">
                        <ArrowLeft className="w-3.5 h-3.5" />Events
                    </Link>
                    <div className="flex items-center gap-3 text-gray-400">
                        <button className={cn('hover:text-amber-500 transition-colors', event.featured && 'text-amber-400')}>
                            <Star className="w-4 h-4" fill={event.featured ? 'currentColor' : 'none'} />
                        </button>
                        <button className="hover:text-violet-500 transition-colors"><Link2 className="w-4 h-4" /></button>
                        <button className="hover:text-violet-500 transition-colors"><Paperclip className="w-4 h-4" /></button>
                        <Link href={`/admin/events/${event.id}/edit`} className="hover:text-violet-600 transition-colors">
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button className="hover:text-violet-500 transition-colors"><Share2 className="w-4 h-4" /></button>
                    </div>
                </div>
                <DetailsPanel event={event} />
            </div>

            {/* Right panel — tab switcher + purple pane */}
            <div className="hidden lg:flex w-96 shrink-0 flex-col overflow-hidden">
                <PeoplePanel event={event} rightTab={rightTab} setRightTab={setRightTab} />
            </div>
        </div>
    );
}
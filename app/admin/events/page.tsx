'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/src/types/event';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    Search,
    Bell,
    Clock,
    ChevronDown,
    MoreHorizontal,
    Plus,
    Menu,
    X,
    Calendar,
    Mail,
    Users
} from 'lucide-react';
import { cn, toJsDate } from '@/src/lib/utils';
import { useRef, useEffect, useState } from 'react';
import type { ApexOptions } from 'apexcharts';

import { SkeletonDashboard } from '@/src/components/skeletons/SkeletonDashboard';
import { UserDropdown } from '@/src/components/admin/UserDropdown';
import { AdminTable } from '@/src/components/admin/AdminTable';
import { StatusBadge } from '@/src/components/admin/AdminSharedUI';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ─── Sub-components ───────────────────────────────────────────────────────────

// Component for displaying overlapping avatars
function AvatarStack({ count }: { count: number }) {
    const colors = ['bg-purple-400', 'bg-pink-400', 'bg-blue-400', 'bg-indigo-400', 'bg-violet-400'];
    return (
        <div className="flex -space-x-2">
            {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
                <div key={i} className={cn('w-7 h-7 rounded-full border-2 border-white', colors[i % colors.length])} />
            ))}
        </div>
    );
}

function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch('/api/notifications');
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const json = await res.json();
            return json.data;
        },
        refetchInterval: 30000,
    });

    // Mock unread count based on available notifications (or add a 'read' field logic later)
    const unreadCount = notifications ? notifications.filter((n: any) => !n.read).length : 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-violet-200 outline-none"
            >
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                            <Link href="#" className="text-xs text-violet-600 font-medium hover:underline">Mark all as read</Link>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-3 animate-pulse">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-2 bg-gray-200 rounded w-3/4" />
                                                <div className="h-2 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : notifications && notifications.length > 0 ? (
                                <div className="py-2">
                                    {notifications.map((notif: any) => (
                                        <div key={notif.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none relative group">
                                            {!notif.read && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-violet-500 rounded-r" />
                                            )}
                                            <div className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow-sm",
                                                notif.type === 'registration' ? "bg-linear-to-br from-violet-400 to-purple-600" :
                                                    notif.type === 'invitation' ? "bg-linear-to-br from-blue-400 to-cyan-600" :
                                                        "bg-linear-to-br from-orange-400 to-pink-500"
                                            )}>
                                                {notif.actorName ? notif.actorName.charAt(0).toUpperCase() : 'S'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-700 text-xs leading-snug">
                                                    <span className="font-semibold text-gray-900">{notif.actorName}</span>{' '}
                                                    <span className="text-gray-500">{notif.action}</span>{' '}
                                                    <span className={cn(notif.highlightColor || 'font-semibold', "wrap-break-word")}>{notif.highlight}</span>
                                                </p>
                                                {(notif.eventTitle || notif.suffix) && (
                                                    <p className="text-[10px] text-gray-400 mt-0.5 truncate italic">
                                                        {notif.suffix} {notif.eventTitle ? `on ${notif.eventTitle}` : ''}
                                                    </p>
                                                )}
                                                <p className="text-[10px] text-gray-400 mt-1 font-medium">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                                    <Bell className="w-8 h-8 text-gray-200" />
                                    <p>No notifications yet</p>
                                </div>
                            )}
                        </div>
                        <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                            <Link href="/admin/notifications" className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">
                                View All Notifications
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


function AnalyticsCharts() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ['active-event-analytics'],
        queryFn: async () => {
            const res = await fetch('/api/events/active/analytics');
            if (!res.ok) throw new Error('Failed to fetch analytics');
            const json = await res.json();
            return json.data;
        },
    });

    if (isLoading) {
        return <div className="h-40 w-full bg-gray-100 rounded-xl animate-pulse" />;
    }

    if (!analytics) {
        return (
            <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No active event data available
            </div>
        );
    }

    const chartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 120,
            sparkline: { enabled: true },
            fontFamily: 'inherit',
            toolbar: { show: false }
        },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            type: 'datetime',
            crosshairs: { width: 1 },
        },
        tooltip: {
            theme: 'light',
            fixed: { enabled: false },
            x: { show: true, format: 'dd MMM yyyy' },
            y: { title: { formatter: () => '' } },
            marker: { show: false },
        }
    };

    const regOptions: ApexOptions = {
        ...chartOptions,
        colors: ['#8b5cf6'], // violet-500
    };

    const invOptions: ApexOptions = {
        ...chartOptions,
        colors: ['#3b82f6'], // blue-500
    };

    return (
        <div className="space-y-6">
            {/* Registrations Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Registrations</p>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1" title={analytics.event.title}>
                            {analytics.event.title}
                        </h4>
                    </div>
                </div>
                <div className="h-28 -mx-2">
                    <ReactApexChart
                        options={regOptions}
                        series={[{ name: 'Registrations', data: analytics.registrations }]}
                        type="area"
                        height={110}
                    />
                </div>
            </div>

            {/* Invitations Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Invitations</p>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1" title={analytics.event.title}>
                            {analytics.event.title}
                        </h4>
                    </div>
                </div>
                <div className="h-28 -mx-2">
                    <ReactApexChart
                        options={invOptions}
                        series={[{ name: 'Invitations', data: analytics.invitations }]}
                        type="area"
                        height={110}
                    />
                </div>
            </div>
        </div>
    );
}

function SidebarContent({ metrics, setView, router }: { metrics: any, setView: (v: 'dashboard' | 'all') => void, router: any }) {
    return (
        <div className="space-y-6">
            {metrics?.activeEventObj && (
                <div
                    onClick={() => router.push(`/admin/events/${metrics.activeEventObj.id}`)}
                    className="bg-violet-50 rounded-2xl p-4 md:p-5 border border-violet-100 hover:shadow-md hover:border-violet-200 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-200/50 rounded-full blur-2xl -mr-10 -mt-10" />

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-white/60 px-2 py-0.5 rounded backdrop-blur-sm">Current Focus</span>
                    </div>

                    <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors mb-1">
                        {metrics.activeEventObj.title}
                    </h3>

                    <div className="text-xs text-violet-800 font-medium mt-1 mb-4 flex-1">
                        {(() => {
                            const now = new Date();
                            const start = metrics.activeEventObj.startDate ? new Date(metrics.activeEventObj.startDate) : now;
                            const end = metrics.activeEventObj.endDate ? new Date(metrics.activeEventObj.endDate) : now;

                            if (start > now) {
                                return <span>Registration ongoing, event starts on {format(start, 'MMM d, yyyy')}.</span>;
                            } else if (now > end) {
                                const days = differenceInDays(now, end);
                                return <span>Event ended {days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'} ago`}.</span>;
                            } else {
                                return <span>Event ongoing from {format(start, 'MMM d')} to {format(end, 'MMM d, yyyy')}.</span>;
                            }
                        })()}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setView('all');
                        }}
                        className="text-xs font-semibold bg-white text-violet-600 hover:text-violet-700 hover:bg-violet-100 py-1.5 px-3 rounded-lg shadow-sm border border-violet-100 transition-colors self-start mt-auto"
                    >
                        View All Events
                    </button>
                </div>
            )}

            {/* Analytics Charts */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Active Event Trends</h3>
                </div>
                <AnalyticsCharts />
            </div>
        </div>
    );
}

function SectionDropdown({ setView }: { setView: (v: 'dashboard' | 'all') => void }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-100 rounded-lg outline-none transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-20 py-2 text-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => { setView('all'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-violet-50 hover:text-violet-700 text-gray-600 font-medium transition-colors">
                            View All Events
                        </button>
                        <Link href="/admin/events/new" className="block px-4 py-2 hover:bg-violet-50 hover:text-violet-700 text-gray-600 font-medium transition-colors" onClick={() => setIsOpen(false)}>
                            Add New Event
                        </Link>
                        <div className="h-px bg-gray-100 my-1 mx-2" />
                        <button onClick={() => setIsOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                            Export List
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsDashboardPage() {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [view, setView] = useState<'dashboard' | 'all'>('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle click outside to close search results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Search Query
    const { data: searchResults, isLoading: isSearchLoading } = useQuery({
        queryKey: ['global-search', debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) return null;
            const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
            if (!res.ok) throw new Error('Search failed');
            return await res.json();
        },
        enabled: debouncedQuery.length >= 2,
    });

    // Fetch user session
    const { data: session } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const res = await fetch('/api/auth/session');
            if (!res.ok) return null;
            const json = await res.json();
            return json.data;
        }
    });

    const { data: events, isLoading: isEventsLoading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error('Failed to fetch events');
            const json = await res.json();
            return json.data as Event[];
        },
    });

    const { data: metrics, isLoading: isMetricsLoading } = useQuery({
        queryKey: ['event-metrics'],
        queryFn: async () => {
            const res = await fetch('/api/events/metrics');
            if (!res.ok) throw new Error('Failed to fetch metrics');
            const json = await res.json();
            return json.data as {
                totalEvents: number;
                activeEvents: number;
                activeEventTitle: string;
                activeEventId?: string;
                activeEventObj?: any;
                totalInvitations: number;
                totalRegistrations: number;
            };
        },
    });

    if (isEventsLoading || isMetricsLoading) return <SkeletonDashboard />;

    const now = new Date();

    // Ongoing: Active and current system date is within the event start and end date
    const ongoingEvents = (events || []).filter(e => {
        if (e.status !== 'published') return false;
        const start = toJsDate(e.startDate);
        const end = toJsDate(e.endDate);
        return now >= start && now <= end;
    });

    // Upcoming: Active and current system date is within the registration start and end date
    const upcomingEvents = (events || []).filter(e => {
        if (e.status !== 'published') return false;

        if (e.registrationOpenDate && e.registrationCloseDate) {
            const regStart = toJsDate(e.registrationOpenDate);
            const regEnd = toJsDate(e.registrationCloseDate);
            return now >= regStart && now <= regEnd;
        }

        // Fallback for events without registration dates
        return toJsDate(e.startDate) > now;
    }).sort((a, b) => toJsDate(a.startDate).getTime() - toJsDate(b.startDate).getTime());

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── Top Nav ──────────────────────────────────────────────────── */}
            <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 sticky top-0 z-20">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 shrink-0">Dashboard</h1>

                <div className="relative flex-1 max-w-sm hidden md:block" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search event or anything"
                            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-700 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-violet-200"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearchFocused(true);
                            }}
                            onFocus={() => setIsSearchFocused(true)}
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {isSearchFocused && debouncedQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                            {isSearchLoading ? (
                                <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                            ) : searchResults && searchResults.data && (
                                <>
                                    {/* Events */}
                                    {searchResults.data.events?.length > 0 && (
                                        <div className="p-2">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Events</h4>
                                            {searchResults.data.events.map((e: any) => (
                                                <Link key={e.id} href={`/admin/events/${e.id}`} className="block px-2 py-2 hover:bg-gray-50 rounded-lg group">
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-violet-600">{e.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{e.shortDescription || e.description}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Registrations */}
                                    {searchResults.data.registrations?.length > 0 && (
                                        <div className="p-2 border-t border-gray-50">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Registrations</h4>
                                            {searchResults.data.registrations.map((r: any) => (
                                                <div key={r.id} className="px-2 py-2 hover:bg-gray-50 rounded-lg cursor-default">
                                                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                                                    <p className="text-xs text-gray-500">{r.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Invitations */}
                                    {searchResults.data.invitations?.length > 0 && (
                                        <div className="p-2 border-t border-gray-50">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Invitations</h4>
                                            {searchResults.data.invitations.map((inv: any) => (
                                                <Link
                                                    key={inv.id}
                                                    href={`/admin/events/${inv.eventId}`}
                                                    className="block px-2 py-2 hover:bg-gray-50 rounded-lg group transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-violet-600">Invitee: {inv.inviteeName}</p>
                                                            <p className="text-xs text-gray-500">By: {inv.inviterName}</p>
                                                        </div>
                                                        {inv.eventTitle && (
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                                                {inv.eventTitle}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* No results */}
                                    {(!searchResults.data.events?.length && !searchResults.data.registrations?.length && !searchResults.data.invitations?.length) && (
                                        <div className="p-8 text-center text-gray-400 text-sm">
                                            No results found for &quot;{debouncedQuery}&quot;
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <button className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Search className="w-4 h-4 text-gray-600" />
                    </button>
                    <NotificationsDropdown />
                    <Link href="/admin/events/new"
                        className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors shadow-md shadow-violet-200">
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Add Event</span>
                    </Link>

                    <div className="hidden lg:block h-8 w-px bg-gray-100 mx-1" />
                    <UserDropdown session={session} />

                    {/* Hamburger – shows sidebar drawer on <lg */}
                    <button onClick={() => setDrawerOpen(true)}
                        className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Menu className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* ── Main ─────────────────────────────────────────────────── */}
                <main className="flex-1 p-4 md:p-6 space-y-5 md:space-y-6 min-w-0">
                    {view === 'dashboard' ? (
                        <>
                            {/* Global Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setView('all')}
                                    className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 hover:-translate-y-0.5 transition-all text-left outline-none cursor-pointer"
                                >
                                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-violet-100 text-violet-600">
                                        <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Total Events</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Active: <span className="font-bold text-gray-800">{metrics?.activeEvents || 0}</span>/{metrics?.totalEvents || 0}
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => metrics?.activeEventId ? router.push(`/admin/events/${metrics.activeEventId}`) : undefined}
                                    className={cn(
                                        "bg-white rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm border border-gray-100 transition-all text-left outline-none",
                                        metrics?.activeEventId ? "cursor-pointer hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5" : ""
                                    )}
                                >
                                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-pink-100 text-pink-600">
                                        <Mail className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Total Invitations</p>
                                        <p className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
                                            {metrics?.totalInvitations || 0} <span className="text-xs font-normal text-gray-400">Sent</span>
                                        </p>
                                        {metrics?.activeEventTitle && (
                                            <span className="block text-[10px] text-gray-400 font-normal truncate max-w-[150px] mt-0.5" title={metrics.activeEventTitle}>
                                                For: {metrics.activeEventTitle}
                                            </span>
                                        )}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => metrics?.activeEventId ? router.push(`/admin/events/${metrics.activeEventId}`) : undefined}
                                    className={cn(
                                        "bg-white rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm border border-gray-100 transition-all text-left outline-none",
                                        metrics?.activeEventId ? "cursor-pointer hover:shadow-md hover:blue-100 hover:-translate-y-0.5" : ""
                                    )}
                                >
                                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-blue-100 text-blue-600">
                                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Total Registrations</p>
                                        <p className="text-sm md:text-base font-bold text-gray-800 mt-0.5">
                                            {metrics?.totalRegistrations || 0} <span className="text-xs font-normal text-gray-400">Registered</span>
                                        </p>
                                        {metrics?.activeEventTitle && (
                                            <span className="block text-[10px] text-gray-400 font-normal truncate max-w-[150px] mt-0.5" title={metrics.activeEventTitle}>
                                                For: {metrics.activeEventTitle}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Ongoing Events */}
                            <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4 md:mb-5">
                                    <h2 className="text-base md:text-lg font-bold text-gray-900">Ongoing Events</h2>
                                    <SectionDropdown setView={setView} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                    {ongoingEvents.length === 0 && (
                                        <div className="col-span-2 md:col-span-4 py-8 text-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            No ongoing events currently
                                        </div>
                                    )}
                                    {ongoingEvents.slice(0, 4).map((event) => (
                                        <Link key={event.id} href={`/admin/events/${event.id}`}
                                            className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col">
                                            <div className="h-28 md:h-32 w-full overflow-hidden bg-linear-to-br from-violet-800 to-indigo-900 relative shrink-0">
                                                {(event.branding?.thumbnail || event.branding?.bannerImage) ? (
                                                    <Image src={event.branding.thumbnail || event.branding.bannerImage!}
                                                        alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full bg-linear-to-br from-violet-700 to-indigo-900" />
                                                )}
                                            </div>
                                            <div className="p-2.5 md:p-3 flex-1">
                                                <p className="font-semibold text-gray-900 text-xs md:text-sm line-clamp-1 group-hover:text-violet-600 transition-colors">
                                                    {event.title}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-[10px] md:text-xs">
                                                    <Clock className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{format(toJsDate(event.startDate), 'd MMM yyyy, hh:mm aa')}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Upcoming Events */}
                            <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4 md:mb-5">
                                    <h2 className="text-base md:text-lg font-bold text-gray-900">Upcoming Events</h2>
                                    <SectionDropdown setView={setView} />
                                </div>
                                {/* Horizontal scroll on mobile → grid on md+ */}
                                <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 md:grid md:grid-cols-4 md:gap-4 snap-x snap-mandatory scrollbar-hide">
                                    {upcomingEvents.slice(0, 4).map((event) => (
                                        <Link key={event.id} href={`/admin/events/${event.id}`}
                                            className="rounded-2xl border border-gray-100 p-3 md:p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0 w-48 sm:w-56 md:w-auto snap-start block group">
                                            <span className="inline-block bg-violet-50 text-violet-600 text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full mb-2.5">
                                                {format(toJsDate(event.startDate), 'd MMM yyyy')}
                                            </span>
                                            <p className="font-semibold text-gray-900 text-xs md:text-sm mb-1.5 line-clamp-2 group-hover:text-violet-600 transition-colors">
                                                {event.title}
                                            </p>
                                            <div className="flex items-center gap-1 text-gray-400 text-[10px] md:text-xs mb-3 md:mb-4">
                                                <Clock className="w-3 h-3 shrink-0" />
                                                <span>
                                                    {format(toJsDate(event.startDate), 'hh:mm aa')} - {format(toJsDate(event.endDate), 'hh:mm aa')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <AvatarStack count={event.registrationCount || 0} />
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    +{event.registrationCount || 0} going
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                    {upcomingEvents.length === 0 && (
                                        <div className="col-span-4 py-8 text-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            No upcoming events found
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">All Events</h2>
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="text-sm font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                >
                                    <span>←</span> Back
                                </button>
                            </div>
                            <AdminTable
                                data={events || []}
                                columns={[
                                    {
                                        header: 'Event',
                                        cell: (e: Event) => (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-violet-100 overflow-hidden shrink-0 border border-violet-100 relative">
                                                    {e.branding?.thumbnail || e.branding?.bannerImage ? (
                                                        <Image src={e.branding.thumbnail || e.branding.bannerImage!} alt={e.title} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-linear-to-br from-violet-500 to-indigo-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 line-clamp-1">{e.title}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{e.category}</p>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Status',
                                        cell: (e: Event) => <StatusBadge status={e.status} />
                                    },
                                    {
                                        header: 'Date',
                                        cell: (e: Event) => (
                                            <div>
                                                <p className="text-sm text-gray-700 font-medium">{format(toJsDate(e.startDate), 'MMM d, yyyy')}</p>
                                                <p className="text-xs text-gray-400">{format(toJsDate(e.startDate), 'h:mm a')}</p>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Registrations',
                                        cell: (e: Event) => (
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-700">{e.registrationCount || 0}</span>
                                            </div>
                                        )
                                    }
                                ]}
                                actions={{
                                    view: (e) => `/admin/events/${e.id}`,
                                    edit: (e) => `/admin/events/${e.id}/edit`,
                                }}
                            />
                        </div>
                    )}
                </main>

                {/* ── Inline sidebar – desktop ─────────────────────────────── */}
                <aside className="hidden lg:block w-80 shrink-0 bg-white border-l border-gray-100 sticky top-[65px] self-start max-h-[calc(100vh-65px)] overflow-y-auto p-5 space-y-6">
                    <SidebarContent metrics={metrics} setView={setView} router={router} />
                </aside>
            </div>

            {/* ── Mobile drawer backdrop ───────────────────────────────────── */}
            <div
                className={cn('fixed inset-0 bg-black/30 z-30 transition-opacity duration-300 lg:hidden',
                    drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}
                onClick={() => setDrawerOpen(false)}
            />
            {/* ── Mobile drawer panel ──────────────────────────────────────── */}
            <aside className={cn(
                'fixed top-0 right-0 h-full w-72 bg-white z-40 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
                drawerOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Activity</h3>
                    <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    <SidebarContent metrics={metrics} setView={setView} router={router} />
                </div>
            </aside>
        </div>
    );
}
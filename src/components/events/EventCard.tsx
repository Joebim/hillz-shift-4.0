'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/src/types/event';
import { Card } from '@/src/components/ui/Card';
import { Calendar, MapPin, ArrowRight, Clock, Lock, UserPlus } from 'lucide-react';
import { formatDate, toJsDate } from '@/src/lib/utils';
import { format } from 'date-fns';

export interface EventCardProps {
    event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
    // Compute registration status
    const now = new Date();
    const regOpen = event.registrationOpenDate ? toJsDate(event.registrationOpenDate) : null;
    const regClose = event.registrationCloseDate ? toJsDate(event.registrationCloseDate) : null;
    const registrationEnabled = !!event.registrationConfig?.enabled;
    const registrationNotStarted = registrationEnabled && regOpen && now < regOpen;
    const registrationEnded = registrationEnabled && regClose && now > regClose;
    const registrationOpen = registrationEnabled && !registrationNotStarted && !registrationEnded;

    const eventSlug = event.slug || event.id;

    return (
        <div className="relative h-full">
            {/* Main card — clicking anywhere goes to event page */}
            <Link href={`/events/${eventSlug}`}>
                <Card variant="default" padding="none" hover className="overflow-hidden h-full group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1">
                    {/* Banner Image */}
                    <div className="relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500 z-10" />
                        <Image
                            src={event.branding.bannerImage || '/images/placeholders/event-banner.jpg'}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Featured badge */}
                        <div className="absolute top-6 right-6 z-20">
                            {event.featured && (
                                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-600 shadow-xl">
                                    Featured
                                </div>
                            )}
                        </div>

                        {/* Category badge */}
                        <div className="absolute bottom-6 left-6 z-20">
                            <div className="bg-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                                {event.category}
                            </div>
                        </div>
                    </div>

                    {/* Card body */}
                    <div className={`p-8 ${registrationEnabled ? 'pb-24' : ''}`}>
                        {/* Date + venue row */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                <span>{formatDate(event.startDate, 'long')}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                                <span>{event.venue.city}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                            {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-500 font-bold mb-6 line-clamp-2 leading-relaxed">
                            {event.shortDescription}
                        </p>
                    </div>
                </Card>
            </Link>

            {/* Registration status overlay — separate from the main link */}
            {registrationEnabled && (
                <div className="absolute bottom-8 left-8 right-8 z-10" onClick={(e) => e.stopPropagation()}>
                    {registrationOpen ? (
                        <Link
                            href={`/e/${eventSlug}/register`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/30 transition-all duration-200 active:scale-95"
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Register Now
                        </Link>
                    ) : registrationNotStarted ? (
                        <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            Opens {regOpen ? format(regOpen, 'do MMM yyyy') : ''}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest">
                            <Lock className="w-3.5 h-3.5 shrink-0" />
                            Registration Ended
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

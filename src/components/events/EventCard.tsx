import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/src/types/event';
import { Card } from '@/src/components/ui/Card';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';

export interface EventCardProps {
    event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
    return (
        <Link href={`/events/${event.slug}`}>
            <Card variant="default" padding="none" hover className="overflow-hidden h-full group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1">
                {}
                <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500 z-10" />
                    <Image
                        src={event.branding.bannerImage || '/images/placeholders/event-banner.jpg'}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {}
                    <div className="absolute top-6 right-6 z-20">
                        {event.featured && (
                            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-600 shadow-xl">
                                Featured
                            </div>
                        )}
                    </div>

                    {}
                    <div className="absolute bottom-6 left-6 z-20">
                        <div className="bg-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                            {event.category}
                        </div>
                    </div>
                </div>

                {}
                <div className="p-8">
                    {}
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

                    {}
                    <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                        {event.title}
                    </h3>

                    {}
                    <p className="text-slate-500 font-bold mb-8 line-clamp-2 leading-relaxed">
                        {event.shortDescription}
                    </p>

                    {}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-900">Get Details</span>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

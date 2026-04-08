import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/shared/Footer';
import { Section } from '@/src/components/shared/Section';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
    Calendar,
    MapPin,
    Clock,
    Share2,
    Download,
    ExternalLink,
    ArrowLeft,
    Sparkles,
    CheckCircle2,
    Heart,
    User,
    Users
} from 'lucide-react';
import { formatDate, formatTime, daysUntil, toJsDate } from '@/src/lib/utils';
import { MapboxViewer } from '@/src/components/events/MapboxViewer';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const events = await queryDocuments<Event>('events', { slug });
    const event = events[0];

    if (!event) return { title: 'Event Not Found' };

    return {
        title: `${event.title} | Hillz Shift 4.0`,
        description: event.shortDescription,
    };
}

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const results = await queryDocuments<Event>('events', { slug });
    const rawEvent = results[0];

    if (!rawEvent) notFound();

    const event = {
        ...rawEvent,
        startDate: toJsDate(rawEvent.startDate),
        endDate: toJsDate(rawEvent.endDate),
        registrationOpenDate: toJsDate(rawEvent.registrationOpenDate),
        registrationCloseDate: toJsDate(rawEvent.registrationCloseDate),
        createdAt: toJsDate(rawEvent.createdAt),
        updatedAt: toJsDate(rawEvent.updatedAt),
    };

    const days = daysUntil(event.startDate);
    const now = new Date();
    const registrationOpen = now >= event.registrationOpenDate && now <= event.registrationCloseDate;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            {}
            <section className="relative overflow-hidden bg-slate-900 min-h-[500px]">
                <div className="relative w-full">
                    {/* Effects Overlay - now strictly on image height */}
                    <Image
                        src={event.branding.bannerImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'}
                        alt={event.title}
                        width={1920}
                        height={1080}
                        className="w-full h-auto opacity-60 block"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/80 via-slate-900/40 to-white z-10" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 pt-48 pb-32 md:pb-64">
                    <div className="container mx-auto px-6 h-full flex items-end">
                        <div className="max-w-4xl w-full">
                            <Link href="/events" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors font-black text-[10px] uppercase tracking-[0.3em] group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Calendar
                            </Link>

                            <div className="flex flex-wrap gap-3 mb-8">
                                <div className="bg-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                                    {event.category}
                                </div>
                                {event.featured && (
                                    <div className="bg-[#D4AF37] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1F2937] shadow-xl">
                                        Featured Gathering
                                    </div>
                                )}
                                {days > 0 && days <= 30 && (
                                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-600 shadow-xl">
                                        {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-fade-in-up">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap gap-8 text-white/80 font-bold uppercase tracking-widest text-xs">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-purple-400" />
                                    <span>{formatDate(event.startDate, 'full')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    <span>{formatTime(event.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-pink-400" />
                                    <span>{event.venue.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {}
            <Section className="py-0 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12 md:-mt-24">
                    {}
                    <div className="lg:col-span-2 space-y-20 pb-32">
                        {}
                        <Card variant="default" padding="none" className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl shadow-purple-900/10 border border-slate-100">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> About the gathering
                            </h2>
                            <p className="text-2xl md:text-3xl font-black text-slate-900 mb-10 leading-tight tracking-tight">
                                {event.shortDescription}
                            </p>
                            <article className="prose prose-xl prose-purple max-w-none text-slate-500 font-medium leading-relaxed italic">
                                {event.description}
                            </article>
                        </Card>

                        {}
                        {event.speakers?.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    The Voices
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {event.speakers?.map((speaker) => (
                                        <Card key={speaker.id} variant="default" padding="none" className="group bg-white rounded-[32px] p-6 border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                                            <div className="flex gap-6">
                                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-slate-50">
                                                    <Image
                                                        src={speaker.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'}
                                                        alt={speaker.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">
                                                        {speaker.name}
                                                    </h3>
                                                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-3">
                                                        {speaker.title}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-bold line-clamp-2 leading-relaxed italic">
                                                        {speaker.bio}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {}
                        {event.schedule?.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    The Shift Flow
                                </h2>
                                <div className="space-y-6">
                                    {event.schedule?.map((item) => (
                                        <Card key={item.id} variant="default" padding="none" className="bg-white rounded-[24px] overflow-hidden border border-slate-100 group">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-32 bg-slate-50 p-6 flex items-center justify-center md:border-r border-slate-100 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
                                                    <span className="font-black text-sm uppercase tracking-widest text-center">
                                                        {item.time}
                                                    </span>
                                                </div>
                                                <div className="p-6 flex-1">
                                                    <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-bold mb-3 italic">
                                                        {item.description}
                                                    </p>
                                                    {item.speaker && (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                            <User className="w-3 h-3" /> {item.speaker}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="space-y-8 h-fit lg:sticky lg:top-32 pb-32">
                        {}
                        {event.registrationConfig.enabled && (
                            <Card variant="default" padding="none" className="bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-purple-900/20 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black mb-10 tracking-tighter">Secure Your Space</h3>

                                    {registrationOpen ? (
                                        <>
                                            <div className="mb-10 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Available Spots</span>
                                                    <span className="font-black text-xl text-purple-400">
                                                        {event.registrationConfig.capacity ? (
                                                            `${event.registrationConfig.capacity - event.registrationCount}`
                                                        ) : (
                                                            'Unlimited'
                                                        )}
                                                    </span>
                                                </div>
                                                {event.registrationConfig.capacity && (
                                                    <div className="w-full bg-white/10 rounded-full h-1.5">
                                                        <div
                                                            className="bg-linear-to-r from-purple-400 to-indigo-400 h-1.5 rounded-full transition-all duration-1000"
                                                            style={{
                                                                width: `${Math.min(
                                                                    (event.registrationCount /
                                                                        event.registrationConfig.capacity) *
                                                                    100,
                                                                    100
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <Link href={`/e/${event.slug}`}>
                                                <Button className="w-full h-18 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-purple-900/40 transition-all">
                                                    ENTER EVENT
                                                </Button>
                                            </Link>
                                            <p className="mt-6 text-center text-[10px] font-black text-white/40 uppercase tracking-widest italic">
                                                * Dive into the experience
                                            </p>
                                        </>
                                    ) : (
                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md text-center">
                                            <p className="text-white/60 font-black uppercase tracking-widest text-xs mb-4">
                                                Registration {now < event.registrationOpenDate ? 'opens' : 'closed'}
                                            </p>
                                            <div className="bg-white/10 p-4 rounded-2xl mb-4">
                                                <p className="text-lg font-black text-white">
                                                    {formatDate(
                                                        now < event.registrationOpenDate
                                                            ? event.registrationOpenDate
                                                            : event.registrationCloseDate,
                                                        'long'
                                                    )}
                                                </p>
                                            </div>
                                            {now < event.registrationOpenDate && (
                                                <Button disabled className="w-full h-14 rounded-2xl bg-white/5 text-white/40 font-black text-xs uppercase tracking-widest border border-white/10">
                                                    COMING SOON
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {}
                        <div className="space-y-6">
                            {}
                            <Card variant="default" padding="none" className="bg-white rounded-[32px] p-8 border border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Location</h3>
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 tracking-tight mb-1">
                                            {event.venue.name}
                                        </p>
                                        <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
                                            {event.venue.address}<br />
                                            {event.venue.city}, {event.venue.country}
                                        </p>
                                    </div>
                                </div>

                                {event.venue.coordinates?.lat && event.venue.coordinates?.lng && (
                                    <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 h-[300px]">
                                        <MapboxViewer lat={event.venue.coordinates.lat} lng={event.venue.coordinates.lng} />
                                    </div>
                                )}

                                <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 relative">
                                    <a
                                        href={`https://maps.google.com/?q=${event.venue.coordinates?.lat || ''},${event.venue.coordinates?.lng || ''}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center w-full h-full"
                                    >
                                        GET DIRECTIONS
                                    </a>
                                </Button>
                            </Card>

                            {}
                            {(event.mediaLinks?.livestreamUrl ||
                                event.mediaLinks?.spotifyUrl ||
                                event.mediaLinks?.youtubeUrl) && (
                                    <Card variant="default" padding="none" className="bg-white rounded-[32px] p-8 border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Digital Access</h3>
                                        <div className="space-y-3">
                                            {event.mediaLinks.livestreamUrl && (
                                                <a href={event.mediaLinks.livestreamUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-50 bg-slate-50 text-slate-900 font-bold text-xs hover:bg-purple-50 hover:text-purple-600 transition-all border-none">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        LIVESTREAM
                                                    </Button>
                                                </a>
                                            )}
                                            {event.mediaLinks.spotifyUrl && (
                                                <a href={event.mediaLinks.spotifyUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-50 bg-slate-50 text-slate-900 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-600 transition-all border-none">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        EVENT PLAYLIST
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </Card>
                                )}
                        </div>
                    </div>
                </div>
            </Section>

            <Footer event={event} />
        </div>
    );
}

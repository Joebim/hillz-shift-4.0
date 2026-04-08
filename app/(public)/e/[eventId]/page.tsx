import { Banner } from '@/src/components/shared/Banner';
import { EventBannerHeader } from '@/src/components/shared/EventBannerHeader';
import { Footer } from '@/src/components/shared/Footer';
import { Button } from '@/src/components/ui/Button';
import Link from 'next/link';
import { EXTERNAL_LINKS } from '@/src/constants/links';
import {
    ArrowRight, Music, Video, Phone, ExternalLink,
    Youtube, Calendar, Clock, MapPin, UserPlus, AlertCircle, Lock, Radio
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { queryDocuments, getDocument } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { format } from 'date-fns';
import { toJsDate } from '@/src/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }): Promise<Metadata> {
    const { eventId } = await params;
    let ArrayEvents = await queryDocuments<Event>('events', { slug: eventId });
    let event: Event | null = ArrayEvents.length > 0 ? ArrayEvents[0] : null;

    if (!event) {
        event = await getDocument<Event>('events', eventId);
    }

    if (!event) return { title: 'Event Not Found | The Hillz' };

    return {
        title: `${event.title} | The Hillz`,
        description: event.description || `Join us for ${event.title}. Register now on The Hillz platform.`,
        openGraph: {
            title: event.title,
            description: event.description,
            images: event.branding.bannerImage ? [{ url: event.branding.bannerImage }] : [],
        },
    };
}

export default async function EventHomePage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    let ArrayEvents = await queryDocuments<Event>('events', { slug: eventId });
    let event: Event | null = ArrayEvents.length > 0 ? ArrayEvents[0] : null;

    if (!event) {
        event = await getDocument<Event>('events', eventId);
    }

    if (!event) return notFound();

    const eventDate = toJsDate(event.startDate);
    const primary = event.branding.primaryColor || '#6B46C1';
    const secondary = event.branding.secondaryColor || '#553C9A';
    const accent = event.branding.accentColor || '#D4AF37';

    // Compute registration window status
    const now = new Date();
    const regOpen = event.registrationOpenDate ? toJsDate(event.registrationOpenDate) : null;
    const regClose = event.registrationCloseDate ? toJsDate(event.registrationCloseDate) : null;
    const registrationEnabled = !!event.registrationConfig?.enabled;
    const registrationNotStarted = registrationEnabled && regOpen && now < regOpen;
    const registrationEnded = registrationEnabled && regClose && now > regClose;
    const registrationOpen = registrationEnabled && !registrationNotStarted && !registrationEnded;

    return (
        <div className="min-h-screen selection:bg-primary/20 bg-white text-gray-900">
            <Banner text={event.bannerText} />
            <EventBannerHeader
                bannerImage={event.branding.bannerImage}
                title={event.title}
                primaryColor={primary}
                secondaryColor={secondary}
            />

            {/* Event Details */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto container-px">
                    <div className="max-w-6xl mx-auto">
                        <div className="rounded-3xl md:rounded-[3rem] border-2 border-primary/10 bg-linear-to-br from-white via-primary/5 to-white p-8 md:p-12 lg:p-20 shadow-lg relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gray-100 blur-3xl"></div>

                            <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
                                {/* Left: Event Info + CTA */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black uppercase tracking-[0.3em] text-xs">
                                            {event.title}
                                        </div>
                                        {/* Thin accent bar under the badge */}
                                        <div className="h-[3px] w-10 rounded-full" style={{ backgroundColor: accent }}></div>
                                        <h2 className="text-3xl md:text-5xl lg:text-[56px] font-black uppercase tracking-tighter leading-[1.2]">
                                            <span className="text-primary">{event.theme}</span>
                                        </h2>
                                        {event.themeBibleVerse && (
                                            <p className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>
                                                {event.themeBibleVerse}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {registrationOpen && (
                                            <Link href={`/e/${eventId}/register`}>
                                                <Button size="lg" className="gap-3 rounded-2xl group btn-primary">
                                                    Register Now
                                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </Link>
                                        )}
                                        {registrationNotStarted && (
                                            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm">
                                                <Clock size={16} className="shrink-0" />
                                                Registration opens {regOpen ? format(regOpen, 'do MMM yyyy') : ''}
                                            </div>
                                        )}
                                        {registrationEnded && (
                                            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 font-bold text-sm">
                                                <Lock size={16} className="shrink-0" />
                                                Registration Ended
                                            </div>
                                        )}
                                        {event.invitationConfig?.enabled && (
                                            <Link href={`/e/${eventId}/invite`}>
                                                <Button size="lg" variant="outline" className="gap-3 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50">
                                                    Invite someone
                                                    <UserPlus size={18} />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Event info cards */}
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-xl p-2" style={{ backgroundColor: `${accent}20`, color: accent }}>
                                                <MapPin size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Venue</div>
                                                <div className="mt-1 text-lg font-black text-gray-900">{event.venue.name}</div>
                                                <div className="mt-2 text-sm font-semibold text-gray-600">
                                                    <span className="text-gray-700">{event.venue.address}</span>
                                                    {event.venue.city && `, ${event.venue.city}`}
                                                    {event.venue.country && `, ${event.venue.country}`}.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-xl p-2" style={{ backgroundColor: `${accent}20`, color: accent }}>
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Date</div>
                                                    <div className="mt-1 text-lg font-black text-gray-900">{format(eventDate, 'do MMM, yyyy').toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-xl p-2" style={{ backgroundColor: `${accent}20`, color: accent }}>
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Time</div>
                                                    <div className="mt-1 text-lg font-black text-gray-900">{format(eventDate, 'h:mm a').toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Registration status card */}
                                    {registrationEnabled && (
                                        <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
                                            registrationOpen
                                                ? 'bg-green-50 border-green-200'
                                                : registrationNotStarted
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'bg-gray-50 border-gray-200'
                                        }`}>
                                            <div className={`rounded-xl p-2 shrink-0 ${
                                                registrationOpen
                                                    ? 'bg-green-100 text-green-600'
                                                    : registrationNotStarted
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-gray-200 text-gray-500'
                                            }`}>
                                                {registrationOpen ? <UserPlus size={18} /> : registrationNotStarted ? <Clock size={18} /> : <Lock size={18} />}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`text-xs font-black uppercase tracking-[0.25em] ${
                                                    registrationOpen ? 'text-green-600' : registrationNotStarted ? 'text-blue-600' : 'text-gray-400'
                                                }`}>Registration</div>
                                                <div className={`mt-0.5 text-sm font-bold ${
                                                    registrationOpen ? 'text-green-800' : registrationNotStarted ? 'text-blue-800' : 'text-gray-500'
                                                }`}>
                                                    {registrationOpen
                                                        ? `Open · Closes ${regClose ? format(regClose, 'do MMM yyyy') : ''}`
                                                        : registrationNotStarted
                                                            ? `Opens ${regOpen ? format(regOpen, 'do MMM yyyy') : ''}`
                                                            : 'Registration Ended'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* About card */}
                                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="text-xs font-black uppercase tracking-[0.25em] mb-2" style={{ color: accent }}>About This Event</div>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed line-clamp-6">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Feature / Spotify Tie-in */}
            <section
                className="py-16 md:py-24 text-white"
                style={{ backgroundColor: `color-mix(in srgb, ${primary} 55%, black)` }}
            >
                <div className="container mx-auto container-px">
                    <div
                        className="rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-2xl"
                        style={{
                            background: `linear-gradient(to bottom right, ${secondary}, ${primary})`
                        }}
                    >
                        {/* Decorative circles */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>

                        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2 relative z-10">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <span className="text-accent font-black uppercase tracking-[0.3em] text-xs">Spotify Premiere</span>
                                    <h2 className="text-4xl font-black md:text-6xl tracking-tighter uppercase">
                                        Shift <span className="text-white">Encounters</span>
                                    </h2>
                                    <p className="text-lg text-white/70 max-w-lg leading-relaxed font-medium">
                                        Listen to &ldquo;Mastering the Mystery of Christ&rdquo; series on Spotify. Prepare your spirit before the event.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <a href={EXTERNAL_LINKS.SPOTIFY} target="_blank" rel="noopener noreferrer">
                                        <Button variant="secondary" className="gap-3 rounded-2xl group bg-[#1DB954] hover:bg-[#1aa34a] text-white border-[#1DB954] shadow-none hover:shadow-none">
                                            <Music size={20} />
                                            Open on Spotify
                                        </Button>
                                    </a>
                                    {event.registrationConfig?.enabled && (
                                        <Link href={`/e/${eventId}/register`}>
                                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl">
                                                Join Event
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="glass-dark p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="aspect-square w-52 relative group cursor-pointer overflow-hidden rounded-3xl bg-white flex items-center justify-center">
                                            <div className="relative w-44 h-44">
                                                <Image
                                                    src="/qr-code.png"
                                                    alt="Scan QR code to listen on Spotify"
                                                    fill
                                                    className="object-contain rounded-2xl"
                                                    priority
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors rounded-3xl pointer-events-none"></div>
                                        </div>
                                        <div className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Scan to Listen</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Event Channels */}
            {event.channels && event.channels.length > 0 && (
                <div className="space-y-0">
                    {event.channels.map((channel, idx) => {
                        const channelColor = channel.color || '#7c3aed';
                        const isYouTube = channel.name.toLowerCase().includes('youtube');
                        const isMeet = channel.name.toLowerCase().includes('meet');
                        const isSpotify = channel.name.toLowerCase().includes('spotify');
                        
                        const Icon = isYouTube ? Youtube : isMeet ? Video : isSpotify ? Music : Radio;
                        
                        return (
                            <section 
                                key={channel.id || idx} 
                                className="py-16 md:py-24 overflow-hidden relative"
                                style={{ 
                                    background: `linear-gradient(135deg, color-mix(in srgb, ${channelColor} 5%, white), white 60%)` 
                                }}
                            >
                                <div className="container mx-auto container-px">
                                    <div className="max-w-6xl mx-auto">
                                        <div 
                                            className="bg-white rounded-3xl md:rounded-[3.5rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-2xl border-2"
                                            style={{ borderColor: `color-mix(in srgb, ${channelColor} 10%, transparent)` }}
                                        >
                                            {/* Decorative Background Elements */}
                                            <div 
                                                className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-10"
                                                style={{ backgroundColor: channelColor }}
                                            ></div>
                                            <div 
                                                className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-15"
                                                style={{ backgroundColor: channelColor }}
                                            ></div>

                                            <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2 relative z-10">
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <div 
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black uppercase tracking-[0.3em] text-[10px] md:text-xs"
                                                            style={{ 
                                                                backgroundColor: `color-mix(in srgb, ${channelColor} 10%, transparent)`,
                                                                color: channelColor
                                                            }}
                                                        >
                                                            <Icon size={16} />
                                                            {channel.name}
                                                        </div>
                                                        <h2 className="text-4xl font-black md:text-6xl tracking-tighter uppercase text-gray-900 leading-none">
                                                            {channel.title?.split(' ').map((word, i, arr) => (
                                                                <span key={i}>
                                                                    {i === arr.length - 1 ? <span style={{ color: channelColor }}>{word}</span> : word + ' '}
                                                                </span>
                                                            )) || (
                                                                <>Join <span style={{ color: channelColor }}>{channel.name}</span></>
                                                            )}
                                                        </h2>
                                                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
                                                            {channel.description || `Stay connected with us on ${channel.name} for the latest updates and sessions.`}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4">
                                                        <a href={channel.link} target="_blank" rel="noopener noreferrer">
                                                            <Button 
                                                                variant="secondary" 
                                                                className="gap-3 rounded-2xl group shadow-lg transition-all hover:-translate-y-1 h-14 px-8"
                                                                style={{ backgroundColor: channelColor, borderColor: channelColor, color: '#fff' }}
                                                            >
                                                                <Icon size={20} />
                                                                {isYouTube ? 'Visit Channel' : isMeet ? 'Join Meeting' : 'Open Link'}
                                                                <ExternalLink size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                                            </Button>
                                                        </a>
                                                        {event.registrationConfig?.enabled && (
                                                            <Link href={`/e/${eventId}/register`}>
                                                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl h-14 px-8">
                                                                    Register Now
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>

                                                    {channel.barcode && (
                                                        <div className="pt-6 border-t border-gray-100">
                                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Access Code / ID</p>
                                                            <div className="font-mono text-xl font-black tracking-widest text-gray-900">
                                                                {channel.barcode}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-center lg:justify-end">
                                                    <div 
                                                        className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-white/5 shadow-2xl relative group"
                                                        style={{ 
                                                            background: `linear-gradient(135deg, color-mix(in srgb, ${channelColor} 10%, white), white)` 
                                                        }}
                                                    >
                                                        <div 
                                                            className="aspect-square w-48 md:w-64 lg:w-72 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105"
                                                            style={{ background: channelColor }}
                                                        >
                                                            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                                                            <Icon size={140} className="text-white opacity-90 drop-shadow-2xl md:scale-100 scale-75" />
                                                            <div className="absolute bottom-6 text-[10px] font-black tracking-[0.3em] text-white uppercase opacity-80">
                                                                {isYouTube ? 'Subscribe' : 'Connect'}
                                                            </div>
                                                        </div>
                                                        {isMeet && (
                                                            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                                                                <div className="w-8 h-8 relative">
                                                                    <Image src="/icons/Google_Meet_icon.svg" alt="Meet" fill className="object-contain" />
                                                                </div>
                                                                <span className="text-xs font-black text-gray-900 uppercase">Live Stream</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}


            {/* Ministers Section */}
            {event.ministers && event.ministers.length > 0 && (
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto container-px">
                        <div className="max-w-6xl mx-auto space-y-10">
                            <div className="space-y-2 text-center">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Ministers</h3>
                                <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                                    Anointed <span className="text-primary">Voices</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {event.ministers.map((minister, idx) => (
                                    <div key={idx} className="group relative bg-gray-50 rounded-[2rem] p-6 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:border-primary/20">
                                        <div className="flex items-center gap-6">
                                            <div
                                                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-md border-2"
                                                style={{ borderColor: `${accent}60` }}
                                            >
                                                {minister.photo ? (
                                                    <Image src={minister.photo} alt={minister.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <UserPlus size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4
                                                    className="text-xl font-bold text-gray-900 underline decoration-4 underline-offset-4"
                                                    style={{ textDecorationColor: accent }}
                                                >{minister.name}</h4>
                                                <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: accent }}>{minister.position || 'Guest Minister'}</p>
                                            </div>
                                        </div>
                                        {minister.bio && <p className="mt-6 text-sm text-gray-500 leading-relaxed line-clamp-3">{minister.bio}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA */}
            <section className="py-24 md:py-32 text-center bg-gray-50/50">
                <div className="container mx-auto container-px space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-primary md:text-7xl tracking-tighter uppercase">
                            Ready for the Encounter?
                        </h2>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                            Join us at <strong>{event.venue.name}</strong> on {format(eventDate, 'MMMM do')}. Don&apos;t miss this encounter.
                        </p>
                    </div>
                    {registrationOpen && (
                        <Link href={`/e/${eventId}/register`}>
                            <Button size="lg" className="h-16 px-12 text-xl gap-3 rounded-4xl shadow-2xl shadow-primary/40 group btn-primary">
                                Secure Your Seat
                                <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                    )}
                    {registrationNotStarted && (
                        <div className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-base">
                            <Clock size={18} className="shrink-0" />
                            Registration opens {regOpen ? format(regOpen, 'do MMM yyyy') : ''}
                        </div>
                    )}
                    {registrationEnded && (
                        <div className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 font-bold text-base">
                            <Lock size={18} className="shrink-0" />
                            Registration has ended
                        </div>
                    )}
                </div>
            </section>

            {/* Fixed mobile CTA */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[calc(100%-48px)]">
                {registrationOpen && (
                    <Link href={`/e/${eventId}/register`}>
                        <Button className="w-full h-16 text-lg font-black uppercase tracking-widest btn-primary rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-primary/30 active:scale-95 transition-transform">
                            Register Now
                        </Button>
                    </Link>
                )}
            </div>

            <Footer event={event} />
        </div>
    );
}

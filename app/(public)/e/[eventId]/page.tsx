import { Button } from '@/src/components/ui/Button';
import Link from 'next/link';
import { EXTERNAL_LINKS } from '@/src/constants/links';
import {
    ArrowRight, Music, Video, Phone, ExternalLink,
    Youtube, Calendar, Clock, MapPin, UserPlus,
    Sparkles, ShieldCheck, Zap
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { format } from 'date-fns';
import { toJsDate } from '@/src/lib/utils';

export default async function EventHomePage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const events = await queryDocuments<Event>('events', { slug: eventId });
    if (!events.length) return notFound();
    const event = events[0];

    const eventDate = toJsDate(event.startDate);

    return (
        <div className="min-h-screen selection:bg-primary/20 bg-white text-gray-900 pb-20">
            {}
            <div className="relative w-full bg-white pt-6 md:pt-10">
                <div className="container mx-auto container-px">
                    <div className="relative group">
                        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl ring-1 ring-black/5 bg-gray-50">
                            {event.branding.bannerImage ? (
                                <Image
                                    src={event.branding.bannerImage}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                    sizes="100vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-primary-dark text-white font-black text-4xl p-10 text-center uppercase tracking-tighter">
                                    {event.title}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md text-accent border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <Sparkles size={12} />
                                        Featured Event
                                    </div>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                                        {event.title}
                                    </h1>
                                </div>

                                <div className="flex gap-3">
                                    {event.registrationConfig?.enabled && (
                                        <Link href={`/e/${eventId}/register`}>
                                            <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-gray-50 border-none font-bold shadow-xl">
                                                Register Now
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="container mx-auto container-px -mt-8 relative z-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 rounded-3xl bg-white shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                            <p className="font-bold text-gray-900">{format(eventDate, 'MMMM do, yyyy')}</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                            <p className="font-bold text-gray-900">{format(eventDate, 'h:mm a')}</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                            <p className="font-bold text-gray-900 line-clamp-1">{event.venue.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="container mx-auto container-px mt-20 md:mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {}
                    <div className="lg:col-span-8 space-y-20">
                        {}
                        <section className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">The Encounter</h3>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                                    About <span className="text-primary">The Event</span>
                                </h2>
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-wrap max-w-3xl">
                                {event.description}
                            </p>
                        </section>

                        {}
                        {event.ministers && event.ministers.length > 0 && (
                            <section className="space-y-10">
                                <div className="space-y-2">
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Ministers</h3>
                                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                                        Anointed <span className="text-primary">Voices</span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {event.ministers.map((minister, idx) => (
                                        <div key={idx} className="group relative bg-gray-50 rounded-[2rem] p-6 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:border-primary/20">
                                            <div className="flex items-center gap-6">
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-md">
                                                    {minister.photo ? (
                                                        <Image src={minister.photo} alt={minister.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                                                            <UserPlus size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900 underline decoration-primary decoration-4 underline-offset-4">{minister.name}</h4>
                                                    <p className="text-sm text-primary font-bold uppercase tracking-widest mt-1">{minister.position || 'Guest Minister'}</p>
                                                </div>
                                            </div>
                                            {minister.bio && <p className="mt-6 text-sm text-gray-500 leading-relaxed line-clamp-3">{minister.bio}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {}
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-green-600 to-green-900 p-8 shadow-2xl group cursor-pointer transition-transform hover:-translate-y-1">
                                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <Music size={200} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                        <Music size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Spotify Playlist</h4>
                                        <p className="text-sm text-white/70 font-medium">Prepare your spirit with the Shift Encounters series.</p>
                                    </div>
                                    <a href={EXTERNAL_LINKS.SPOTIFY} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full rounded-xl bg-white text-green-700 hover:bg-gray-100 border-none font-bold">Listen Now</Button>
                                    </a>
                                </div>
                            </div>

                            {}
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-red-600 to-red-900 p-8 shadow-2xl group cursor-pointer transition-transform hover:-translate-y-1">
                                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <Youtube size={200} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                        <Youtube size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Watch Live</h4>
                                        <p className="text-sm text-white/70 font-medium">Subscribe and stay connected with our community.</p>
                                    </div>
                                    <a href={EXTERNAL_LINKS.YOUTUBE} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full rounded-xl bg-white text-red-700 hover:bg-gray-100 border-none font-bold">Visit Channel</Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-10 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-2xl shadow-primary/10 space-y-8 overflow-hidden relative">
                                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl"></div>

                                <div className="space-y-4 text-center">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase">Secure Your Place</h3>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        Limited seats are available for this encounter. Register today to avoid missing out.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {event.registrationConfig?.enabled && (
                                        <Link href={`/e/${eventId}/register`} className="block">
                                            <Button className="w-full h-16 text-lg btn-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group">
                                                Register For Event
                                                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    )}
                                    {event.invitationConfig?.enabled && (
                                        <Link href={`/e/${eventId}/invite`} className="block">
                                            <Button variant="outline" className="w-full h-16 text-lg rounded-2xl border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-3 text-gray-600">
                                                Invite Someone
                                                <UserPlus size={20} className="opacity-60" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-50 space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <ShieldCheck size={18} className="text-green-500" />
                                        Free Entry / Online Access
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <Zap size={18} className="text-amber-500" />
                                        Spiritual Refreshment Guaranteed
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="bg-linear-to-br from-primary to-primary-dark rounded-[2.5rem] p-8 text-white shadow-xl">
                                <p className="text-lg font-medium italic leading-relaxed text-white/90">
                                    &ldquo;{event.themeBibleVerse || 'But as for you, continue in what you have learned and have become convinced of.'}&rdquo;
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-px flex-1 bg-white/20"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">
                                        {event.theme || 'The Word'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <section className="container mx-auto container-px mt-32 text-center space-y-12">
                <div className="max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                        Join Us <span className="text-primary">From Everywhere</span>
                    </h2>
                    <p className="text-lg text-gray-500 font-medium">
                        Can&apos;t make it in person? Experience the shift live via Google Meet.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
                    <div className="space-y-6">
                        <div className="h-16 w-16 relative">
                            <Image src="/icons/Google_Meet_icon.svg" alt="Google Meet" fill className="object-contain" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-black text-gray-900 uppercase">Live Streaming</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                High-quality video and audio streaming for our global community members.
                            </p>
                        </div>
                        <a href={EXTERNAL_LINKS.GOOGLE_MEET.VIDEO_LINK} target="_blank" rel="noopener noreferrer">
                            <Button className="h-14 px-8 rounded-xl bg-[#00832d] hover:bg-[#006b24] text-white gap-3 font-bold border-none shadow-lg">
                                Join Meeting
                                <ExternalLink size={18} />
                            </Button>
                        </a>
                    </div>
                    <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-12">
                        <h5 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Join By Phone</h5>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Dial In:</p>
                                <a href={`tel:${EXTERNAL_LINKS.GOOGLE_MEET.PHONE}`} className="text-primary font-black text-lg hover:underline transition-all">
                                    {EXTERNAL_LINKS.GOOGLE_MEET.PHONE}
                                </a>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">PIN:</p>
                                <p className="text-primary font-black text-lg">{EXTERNAL_LINKS.GOOGLE_MEET.PIN}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[calc(100%-48px)]">
                {event.registrationConfig?.enabled && (
                    <Link href={`/e/${eventId}/register`}>
                        <Button className="w-full h-16 text-lg font-black uppercase tracking-widest bg-primary text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-primary/30 active:scale-95 transition-transform">
                            Register Now
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

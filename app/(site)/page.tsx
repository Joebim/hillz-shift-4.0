import { Banner } from '@/src/components/shared/Banner';
import { EventHeader } from '@/src/components/shared/EventHeader';
import { Footer } from '@/src/components/shared/Footer';
import { Button } from '@/src/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';
import { EXTERNAL_LINKS } from '@/src/constants/links';
import { ArrowRight, Music, Video, Phone, ExternalLink, Youtube, Calendar, Clock, MapPin, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white selection:bg-primary/20">
            <Banner />
            <EventHeader />

            {/* Event Details */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto container-px">
                    <div className="max-w-6xl mx-auto">
                        <div className="rounded-3xl md:rounded-[3rem] border-2 border-primary/10 bg-linear-to-br from-white via-primary/5 to-white p-8 md:p-12 lg:p-20 shadow-lg relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>

                            <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
                                {/* Left: Scripture + CTA */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black uppercase tracking-[0.3em] text-xs">
                                            SHIFT 4.0
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-primary-dark uppercase tracking-tighter leading-tight">
                                            A DATE WITH JESUS THE WORD, <span className="text-primary">SEATED AT THE RIGHT HAND OF POWER</span>
                                        </h2>
                                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
                                            MARK 14:62
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <Link href={ROUTES.REGISTER}>
                                            <Button size="lg" className="gap-3 rounded-2xl group">
                                                Register
                                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                        <Link href={ROUTES.INVITE}>
                                            <Button size="lg" variant="outline" className="gap-3 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50">
                                                Invite someone
                                                <UserPlus size={18} />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Right: Event info */}
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                                <MapPin size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Venue</div>
                                                <div className="mt-1 text-lg font-black text-primary-dark">IKENGA HALL</div>
                                                <div className="mt-2 text-sm font-semibold text-gray-600">
                                                    RADISSON IKEJA LAGOS, 42/44 ISAAC JOHN STREET, GRA IKEJA LAGOS, NIGERIA.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Date</div>
                                                    <div className="mt-1 text-lg font-black text-primary-dark">31ST, JAN. 2026</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-xl bg-accent/15 p-2 text-accent-foreground">
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Time</div>
                                                    <div className="mt-1 text-lg font-black text-primary-dark">10AM - 5PM</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass p-6 rounded-2xl">
                                        <div className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-2">Why this matters</div>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            SHIFT Conference was established by the instruction of the Holy Spirit with a mandate to bring men and women up the hill, the holy hill of Zion, the place of Christ&apos;s dominion on earth.
                                            <br /><br />
                                            It is a time of deep immersion into the mysteries of Christ through His Word and a season of earnest supplication, transforming men and women into carriers of God&apos;s presence, true bearers of divine presence wherever they go, exercising Christ&apos;s dominion on earth.
                                            <br /><br />
                                            Come expecting clarity, communion, and a fresh unveiling of Christ.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Feature / Spotify Tie-in */}
            <section className="bg-primary-dark py-16 md:py-24 text-white">
                <div className="container mx-auto container-px">
                    <div className="flyer-gradient rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-2xl">
                        {/* Decorative circles */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>

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
                                        <Button variant="secondary" className="gap-3 rounded-2xl group">
                                            <Music size={20} />
                                            Open on Spotify
                                        </Button>
                                    </a>
                                    <Link href={ROUTES.REGISTER}>
                                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl">
                                            Join Event
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="glass-dark p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-white/5 shadow-2xl">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="aspect-square w-52 relative group cursor-pointer overflow-hidden rounded-3xl bg-white flex items-center justify-center">
                                            <div className="relative w-44 h-44">
                                                <Image
                                                    src="/graphics/Mastering_The_Misteries_of_Christ_-_Temi_Adenigba-1024.png"
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

            {/* YouTube Channel Section */}
            {EXTERNAL_LINKS.YOUTUBE !== "#" && (
                <section className="bg-linear-to-br from-red-50 via-red-50/50 to-white py-16 md:py-24">
                    <div className="container mx-auto container-px">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-2xl border-2 border-red-100">
                                {/* Decorative circles */}
                                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-red-500/10 blur-3xl"></div>
                                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-red-600/10 blur-3xl"></div>

                                <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2 relative z-10">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 font-black uppercase tracking-[0.3em] text-xs">
                                                <Youtube size={16} />
                                                YouTube Channel
                                            </div>
                                            <h2 className="text-4xl font-black md:text-6xl tracking-tighter uppercase text-gray-900">
                                                Watch & <span className="text-red-600">Learn</span>
                                            </h2>
                                            <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
                                                Subscribe to our YouTube channel for powerful teachings, testimonies, and event highlights. Stay connected with the community.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <a href={EXTERNAL_LINKS.YOUTUBE} target="_blank" rel="noopener noreferrer">
                                                <Button variant="secondary" className="gap-3 rounded-2xl group bg-red-600 hover:bg-red-700 text-white border-red-600">
                                                    <Youtube size={20} />
                                                    Visit Channel
                                                </Button>
                                            </a>
                                            <Link href={ROUTES.REGISTER}>
                                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl">
                                                    Register Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="glass-dark p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border-white/5 shadow-2xl bg-linear-to-br from-red-50 to-white">
                                            <div className="aspect-video w-full max-w-md bg-linear-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                                <div className="absolute inset-0 bg-red-600/20 group-hover:bg-transparent transition-colors"></div>
                                                <Youtube size={120} className="text-white opacity-90 drop-shadow-2xl" />
                                                <div className="absolute bottom-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase">Subscribe</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Google Meet Live Streaming Section */}
            <section className="bg-linear-to-br from-green-50 via-blue-50/30 to-indigo-50 py-16 md:py-24">
                <div className="container mx-auto container-px">
                    <div className="mx-auto">
                        <div className="bg-white rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-lg border-2 border-green-100">


                            <div className="relative z-10 space-y-10">
                                {/* Header with Icon */}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="shrink-0">
                                        <div className="relative w-16 h-16">
                                            <Image
                                                src="/icons/Google_Meet_icon.svg"
                                                alt="Google Meet"
                                                fill
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-black uppercase tracking-[0.3em] text-xs mb-4">
                                            <Video size={16} />
                                            Live Streaming
                                        </div>
                                        <h2 className="text-4xl font-black md:text-6xl tracking-tighter uppercase text-gray-900 mb-3">
                                            Join Us <span className="text-green-600">Live</span>
                                        </h2>
                                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                            Can&apos;t make it in person? Join us live via Google Meet for an immersive online experience.
                                        </p>
                                    </div>
                                </div>

                                {/* Primary Action */}
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href={EXTERNAL_LINKS.GOOGLE_MEET.VIDEO_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="secondary" className="gap-3 rounded-2xl group bg-[#00832d] hover:bg-[#006b24] text-white border-[#00832d]">
                                            <Video size={20} />
                                            Join Google Meet
                                            <ExternalLink size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </Button>
                                    </a>
                                    <Link href={ROUTES.REGISTER}>
                                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl">
                                            Register Now
                                        </Button>
                                    </Link>
                                </div>

                                {/* Phone Access */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Or Join by Phone</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-green-300 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Phone size={18} className="text-green-600" />
                                                <span className="text-sm font-bold text-gray-700">Dial In</span>
                                            </div>
                                            <a
                                                href={`tel:${EXTERNAL_LINKS.GOOGLE_MEET.PHONE}`}
                                                className="text-base text-green-600 hover:text-green-700 hover:underline font-semibold block mb-1"
                                            >
                                                {EXTERNAL_LINKS.GOOGLE_MEET.PHONE}
                                            </a>
                                            <p className="text-sm text-gray-600">
                                                PIN: <span className="font-mono font-bold text-gray-900">{EXTERNAL_LINKS.GOOGLE_MEET.PIN}</span>
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Phone size={18} className="text-blue-600" />
                                                <span className="text-sm font-bold text-gray-700">More Numbers</span>
                                            </div>
                                            <a
                                                href={EXTERNAL_LINKS.GOOGLE_MEET.MORE_PHONE_NUMBERS}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline font-semibold flex items-center gap-2"
                                            >
                                                View all phone numbers
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 md:py-32 text-center bg-gray-50/50">
                <div className="container mx-auto container-px space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-primary-dark md:text-7xl tracking-tighter uppercase">
                            Ready for A <span className="text-primary">Shift?</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                            Join us at <strong>Ikenga Hall, Radisson Ikeja</strong> on Jan 31st. Limited seats available for this encounter.
                        </p>
                    </div>
                    <Link href={ROUTES.REGISTER}>
                        <Button size="lg" className="h-16 px-12 text-xl gap-3 rounded-4xl shadow-2xl shadow-primary/40 group">
                            Secure Your Seat
                            <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}


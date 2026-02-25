import Link from 'next/link';
import Image from 'next/image';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { Event } from '@/src/types/event';
import { Sermon } from '@/src/types/sermon';
import { Ministry } from '@/src/types/ministry';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Hero } from '@/src/components/home/Hero';
import { Newsletter } from '@/src/components/home/Newsletter';
import { Section } from '@/src/components/shared/Section';
import { EventCard } from '@/src/components/events/EventCard';
import { SermonCard } from '@/src/components/sermons/SermonCard';
import { MinistryCard } from '@/src/components/ministries/MinistryCard';
import { Button } from '@/src/components/ui/Button';
import { ArrowRight, Quote, Clock, CheckCircle2, Sparkles, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'The Hillz | Experience New Dimensions',
    description: 'Welcome to The Hillz platform. Join us for transformative gatherings and spiritual experiences.',
};

export default async function HomePage() {
    // Fetch featured content
    const [rawEvents, rawSermons, rawMinistries] = await Promise.all([
        queryDocuments<Event>('events', { status: 'published', featured: true }, 'startDate', 3),
        queryDocuments<Sermon>('sermons', {}, 'date', 3),
        queryDocuments<Ministry>('ministries', { active: true }, 'order', 4),
    ]);

    // Serialize data for components
    const featuredEvents = rawEvents.map(event => ({
        ...event,
        startDate: toJsDate(event.startDate),
        endDate: toJsDate(event.endDate),
        createdAt: toJsDate(event.createdAt),
        updatedAt: toJsDate(event.updatedAt),
    }));

    const latestSermons = rawSermons.map(sermon => ({
        ...sermon,
        date: toJsDate(sermon.date),
        createdAt: toJsDate(sermon.createdAt),
        updatedAt: toJsDate(sermon.updatedAt),
    }));

    const ministries = rawMinistries.map(ministry => ({
        ...ministry,
        createdAt: toJsDate(ministry.createdAt),
        updatedAt: toJsDate(ministry.updatedAt),
    }));

    return (
        <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900 font-medium">
            <Header />

            <Hero />

            {/* Sunday Service Times Section - Inspired by reference */}
            <Section bg="none" className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-widest mb-6">
                            <Clock className="w-3.5 h-3.5" />
                            Weekly Gatherings
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                            Join Us This Sunday
                        </h2>
                        <p className="text-xl text-slate-500 font-medium">
                            Experience The Hillz in person. We have multiple service times <br className="hidden md:block" />
                            designed to fit your schedule and spiritual needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Service Card 1 */}
                        <div className="group bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 mb-8">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-2">7:30 AM</h3>
                            <p className="text-xl font-bold text-slate-600 mb-6">Morning Prayer</p>
                            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                                A quiet, reflective start to your Sunday with liturgical prayer and meditation.
                            </p>
                            <Button variant="outline" className="w-full rounded-2xl h-14 border-slate-200 group-hover:border-purple-600 group-hover:text-purple-600 font-bold transition-all">
                                Plan a Visit
                            </Button>
                        </div>

                        {/* Service Card 2 - FEATURED */}
                        <div className="group relative bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-indigo-200 overflow-hidden transform md:scale-110 z-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest mb-8">
                                    <Sparkles className="w-3 h-3" /> Popular
                                </div>
                                <h3 className="text-4xl font-black text-white mb-2">9:00 AM</h3>
                                <p className="text-xl font-bold text-purple-300 mb-6">The Grand Shift</p>
                                <p className="text-slate-300 font-medium mb-10 leading-relaxed">
                                    Our main celebration with full choir, powerful teaching, and children&apos;s ministry.
                                </p>
                                <Button className="w-full rounded-2xl h-14 bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg shadow-purple-900/20">
                                    Join Main Service
                                </Button>
                            </div>
                        </div>

                        {/* Service Card 3 */}
                        <div className="group bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 mb-8">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-2">11:30 AM</h3>
                            <p className="text-xl font-bold text-slate-600 mb-6">Mid-Day Worship</p>
                            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                                An energetic, contemporary worship experience designed for the whole family.
                            </p>
                            <Button variant="outline" className="w-full rounded-2xl h-14 border-slate-200 group-hover:border-purple-600 group-hover:text-purple-600 font-bold transition-all">
                                Get Directions
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Info Section 1 - Text Left, Image Right */}
            <Section bg="white" className="py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="max-w-xl">
                        <div className="w-12 h-1.5 bg-purple-600 rounded-full mb-8" />
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                            WELCOME TO <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">THE HILLZ</span>
                        </h2>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                            We are more than just a church; we are a community focused on spiritual renewal, personal growth, and collective impact. Join a movement that is transforming the culture through founded faith.
                        </p>
                        <div className="space-y-4 mb-10">
                            {[
                                'Transformative Worship Experiences',
                                'Biblical Wisdom for Modern Living',
                                'Thriving Community of Believers'
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-700 font-bold">{item}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="primary" size="lg" className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl shadow-slate-200">
                            Learn Our Vision <ArrowRight className="w-5 h-5 ml-3" />
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-tr from-purple-100 to-indigo-100 rounded-[60px] blur-2xl opacity-50" />
                        <div className="relative rounded-[60px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] h-[600px]">
                            <Image
                                src="/welcome_to_the_hillz_landing.png"
                                alt="Welcome to The Hillz"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                unoptimized
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-50 max-w-xs hidden md:block animate-bounce-slow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900 leading-none">2.5k+</p>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Members</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 font-bold italic leading-none">&quot;A place where everyone belongs.&quot;</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Testimonials - Inspired by reference */}
            <Section className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-purple-600 rounded-full blur-[150px] -translate-y-1/2" />
                </div>

                <div className="relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-xs font-black uppercase tracking-widest mb-6">
                            Life Transformations
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                            Stories of The Hillz
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah Jemison',
                                role: 'Worship Team',
                                text: 'Joining The Hillz platform has been life-changing. The warmth and support helped me grow in my faith and find true belonging.',
                                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
                            },
                            {
                                name: 'David Thompson',
                                role: 'Youth Leader',
                                text: 'The sermons are inspiring and relevant. I leave feeling uplifted and motivated. This platform truly feels like home.',
                                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Ministry Partner',
                                text: 'I found a community that challenged me to go deeper. The transformation is real, and it starts from within.',
                                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10 hover:bg-white/10 transition-all duration-500 group">
                                <Quote className="w-12 h-12 text-purple-500/30 mb-8 group-hover:text-purple-400 transition-colors" />
                                <p className="text-xl text-white/80 font-medium mb-10 leading-relaxed italic">
                                    &quot;{t.text}&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-500/30">
                                        <Image src={t.image} alt={t.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black">{t.name}</p>
                                        <p className="text-purple-400 text-xs font-black uppercase tracking-widest">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Featured Events Section */}
            {featuredEvents.length > 0 && (
                <Section bg="white" className="py-32">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <div className="w-12 h-1.5 bg-[#D4AF37] rounded-full mb-8" />
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                                DON&apos;T MISS <br />
                                <span className="text-[#D4AF37]">THE MOMENT</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium max-w-xl">
                                Our upcoming gatherings are carefully curated experiences designed to spark transformation.
                            </p>
                        </div>
                        <Link href="/events">
                            <Button size="lg" className="rounded-2xl h-16 px-10 border-2 border-slate-100 hover:bg-slate-50 text-slate-900 font-black text-lg transition-all group shadow-xl">
                                Explore Calendar <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </Section>
            )}

            {/* Latest Sermons Section */}
            <Section bg="gray" className="py-32">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                            Latest Messages
                        </h2>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl">
                            Dive deep into the word with teachings that challenge and inspire.
                        </p>
                    </div>
                    <Link href="/sermons">
                        <Button variant="outline" className="rounded-full px-8 font-bold border-slate-200">
                            View Archive
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {latestSermons.map((sermon) => (
                        <SermonCard key={sermon.id} sermon={sermon} />
                    ))}
                </div>
            </Section>

            {/* Ministries Section */}
            <Section bg="white" className="py-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        Find Your Tribe
                    </h2>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Growth happens in circles, not just rows. Connect with a ministry group that speaks to your stage of life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {ministries.map((ministry) => (
                        <MinistryCard key={ministry.id} ministry={ministry} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/ministries">
                        <Button size="lg" className="rounded-2xl h-16 px-12 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg shadow-2xl shadow-purple-200">
                            Explore All Ministries
                        </Button>
                    </Link>
                </div>
            </Section>

            {/* Newsletter */}
            <Newsletter />

            <Footer />
        </div>
    );
}

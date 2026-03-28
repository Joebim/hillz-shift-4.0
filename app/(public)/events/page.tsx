import Image from 'next/image';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { Event } from '@/src/types/event';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { EventGrid } from '@/src/components/events/EventGrid';
import { Calendar, Sparkles } from 'lucide-react';
import { Section } from '@/src/components/shared/Section';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Events | Hillz Shift 4.0',
    description: 'Join us for transformative gatherings and spiritual experiences',
};

export default async function EventsPage() {
    const rawEvents = await queryDocuments<Event>(
        'events',
        { status: 'published' },
        'startDate',
        100
    );

    const events = rawEvents.map(event => ({
        ...event,
        startDate: toJsDate(event.startDate),
        endDate: toJsDate(event.endDate),
        registrationOpenDate: toJsDate(event.registrationOpenDate),
        registrationCloseDate: toJsDate(event.registrationCloseDate),
        createdAt: toJsDate(event.createdAt),
        updatedAt: toJsDate(event.updatedAt),
    }));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
                        alt="Events"
                        fill
                        className="object-cover opacity-60"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Calendar className="w-3 h-3" />
                            {events.length} Upcoming Gatherings
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            EXPERIENCE <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-300 to-indigo-400">THE MYSTERY</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl font-medium animate-fade-in-up delay-100 italic">
                            &quot;and to make all men see what is the fellowship of the mystery, which from the beginning of the world hath been hid in God, who created all things by Jesus Christ.&quot; — Ephesians 3:9
                        </p>
                    </div>
                </div>

                {}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-linear-to-tl from-purple-600/20 to-transparent blur-3xl" />
            </section>

            {}
            <Section bg="gray" className="py-24">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Discover All Events</h2>
                </div>
                <EventGrid events={events} />
            </Section>

            <Footer />
        </div>
    );
}

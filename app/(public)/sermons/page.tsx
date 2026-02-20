import Image from 'next/image';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { Sermon } from '@/src/types/sermon';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { SermonCard } from '@/src/components/sermons/SermonCard';
import { Section } from '@/src/components/shared/Section';
import { PlayCircle, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Sermons | Hillz Shift 4.0',
    description: 'Watch and listen to our latest sermons and teachings.',
};

export default async function SermonsPage() {
    const rawSermons = await queryDocuments<Sermon>('sermons', {}, 'date', 100);

    const sermons = rawSermons.map(sermon => ({
        ...sermon,
        date: toJsDate(sermon.date),
        createdAt: toJsDate(sermon.createdAt),
        updatedAt: toJsDate(sermon.updatedAt),
    }));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                        alt="Sermons"
                        fill
                        className="object-cover opacity-60"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <PlayCircle className="w-3 h-3" />
                            Digital Worship Library
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            WORDS FOR THE <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-300 to-indigo-400">SHIFTED SOUL</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            &quot;Faith comes from hearing, and hearing through the word of Christ.&quot; — Romans 10:17
                        </p>
                    </div>
                </div>
            </section>

            {/* Sermon Grid Section */}
            <Section bg="gray" className="py-24">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Recent Teachings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sermons.map((sermon) => (
                        <SermonCard key={sermon.id} sermon={sermon} />
                    ))}
                </div>

                {sermons.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100">
                        <p className="text-xl text-slate-400 font-bold leading-relaxed">
                            The word is being prepared. <br /> Check back soon for new messages.
                        </p>
                    </div>
                )}
            </Section>

            <Footer />
        </div>
    );
}

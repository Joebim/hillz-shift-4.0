import Image from 'next/image';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { Ministry } from '@/src/types/ministry';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { MinistryCard } from '@/src/components/ministries/MinistryCard';
import { Section } from '@/src/components/shared/Section';
import { Users, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Ministries | Hillz Shift 4.0',
    description: 'Explore our ministries and find where you belong.',
};

export default async function MinistriesPage() {
    const rawMinistries = await queryDocuments<Ministry>('ministries', { active: true }, 'order', 100);

    const ministries = rawMinistries.map(ministry => ({
        ...ministry,
        createdAt: toJsDate(ministry.createdAt),
        updatedAt: toJsDate(ministry.updatedAt),
    }));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop"
                        alt="Ministries"
                        fill
                        className="object-cover opacity-60"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                        <Users className="w-3 h-3" />
                        Community & Growth
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                        FIND YOUR <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-indigo-400">PERFECT TRIBE</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                        &quot;As iron sharpens iron, so one person sharpens another.&quot; — Proverbs 27:17
                    </p>
                </div>
            </section>

            {}
            <Section bg="white" className="py-24">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Active Communities</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ministries.map((ministry) => (
                        <MinistryCard key={ministry.id} ministry={ministry} />
                    ))}
                </div>

                {ministries.length === 0 && (
                    <div className="text-center py-24 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                        <p className="text-xl text-slate-400 font-bold">New communities are forming. Check back soon.</p>
                    </div>
                )}
            </Section>

            <Footer />
        </div>
    );
}

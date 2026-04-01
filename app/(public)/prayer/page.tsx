import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';

import { Section } from '@/src/components/shared/Section';
import { PrayerForm } from '@/src/components/prayer/PrayerForm';
import { Card } from '@/src/components/ui/Card';
import { Heart, Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Prayer Request | The Hillz',
    description: 'Submit your prayer requests. We are here to pray with you.',
};

export default function PrayerPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="/prayer_hero.png"
                        alt="Prayer"
                        fill
                        className="object-cover opacity-60"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Heart className="w-3 h-3 text-pink-400 animate-pulse" />
                            How Can We Pray for You?
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            POWER OF <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">INTERCESSION</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            &quot;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&quot; — Philippians 4:6
                        </p>
                    </div>
                </div>

                {}
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-tr from-indigo-600/20 to-transparent blur-3xl" />
            </section>

            <Section className="py-24 bg-slate-50 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <Card variant="default" padding="none" className="-mt-32 relative z-20 shadow-2xl shadow-indigo-900/10 border border-slate-100 bg-white rounded-[40px] overflow-hidden animate-fade-in-up delay-200">
                        <div className="p-8 md:p-12">
                            <div className="mb-12 text-center">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Submit Prayer Request</h2>
                                <p className="text-slate-500 font-bold mt-4">Our prayer team is dedicated to interceding for your needs with faith and compassion.</p>
                            </div>

                            <PrayerForm />
                        </div>
                    </Card>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Sparkles, Target, Compass } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export const metadata = {
    title: 'Vision & Mission | The Hillz',
    description: 'Learn about our vision and mission.',
};

export default function VisionMissionPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-slate-900/50 to-slate-900 z-10" />
                    <Image
                        src="/vision_hero.png"
                        alt="Vision and Mission"
                        fill
                        className="object-cover opacity-60 animate-slow-zoom"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Compass className="w-3 h-3 text-indigo-400" />
                            Our Purpose
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            VISION & <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">MISSION</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            &quot;Where there is no vision, the people perish...&quot; — Proverbs 29:18
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-tr from-indigo-600/20 to-transparent blur-3xl" />
            </section>

            <Section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <Card variant="default" padding="none" className="-mt-32 relative z-20 shadow-2xl shadow-indigo-900/10 border border-slate-100 bg-white rounded-[40px] overflow-hidden animate-fade-in-up delay-200">
                        <div className="p-8 md:p-16">
                            <div className="grid md:grid-cols-2 gap-16">
                                {/* Vision Column */}
                                <div>
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Our Vision</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        Our vision is to see a generation fully awake to their divine purpose and walking in the fullness of God&apos;s power. We long to build a Christ-centered community that shatters the mold of traditional religion to embrace real, transformative faith.
                                    </p>
                                </div>

                                {/* Mission Column */}
                                <div>
                                    <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Our Mission</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                                        We are creating intentional spaces for radical transformation through worship, word, and community.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            'Living out radical love every single day',
                                            'Demonstrating dynamic, earth-shaking faith',
                                            'Impacting generations globally for God\'s glory'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                                </div>
                                                <span className="text-slate-700 font-bold">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

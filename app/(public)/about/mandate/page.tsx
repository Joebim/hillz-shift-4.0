import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Sparkles, Target, Compass } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export const metadata = {
    title: 'Mandate & Mission | The Hillz',
    description: 'Learn about our mandate and mission.',
};

export default function MandateMissionPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-slate-900/50 to-slate-900 z-10" />
                    <Image
                        src="/vision_hero.png"
                        alt="Mandate and Mission"
                        fill
                        className="object-cover opacity-60"
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
                            MANDATE & <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">MISSION</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 whitespace-nowrap italic leading-relaxed">
                            &quot;Who are these that fly along like clouds, like doves to their nests?&quot; — Isaiah 60:8
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
                                {}
                                <div>
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Our Mandate</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        Our Mandate is to raise a nation of Priest and Kings fully awake to their purpose in God. A people of His presence, His kingdom and His dominion. <br />
                                        Positioned on the Father&apos;s Hillz (Holy hill of Zion) with the Son and exercising Christ&apos;s absolute authority over the nations - as those who put their trust in Him — Psalm 2:1 - 12
                                    </p>
                                </div>

                                {}
                                <div>
                                    <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Our Mission</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                                        Our Mission is to equip millions around the world with what it takes to ascend and remain on the Father&apos;s Hillz. Our teachings and ministries focuses on:
                                    </p>
                                    
                                    <ul className="space-y-4">
                                        {[
                                            'Repairing foundations',
                                            'Refocusing purpose',
                                            'Releasing for the flight'
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

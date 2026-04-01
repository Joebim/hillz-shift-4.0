import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Users, HeartHandshake } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export const metadata = {
    title: 'Leadership | The Hillz',
    description: 'Meet the leadership team of The Hillz.',
};

export default function LeadershipPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-slate-900/50 to-slate-900 z-10" />
                    <Image
                        src="/leadership_hero.png"
                        alt="Our Leadership"
                        fill
                        className="object-cover opacity-60"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Users className="w-3 h-3 text-pink-400" />
                            Our Team
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            MEET OUR <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">LEADERS</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            Guided by faith, grounded in truth, and dedicated to serving the congregation with vision and love.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-tr from-indigo-600/20 to-transparent blur-3xl" />
            </section>

            <Section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <Card variant="default" padding="none" className="-mt-32 relative z-20 shadow-2xl shadow-indigo-900/10 border border-slate-100 bg-white rounded-[40px] overflow-hidden animate-fade-in-up delay-200">
                        <div className="p-8 md:p-16 text-center">
                            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <HeartHandshake className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Servant Leadership</h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8 max-w-2xl mx-auto">
                                Our pastors, elders, and ministry directors believe that true leadership starts with a servant&apos;s heart. We are committed to fostering an atmosphere of authentic connection and spiritual growth for every member of The Hillz.
                            </p>

                            <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 max-w-2xl mx-auto">
                                <p className="text-indigo-900 font-bold italic">
                                    &quot;Be shepherds of God&apos;s flock that is under your care, watching over them... not lording it over those entrusted to you, but being examples to the flock.&quot; <br /><br />
                                    <span className="text-sm opacity-60 mt-2 block">&mdash; 1 Peter 5:2-3</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

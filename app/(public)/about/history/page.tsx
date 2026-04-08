import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { History as HistoryIcon, Clock, Flame } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export const metadata = {
    title: 'History | The Hillz',
    description: 'Learn about the history of The Hillz.',
};

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-slate-900/50 to-slate-900 z-10" />
                    <Image
                        src="/history_new.png"
                        alt="Our History"
                        fill
                        className="object-cover opacity-60"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <HistoryIcon className="w-3 h-3 text-purple-400" />
                            Our Journey
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            OUR <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">HISTORY</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            From humble gatherings to a thriving community, witnessing God&apos;s faithfulness through every season.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-tr from-indigo-600/20 to-transparent blur-3xl" />
            </section>

            <Section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <Card variant="default" padding="none" className="-mt-32 relative z-20 shadow-2xl shadow-indigo-900/10 border border-slate-100 bg-white rounded-[40px] overflow-hidden animate-fade-in-up delay-200">
                        <div className="p-8 md:p-16">
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Foundation</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                                        What began as a divine whisper to transform how we experience faith has blossomed into The Hillz. It started with a small group of passionate believers gathering to seek a deeper, more authentic encounter with God.
                                    </p>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        Through the years, our community has grown remarkably. We&apos;ve witnessed countless lives transformed, families restored, and individuals stepping into their God-given purposes. But we believe we are only just beginning to see what God has in store for The Hillz.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex gap-4 p-6 rounded-3xl bg-indigo-50 border border-indigo-100">
                                        <Clock className="w-8 h-8 text-indigo-500 shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">Humble Beginnings</h3>
                                            <p className="text-sm text-slate-600 font-medium">Starting from living room prayer meetings, our foundation was built entirely on seeking God&apos;s face.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-6 rounded-3xl bg-pink-50 border border-pink-100">
                                        <Flame className="w-8 h-8 text-pink-500 shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-2">A Reignited Passion</h3>
                                            <p className="text-sm text-slate-600 font-medium">As the community expanded, so did our desire to impact the generation with radical love and transformative worship.</p>
                                        </div>
                                    </div>
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

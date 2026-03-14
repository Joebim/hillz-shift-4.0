import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Button } from '@/src/components/ui/Button';
import { CheckCircle2, Heart, Shield, Star, Users, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'About Us | The Hillz',
    description: 'Learn about our vision, mission, and the history of The Hillz.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-medium">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="/about_hero.png"
                        alt="About Us"
                        fill
                        className="object-cover opacity-60"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                        <Star className="w-3 h-3" />
                        Our Journey & Vision
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                        BEYOND THE <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-300 to-indigo-400">TRADITIONAL</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                        &quot;Then I saw a new heaven and a new earth...&quot; — Revelation 21:1
                    </p>
                </div>
            </section>

            {}
            <Section bg="white" className="py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-tr from-purple-100 to-indigo-100 rounded-[60px] blur-2xl opacity-50" />
                        <div className="relative rounded-[60px] overflow-hidden shadow-2xl h-[600px]">
                            <Image
                                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop"
                                alt="Our Vision"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="max-w-xl">
                        <div className="w-12 h-1.5 bg-purple-600 rounded-full mb-8" />
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
                            Called to Impact
                        </h2>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                            The Hillz began as a divine whisper to transform how we experience faith in the modern world. We aren&apos;t just a church; we are a catalyst for spiritual breakthrough.
                        </p>

                        <div className="space-y-8">
                            {[
                                {
                                    title: 'Our Vision',
                                    desc: 'To see a generation fully awake to their divine purpose and walking in the fullness of God&apos;s power.',
                                    icon: Sparkles
                                },
                                {
                                    title: 'Our Mission',
                                    desc: 'Creating intentional spaces for radical transformation through worship, word, and community.',
                                    icon: Heart
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {}
            <Section bg="gray" className="py-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        What We Breathe
                    </h2>
                    <p className="text-xl text-slate-500 font-bold">
                        Our culture is built on these non-negotiable pillars of faith and practice.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: 'Radical Love', desc: 'Acceptance without exceptions, reflecting the heart of Christ.', icon: Heart },
                        { title: 'Dynamic Faith', desc: 'A living, breathing relationship with God that moves mountains.', icon: Shield },
                        { title: 'Generational Impact', desc: 'Building legacies that outlast our own lifetimes.', icon: Users },
                        { title: 'Spiritual Excellence', desc: 'Giving God our absolute best in everything we do.', icon: Star },
                        { title: 'Unfiltered Worship', desc: 'Authentic expression of gratitude and awe.', icon: Sparkles },
                        { title: 'Divine Purpose', desc: 'Calling every individual into their unique God-given destiny.', icon: CheckCircle2 }
                    ].map((value, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-500">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 transition-colors">
                                <value.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{value.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {}
            <Section bg="none" className="py-32 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-r from-purple-900/90 to-slate-900/90" />
                    <Image
                        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop"
                        alt="Community"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-none">
                        READY TO <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-300">WALK WITH US?</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/events">
                            <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-gray-100 font-black text-lg shadow-2xl">
                                JOIN THE FAMILY
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-white/20 text-white hover:bg-white/10 font-bold text-lg backdrop-blur-md">
                                REACH OUT
                            </Button>
                        </Link>
                    </div>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Button } from '@/src/components/ui/Button';
import { CheckCircle2, Heart, Shield, Star, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'About Us | The Hillz',
    description: 'Learn about our vision, mission, and the history of The Hillz.',
};

export default async function AboutPage() {
    const [membershipEvents, featuredEvents] = await Promise.all([
        queryDocuments<Event>("events", { isMembershipForm: true }, "createdAt", 1),
        queryDocuments<Event>("events", { status: "published", featured: true }, "startDate", 1)
    ]);

    const targetEvent = membershipEvents?.[0] || featuredEvents?.[0];

    const joinLink = targetEvent
        ? `/e/${targetEvent.slug || targetEvent.id}/register`
        : "/events";

    return (
        <div className="min-h-screen bg-white font-medium">
            <Header />

            { }
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
                        &quot;But you have come to Mount Zion, to the city of the living God, the heavenly Jerusalem. You have come to thousands upon thousands of angels in joyful assembly,&quot; <br /> — Hebrews 12:22
                    </p>


                </div>
            </section>

            { }
            <Section bg="white" className="py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-tr from-purple-100 to-indigo-100 rounded-[60px] blur-2xl opacity-50" />
                        <div className="relative rounded-[60px] overflow-hidden shadow-2xl h-[600px]">
                            <Image
                                src="/ministry_impact_section.png"
                                alt="Our Vision"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className="max-w-xl">
                        <div className="w-12 h-1.5 bg-purple-600 rounded-full mb-8" />
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
                            Called to the Father&apos;s Hillz
                        </h2>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                            The Hillz began as a divine whisper to step fully into the life the blood of Jesus has bought for us. A gentle nudge to take our place in dominion with Christ
                        </p>


                        <div className="space-y-8">
                            {[
                                {
                                    title: 'Our Mandate',
                                    desc: "Our Mandate is to raise a people fully awake to their purpose in God. A people of His presence, His kingdom and dominion",
                                    icon: Sparkles
                                },
                                {
                                    title: 'Our Mission',
                                    desc: "Our Mission is to equip Millions around the world with what it takes to ascend and remain on the Father's Hillz",
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

            { }
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
                        { title: 'The Word', desc: <>We receive grace and truth as we behold the glory of the Lord in meditation and obedience, shaping our everyday reality by the truth of the word of God.<br /> — John 1:14</>, icon: Star },
                        { title: 'Holy Spirit', desc: <>We believe in, submit to and walk by the spirit, the executor-in-chief of God&apos;s purposes on earth. <br /> — Luke 1:35</>, icon: Sparkles },
                        { title: 'Righteousness', desc: <>We receive capacity for righteousness via the activities of the word and the spirit, producing transformation of our nature. <br /> — 2 Corinthians 3:18</>, icon: Shield },
                        { title: 'Devotion', desc: <>We continue steadfastly in prayers, fasting, communion and giving as we receive grace to stand before God continually.<br /> — Acts 2:42</>, icon: Heart },
                        { title: 'Purpose', desc: <>We are committed to everlasting covenant between God and the Church to be the light of the world, as a city that is set on the hill, we will not be hidden. <br /> — Matthew 5:14</>, icon: Users },
                        { title: 'Excellence', desc: <>We strive to do all things as unto the Lord.Always working worthy of our great calling in love, diligence and excellence. <br /> — Ephesians 1:4</>, icon: CheckCircle2 }
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

            { }
            <Section bg="none" className="py-32 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/ministry_ready_to_talk.png"
                        alt="Join The Hillz Family"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-none">
                        READY FOR <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-300">THE FLIGHT?</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href={joinLink}>
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

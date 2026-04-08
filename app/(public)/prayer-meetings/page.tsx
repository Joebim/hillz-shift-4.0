import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Clock, MapPin, Users, Sparkles, Calendar, ArrowRight, Shield, Heart } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Prayer Meetings | The Hillz',
    description: 'Join our weekly prayer meetings and experience the power of corporate prayer.',
};

export default function PrayerMeetingsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-slate-900/50 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1544427928-c49cdfebf49c?q=80&w=2035&auto=format&fit=crop"
                        alt="Prayer Meetings"
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                            Sacred Gatherings
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            PRAYER <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-300 to-indigo-400">MEETINGS</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            &quot;My house shall be called a house of prayer for all nations.&quot; — Matthew 21:13
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <Section bg="white" className="py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="max-w-xl">
                        <div className="w-12 h-1.5 bg-purple-600 rounded-full mb-8" />
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">
                            A Culture of <br />Presence
                        </h2>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                            At The Hillz, prayer is not just an activity; it is our lifeline. We believe in the corporate power of believers coming together to seek the face of God, intercede for the nations, and build a dwelling place for His presence.
                        </p>
                        
                        <div className="space-y-6">
                            {[
                                {
                                    title: "Spiritual Intimacy",
                                    desc: "Developing a deep, personal connection with the Father through sustained communion.",
                                    icon: Heart
                                },
                                {
                                    title: "Strategic Intercession",
                                    desc: "Standing in the gap for our families, the church, and the global movement.",
                                    icon: Shield
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
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-tr from-purple-100 to-indigo-100 rounded-[60px] blur-2xl opacity-50" />
                        <div className="relative rounded-[60px] overflow-hidden shadow-2xl h-[600px]">
                            <Image
                                src="https://images.unsplash.com/photo-1438232992991-995b7058633e?q=80&w=2069&auto=format&fit=crop"
                                alt="Prayer Gathering"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Weekly Schedule */}
            <Section bg="gray" className="py-32">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                        Weekly Connect
                    </h2>
                    <p className="text-xl text-slate-500 font-bold">
                        Join us twice a week for our specialized prayer sessions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {[
                        {
                            day: "Monday",
                            time: "10:15 PM",
                            title: "Monday Prayer Connect",
                            desc: "Focused on maximizing our dominion inheritance and establishing the week in the presence of God.",
                            link: "https://meet.google.com/jhq-mnff-ekz"
                        },
                        {
                            day: "Thursday",
                            time: "10:15 PM",
                            title: "Thursday Prayer Connect",
                            desc: "A deeper dive into intercession and spiritual warfare, building a thriving prayer life together.",
                            link: "https://meet.google.com/jhq-mnff-ekz"
                        }
                    ].map((session, i) => (
                        <Card key={i} className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-500 group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">{session.day}</p>
                                    <p className="text-2xl font-black text-slate-900">{session.time}</p>
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{session.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed mb-10">{session.desc}</p>
                            <a href={session.link} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black">
                                    Join Session <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </a>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <Section bg="white" className="py-32">
                <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                            Ready to Seek <br />HIS FACE?
                        </h2>
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
                            Join our community of prayer warriors and experience the transformation that comes from being in His presence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="h-16 px-10 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black">
                                    Get In Touch
                                </Button>
                            </Link>
                            <Link href="/events">
                                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold">
                                    Upcoming Events
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

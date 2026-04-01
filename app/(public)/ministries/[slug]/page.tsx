import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { Ministry } from '@/src/types/ministry';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Users, Calendar, Mail, User, ArrowLeft, Sparkles, Heart } from 'lucide-react';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const ministries = await queryDocuments<Ministry>('ministries', { slug });
    const ministry = ministries[0];

    if (!ministry) return { title: 'Ministry Not Found' };

    return {
        title: `${ministry.name} | Hillz Shift 4.0`,
        description: ministry.description,
    };
}

export default async function MinistryDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const results = await queryDocuments<Ministry>('ministries', { slug });
    const rawMinistry = results[0];

    if (!rawMinistry) notFound();

    const ministry = {
        ...rawMinistry,
        createdAt: toJsDate(rawMinistry.createdAt),
        updatedAt: toJsDate(rawMinistry.updatedAt),
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <section className="relative pt-48 pb-64 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-white z-10" />
                    <Image
                        src={ministry.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop'}
                        alt={ministry.name}
                        fill
                        className="object-cover opacity-60"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/ministries" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors font-black text-[10px] uppercase tracking-[0.3em] group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Ministries
                        </Link>

                        <div className="text-6xl mb-8 animate-bounce-slow filter drop-shadow-2xl">
                            {ministry.icon}
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-fade-in-up uppercase">
                            {ministry.name}
                        </h1>

                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            {ministry.description}
                        </p>
                    </div>
                </div>

                {}
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-tr from-purple-600/20 to-transparent blur-3xl" />
            </section>

            {}
            <Section className="py-0 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 -mt-24">
                    <div className="lg:col-span-2 space-y-20 pb-32">
                        {}
                        <Card variant="default" padding="none" className="bg-white rounded-[40px] p-10 md:p-12 shadow-2xl shadow-purple-900/10 border border-slate-100">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mb-8 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> The Vision
                            </h2>
                            <article className="prose prose-2xl prose-purple max-w-none text-slate-600 font-medium leading-relaxed italic selection:bg-purple-100 selection:text-purple-900 whitespace-pre-line">
                                {ministry.description}
                            </article>

                            <div className="mt-16 pt-16 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Our Purpose</h3>
                                    <p className="text-sm text-slate-400 font-bold leading-relaxed italic">
                                        To empower, equip and engage every member of our community through the unique calling of this ministry.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">How to Join</h3>
                                    <p className="text-sm text-slate-400 font-bold leading-relaxed italic">
                                        Anyone with a heart for service and a desire to grow is welcome. We meet regularly to pray, plan and participate in God&apos;s work.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8 h-fit lg:sticky lg:top-32 pb-32">
                        {}
                        <Card variant="default" padding="none" className="bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-purple-900/20 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-10 tracking-tighter flex items-center gap-3">
                                    <Heart className="w-6 h-6 text-pink-400" /> Ministry Heart
                                </h3>

                                <div className="space-y-8">
                                    {ministry.leader && (
                                        <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10">
                                                {ministry.leader.photo ? (
                                                    <Image src={ministry.leader.photo} alt={ministry.leader.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xl">
                                                        {ministry.leader.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Leader</p>
                                                <h4 className="font-black text-white uppercase tracking-tight">{ministry.leader.name}</h4>
                                                <p className="text-xs text-white/40 font-bold italic">{ministry.leader.role}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {ministry.meetingSchedule && (
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Meet Times</p>
                                                    <p className="font-bold text-sm text-white/80">{ministry.meetingSchedule}</p>
                                                </div>
                                            </div>
                                        )}

                                        {ministry.leader?.email && (
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Connect</p>
                                                    <a href={`mailto:${ministry.leader.email}`} className="font-bold text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                                        {ministry.leader.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button className="w-full h-18 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-900/40 transition-all mt-8">
                                        JOIN THE SHIFT
                                    </Button>
                                    <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest italic pt-4">
                                        * No previous experience required
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

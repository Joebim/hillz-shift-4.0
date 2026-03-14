import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { Sermon } from '@/src/types/sermon';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Button } from '@/src/components/ui/Button';
import { Section } from '@/src/components/shared/Section';
import { Card } from '@/src/components/ui/Card';
import {
    Calendar,
    User,
    Share2,
    Download,
    BookOpen,
    Play,
    Music,
    Sparkles,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/src/lib/utils';
import { SermonCard } from '@/src/components/sermons/SermonCard';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const sermons = await queryDocuments<Sermon>('sermons', { slug });
    const sermon = sermons[0];

    if (!sermon) return { title: 'Sermon Not Found' };

    return {
        title: `${sermon.title} | Hillz Shift 4.0`,
        description: sermon.description,
    };
}

export default async function SermonDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const results = await queryDocuments<Sermon>('sermons', { slug });
    const rawSermon = results[0];

    if (!rawSermon) notFound();

    const sermon = {
        ...rawSermon,
        date: toJsDate(rawSermon.date),
        createdAt: toJsDate(rawSermon.createdAt),
        updatedAt: toJsDate(rawSermon.updatedAt),
    };

    const relatedResults = await queryDocuments<Sermon>('sermons', {
        series: sermon.series || ''
    }, 'date', 4);

    const relatedSermons = (relatedResults || [])
        .filter(s => s.id !== sermon.id)
        .slice(0, 3)
        .map(s => ({
            ...s,
            date: toJsDate(s.date),
            createdAt: toJsDate(s.createdAt),
            updatedAt: toJsDate(s.updatedAt),
        }));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <div className="relative pt-48 pb-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black z-10" />
                    <Image
                        src={sermon.thumbnailUrl}
                        alt={sermon.title}
                        fill
                        className="object-cover blur-2xl scale-110"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link href="/sermons" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors font-black text-[10px] uppercase tracking-[0.3em] group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                        {}
                        <div className="lg:col-span-2">
                            <div className="relative aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/5 group">
                                {sermon.videoUrl ? (
                                    <iframe
                                        src={sermon.videoUrl}
                                        className="w-full h-full"
                                        title={sermon.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Image
                                            src={sermon.thumbnailUrl}
                                            alt={sermon.title}
                                            fill
                                            className="object-cover opacity-60"
                                        />
                                        <div className="relative z-10 glass-dark p-12 rounded-[32px] border border-white/10 text-center max-w-lg mx-6">
                                            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
                                                <Music className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-black mb-4">Audio Message</h3>
                                            <audio controls className="w-full h-12 rounded-full bg-white/10" src={sermon.audioUrl}>
                                                Your browser does not support audio.
                                            </audio>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {}
                        <div className="lg:col-span-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-purple-900/40">
                                <Sparkles className="w-3 h-3" /> {sermon.series || 'Latest Message'}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                                {sermon.title}
                            </h1>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Speaker</p>
                                        <p className="text-lg font-black text-white/90">{sermon.speaker}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Published</p>
                                        <p className="text-lg font-black text-white/90">{formatDate(sermon.date, 'long')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Scripture</p>
                                        <p className="text-lg font-black text-white/90 italic">{sermon.scripture}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-16 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                                <Button variant="outline" className="flex-1 h-16 rounded-2xl border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5">
                                    <Download className="w-4 h-4 mr-2" /> Offline
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <Section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-1.5 h-12 bg-purple-600 rounded-full" />
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Message Description</h2>
                    </div>
                    <p className="text-2xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-50 pl-12">
                        &quot;{sermon.description}&quot;
                    </p>
                </div>
            </Section>

            {}
            <Section bg="gray" className="py-24">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">More from this Series</h2>
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-purple-600 uppercase tracking-widest">
                        View All <Play className="w-3 h-3" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {relatedSermons.length > 0 ? relatedSermons.map((s) => (
                        <SermonCard key={s.id} sermon={s} />
                    )) : (
                        <div className="col-span-3 py-16 text-center bg-white rounded-[32px] border border-slate-100 font-bold text-slate-400">
                            No other messages in this collection yet.
                        </div>
                    )}
                </div>
            </Section>

            <Footer />
        </div>
    );
}

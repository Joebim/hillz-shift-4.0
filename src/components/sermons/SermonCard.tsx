import Link from 'next/link';
import Image from 'next/image';
import { Sermon } from '@/src/types/sermon';
import { Card } from '@/src/components/ui/Card';
import { PlayCircle, Mic, Video, Calendar, Users } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';

export interface SermonCardProps {
    sermon: Sermon;
}

export const SermonCard = ({ sermon }: SermonCardProps) => {
    return (
        <Card variant="default" padding="none" hover className="overflow-hidden h-full flex flex-col group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={sermon.thumbnailUrl}
                    alt={sermon.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                        <PlayCircle className="w-10 h-10 fill-white" />
                    </div>
                </div>
                <div className="absolute top-6 right-6 flex gap-2">
                    {(sermon.mediaType === 'video' || sermon.mediaType === 'both') && (
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-600 shadow-xl flex items-center gap-1.5">
                            <Video className="w-3 h-3" /> Video
                        </div>
                    )}
                    {(sermon.mediaType === 'audio' || sermon.mediaType === 'both') && (
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-xl flex items-center gap-1.5">
                            <Mic className="w-3 h-3" /> Audio
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span>{formatDate(sermon.date, 'short')}</span>
                    </div>
                    {sermon.series && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{sermon.series}</span>
                        </>
                    )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight hover:text-purple-600 transition-colors">
                    <Link href={`/sermons/${sermon.slug}`}>{sermon.title}</Link>
                </h3>

                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">
                        {sermon.speaker}
                    </p>
                </div>

                <p className="text-slate-500 font-bold line-clamp-2 mb-8 text-sm leading-relaxed flex-1">
                    {sermon.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{sermon.scripture}</span>
                    <Link href={`/sermons/${sermon.slug}`}>
                        <Button variant="ghost" className="rounded-full font-black text-xs uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 px-4">WATCH NOW</Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

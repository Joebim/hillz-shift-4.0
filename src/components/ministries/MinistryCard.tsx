import Link from 'next/link';
import Image from 'next/image';
import { Ministry } from '@/src/types/ministry';
import { Card } from '@/src/components/ui/Card';
import { ArrowRight, Users } from 'lucide-react';

export interface MinistryCardProps {
    ministry: Ministry;
}

export const MinistryCard = ({ ministry }: MinistryCardProps) => {
    return (
        <Card variant="default" padding="none" hover className="overflow-hidden h-full flex flex-col group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1">
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={ministry.image}
                    alt={ministry.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors duration-500 z-10" />

                {/* Floating Icon */}
                <div className="absolute top-6 left-6 z-20">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                        {ministry.icon || '✨'}
                    </div>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-purple-600 transition-colors">
                    {ministry.name}
                </h3>

                <p className="text-slate-500 font-bold line-clamp-3 mb-8 flex-1 text-sm leading-relaxed">
                    {ministry.description}
                </p>

                {ministry.meetingSchedule && (
                    <div className="mb-8 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-4 py-2 rounded-full flex items-center gap-2 self-start border border-purple-100 italic">
                        <Users className="w-3.5 h-3.5" />
                        {ministry.meetingSchedule}
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-slate-50">
                    <Link
                        href={`/ministries/${ministry.slug}`}
                        className="flex items-center justify-between text-slate-900 font-black text-sm uppercase tracking-widest hover:text-purple-600 transition-all"
                    >
                        Learn More
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

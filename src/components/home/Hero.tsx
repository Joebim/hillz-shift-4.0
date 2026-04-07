'use client';

import Link from 'next/link';
import { Play, UserPlus } from 'lucide-react';
import { Event } from '@/src/types/event';

interface HeroProps {
    upcomingEvent?: Event | null;
}

export const Hero = ({ upcomingEvent }: HeroProps) => {
    return (
        <section className="relative w-full h-screen min-h-[580px] overflow-hidden bg-black font-sans">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/landing_hero.png"
                    alt="Preaching at The Hillz"
                    className="w-full h-full object-cover object-center"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content Container */}
            <div className="absolute bottom-0 left-0 z-20 px-6 sm:px-10 pb-10 sm:pb-14 space-y-5">

                {/* Main Heading */}
                <h1
                    className="text-white font-black uppercase tracking-[0.06em] text-5xl sm:text-5xl md:text-6xl leading-tight opacity-0 animate-[fadeUp_0.6s_0.2s_ease_forwards]"
                >
                    The Hillz
                </h1>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-3 opacity-0 animate-[fadeUp_0.6s_0.4s_ease_forwards]">

                    {/* Listen Button */}
                    <Link
                        href="/sermons"
                        className="
                            inline-flex items-center gap-2 px-6 py-3.5 rounded-full
                            bg-purple-600 hover:bg-purple-500
                            text-white text-xs font-black uppercase tracking-[0.14em]
                            transition-colors duration-200 shadow-lg shadow-purple-600/30
                        "
                    >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Listen to Latest Sermon
                    </Link>

                    {/* JOIN US Button (Membership / Primary Event) */}
                    {upcomingEvent && (
                        <Link
                            href={`/e/${upcomingEvent.slug || upcomingEvent.id}/register`}
                            className="
                                inline-flex items-center px-8 py-2.5 rounded-full
                                bg-white text-black hover:bg-white/90 
                                transition-all duration-300 font-black text-sm tracking-[0.2em]
                                shadow-2xl shadow-white/10 hover:-translate-y-1
                            "
                        >
                            JOIN US
                        </Link>
                    )}
                </div>
            </div>

            {/* Animation Styles */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};
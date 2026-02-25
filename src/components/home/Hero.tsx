'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Hero — Variant 2
   Reference: River Valley Church
   Style: Full-bleed worship photo, minimal overlay, church name bottom-left,
          two pill CTAs, sparse nav top-right, logo mark top-left.
   No mosaic — the image IS the hero. UI sits on top with light touch.
───────────────────────────────────────────────────────────────────────────── */

// Today's verse — swap out each week
const TODAYS_VERSE = {
    label: "TODAY'S VERSE",
    ref: 'John 15:13',
};

export const Hero = () => {
    return (
        <section className="relative w-full h-screen min-h-[580px] overflow-hidden bg-black font-sans">

            {/* ── Full-bleed background photo ────────────────────────────── */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/landing_hero.png"
                    alt="Preaching at The Hillz"
                    className="w-full h-full object-cover object-center"
                />
                {/* Very subtle gradient — only bottom and slight left, keeps image vivid */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </div>



            {/* ── Bottom-left content block ───────────────────────────────── */}
            <div className="absolute bottom-0 left-0 z-20 px-6 sm:px-10 pb-10 sm:pb-14 space-y-5">

                {/* Church name — compact, bold, white, uppercase, tight tracking */}
                <h1
                    className="text-white font-black uppercase tracking-[0.06em] text-2xl sm:text-3xl md:text-4xl leading-tight opacity-0 animate-[fadeUp_0.6s_0.2s_ease_forwards]"
                >
                    The Hillz Church
                </h1>

                {/* Two pill CTAs side by side */}
                <div className="flex items-center gap-3 opacity-0 animate-[fadeUp_0.6s_0.4s_ease_forwards]">

                    {/* Primary CTA — purple, matches site aesthetics */}
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
                        Watch Latest Sermon
                    </Link>

                    {/* Secondary CTA — dark pill with label + verse, matches reference */}
                    <Link
                        href="/devotional"
                        className="
                            inline-flex flex-col items-start px-5 py-2.5 rounded-full
                            bg-black/60 hover:bg-black/80 border border-white/20
                            backdrop-blur-sm transition-all duration-200
                        "
                    >
                        <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.18em] leading-none mb-0.5">
                            {TODAYS_VERSE.label}
                        </span>
                        <span className="text-white text-sm font-bold leading-none">
                            {TODAYS_VERSE.ref}
                        </span>
                    </Link>
                </div>
            </div>

            {/* ── Keyframe animations ─────────────────────────────────────── */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};
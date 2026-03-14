'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { BookOpen, RefreshCw, Share2, Copy, Check, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Link from 'next/link';

// ─── Curated verse list ───────────────────────────────────────────────────────
// We keep a rich list of scriptures so the page never needs an external API key
const VERSES = [
    { ref: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', theme: 'Love' },
    { ref: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.', theme: 'Strength' },
    { ref: 'Jeremiah 29:11', text: '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."', theme: 'Hope' },
    { ref: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', theme: 'Trust' },
    { ref: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', theme: 'Faith' },
    { ref: 'Matthew 5:14', text: 'You are the light of the world. A town built on a hill cannot be hidden.', theme: 'Purpose' },
    { ref: 'Isaiah 40:31', text: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', theme: 'Strength' },
    { ref: 'Psalm 23:1', text: 'The LORD is my shepherd, I lack nothing.', theme: 'Provision' },
    { ref: 'Matthew 6:33', text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.', theme: 'Priority' },
    { ref: 'John 15:13', text: 'Greater love has no one than this: to lay down one\'s life for one\'s friends.', theme: 'Love' },
    { ref: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.', theme: 'Courage' },
    { ref: 'Psalm 46:10', text: 'He says, "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth."', theme: 'Peace' },
    { ref: 'Romans 12:2', text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is—his good, pleasing and perfect will.', theme: 'Transformation' },
    { ref: 'Hebrews 11:1', text: 'Now faith is confidence in what we hope for and assurance about what we do not see.', theme: 'Faith' },
    { ref: '1 Corinthians 13:4-5', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.', theme: 'Love' },
    { ref: 'James 1:2-3', text: 'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.', theme: 'Perseverance' },
    { ref: 'Ephesians 2:8-9', text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.', theme: 'Grace' },
    { ref: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.', theme: 'Guidance' },
    { ref: 'Galatians 5:22-23', text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.', theme: 'Character' },
    { ref: 'Proverbs 31:25', text: 'She is clothed with strength and dignity; she can laugh at the days to come.', theme: 'Strength' },
    { ref: 'John 14:6', text: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."', theme: 'Salvation' },
    { ref: '1 Peter 5:7', text: 'Cast all your anxiety on him because he cares for you.', theme: 'Peace' },
    { ref: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.', theme: 'Diligence' },
    { ref: 'Psalm 34:18', text: 'The LORD is close to the brokenhearted and saves those who are crushed in spirit.', theme: 'Comfort' },
    { ref: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.', theme: 'Courage' },
    { ref: '2 Corinthians 5:17', text: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!', theme: 'Transformation' },
    { ref: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.', theme: 'Rest' },
    { ref: 'Psalm 27:1', text: 'The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?', theme: 'Courage' },
    { ref: 'Romans 5:8', text: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.', theme: 'Grace' },
    { ref: 'John 8:32', text: 'Then you will know the truth, and the truth will set you free.', theme: 'Freedom' },
    { ref: 'Micah 6:8', text: 'He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.', theme: 'Character' },
    { ref: 'Lamentations 3:22-23', text: 'Because of the LORD\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.', theme: 'Faithfulness' },
    { ref: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', theme: 'Peace' },
    { ref: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.', theme: 'Courage' },
    { ref: 'Ephesians 6:10', text: 'Finally, be strong in the Lord and in his mighty power.', theme: 'Strength' },
    { ref: 'Romans 8:38-39', text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.', theme: 'Love' },
    { ref: 'John 1:1', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', theme: 'Truth' },
    { ref: 'Hebrews 4:12', text: 'For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.', theme: 'Truth' },
];

// Deterministically pick verse by day-of-year so it's consistent for all users on the same day
function getDailyVerseIndex(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % VERSES.length;
}

const THEME_COLORS: Record<string, { pill: string; accent: string; glow: string }> = {
    Love: { pill: 'bg-rose-500/20 text-rose-300 border-rose-500/30', accent: 'from-rose-500/20', glow: 'shadow-rose-500/10' },
    Strength: { pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30', accent: 'from-amber-500/20', glow: 'shadow-amber-500/10' },
    Hope: { pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', accent: 'from-emerald-500/20', glow: 'shadow-emerald-500/10' },
    Trust: { pill: 'bg-sky-500/20 text-sky-300 border-sky-500/30', accent: 'from-sky-500/20', glow: 'shadow-sky-500/10' },
    Faith: { pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', accent: 'from-indigo-500/20', glow: 'shadow-indigo-500/10' },
    Peace: { pill: 'bg-teal-500/20 text-teal-300 border-teal-500/30', accent: 'from-teal-500/20', glow: 'shadow-teal-500/10' },
    Courage: { pill: 'bg-orange-500/20 text-orange-300 border-orange-500/30', accent: 'from-orange-500/20', glow: 'shadow-orange-500/10' },
    Grace: { pill: 'bg-violet-500/20 text-violet-300 border-violet-500/30', accent: 'from-violet-500/20', glow: 'shadow-violet-500/10' },
    Guidance: { pill: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', accent: 'from-yellow-500/20', glow: 'shadow-yellow-500/10' },
};

function getThemeColors(theme: string) {
    return THEME_COLORS[theme] || { pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30', accent: 'from-purple-500/20', glow: 'shadow-purple-500/10' };
}

function formatDate(d: Date) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DevotionalPage() {
    const dailyIdx = getDailyVerseIndex();
    const [currentIdx, setCurrentIdx] = useState(dailyIdx);
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const today = new Date();

    const current = VERSES[currentIdx];
    const colors = getThemeColors(current.theme);
    const isToday = currentIdx === dailyIdx;

    const navigate = useCallback((dir: 'prev' | 'next') => {
        setDirection(dir === 'next' ? 'right' : 'left');
        setAnimating(true);
        setTimeout(() => {
            setCurrentIdx(idx => {
                if (dir === 'next') return (idx + 1) % VERSES.length;
                return (idx - 1 + VERSES.length) % VERSES.length;
            });
            setAnimating(false);
        }, 220);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(`"${current.text}" — ${current.ref}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: `Daily Verse — ${current.ref}`,
                text: `"${current.text}" — ${current.ref}`,
                url: window.location.href,
            });
        } else {
            handleCopy();
        }
    };

    // Keyboard nav
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] selection:bg-purple-900/60 selection:text-white font-sans">
            <Header />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-32 overflow-hidden">

                {/* Ambient lighting */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-purple-700/10 blur-[120px]" />
                    <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-[90px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-[90px]" />
                    {/* Subtle grid */}
                    <div className="absolute inset-0 opacity-[0.015]"
                        style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="relative z-10 w-full max-w-3xl mx-auto">

                    {/* Label */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 text-[11px] font-black uppercase tracking-[0.22em]">
                            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                            {isToday ? "Today's Verse" : `Verse ${currentIdx + 1} of ${VERSES.length}`}
                        </div>
                    </div>

                    {/* Date */}
                    {isToday && (
                        <p className="text-center text-white/25 text-xs font-bold uppercase tracking-[0.3em] mb-8">
                            {formatDate(today)}
                        </p>
                    )}

                    {/* Main card */}
                    <div
                        className={`
                            relative bg-white/[0.04] backdrop-blur-md border border-white/10
                            rounded-[40px] p-10 md:p-16 shadow-2xl ${colors.glow}
                            transition-all duration-300
                            ${animating
                                ? direction === 'right'
                                    ? 'opacity-0 translate-x-4 scale-[0.98]'
                                    : 'opacity-0 -translate-x-4 scale-[0.98]'
                                : 'opacity-100 translate-x-0 scale-100'
                            }
                        `}
                    >
                        {/* Glow accent top-left */}
                        <div className={`absolute top-0 left-0 w-80 h-40 rounded-full bg-gradient-to-br ${colors.accent} to-transparent blur-3xl opacity-60 pointer-events-none`} />

                        {/* Theme pill */}
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-[0.18em] ${colors.pill}`}>
                                {current.theme}
                            </span>
                            <button
                                onClick={() => setLiked(v => !v)}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors group"
                                aria-label="Save verse"
                            >
                                <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white/30 group-hover:text-rose-400'}`} />
                            </button>
                        </div>

                        {/* Verse text */}
                        <blockquote className="relative z-10 mb-10">
                            <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold leading-tight tracking-tight">
                                &ldquo;{current.text}&rdquo;
                            </p>
                        </blockquote>

                        {/* Reference */}
                        <p className="text-purple-400 font-black text-base md:text-lg tracking-wider uppercase relative z-10">
                            — {current.ref}
                        </p>

                        {/* Divider */}
                        <div className="my-8 h-px bg-white/10 relative z-10" />

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-3 relative z-10">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-xs font-bold transition-all"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white text-xs font-bold transition-all"
                                >
                                    <Share2 className="w-3.5 h-3.5" />
                                    Share
                                </button>
                            </div>

                            {/* Navigation arrows */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('prev')}
                                    className="p-2.5 rounded-xl bg-white/8 hover:bg-purple-600/30 border border-white/10 text-white/50 hover:text-white hover:border-purple-500/40 transition-all"
                                    aria-label="Previous verse"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => navigate('next')}
                                    className="p-2.5 rounded-xl bg-white/8 hover:bg-purple-600/30 border border-white/10 text-white/50 hover:text-white hover:border-purple-500/40 transition-all"
                                    aria-label="Next verse"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-1.5 mt-10">
                        {VERSES.slice(0, Math.min(VERSES.length, 12)).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > currentIdx ? 'right' : 'left');
                                    setAnimating(true);
                                    setTimeout(() => { setCurrentIdx(i); setAnimating(false); }, 220);
                                }}
                                className={`rounded-full transition-all duration-300 ${i === currentIdx
                                    ? 'w-6 h-2 bg-purple-400'
                                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to verse ${i + 1}`}
                            />
                        ))}
                        {VERSES.length > 12 && <span className="text-white/20 text-xs ml-1">···</span>}
                    </div>

                    {/* Back to today */}
                    {!isToday && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => {
                                    setDirection('right');
                                    setAnimating(true);
                                    setTimeout(() => { setCurrentIdx(dailyIdx); setAnimating(false); }, 220);
                                }}
                                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Back to today&apos;s verse
                            </button>
                        </div>
                    )}

                    {/* Keyboard hint */}
                    <p className="text-center text-white/15 text-[10px] font-medium mt-8 tracking-wider hidden md:block">
                        Use ← → arrow keys to navigate
                    </p>
                </div>
            </section>

            {/* ── Browse by Theme ───────────────────────────────────────── */}
            <section className="relative py-24 px-4 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-px bg-white/20" />
                        <h2 className="text-white/50 text-xs font-black uppercase tracking-[0.3em]">Browse by Theme</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {Array.from(new Set(VERSES.map(v => v.theme))).map(theme => {
                            const tc = getThemeColors(theme);
                            const count = VERSES.filter(v => v.theme === theme).length;
                            const firstIdx = VERSES.findIndex(v => v.theme === theme);
                            return (
                                <button
                                    key={theme}
                                    onClick={() => {
                                        setDirection('right');
                                        setAnimating(true);
                                        setTimeout(() => { setCurrentIdx(firstIdx); setAnimating(false); }, 220);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all hover:scale-105 ${tc.pill}`}
                                >
                                    {theme}
                                    <span className="text-[10px] opacity-60 font-bold">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────── */}
            <section className="py-24 px-4 border-t border-white/5">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/sermons" className="group relative bg-white/[0.03] rounded-[32px] border border-white/10 p-10 hover:bg-white/[0.07] hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-purple-600/20 transition-all" />
                        <div className="relative z-10">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Go Deeper</p>
                            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors">Listen to Sermons</h3>
                            <p className="text-white/40 font-medium text-sm leading-relaxed">Explore our library of teachings rooted in the Word.</p>
                        </div>
                    </Link>

                    <Link href="/prayer" className="group relative bg-white/[0.03] rounded-[32px] border border-white/10 p-10 hover:bg-white/[0.07] hover:border-rose-500/30 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-rose-600/20 transition-all" />
                        <div className="relative z-10">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Community</p>
                            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-rose-300 transition-colors">Submit a Prayer</h3>
                            <p className="text-white/40 font-medium text-sm leading-relaxed">Let us stand in agreement with you on your request.</p>
                        </div>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

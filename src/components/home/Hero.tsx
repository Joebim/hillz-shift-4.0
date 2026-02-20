import Link from 'next/link';
import { Button } from '@/src/components/ui/Button';
import { Play } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/90 z-10" />
                <div
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center scale-100 animate-slow-zoom"
                />
            </div>

            <div className="container mx-auto px-6 relative z-20">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up shadow-2xl">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        Welcome to the Future of Faith
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter animate-fade-in-up">
                        SHIFT INTO <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-300 to-indigo-400 bg-300% animate-gradient">NEW DIMENSIONS</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto font-medium animate-fade-in-up delay-100">
                        Join us for Hillz Shift 4.0. Experience transformative worship, <br className="hidden md:block" />
                        powerful teaching, and a community dedicated to walking in purpose.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-200">
                        <Link href="/events">
                            <Button size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-white text-black hover:bg-gray-100 font-black text-lg transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                JOIN THE SHIFT
                            </Button>
                        </Link>
                        <Link href="/sermons">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold text-lg backdrop-blur-md transition-all">
                                <Play className="w-5 h-5 mr-3 fill-current" />
                                WATCH LATEST
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce z-20 text-white/40">
                <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5">
                    <div className="w-1 h-2 bg-current rounded-full animate-scroll-down" />
                </div>
            </div>
        </section>
    );
};

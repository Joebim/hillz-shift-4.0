import Link from 'next/link';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Button } from '@/src/components/ui/Button';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative background gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-50 rounded-full blur-3xl opacity-50 -z-10" />
                
                <div className="max-w-2xl mx-auto text-center space-y-10 relative z-10 w-full animate-fade-in-up">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple-100 blur-2xl opacity-50 rounded-full transform scale-150"></div>
                        <div className="relative w-32 h-32 mx-auto bg-purple-50 rounded-[2rem] flex items-center justify-center rotate-3 border border-purple-100 shadow-xl shadow-purple-900/5 mb-8">
                            <Compass className="w-14 h-14 text-purple-600 -rotate-3" strokeWidth={1.5} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-8xl md:text-9xl font-black text-slate-900 tracking-tighter">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                            Journey Interrupted
                        </h2>
                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                            It seems the page you&apos;re looking for has been moved, renamed, or no longer exists. Let&apos;s guide you back to familiar grounds.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/events">
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto h-14 px-8 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold uppercase tracking-widest text-xs"
                            >
                                <Compass className="w-4 h-4 mr-2" />
                                Browse Events
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-900/20 font-bold uppercase tracking-widest text-xs">
                                <Home className="w-4 h-4 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

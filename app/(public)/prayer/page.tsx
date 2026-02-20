import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Section } from '@/src/components/shared/Section';
import { Card } from '@/src/components/ui/Card';
import { Heart, ShieldCheck, Sparkles, Send, Lock } from 'lucide-react';

export const metadata = {
    title: 'Prayer Request | Hillz Shift 4.0',
    description: 'Submit your prayer requests. We are here to pray with you.',
};

export default function PrayerPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1445445290250-18a3a8300ad0?q=80&w=2070&auto=format&fit=crop"
                        alt="Prayer"
                        fill
                        className="object-cover opacity-60 animate-slow-zoom"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Heart className="w-3 h-3 text-pink-400 animate-pulse" />
                            How Can We Pray for You?
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            POWER OF <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">INTERCESSION</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            &quot;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&quot; — Philippians 4:6
                        </p>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-tr from-indigo-600/20 to-transparent blur-3xl" />
            </section>

            <Section className="py-24 bg-slate-50 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <Card variant="default" padding="none" className="-mt-32 relative z-20 shadow-2xl shadow-indigo-900/10 border border-slate-100 bg-white rounded-[40px] overflow-hidden animate-fade-in-up delay-200">
                        <div className="p-8 md:p-12">
                            <div className="mb-12 text-center">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Submit Prayer Request</h2>
                                <p className="text-slate-500 font-bold mt-4">Our prayer team is dedicated to interceding for your needs with faith and compassion.</p>
                            </div>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Your Name (Optional)</label>
                                        <Input placeholder="Anonymous" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email (Optional)</label>
                                        <Input type="email" placeholder="For follow up" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone (Optional)</label>
                                        <Input type="tel" placeholder="For follow up" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                                    </div>
                                    <div className="flex flex-col justify-end pb-1">
                                        <label className="group flex items-center gap-3 cursor-pointer p-4 border border-slate-100 rounded-2xl hover:bg-indigo-50 transition-all bg-slate-50/30">
                                            <div className="relative flex items-center justify-center">
                                                <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" />
                                                <ShieldCheck className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Keep this request private</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Healings', 'Guidance', 'Provision', 'Family', 'Salvation', 'Other'].map(cat => (
                                            <button 
                                                type="button" 
                                                key={cat} 
                                                className="px-6 py-2.5 rounded-full border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Your Prayer Request</label>
                                    <Textarea rows={6} placeholder="Share your burdens with us..." required className="rounded-[24px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold p-6" />
                                </div>

                                <div className="glass bg-blue-50/50 border-blue-100 p-6 rounded-[24px] flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-blue-800 leading-relaxed italic">
                                        Your privacy is important to us. All requests are handled with divine confidentiality and care by our dedicated spiritual warriors.
                                    </p>
                                </div>

                                <Button className="w-full h-18 rounded-[24px] bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-900/10 transition-all flex items-center justify-center gap-3">
                                    Submit Prayer Request <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

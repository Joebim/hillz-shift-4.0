import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Button } from '@/src/components/ui/Button';
import { Section } from '@/src/components/shared/Section';
import { Card } from '@/src/components/ui/Card';
import { CreditCard, Smartphone, Building, CheckCircle2, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Give | Hillz Shift 4.0',
    description: 'Support the work of the ministry through your generous giving.',
};

export default function GivePage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
                        alt="Generosity"
                        fill
                        className="object-cover opacity-60 animate-slow-zoom"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <Heart className="w-3 h-3 text-pink-400" />
                            Generosity Changes Lives
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            PARTNER IN <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-300 to-indigo-400">THE SHIFT</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl font-medium animate-fade-in-up delay-100 italic leading-relaxed">
                            &quot;Every man shall give as he is able, according to the blessing of the Lord your God which he has given you.&quot; — Deuteronomy 16:17
                        </p>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-linear-to-tl from-purple-600/20 to-transparent blur-3xl" />
            </section>

            {/* Ways to Give Section */}
            <Section bg="white" className="py-32">
                <div className="flex items-center gap-3 mb-16">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Ways To Give</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Online Giving */}
                    <Card variant="default" padding="none" hover className="overflow-hidden h-full flex flex-col group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-2">
                        <div className="p-10 flex flex-col items-center text-center flex-1">
                            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                <CreditCard className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Give Online</h3>
                            <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm flex-1">
                                Securely give one-time or setup recurring donations using your credit card or bank account.
                            </p>
                            <Button className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-900/20">
                                Give Now <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {/* Mobile Giving */}
                    <Card variant="default" padding="none" hover className="overflow-hidden h-full flex flex-col group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-2">
                        <div className="p-10 flex flex-col items-center text-center flex-1">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <Smartphone className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Text to Give</h3>
                            <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm flex-1">
                                Text <span className="text-blue-600">GIVE</span> to <span className="text-blue-600">84321</span>. Follow the prompts to complete your donation securely in seconds.
                            </p>
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 group-hover:border-blue-600 group-hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all">
                                Learn More
                            </Button>
                        </div>
                    </Card>

                    {/* In Person / Mail */}
                    <Card variant="default" padding="none" hover className="overflow-hidden h-full flex flex-col group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-2">
                        <div className="p-10 flex flex-col items-center text-center flex-1">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                <Building className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">In Person & Mail</h3>
                            <p className="text-slate-500 font-bold mb-10 leading-relaxed text-sm flex-1">
                                Give during our services or mail your check to:<br />
                                <span className="text-slate-900">123 Ministry Lane, City, ST 12345</span>
                            </p>
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 group-hover:border-emerald-600 group-hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-all">
                                Get Directions
                            </Button>
                        </div>
                    </Card>
                </div>
            </Section>

            {/* Your Impact Section */}
            <Section bg="gray" className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="animate-fade-in-up">
                            <div className="w-12 h-1.5 bg-purple-600 rounded-full mb-8" />
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
                                YOUR <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">IMPACT</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed">
                                Your generosity fuels the mission. Together, we are creating a legacy of faith and transformation that ripples through generations.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    'Supporting local community outreach programs',
                                    'Funding global missionary work',
                                    'Providing resources for children and youth ministries',
                                    'Maintaining our facilities for worship and gathering',
                                    'Helping families in need during crisis'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-700 font-bold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative h-[600px] rounded-[60px] overflow-hidden shadow-2xl shadow-slate-200">
                            <Image
                                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
                                alt="Community Impact"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-10 left-10 right-10 p-8 glass-dark rounded-[32px] border border-white/10">
                                <p className="text-white font-bold leading-relaxed italic">
                                    &quot;We make a living by what we get, but we make a life by what we give.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Footer />
        </div>
    );
}

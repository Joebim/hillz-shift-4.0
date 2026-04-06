import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';

import { Button } from '@/src/components/ui/Button';
import { Section } from '@/src/components/shared/Section';
import { ContactForm } from '@/src/components/contact/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
    title: 'Contact Us | The Hillz',
    description: 'Get in touch with us. We would love to hear from you.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="/contact_hero.png"
                        alt="Contact"
                        fill
                        className="object-cover opacity-50"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                        <Mail className="w-3 h-3" />
                        Get In Touch
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                        LET&apos;S START <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">A CONVERSATION</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium animate-fade-in-up delay-100">
                        Whether you have a question, a prayer request, or just want to say hello, we are here to listen and serve.
                    </p>
                </div>
            </section>

            <Section className="py-32 bg-slate-50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-purple-900/5 border border-slate-100">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Send us a Message</h2>
                            <ContactForm />
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <div className="mb-12">
                            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Connect with Us</h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                We will be happy to provide support and spiritual guidance. Reach out through any of these channels
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Phone, title: 'Phone Number', content: '+234 8143375628', sub: 'WhatsApp messages only' },
                                { icon: Mail, title: 'Email Support', content: 'Convener@themysteryofchrist.org', sub: 'We reply within 24 hours' }
                            ].map((item, i) => (
                                <div key={i} className="group flex items-center gap-6 p-6 rounded-3xl bg-white border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shrink-0">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 leading-tight">{item.title}</h3>
                                        <p className="text-slate-500 font-bold">{item.content}</p>
                                        {item.sub && <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mt-1">{item.sub}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {}
            <section className="h-[500px] w-full relative overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop"
                    alt="Map"
                    fill
                    className="object-cover brightness-50 grayscale"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/20 text-center max-w-sm">
                        <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Find Us</h3>
                        <p className="text-slate-500 font-bold mb-6">Come experience the hillz in person, find our meeting venue(s).</p>
                        <Link 
                            href="https://maps.app.goo.gl/RcFAHpH192Dtuy9r8" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" className="rounded-full font-bold px-8">OPEN IN MAPS</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

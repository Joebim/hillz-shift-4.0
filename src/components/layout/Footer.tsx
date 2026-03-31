import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, Music } from 'lucide-react';

const footerLinks = {
    ministry: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Mandate', href: '/about/mandate' },
        { name: 'Leadership', href: '/about/leadership' },
        { name: 'History', href: '/about/history' },
    ],
    resources: [
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ],
    connect: [
        { name: 'Ministries', href: '/ministries' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Prayer Request', href: '/prayer' },
    ],
};

const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Spotify', icon: Music, href: '#' },
];

export const Footer = () => {
    return (
        <footer className="bg-[#020617] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2" />

            {}
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {}
                    <div className="lg:col-span-4">
                        <Link href="/" className="mb-8 block group">
                            <img 
                                src="/icons/hillz-logo-dark-transparent.svg" 
                                alt="The Hillz Logo" 
                                className="h-16 md:h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300" 
                            />
                        </Link>
                        <p className="text-slate-400 mb-10 text-base leading-relaxed max-w-sm font-medium italic">
                            &quot;and to make all men see what is the fellowship of the mystery, which from the beginning of the world hath been hid in God, who created all things by Jesus Christ:&quot; Ephesians 3:9
                        </p>

                        {}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="w-12 h-12 bg-white/5 hover:bg-purple-600 rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] group"
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-8">Ministry</h3>
                            <ul className="space-y-4">
                                {footerLinks.ministry.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors font-bold text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-8">Resources</h3>
                            <ul className="space-y-4">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors font-bold text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-8">Connect</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 text-slate-400 group cursor-pointer lg:hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold leading-relaxed pt-1 break-all whitespace-nowrap">
                                        Convener@themysteryofchrist.org
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 group cursor-pointer lg:hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">+234 8143375628</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="pt-12 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                            © {new Date().getFullYear()} THE HILLZ • THE PEOPLE OF HIS DOMINION
                        </p>
                        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-slate-500 hover:text-white transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

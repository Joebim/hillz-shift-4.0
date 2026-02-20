import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Phone, MapPin } from 'lucide-react';

const footerLinks = {
    ministry: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Vision', href: '/about/vision' },
        { name: 'Leadership', href: '/about/leadership' },
        { name: 'History', href: '/about/history' },
    ],
    resources: [
        { name: 'Events', href: '/events' },
        { name: 'Sermons', href: '/sermons' },
        { name: 'Blog', href: '/blog' },
        { name: 'Media', href: '/media' },
    ],
    connect: [
        { name: 'Ministries', href: '/ministries' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Prayer Request', href: '/prayer' },
        { name: 'Give', href: '/give' },
    ],
};

const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
];

export const Footer = () => {
    return (
        <footer className="bg-[#020617] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2" />

            {/* Main Footer */}
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-black text-2xl">S</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter">SHIFT 4.0</span>
                                <span className="text-[10px] font-black tracking-[0.3em] text-purple-400">MINISTRY PLATFORM</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-sm font-medium">
                            Transforming lives through the power of God&apos;s love and the shift into new dimensions of glory.
                        </p>

                        {/* Social Links */}
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

                    {/* Links Grid */}
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
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold leading-relaxed pt-1">
                                        123 Church Avenue, <br />
                                        City, State 12345
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 group cursor-pointer lg:hover:text-white transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">(123) 456-7890</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                            © {new Date().getFullYear()} Shift Platform • Built for the Glory
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

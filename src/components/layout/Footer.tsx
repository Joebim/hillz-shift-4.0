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
                    <div className="lg:col-span-4 space-y-4">
                        <Link href="/" className=" block group">
                            <img 
                                src="/icons/hillz-logo-dark-transparent.svg" 
                                alt="The Hillz Logo" 
                                className="h-16 md:h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300" 
                            />
                        </Link>
                        <p className="text-slate-400 text-base leading-relaxed max-w-sm font-medium italic">
                            &quot;Yet I have set My King on My holy hill of Zion.&quot; <br />
                            &quot;I will declare the decree: The Lord has said to me, <br />
                            You are My Son, Today I have begotten You.&quot; <br />
                            — Psalm 2:6-7
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
                                <a 
                                    href="mailto:Convener@themysteryofchrist.org"
                                    className="flex items-start gap-4 text-slate-400 group lg:hover:text-white transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold leading-relaxed pt-1 break-all">
                                        Convener@themysteryofchrist.org
                                    </span>
                                </a>
                                <a 
                                    href="tel:+2348143375628"
                                    className="flex items-center gap-4 text-slate-400 group lg:hover:text-white transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">+234 814 337 5628</span>
                                </a>
                                <a 
                                    href="https://wa.me/2348143375628"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 text-slate-400 group lg:hover:text-white transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                                        <svg className="w-4 h-4" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor" fillRule="evenodd" d="M96 16c-44.183 0-80 35.817-80 80 0 13.12 3.163 25.517 8.771 36.455l-8.608 36.155a6.002 6.002 0 0 0 7.227 7.227l36.155-8.608C70.483 172.837 82.88 176 96 176c44.183 0 80-35.817 80-80s-35.817-80-80-80ZM28 96c0-37.555 30.445-68 68-68s68 30.445 68 68-30.445 68-68 68c-11.884 0-23.04-3.043-32.747-8.389a6.003 6.003 0 0 0-4.284-.581l-28.874 6.875 6.875-28.874a6.001 6.001 0 0 0-.581-4.284C31.043 119.039 28 107.884 28 96Zm46.023 21.977c11.975 11.974 27.942 20.007 45.753 21.919 11.776 1.263 20.224-8.439 20.224-18.517v-6.996a18.956 18.956 0 0 0-13.509-18.157l-.557-.167-.57-.112-8.022-1.58a18.958 18.958 0 0 0-15.25 2.568 42.144 42.144 0 0 1-7.027-7.027 18.958 18.958 0 0 0 2.569-15.252l-1.582-8.021-.112-.57-.167-.557A18.955 18.955 0 0 0 77.618 52H70.62c-10.077 0-19.78 8.446-18.517 20.223 1.912 17.81 9.944 33.779 21.92 45.754Zm33.652-10.179a6.955 6.955 0 0 1 6.916-1.743l8.453 1.665a6.957 6.957 0 0 1 4.956 6.663v6.996c0 3.841-3.124 6.995-6.943 6.585a63.903 63.903 0 0 1-26.887-9.232 64.594 64.594 0 0 1-11.661-9.241 64.592 64.592 0 0 1-9.241-11.661 63.917 63.917 0 0 1-9.232-26.888C63.626 67.123 66.78 64 70.62 64h6.997a6.955 6.955 0 0 1 6.66 4.957l1.667 8.451a6.956 6.956 0 0 1-1.743 6.917l-1.12 1.12a5.935 5.935 0 0 0-1.545 2.669c-.372 1.403-.204 2.921.603 4.223a54.119 54.119 0 0 0 7.745 9.777 54.102 54.102 0 0 0 9.778 7.746c1.302.806 2.819.975 4.223.603a5.94 5.94 0 0 0 2.669-1.545l1.12-1.12Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">+234 814 337 5628</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="pt-12 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                            © {new Date().getFullYear()} THE HILLZ • THE PEOPLE OF HIS PRESENCE AND DOMINION
                        </p>
                        
                    </div>
                </div>
            </div>
        </footer>
    );
};

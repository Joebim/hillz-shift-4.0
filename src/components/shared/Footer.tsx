import { Mail, ExternalLink, Music, Video, Phone, Globe } from 'lucide-react';
import { EXTERNAL_LINKS } from '@/src/constants/links';
import { Event } from '@/src/types/event';

interface FooterProps {
    event?: Event;
}

export const Footer = ({ event }: FooterProps) => {
    const defaultFooterText = "Empowering a generation for spiritual excellence and purposeful living. Join the movement.";
    const footerText = event?.footerText || defaultFooterText;

    const primaryColor = event?.branding?.primaryColor || '#7c3aed';
    const darkBgColor = `color-mix(in srgb, ${primaryColor} 15%, black)`;

    const contacts = event?.contacts && event.contacts.length > 0 
        ? event.contacts.map(c => ({
            value: c,
            href: c.includes('@') ? `mailto:${c}` : `tel:${c}`,
            icon: c.includes('@') ? Mail : Phone
        }))
        : [{
            value: "Convener@themysteryofchrist.org",
            href: "mailto:Convener@themysteryofchrist.org",
            icon: Mail
        }];

    return (
        <footer 
            className="w-full border-t border-white/10 py-16 md:py-20 text-white/80"
            style={{ backgroundColor: darkBgColor }}
        >
            <div className="container mx-auto container-px">
                <div className="grid grid-cols-1 gap-12 md:gap-16 md:grid-cols-3">
                    <div className="space-y-6">
                        <img 
                            src="/icons/hillz-logo-dark-transparent.svg" 
                            alt="The Hillz Logo" 
                            className="h-14 w-auto object-contain" 
                        />
                        <p className="leading-relaxed text-white/70 max-w-sm">
                            {footerText}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">Contact Us</h4>
                        <ul className="space-y-4">
                            {contacts.map((contact, idx) => (
                                <li key={idx} className="flex items-center gap-4 group">
                                    <div className="rounded-lg bg-white/10 p-2 text-white group-hover:bg-primary group-hover:text-white transition-colors">
                                        <contact.icon size={18} />
                                    </div>
                                    <a
                                        href={contact.href}
                                        className="font-medium text-white/80 group-hover:text-white transition-colors break-all"
                                    >
                                        {contact.value}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h4>
                        <div className="space-y-3">
                            {event?.links && event.links.length > 0 ? (
                                event.links.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:underline font-medium group"
                                    >
                                        <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                        {link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <a
                                        href={EXTERNAL_LINKS.WEBSITE}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:underline font-medium group"
                                    >
                                        <Globe size={16} />
                                        Visit our website
                                    </a>
                                    <a
                                        href={EXTERNAL_LINKS.SPOTIFY}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:underline font-medium group"
                                    >
                                        <Music size={16} className="group-hover:scale-110 transition-transform" />
                                        Listen on Spotify
                                    </a>
                                    <a
                                        href={EXTERNAL_LINKS.GOOGLE_MEET.VIDEO_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:underline font-medium group"
                                    >
                                        <Video size={16} className="group-hover:scale-110 transition-transform" />
                                        Join Live Stream
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-14 md:mt-20 border-t border-white/10 pt-8 md:pt-10 text-center">
                    <p className="text-xs font-semibold text-white/50">
                        © {new Date().getFullYear()} Hillz. All rights reserved.
                        <span className="mx-3 text-white/20">|</span>
                        THE PEOPLE OF HIS DOMINION
                    </p>
                </div>
            </div>
        </footer>
    );
};

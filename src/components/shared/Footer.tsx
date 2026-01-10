import React from 'react';
import { Mail, Phone, ExternalLink, Music, Video } from 'lucide-react';
import { EXTERNAL_LINKS } from '@/src/constants/links';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-white/10 bg-gradient-to-br from-primary-dark via-[#1a1a3a] to-[#0a0a1f] py-16 md:py-20 text-white/80">
            <div className="container mx-auto container-px">
                <div className="grid grid-cols-1 gap-12 md:gap-16 md:grid-cols-3">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
                                SHIFT <span className="text-accent">4.0</span>
                            </h3>
                            <div className="h-1 w-12 bg-accent rounded-full"></div>
                        </div>
                        <p className="leading-relaxed text-white/70 max-w-sm">
                            Empowering a generation for spiritual excellence and purposeful living. Join the movement.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 group">
                                <div className="rounded-lg bg-white/10 p-2 text-white group-hover:bg-accent group-hover:text-primary-dark transition-colors">
                                    <Mail size={18} />
                                </div>
                                <span className="font-medium text-white/80 group-hover:text-accent transition-colors">info@hillzshift.org</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="rounded-lg bg-white/10 p-2 text-white group-hover:bg-accent group-hover:text-primary-dark transition-colors">
                                    <Phone size={18} />
                                </div>
                                <span className="font-medium text-white/80 group-hover:text-accent transition-colors">+234 800 123 4567</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h4>
                        <div className="space-y-3">
                            <a
                                href={EXTERNAL_LINKS.WEBSITE}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-white/90 hover:text-accent hover:underline font-medium group"
                            >
                                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                Visit our website
                            </a>
                            <a
                                href={EXTERNAL_LINKS.SPOTIFY}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-white/90 hover:text-accent hover:underline font-medium group"
                            >
                                <Music size={16} className="group-hover:scale-110 transition-transform" />
                                Listen on Spotify
                            </a>
                            <a
                                href={EXTERNAL_LINKS.GOOGLE_MEET.VIDEO_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-white/90 hover:text-accent hover:underline font-medium group"
                            >
                                <Video size={16} className="group-hover:scale-110 transition-transform" />
                                Join Live Stream
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-14 md:mt-20 border-t border-white/10 pt-8 md:pt-10 text-center">
                    <p className="text-xs font-semibold text-white/50">
                        © {new Date().getFullYear()} Hillz Shift Ministries. All rights reserved.
                        <span className="mx-3 text-white/20">|</span>
                        Designed with Heart for the Kingdom.
                    </p>
                </div>
            </div>
        </footer>
    );
};

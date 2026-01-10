import React from 'react';
import Image from 'next/image';

export const EventHeader = () => {
    return (
        <div className="relative w-full overflow-hidden py-4 md:py-5 lg:py-6">
            {/* Gradient background that transitions from dark sides to lighter center */}
            <div className="absolute inset-0 z-0" style={{
                background: 'radial-gradient(ellipse 120% 100% at center, rgba(43,63,211,0.5) 0%, rgba(74,16,138,0.7) 35%, rgba(26,26,122,0.95) 65%, rgba(5,10,48,1) 100%)'
            }}>
                {/* Additional horizontal gradient overlay for smooth side transitions */}
                <div className="absolute inset-0 bg-linear-to-r from-[#050a30]/95 via-transparent to-[#050a30]/95"></div>
                {/* Vertical gradient overlay for top/bottom depth */}
                <div className="absolute inset-0 bg-linear-to-b from-[#050a30]/60 via-transparent to-[#050a30]/60"></div>
            </div>

            {/* Container to center the image */}
            <div className="relative z-10 container mx-auto container-px flex items-center justify-center">
                <div className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                    <div className="relative aspect-1080/786 w-full overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/10">
                        <Image
                            src="/graphics/shift-flyer-4.0.jpeg"
                            alt="SHIFT 4.0 Event Flyer"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import Image from 'next/image';

export const EventHeader = () => {
    return (
        <div className="relative w-full overflow-hidden py-4 md:py-5 lg:py-6 bg-white">

            {/* Container to center the image */}
            <div className="relative container mx-auto container-px flex items-center justify-center">
                <div className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                    <div className="relative aspect-1080/786 w-full overflow-hidden rounded-2xl ring-4 ring-white/10">
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

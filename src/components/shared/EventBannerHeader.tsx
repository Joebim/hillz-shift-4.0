import React from 'react';
import Image from 'next/image';

interface EventBannerHeaderProps {
    bannerImage?: string;
    title: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export const EventBannerHeader = ({
    bannerImage,
    title,
    primaryColor,
    secondaryColor,
}: EventBannerHeaderProps) => {
    return (
        <div className="relative w-full overflow-hidden py-4 md:py-5 lg:py-6 bg-white">
            <div className="relative container mx-auto container-px flex items-center justify-center">
                <div className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
                    <div className="relative aspect-4/3 md:aspect-5/4 w-full overflow-hidden rounded-2xl shadow-none">
                        {bannerImage ? (
                            <Image
                                src={bannerImage}
                                alt={`${title} Banner`}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center text-white font-black text-3xl md:text-5xl p-10 text-center uppercase tracking-tighter"
                                style={{
                                    background: primaryColor && secondaryColor
                                        ? `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
                                        : primaryColor
                                            ? `linear-gradient(to bottom right, ${primaryColor}, ${primaryColor}cc)`
                                            : 'linear-gradient(to bottom right, #6B46C1, #553C9A)',
                                }}
                            >
                                {title}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';

export const Banner = () => {
    return (
        <div className="w-full bg-primary-dark/5 p-3 text-center backdrop-blur-sm border-b border-primary/5">
            <div className="mx-auto flex max-w-7xl items-center justify-center container-px">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-1.5 shadow-sm border border-primary/10">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-xs font-bold tracking-wide text-primary-dark uppercase text-center">
                        Join us for a <span className="text-primary">life-transforming encounter</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

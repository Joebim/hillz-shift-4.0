
import { cn } from "@/src/lib/utils";

function Sk({ className }: { className?: string }) {
    return <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />;
}

export function SkeletonDetail() {
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
            {/* Mobile top bar */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
                <Sk className="h-4 w-20" />
                <div className="flex gap-2">
                    <Sk className="h-8 w-8 rounded-full" />
                    <Sk className="h-8 w-8 rounded-full" />
                    <Sk className="h-8 w-8 rounded-full" />
                </div>
            </div>
            {/* Mobile tab bar */}
            <div className="lg:hidden flex bg-white border-b border-gray-100 px-4 gap-1 py-2 shrink-0">
                <Sk className="flex-1 h-8 rounded-lg" />
                <Sk className="flex-1 h-8 rounded-lg" />
            </div>

            {/* Left / main panel skeleton */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden border-r border-gray-200">
                {/* Header bar */}
                <div className="hidden lg:flex px-6 py-4 border-b border-gray-100 items-center justify-between shrink-0">
                    <Sk className="h-4 w-24" />
                    <div className="flex gap-3">{[1, 2, 3, 4].map(i => <Sk key={i} className="h-4 w-4 rounded" />)}</div>
                </div>
                {/* Hero banner */}
                <Sk className="h-44 md:h-56 w-full rounded-none shrink-0" />
                <div className="flex-1 px-6 py-6 space-y-6 overflow-hidden">
                    {/* Title row */}
                    <div className="space-y-2">
                        <div className="flex gap-2"><Sk className="h-5 w-20 rounded-full" /><Sk className="h-5 w-24 rounded-full" /></div>
                        <Sk className="h-8 w-3/4" />
                        <Sk className="h-4 w-1/2" />
                    </div>
                    {/* Info grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Sk key={i} className="h-16 rounded-xl" />)}
                    </div>
                    {/* Description */}
                    <div className="space-y-2">
                        <Sk className="h-3 w-20" />
                        <Sk className="h-4 w-full" />
                        <Sk className="h-4 w-full" />
                        <Sk className="h-4 w-2/3" />
                    </div>
                    {/* Tags */}
                    <div className="flex gap-2">{[1, 2, 3].map(i => <Sk key={i} className="h-7 w-20 rounded-full" />)}</div>
                    {/* Sections */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Sk className="h-3 w-16" /><Sk className="h-4 w-full" /><Sk className="h-4 w-3/4" /></div>
                        <div className="space-y-2"><Sk className="h-3 w-16" /><Sk className="h-4 w-full" /><Sk className="h-4 w-1/2" /></div>
                    </div>
                    <div className="space-y-2"><Sk className="h-3 w-20" />{[1, 2].map(i => <Sk key={i} className="h-14 rounded-xl" />)}</div>
                    <div className="grid grid-cols-2 gap-3">{[1, 2, 3, 4].map(i => <Sk key={i} className="h-16 rounded-xl" />)}</div>
                </div>
            </div>

            {/* Right panel skeleton */}
            <div className="hidden lg:flex w-96 shrink-0 flex-col overflow-hidden">
                {/* Tabs above purple */}
                <div className="bg-white border-b border-gray-100 px-4 py-3 flex gap-2 shrink-0">
                    <Sk className="flex-1 h-9 rounded-xl" />
                    <Sk className="flex-1 h-9 rounded-xl" />
                </div>
                {/* Purple pane */}
                <div className="flex-1 flex flex-col" style={{ backgroundColor: '#6c63d5' }}>
                    <div className="px-6 pt-5 pb-4 space-y-2 shrink-0">
                        <Sk className="h-3 w-20 bg-violet-400" />
                        <Sk className="h-8 w-48 bg-violet-400" />
                        <Sk className="h-3 w-28 bg-violet-400" />
                        <Sk className="h-9 w-28 bg-violet-500 rounded-lg mt-3" />
                    </div>
                    <div className="h-px bg-violet-400/30 mx-6 shrink-0" />
                    <div className="px-6 py-4 space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sk className="h-9 w-9 rounded-full bg-violet-400" />
                                    <Sk className="h-4 w-28 bg-violet-400" />
                                </div>
                                <div className="flex gap-1.5">
                                    <Sk className="h-6 w-6 rounded-full bg-violet-400" />
                                    <Sk className="h-6 w-6 rounded-full bg-violet-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

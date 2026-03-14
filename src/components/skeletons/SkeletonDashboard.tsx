
import { cn } from "@/src/lib/utils";

function Sk({ className }: { className?: string }) {
    return <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />;
}

export function SkeletonDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            {}
            <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
                <Sk className="h-7 w-28 shrink-0" />
                <Sk className="hidden md:block h-10 rounded-full flex-1 max-w-sm" />
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <Sk className="h-9 w-9 rounded-full" />
                    <Sk className="h-9 w-28 rounded-full hidden sm:block" />
                    <Sk className="h-9 w-9 rounded-full" />
                    <Sk className="h-9 w-9 rounded-full lg:hidden" />
                </div>
            </div>
            <div className="flex">
                <main className="flex-1 p-4 md:p-6 space-y-5 min-w-0">
                    {}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                                <Sk className="w-12 h-12 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Sk className="h-4 w-28" />
                                    <Sk className="h-3 w-36" />
                                </div>
                            </div>
                        ))}
                    </div>
                    {}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <Sk className="h-5 w-32" />
                            <Sk className="h-5 w-5 rounded" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                                    <Sk className="h-28 md:h-32 w-full rounded-none" />
                                    <div className="p-3 space-y-2">
                                        <Sk className="h-4 w-full" />
                                        <Sk className="h-3 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <Sk className="h-5 w-32" />
                            <Sk className="h-5 w-5 rounded" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="rounded-2xl border border-gray-100 p-4 space-y-3">
                                    <Sk className="h-6 w-24 rounded-full" />
                                    <Sk className="h-4 w-full" />
                                    <Sk className="h-3 w-32" />
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(j => <Sk key={j} className="w-7 h-7 rounded-full" />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                {}
                <aside className="hidden lg:block w-72 shrink-0 bg-white border-l border-gray-100 p-5 space-y-5">
                    <div className="flex items-center justify-between">
                        <Sk className="h-5 w-28" />
                        <Sk className="h-5 w-5 rounded" />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3">
                            <Sk className="w-10 h-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Sk className="h-3 w-full" />
                                <Sk className="h-3 w-3/4" />
                                <Sk className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                        <Sk className="h-5 w-24" />
                        <Sk className="h-24 w-full rounded-xl" />
                    </div>
                </aside>
            </div>
        </div>
    );
}

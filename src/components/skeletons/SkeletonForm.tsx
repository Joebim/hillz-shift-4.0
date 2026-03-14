
import { cn } from "@/src/lib/utils";

function Sk({ className }: { className?: string }) {
    return <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />;
}

export function SkeletonForm() {
    return (
        <div className="min-h-screen bg-gray-50">
            {}
            <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <Sk className="h-4 w-20" />
                    <Sk className="h-4 w-px bg-gray-200 mx-1" />
                    <Sk className="h-5 w-40" />
                </div>
                <div className="flex gap-2">
                    <Sk className="h-9 w-24 rounded-xl" />
                    <Sk className="h-9 w-24 rounded-xl" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex gap-6">
                {}
                <div className="hidden lg:block w-52 shrink-0 space-y-1 pt-1">
                    {[1, 2, 3, 4, 5, 6].map(i => <Sk key={i} className="h-10 w-full rounded-xl" />)}
                    <div className="pt-4 space-y-2 border-t border-gray-100 mt-4">
                        <Sk className="h-10 w-full rounded-xl" />
                        <Sk className="h-10 w-full rounded-xl" />
                    </div>
                </div>

                {}
                <div className="flex-1 min-w-0 space-y-6">
                    {}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2.5"><Sk className="w-8 h-8 rounded-lg" /><Sk className="h-5 w-32" /></div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2"><Sk className="h-40 rounded-xl" /></div>
                            <Sk className="h-40 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map(i => <Sk key={i} className="h-12 rounded-xl" />)}
                        </div>
                    </div>

                    {}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2.5"><Sk className="w-8 h-8 rounded-lg" /><Sk className="h-5 w-28" /></div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2"><Sk className="h-11 rounded-xl" /></div>
                            <Sk className="h-11 rounded-xl" />
                        </div>
                        <Sk className="h-11 w-full rounded-xl" />
                        <Sk className="h-28 w-full rounded-xl" />
                        <Sk className="h-24 w-full rounded-xl" />
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => <Sk key={i} className="h-7 rounded-full" />)}
                        </div>
                    </div>

                    {}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2.5"><Sk className="w-8 h-8 rounded-lg" /><Sk className="h-5 w-36" /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <Sk className="h-11 rounded-xl" />
                            <Sk className="h-11 rounded-xl" />
                        </div>
                        <Sk className="h-44 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

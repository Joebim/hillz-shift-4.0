import { Section } from '@/src/components/shared/Section';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Send } from 'lucide-react';

export const Newsletter = () => {
    return (
        <Section bg="none" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                    <Send className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Stay in the Flow</h2>
                <p className="text-white/70 mb-12 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                    Get the latest inspiration, event updates, and spiritual insights <br className="hidden md:block" />
                    delivered directly to your digital space.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto bg-white/5 p-3 rounded-[32px] backdrop-blur-2xl border border-white/10 shadow-3xl">
                    <Input
                        type="email"
                        placeholder="your@email.com"
                        className="flex-1 h-16 px-8 rounded-full bg-white/10 border-transparent focus:bg-white/20 focus:ring-0 placeholder:text-white/40 text-white font-bold text-lg"
                        required
                    />
                    <Button type="submit" variant="secondary" className="h-16 px-10 rounded-full bg-white text-black hover:bg-gray-100 font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl">
                        SUBSCRIBE
                    </Button>
                </form>
                <p className="mt-8 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase">No Spam • Just Glory • Unsubscribe Anytime</p>
            </div>
        </Section>
    );
};

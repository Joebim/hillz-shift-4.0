'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { ShieldCheck, Send, Lock } from 'lucide-react';

export function PrayerForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [activeCategory, setActiveCategory] = useState<string>('General');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            isPrivate: formData.get('isPrivate') === 'on',
            category: activeCategory,
            request: formData.get('request') as string,
        };

        try {
            const res = await fetch('/api/prayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 bg-green-50 rounded-[24px] border border-green-100 animate-fade-in-up">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">Request Submitted</h3>
                <p className="text-green-700 font-medium">Your prayer request has been received. Our team will be praying for you.</p>
                <Button onClick={() => setStatus('idle')} className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full">
                    Submit Another Request
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Your Name (Optional)</label>
                    <Input name="name" placeholder="Anonymous" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email (Optional)</label>
                    <Input name="email" type="email" placeholder="For follow up" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone (Optional)</label>
                    <Input name="phone" type="tel" placeholder="For follow up" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold" />
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <label className="group flex items-center gap-3 cursor-pointer p-4 border border-slate-100 rounded-2xl hover:bg-indigo-50 transition-all bg-slate-50/30">
                        <div className="relative flex items-center justify-center">
                            <input name="isPrivate" type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" />
                            <ShieldCheck className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Keep this request private</span>
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                <div className="flex flex-wrap gap-3">
                    {['General', 'Healings', 'Guidance', 'Provision', 'Family', 'Salvation', 'Other'].map(cat => (
                        <button
                            type="button"
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full border border-slate-100 text-xs font-black uppercase tracking-widest transition-all shadow-sm ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'text-slate-500 hover:bg-indigo-50 hover:border-indigo-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Your Prayer Request</label>
                <Textarea name="request" rows={6} placeholder="Share your burdens with us..." required className="rounded-[24px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold p-6" />
            </div>

            <div className="glass bg-blue-50/50 border-blue-100 p-6 rounded-[24px] flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                    <Lock className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-blue-800 leading-relaxed italic">
                    Your privacy is important to us. All requests are handled with divine confidentiality and care by our dedicated spiritual warriors.
                </p>
            </div>

            {status === 'error' && (
                <div className="text-red-500 font-bold ml-4">Failed to submit request. Please try again.</div>
            )}

            <Button disabled={status === 'loading'} className="w-full h-18 rounded-[24px] bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-900/10 transition-all flex items-center justify-center gap-3">
                {status === 'loading' ? 'Submitting...' : 'Submit Prayer Request'} <Send className="w-4 h-4" />
            </Button>
        </form>
    );
}

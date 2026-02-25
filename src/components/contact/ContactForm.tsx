'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';

export function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        try {
            const res = await fetch('/api/contact', {
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
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent</h3>
                <p className="text-green-700 font-medium">Thank you for contacting us. We will get back to you soon.</p>
                <Button onClick={() => setStatus('idle')} className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full">
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <Input name="name" placeholder="John Doe" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-purple-600/20 text-slate-900 font-bold" required />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <Input name="email" type="email" placeholder="john@example.com" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-purple-600/20 text-slate-900 font-bold" required />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                <Input name="subject" placeholder="How can we help you?" className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-purple-600/20 text-slate-900 font-bold" required />
            </div>
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                <Textarea name="message" rows={6} placeholder="Tell us what's on your mind..." className="rounded-3xl bg-slate-50 border-transparent focus:bg-white focus:ring-purple-600/20 text-slate-900 font-bold p-6" required />
            </div>

            {status === 'error' && (
                <div className="text-red-500 font-bold ml-1">Failed to send message. Please try again.</div>
            )}

            <Button disabled={status === 'loading'} className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl" size="lg">
                {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
            </Button>
        </form>
    );
}

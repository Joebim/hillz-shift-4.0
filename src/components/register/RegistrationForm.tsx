'use client';

import React from 'react';
import { useRegistrationStore } from '@/src/store/useRegistrationStore';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { Info } from 'lucide-react';
import { useToast } from '@/src/contexts/ToastContext';

export const RegistrationForm = () => {
    const { form, setField, isSubmitting, setIsSubmitting } = useRegistrationStore();
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Registration successful! Redirecting...', 2000);
                setTimeout(() => {
                router.push(ROUTES.SUCCESS);
                }, 500);
            } else {
                const errorMessage = result.error || 'Registration failed. Please try again.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong! Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6">
            <Input
                label="Full Name"
                placeholder="Enter your name"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
            />
            <Input
                label="Email Address"
                type="email"
                placeholder="yourname@example.com"
                required
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
            />
            <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 ..."
                required
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Address
                    <div className="group relative">
                        <Info size={14} className="text-gray-400 cursor-help" aria-label="Example: Gbagada, Lagos" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus-within:block w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10 pointer-events-none">
                            Example: Gbagada, Lagos
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>
                </label>
                <input
                    type="text"
                    placeholder="e.g., Gbagada, Lagos"
                    required
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400"
                />
            </div>

            <Input
                label="Who invited you?"
                type="text"
                placeholder="Name of the person who invited you (optional)"
                value={form.whoInvited}
                onChange={(e) => setField('whoInvited', e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">How did you hear about us?</label>
                <select
                    value={form.heardFrom}
                    onChange={(e) => setField('heardFrom', e.target.value)}
                    required
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                    <option value="">Select an option</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend">Friend / Referral</option>
                    <option value="church">Church Announcement</option>
                    <option value="qr-code">QR Code</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                Register for Hillz Shift 4.0
            </Button>
        </form>
    );
};

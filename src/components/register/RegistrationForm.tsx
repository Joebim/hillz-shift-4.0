'use client';

import React from 'react';
import { useRegistrationStore } from '@/src/store/useRegistrationStore';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { ParticipantsSearchSelect } from '@/src/components/invite/ParticipantsSearchSelect';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { Info } from 'lucide-react';
import { useToast } from '@/src/contexts/ToastContext';

export const RegistrationForm = () => {
    const { form, setField, isSubmitting, setIsSubmitting } = useRegistrationStore();
    const router = useRouter();
    const toast = useToast();
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.name?.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!form.email?.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!form.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            // Basic phone validation (should contain digits and optional + at start)
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(form.phone.trim())) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        if (!form.address?.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!form.joiningMethod) {
            newErrors.joiningMethod = 'Please select how you will be attending';
        }

        if (!form.heardFrom) {
            newErrors.heardFrom = 'Please select how you heard about us';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

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
                onChange={(e) => {
                    setField('name', e.target.value);
                    if (errors.name) {
                        setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.name;
                            return newErrors;
                        });
                    }
                }}
                error={errors.name}
            />
            <Input
                label="Email Address"
                type="email"
                placeholder="yourname@example.com"
                required
                value={form.email}
                onChange={(e) => {
                    setField('email', e.target.value);
                    if (errors.email) {
                        setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.email;
                            return newErrors;
                        });
                    }
                }}
                error={errors.email}
            />
            <Input
                label="Phone Number"
                type="tel"
                placeholder="+234 ..."
                required
                value={form.phone}
                onChange={(e) => {
                    setField('phone', e.target.value);
                    if (errors.phone) {
                        setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.phone;
                            return newErrors;
                        });
                    }
                }}
                error={errors.phone}
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
                    onChange={(e) => {
                        setField('address', e.target.value);
                        if (errors.address) {
                            setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.address;
                                return newErrors;
                            });
                        }
                    }}
                    className={`flex h-11 w-full rounded-xl border px-4 py-2 text-sm transition-all focus:outline-none focus:ring-4 placeholder:text-gray-400 ${
                        errors.address
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/10'
                    }`}
                />
                {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
            </div>

            <ParticipantsSearchSelect
                label="Who invited you?"
                placeholder="Type the name of the person who invited you..."
                value={form.whoInvited}
                onChange={(value) => setField('whoInvited', value)}
                onSelect={(participant) => {
                    if (participant) {
                        setField('whoInvited', participant.name);
                    }
                }}
                showRegisterPrompt={false}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">How will you be attending?</label>
                <select
                    value={form.joiningMethod}
                    onChange={(e) => {
                        setField('joiningMethod', e.target.value);
                        if (errors.joiningMethod) {
                            setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.joiningMethod;
                                return newErrors;
                            });
                        }
                    }}
                    required
                    className={`flex h-11 w-full rounded-xl border px-4 py-2 text-sm transition-all focus:outline-none focus:ring-4 ${
                        errors.joiningMethod
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/10'
                    }`}
                >
                    <option value="">Select an option</option>
                    <option value="in-person">In Person</option>
                    <option value="online">Online</option>
                </select>
                {errors.joiningMethod && <span className="text-xs text-red-500">{errors.joiningMethod}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">How did you hear about us?</label>
                <select
                    value={form.heardFrom}
                    onChange={(e) => {
                        setField('heardFrom', e.target.value);
                        if (errors.heardFrom) {
                            setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.heardFrom;
                                return newErrors;
                            });
                        }
                    }}
                    required
                    className={`flex h-11 w-full rounded-xl border px-4 py-2 text-sm transition-all focus:outline-none focus:ring-4 ${
                        errors.heardFrom
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/10'
                    }`}
                >
                    <option value="">Select an option</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend">Friend / Referral</option>
                    <option value="church">Church Announcement</option>
                    <option value="qr-code">QR Code</option>
                    <option value="other">Other</option>
                </select>
                {errors.heardFrom && <span className="text-xs text-red-500">{errors.heardFrom}</span>}
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                Register for Shift 4.0
            </Button>
        </form>
    );
};

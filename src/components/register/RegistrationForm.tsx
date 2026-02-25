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
import { DynamicFieldRenderer } from '@/src/components/shared/DynamicFieldRenderer';
import { EventRegistrationConfig } from '@/src/types/event';

interface Props {
    eventId?: string;
    config?: EventRegistrationConfig;
}

export const RegistrationForm = ({ eventId, config }: Props) => {
    const { form, setField, setCustomField, isSubmitting, setIsSubmitting } = useRegistrationStore();
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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!form.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        // Validate dynamic fields
        if (config?.fields) {
            config.fields.forEach(field => {
                if (field.required) {
                    const value = form.customFields[field.label] as unknown;
                    if (!value || (Array.isArray(value) && value.length === 0)) {
                        newErrors[field.label] = `${field.label} is required`;
                    }
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const nameParts = form.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Attendee';

            const payload = {
                eventId: eventId || 'unknown',
                attendee: {
                    firstName,
                    lastName,
                    email: form.email,
                    phone: form.phone,
                    customFields: {
                        address: form.address,
                        joiningMethod: form.joiningMethod,
                        heardFrom: form.heardFrom,
                        ...form.customFields
                    }
                },
                invitedBy: form.whoInvited || undefined,
            };

            const endpoint = eventId ? `/api/events/${eventId}/registrations` : `/api/registrations`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Registration successful! Redirecting...', 2000);
                setTimeout(() => {
                    const successUrl = eventId ? `/e/${eventId}/success` : ROUTES.SUCCESS;
                    router.push(successUrl);
                }, 500);
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-4">Personal Information</h3>
                <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    error={errors.name}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="yourname@example.com"
                        required
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        error={errors.email}
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+234 ..."
                        required
                        value={form.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                        error={errors.phone}
                    />
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-4">Additional Details</h3>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Address
                        <Info size={14} className="text-gray-400" />
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Gbagada, Lagos"
                        value={form.address}
                        onChange={(e) => setField('address', e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Attendance Type</label>
                        <select
                            value={form.joiningMethod}
                            onChange={(e) => setField('joiningMethod', e.target.value)}
                            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                        >
                            <option value="">Select an option</option>
                            <option value="in-person">In Person</option>
                            <option value="online">Online</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">How did you hear about us?</label>
                        <select
                            value={form.heardFrom}
                            onChange={(e) => setField('heardFrom', e.target.value)}
                            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                        >
                            <option value="">Select an option</option>
                            <option value="social-media">Social Media</option>
                            <option value="friend">Friend / Referral</option>
                            <option value="church">Church Announcement</option>
                            <option value="qr-code">QR Code</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <ParticipantsSearchSelect
                    label="Who invited you?"
                    placeholder="Search inviter name..."
                    value={form.whoInvited}
                    onChange={(value) => setField('whoInvited', value)}
                    onSelect={(p) => p && setField('whoInvited', p.name)}
                    showRegisterPrompt={false}
                />
            </div>

            {config?.fields && config.fields.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-4">Event Questions</h3>
                    <DynamicFieldRenderer
                        fields={config.fields}
                        values={form.customFields}
                        onChange={(label, value) => {
                            setCustomField(label, value);
                            if (errors[label]) {
                                setErrors(prev => {
                                    const next = { ...prev };
                                    delete next[label];
                                    return next;
                                });
                            }
                        }}
                        errors={errors}
                    />
                </div>
            )}

            <Button type="submit" className="w-full h-14 text-lg btn-primary rounded-2xl shadow-xl shadow-primary/20" isLoading={isSubmitting}>
                Complete Registration
            </Button>
        </form>
    );
};

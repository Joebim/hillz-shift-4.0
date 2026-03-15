'use client';

import React from 'react';
import { useRegistrationStore } from '@/src/store/useRegistrationStore';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { DbSearchSelect } from '@/src/components/shared/DbSearchSelect';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { useToast } from '@/src/contexts/ToastContext';
import { DynamicFieldRenderer } from '@/src/components/shared/DynamicFieldRenderer';
import { EventRegistrationConfig } from '@/src/types/event';

interface Props {
    eventId?: string;
    eventSlug?: string;
    config?: EventRegistrationConfig;
}

export const RegistrationForm = ({ eventId, eventSlug, config }: Props) => {
    const { form, setField, setCustomField, isSubmitting, setIsSubmitting } = useRegistrationStore();
    const router = useRouter();
    const toast = useToast();
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.name?.trim()) newErrors.name = 'Full name is required';

        if (!form.email?.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!form.phone?.trim()) newErrors.phone = 'Phone number is required';

        if (!form.whoInvited?.trim()) newErrors.whoInvited = 'Please tell us who invited you';

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
                    customFields: form.customFields,
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
                    const slugOrId = eventSlug || eventId;
                    const successUrl = slugOrId ? `/e/${slugOrId}/success` : ROUTES.SUCCESS;
                    router.push(successUrl);
                }, 500);
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-8">

            {}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-4">
                        Your Information
                    </h3>
                    <span className="text-[10px] font-bold bg-violet-50 text-violet-500 border border-violet-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Required
                    </span>
                </div>

                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
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

                {}
                <DbSearchSelect
                    source="registrations"
                    eventId={eventId}
                    label="Who Invited You?"
                    placeholder="Search by inviter name..."
                    required
                    value={form.whoInvited}
                    onChange={(value) => {
                        setField('whoInvited', value);
                        if (errors.whoInvited) setErrors(prev => { const n = { ...prev }; delete n.whoInvited; return n; });
                    }}
                    error={errors.whoInvited}
                />
            </div>

            {}
            {config?.fields && config.fields.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-4">
                        Event Questions
                    </h3>
                    <DynamicFieldRenderer
                        fields={config.fields}
                        values={form.customFields}
                        eventId={eventId}
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

            <Button
                type="submit"
                className="w-full h-14 text-lg btn-primary rounded-2xl shadow-xl shadow-primary/20"
                isLoading={isSubmitting}
            >
                Complete Registration
            </Button>
        </form>
    );
};

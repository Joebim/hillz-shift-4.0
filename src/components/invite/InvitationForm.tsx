'use client';

import React from 'react';
import { useInvitationStore } from '@/src/store/useInvitationStore';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Button } from '@/src/components/ui/Button';
import { DbSearchSelect } from '@/src/components/shared/DbSearchSelect';
import { Share2 } from 'lucide-react';
import { generateWhatsAppInvite } from '@/src/utils/whatsapp';
import { useToast } from '@/src/contexts/ToastContext';
import { DynamicFieldRenderer } from '@/src/components/shared/DynamicFieldRenderer';
import { EventInvitationConfig } from '@/src/types/event';

interface Props {
    eventId?: string;
    eventSlug?: string;
    eventTitle?: string;
    config?: EventInvitationConfig;
}

export const InvitationForm = ({ eventId, eventSlug, eventTitle, config }: Props) => {
    const { form, setField, setCustomField, isSubmitting, setIsSubmitting, resetForm } = useInvitationStore();
    const toast = useToast();
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.inviterName?.trim()) newErrors.inviterName = 'Your name is required';

        if (!form.inviteeName?.trim()) newErrors.inviteeName = "Guest's name is required";

        if (!form.inviteePhone?.trim()) {
            newErrors.inviteePhone = 'Phone / WhatsApp number is required';
        } else {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(form.inviteePhone.trim())) {
                newErrors.inviteePhone = 'Please enter a valid phone number';
            }
        }

        if (form.inviteeEmail?.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.inviteeEmail.trim())) {
                newErrors.inviteeEmail = 'Please enter a valid email address';
            }
        }

        // customMessage is now optional
        // if (!form.customMessage?.trim()) newErrors.customMessage = 'Invitation message is required';

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
            const payload = {
                senderName: form.inviterName,
                senderEmail: 'whatsapp-invite@hillzshift.com',
                recipientName: form.inviteeName,
                recipientEmail: form.inviteeEmail || '',
                personalMessage: form.customMessage,
                customFields: {
                    recipientPhone: form.inviteePhone,
                    ...form.customFields,
                },
            };

            const endpoint = eventId ? `/api/events/${eventId}/invitations` : '/api/invitations';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.success) {
                const registrationLink =
                    result.registrationLink || 
                    (eventSlug 
                        ? `${window.location.origin}/e/${eventSlug}/register?ref=${result.id}`
                        : `${window.location.origin}/register?ref=${result.id}`);
                const waLink = generateWhatsAppInvite(
                    form.inviteeName,
                    form.inviterName,
                    form.customMessage,
                    registrationLink,
                    form.inviteePhone,
                    eventTitle
                );

                resetForm();
                toast.success('Invitation processed! Opening WhatsApp...', 2000);

                const link = document.createElement('a');
                link.href = waLink;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => document.body.removeChild(link), 100);

                setTimeout(() => {
                    window.open(waLink, '_blank', 'noopener,noreferrer');
                }, 50);
            } else {
                toast.error(result.error || 'Failed to send invitation');
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10">

            {}
            <div className="space-y-6 rounded-3xl border border-primary/10 bg-primary/5 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-primary flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm text-white font-black">
                        1
                    </span>
                    Your Information
                    <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-widest ml-auto">
                        Default
                    </span>
                </h3>
                <DbSearchSelect
                    source="registrations"
                    eventId={eventId}
                    label="Your Full Name"
                    placeholder="Search your name..."
                    required
                    value={form.inviterName}
                    onChange={(val) => setField('inviterName', val)}
                    error={errors.inviterName}
                />
            </div>

            {}
            <div className="space-y-6 rounded-3xl border border-accent/10 bg-accent/5 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-accent flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-sm text-white font-black">
                        2
                    </span>
                    Guest Information
                    <span className="text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full uppercase tracking-widest ml-auto">
                        Default
                    </span>
                </h3>

                {}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                        label="Guest Full Name"
                        placeholder="e.g. John Doe"
                        required
                        value={form.inviteeName}
                        onChange={(e) => setField('inviteeName', e.target.value)}
                        error={errors.inviteeName}
                    />
                    <Input
                        label="Phone / WhatsApp Number"
                        type="tel"
                        placeholder="e.g. +234..."
                        required
                        value={form.inviteePhone}
                        onChange={(e) => setField('inviteePhone', e.target.value)}
                        error={errors.inviteePhone}
                    />
                </div>

                {}
                <Input
                    label="Email Address (Optional)"
                    type="email"
                    placeholder="john@example.com"
                    value={form.inviteeEmail}
                    onChange={(e) => setField('inviteeEmail', e.target.value)}
                    error={errors.inviteeEmail}
                />

                {}
                <Textarea
                    label="Personal Invitation Note (Optional)"
                    placeholder="Write a message to your guest..."
                    value={form.customMessage}
                    onChange={(e) => setField('customMessage', e.target.value)}
                    className="min-h-[120px]"
                    error={errors.customMessage}
                />
            </div>

            {}
            {config?.fields && config.fields.length > 0 && (
                <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-600 font-black">
                            3
                        </span>
                        Additional Questions
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
                className="w-full h-16 text-lg gap-3 btn-primary rounded-2xl shadow-xl shadow-primary/20"
                isLoading={isSubmitting}
            >
                <Share2 size={24} />
                Send Invitation Now
            </Button>
        </form>
    );
};

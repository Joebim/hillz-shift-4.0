'use client';

import React from 'react';
import { useInvitationStore } from '@/src/store/useInvitationStore';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Button } from '@/src/components/ui/Button';
import { ParticipantsSearchSelect } from '@/src/components/invite/ParticipantsSearchSelect';
import { Share2 } from 'lucide-react';
import { generateWhatsAppInvite } from '@/src/utils/whatsapp';
import { useToast } from '@/src/contexts/ToastContext';

export const InvitationForm = () => {
    const { form, setField, isSubmitting, setIsSubmitting, resetForm } = useInvitationStore();
    const toast = useToast();
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.inviterName?.trim()) {
            newErrors.inviterName = 'Your name is required';
        }

        if (!form.inviteeName?.trim()) {
            newErrors.inviteeName = 'Invitee name is required';
        }

        if (!form.inviteePhone?.trim()) {
            newErrors.inviteePhone = 'WhatsApp number is required';
        } else {
            // Basic phone validation (should contain digits and optional + at start)
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(form.inviteePhone.trim())) {
                newErrors.inviteePhone = 'Please enter a valid phone number';
            }
        }

        // Email is optional but if provided, must be valid
        if (form.inviteeEmail?.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.inviteeEmail.trim())) {
                newErrors.inviteeEmail = 'Please enter a valid email address';
            }
        }

        if (!form.location?.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!form.customMessage?.trim()) {
            newErrors.customMessage = 'Invitation message is required';
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
            const response = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const result = await response.json();
            if (result.success) {
                // Trigger WhatsApp with custom message
                const registrationLink = result.registrationLink || `${window.location.origin}/register?ref=${result.id}`;
                const waLink = generateWhatsAppInvite(
                    form.inviteeName,
                    form.inviterName,
                    form.customMessage,
                    registrationLink,
                    form.inviteePhone // Pass the phone number
                );

                // Reset form immediately
                resetForm();

                // Show success message
                toast.success('Invitation sent via Email! Opening WhatsApp...', 2000);

                // Open WhatsApp immediately using anchor click (most reliable method)
                // This must happen immediately after the async call completes
                const link = document.createElement('a');
                link.href = waLink;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.position = 'fixed';
                link.style.top = '-9999px';
                link.style.left = '-9999px';
                document.body.appendChild(link);

                // Click immediately - no delays
                link.click();

                // Clean up after a brief moment
                setTimeout(() => {
                    if (link.parentNode) {
                        document.body.removeChild(link);
                    }
                }, 100);

                // Also try window.open as backup (in case anchor click doesn't work)
                setTimeout(() => {
                    const newWindow = window.open(waLink, '_blank', 'noopener,noreferrer');
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        // Popup was blocked - show fallback
                        createFallbackLink(waLink);
                    }
                }, 50);
            } else {
                const errorMessage = result.error || 'Failed to send invitation. Please try again.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong! Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function to create fallback link
    const createFallbackLink = (waLink: string) => {
        const manualLink = document.createElement('a');
        manualLink.href = waLink;
        manualLink.target = '_blank';
        manualLink.rel = 'noopener noreferrer';
        manualLink.textContent = 'Click here to open WhatsApp';
        manualLink.className = 'fixed bottom-24 right-4 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[10000] font-bold transition-all hover:scale-105 cursor-pointer';
        manualLink.style.zIndex = '10000';
        document.body.appendChild(manualLink);

        const cleanup = () => {
            if (manualLink.parentNode) {
                document.body.removeChild(manualLink);
            }
        };
        manualLink.addEventListener('click', cleanup);
        setTimeout(cleanup, 15000);

        toast.info('Popup blocked. Please click the green button to open WhatsApp', 5000);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10">
            <div className="space-y-6 rounded-2xl border border-primary/5 bg-primary/5 p-8">
                <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white uppercase">1</span>
                    About You (The Inviter)
                </h3>
                <ParticipantsSearchSelect
                    label="Your Name"
                    placeholder="Type your name to search..."
                    required
                    value={form.inviterName}
                    onChange={(value) => {
                        setField('inviterName', value);
                        if (errors.inviterName) {
                            setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.inviterName;
                                return newErrors;
                            });
                        }
                    }}
                    onSelect={(participant) => {
                        // Optional: You can store participant ID or other info if needed
                        console.log('Selected participant:', participant);
                    }}
                />
            </div>

            <div className="space-y-6 rounded-2xl border border-accent/10 bg-accent/5 p-8">
                <h3 className="text-lg font-bold text-accent-foreground flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground font-black uppercase">2</span>
                    The Person You&apos;re Inviting
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                        label="Name of Invitee"
                        placeholder="Jane Smith"
                        required
                        value={form.inviteeName}
                        onChange={(e) => {
                            setField('inviteeName', e.target.value);
                            if (errors.inviteeName) {
                                setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.inviteeName;
                                    return newErrors;
                                });
                            }
                        }}
                        error={errors.inviteeName}
                    />
                    <Input
                        label="WhatsApp number of invitee"
                        type="tel"
                        placeholder="+234 ..."
                        required
                        value={form.inviteePhone}
                        onChange={(e) => {
                            setField('inviteePhone', e.target.value);
                            if (errors.inviteePhone) {
                                setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.inviteePhone;
                                    return newErrors;
                                });
                            }
                        }}
                        error={errors.inviteePhone}
                    />
                    <Input
                        label="Email of Invitee"
                        type="email"
                        className="md:col-span-2"
                        placeholder="jane@example.com (optional)"
                        value={form.inviteeEmail || ''}
                        onChange={(e) => {
                            setField('inviteeEmail', e.target.value);
                            // Clear error when user starts typing
                            if (errors.inviteeEmail) {
                                setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.inviteeEmail;
                                    return newErrors;
                                });
                            }
                        }}
                        error={errors.inviteeEmail}
                    />
                    <Input
                        label="Location"
                        type="text"
                        className="md:col-span-2"
                        placeholder="e.g., Lagos, Nigeria"
                        required
                        value={form.location}
                        onChange={(e) => {
                            setField('location', e.target.value);
                            if (errors.location) {
                                setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.location;
                                    return newErrors;
                                });
                            }
                        }}
                        error={errors.location}
                    />
                </div>
                <Textarea
                    label="Short invitation note"
                    placeholder="Write a personal message for your invitee..."
                    required
                    value={form.customMessage}
                    onChange={(e) => {
                        setField('customMessage', e.target.value);
                        if (errors.customMessage) {
                            setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.customMessage;
                                return newErrors;
                            });
                        }
                    }}
                    className="min-h-[120px]"
                    error={errors.customMessage}
                />
            </div>

            <Button type="submit" className="w-full gap-2 text-[15px] sm:text-lg" size="lg" isLoading={isSubmitting}>
                <Share2 size={20} />
                Send invite by WhatsApp and Email
            </Button>
        </form>
    );
};

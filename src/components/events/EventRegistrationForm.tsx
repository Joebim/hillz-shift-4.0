import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/src/types/event';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { CheckCircle } from 'lucide-react';
import { DynamicFieldRenderer } from '@/src/components/shared/DynamicFieldRenderer';
import { DbSearchSelect } from '@/src/components/shared/DbSearchSelect';

export interface EventRegistrationFormProps {
    event: Event;
}

export const EventRegistrationForm = ({ event }: EventRegistrationFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        invitedBy: '',
    });

    const [customFields, setCustomFields] = useState<Record<string, unknown>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Base fields
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

        // Custom fields
        if (event.registrationConfig.fields) {
            event.registrationConfig.fields.forEach(field => {
                if (field.required) {
                    const value = customFields[field.label];
                    const isEmpty = (
                        value === undefined || 
                        value === null || 
                        value === '' || 
                        (Array.isArray(value) && value.length === 0) ||
                        (typeof value === 'boolean' && value === false) // For tick_check if strictly required
                    );
                    if (isEmpty) {
                        newErrors[field.label] = `${field.label} is required`;
                    }
                }
            });
        }

        setFieldErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setError('Please fill in all required fields');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const { invitedBy, ...attendeeBase } = formData;
            const response = await fetch(`/api/events/${event.id}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attendee: {
                        ...attendeeBase,
                        customFields,
                    },
                    invitedBy,
                    status: 'pending',
                    checkedIn: false,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setConfirmationCode(data.data.confirmationCode);
                setIsSuccess(true);
            } else {
                setError(data.error?.message || 'Registration failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCustomFieldChange = (label: string, value: unknown) => {
        setCustomFields(prev => ({ ...prev, [label]: value }));
        if (fieldErrors[label]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[label];
                return next;
            });
        }
    };

    if (isSuccess) {
        return (
            <Card variant="elevated" padding="lg">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-[#10B981]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                        Registration Successful!
                    </h2>
                    <p className="text-[#6B7280] mb-6">
                        Thank you for registering for {event.title}
                    </p>

                    <div className="bg-[#F3F4F6] rounded-lg p-6 mb-6">
                        <p className="text-sm text-[#6B7280] mb-2">Your Confirmation Code</p>
                        <p className="text-3xl font-bold text-[#6B46C1] tracking-wider">
                            {confirmationCode}
                        </p>
                    </div>

                    <p className="text-sm text-[#6B7280] mb-6">
                        A confirmation email has been sent to {formData.email}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => router.push('/events')}>
                            View All Events
                        </Button>
                        <Button variant="primary" onClick={() => router.push(`/events/${event.slug}`)}>
                            Back to Event
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="elevated" padding="lg">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
                Register for {event.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="First Name"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        error={fieldErrors.firstName}
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        error={fieldErrors.lastName}
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={fieldErrors.email}
                />

                <Input
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={fieldErrors.phone}
                />

                {/* Who Invited You? */}
                <DbSearchSelect
                    source="registrations"
                    eventId={event.id}
                    label="Who invited you?"
                    placeholder="Search name..."
                    value={formData.invitedBy}
                    onChange={(val) => setFormData({ ...formData, invitedBy: val })}
                />

                {/* Custom Fields */}
                {event.registrationConfig.fields && event.registrationConfig.fields.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Additional Questions</h3>
                        <DynamicFieldRenderer
                            fields={event.registrationConfig.fields}
                            values={customFields}
                            onChange={handleCustomFieldChange}
                            errors={fieldErrors}
                            eventId={event.id}
                        />
                    </div>
                )}

                {error && (
                    <div className="bg-[#DC2626]/10 border border-[#DC2626] rounded-lg p-4">
                        <p className="text-[#DC2626] text-sm">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

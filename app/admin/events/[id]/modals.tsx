
'use client';

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Event } from "@/src/types/event";

function SimpleModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                {children}
            </div>
        </div>
    );
}

interface RegistrationFormData {
    name: string;
    email: string;
    type: string;
    attendee: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        customFields: Record<string, string | number | boolean>;
    };
}

export function AddRegistrationModal({ event, isOpen, onClose }: { event: Event, isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<RegistrationFormData>({ 
        name: '', 
        email: '', 
        type: 'Attendee',
        attendee: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            customFields: {}
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: unknown) => {
            const res = await fetch(`/api/events/${event.id}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to add registration');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations', event.id] });
            onClose();
            setFormData({ 
                name: '', email: '', type: 'Attendee',
                attendee: { firstName: '', lastName: '', email: '', phone: '', customFields: {} }
            });
        }
    });

    const handleCustomFieldChange = (fieldId: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            attendee: {
                ...prev.attendee,
                customFields: {
                    ...prev.attendee.customFields,
                    [fieldId]: value
                }
            }
        }));
    };

    return (
        <SimpleModal isOpen={isOpen} onClose={onClose} title="Add Attendee">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">First Name</label>
                        <input
                            className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                            value={formData.attendee.firstName} 
                            onChange={e => setFormData({ ...formData, name: `${e.target.value} ${formData.attendee.lastName}`, attendee: { ...formData.attendee, firstName: e.target.value } })}
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Last Name</label>
                        <input
                            className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                            value={formData.attendee.lastName} 
                            onChange={e => setFormData({ ...formData, name: `${formData.attendee.firstName} ${e.target.value}`, attendee: { ...formData.attendee, lastName: e.target.value } })}
                            placeholder="Doe"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.attendee.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value, attendee: { ...formData.attendee, email: e.target.value } })}
                        placeholder="john@example.com"
                        type="email"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.attendee.phone} 
                        onChange={e => setFormData({ ...formData, attendee: { ...formData.attendee, phone: e.target.value } })}
                        placeholder="000 000 0000"
                    />
                </div>

                {event.registrationConfig?.fields?.map(field => (
                    <div key={field.id}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                            <select
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                value={(formData.attendee.customFields[field.id] as any) || ''}
                                onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                            >
                                <option value="">Select {field.label}</option>
                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : field.type === 'textarea' ? (
                            <textarea
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                value={(formData.attendee.customFields[field.id] as any) || ''}
                                onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        ) : (
                            <input
                                type={field.type}
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                value={(formData.attendee.customFields[field.id] as any) || ''}
                                onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}

                <div className="pt-2 flex justify-end gap-2 sticky bottom-0 bg-white pb-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending || !formData.attendee.firstName || !formData.email}
                        className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Adding...' : 'Add Attendee'}
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}

interface InvitationFormData {
    recipientName: string;
    recipientEmail: string;
    personalMessage: string;
    customFields: Record<string, string | number | boolean>;
}

export function AddInvitationModal({ event, isOpen, onClose }: { event: Event, isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<InvitationFormData>({ 
        recipientName: '', 
        recipientEmail: '',
        personalMessage: '',
        customFields: {}
    });

    const mutation = useMutation({
        mutationFn: async (data: unknown) => {
            const res = await fetch(`/api/events/${event.id}/invitations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to send invitation');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', event.id] });
            onClose();
            setFormData({ recipientName: '', recipientEmail: '', personalMessage: '', customFields: {} });
        }
    });

    const handleCustomFieldChange = (fieldId: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            customFields: {
                ...prev.customFields,
                [fieldId]: value
            }
        }));
    };

    return (
        <SimpleModal isOpen={isOpen} onClose={onClose} title="Send Invitation">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Invitee Name</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.recipientName} onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                        placeholder="Jane Smith"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.recipientEmail} onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
                        placeholder="jane@example.com"
                        type="email"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Personal Message</label>
                    <textarea
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.personalMessage} onChange={e => setFormData({ ...formData, personalMessage: e.target.value })}
                        placeholder="Add a personal note..."
                    />
                </div>

                {event.invitationConfig?.fields?.map(field => (
                    <div key={field.id}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'select' ? (
                            <select
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                value={(formData.customFields[field.id] as any) || ''}
                                onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                            >
                                <option value="">Select {field.label}</option>
                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : field.type === 'textarea' ? (
                            <textarea
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                value={(formData.customFields[field.id] as any) || ''}
                                onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        ) : (
                            <input
                                type={field.type}
                                className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                value={(formData.customFields[field.id] as any) || ''}
                                onChange={e => handleCustomFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}

                <div className="pt-2 flex justify-end gap-2 sticky bottom-0 bg-white pb-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending || !formData.recipientName || !formData.recipientEmail}
                        className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Sending...' : 'Send Invite'}
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}


'use client';

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

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

export function AddRegistrationModal({ eventId, isOpen, onClose }: { eventId: string, isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: '', email: '', type: 'Attendee' });

    const mutation = useMutation({
        mutationFn: async (data: { name: string; email: string; type: string }) => {
            const res = await fetch(`/api/events/${eventId}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to add registration');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
            onClose();
            setFormData({ name: '', email: '', type: 'Attendee' });
        }
    });

    return (
        <SimpleModal isOpen={isOpen} onClose={onClose} title="Add Attendee">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        type="email"
                    />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending || !formData.name || !formData.email}
                        className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Adding...' : 'Add Attendee'}
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}

export function AddInvitationModal({ eventId, isOpen, onClose }: { eventId: string, isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: '', email: '' });

    const mutation = useMutation({
        mutationFn: async (data: { name: string; email: string }) => {
            
            const res = await fetch(`/api/events/${eventId}/invitations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to send invitation');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations', eventId] });
            onClose();
            setFormData({ name: '', email: '' });
        }
    });

    return (
        <SimpleModal isOpen={isOpen} onClose={onClose} title="Send Invitation">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Invitee Name</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Smith"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                    <input
                        className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@example.com"
                        type="email"
                    />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending || !formData.name || !formData.email}
                        className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                    >
                        {mutation.isPending ? 'Sending...' : 'Send Invite'}
                    </button>
                </div>
            </div>
        </SimpleModal>
    );
}

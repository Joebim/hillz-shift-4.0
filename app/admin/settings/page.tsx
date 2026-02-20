
// app/admin/settings/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@/src/types/user';
import { Event } from '@/src/types/event';
import { Search, Plus, Edit, Trash2, X, Check, Eye, Send, Mail, Copy } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Image from 'next/image';

// ─── Constants ───────────────────────────────────────────────────────────────

const roles: { value: UserRole; label: string; color: string; ring: string }[] = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-red-50 text-red-700', ring: 'ring-red-500/10' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-50 text-purple-700', ring: 'ring-purple-500/10' },
    { value: 'moderator', label: 'Moderator', color: 'bg-blue-50 text-blue-700', ring: 'ring-blue-500/10' },
    { value: 'event_manager', label: 'Event Manager', color: 'bg-orange-50 text-orange-700', ring: 'ring-orange-500/10' },
];

function getRole(role: string) {
    return roles.find(r => r.value === role) || { label: role, color: 'bg-gray-100 text-gray-600', ring: 'ring-gray-500/10' };
}

// ─── Animated Components ──────────────────────────────────────────────────────────────

function UserModal({
    user,
    onClose,
    onSave,
    events,
    isProcessing
}: {
    user?: Partial<User> | null,
    onClose: () => void,
    onSave: (data: any) => void,
    events?: Event[],
    isProcessing?: boolean
}) {
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        role: user?.role || 'moderator',
        managedEventId: user?.managedEventId || '',
    });

    const isEditing = !!user?.id;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className="bg-linear-to-r from-violet-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">
                                {isEditing ? 'Edit User Profile' : 'Invite New Team Member'}
                            </h3>
                            <p className="text-violet-100/80 text-sm mt-1">
                                {isEditing ? 'Update user details and access level.' : 'Send an invitation to join the admin panel.'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    {/* Basic Info Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-gray-300"
                                    value={formData.displayName}
                                    onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                    placeholder="e.g. Sarah Connor"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-300"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="sarah@example.com"
                                    disabled={isEditing}
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Access Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            {roles.map(role => (
                                <button
                                    key={role.value}
                                    onClick={() => setFormData({ ...formData, role: role.value as any })}
                                    className={cn(
                                        "relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left hover:border-violet-200 hover:bg-violet-50/50",
                                        formData.role === role.value
                                            ? "border-violet-500 bg-violet-50/80 ring-2 ring-violet-500/10 shadow-sm"
                                            : "border-gray-100 bg-white"
                                    )}
                                >
                                    <div className={cn("w-3 h-3 rounded-full shrink-0", role.color.split(' ')[0], role.value === formData.role ? "ring-2 ring-current ring-offset-2" : "")} />
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm font-semibold truncate", formData.role === role.value ? "text-violet-900" : "text-gray-600")}>
                                            {role.label}
                                        </p>
                                    </div>
                                    {formData.role === role.value && (
                                        <Check className="w-4 h-4 text-violet-600 absolute right-3 top-1/2 -translate-y-1/2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conditional Event Selection */}
                    {formData.role === 'event_manager' && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                            <label className="text-xs font-semibold uppercase text-orange-400 tracking-wider mb-2 block">Assign Specific Event</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium appearance-none cursor-pointer hover:bg-gray-50/50"
                                value={formData.managedEventId}
                                onChange={e => setFormData({ ...formData, managedEventId: e.target.value })}
                            >
                                <option value="">Select event to manage...</option>
                                {events?.map(event => (
                                    <option key={event.id} value={event.id}>{event.title}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-orange-600/80 mt-2 flex items-start gap-1.5">
                                <span className="mt-0.5">•</span>
                                User will have limited access only to verify tickets and manage attendees for this event.
                            </p>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-4 flex gap-3 border-t border-gray-50 mt-4">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 hover:text-gray-700 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            disabled={isProcessing}
                            className={cn(
                                "flex-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-lg active:scale-[0.98]",
                                isProcessing ? "bg-violet-400 cursor-wait" : "bg-violet-600 hover:bg-violet-700 hover:shadow-violet-200 hover:-translate-y-0.5"
                            )}
                        >
                            {isProcessing ? (
                                <>Processing...</>
                            ) : isEditing ? (
                                <>Save Changes <Check className="w-4 h-4" /></>
                            ) : (
                                <>Send Invitation <Send className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Invite Success Alert ──────────────────────────────────────────────────

function InviteSuccessModal({ password, onClose }: { password?: string, onClose: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 delay-100">
                    <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Invitation Sent!</h3>
                {password ? (
                    <>
                        <p className="text-gray-500 text-sm mb-6">Email delivery failed (SMTP not active). Please manually copy these credentials and share them with the user.</p>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 relative group text-left">
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Temporary Password</p>
                            <code className="text-lg font-mono font-bold text-gray-800 tracking-wider block">{password}</code>
                            <button
                                onClick={handleCopy}
                                className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-violet-200 hover:text-violet-600 transition-all text-gray-400"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm mb-6">The invitation email has been sent successfully. The user can now login via the link provided in the email.</p>
                )}
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all hover:shadow-lg active:scale-[0.98]"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

import { useConfirmModal } from '@/src/hooks/useConfirmModal';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const confirmCheck = useConfirmModal();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [tempPassword, setTempPassword] = useState<string | undefined>(undefined);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch Users
    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const json = await res.json();
            return json.data as User[];
        }
    });

    // Fetch Events (for assigning event managers)
    const { data: events } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await fetch('/api/events');
            if (!res.ok) return [];
            const json = await res.json();
            return json.data as Event[];
        }
    });

    // Invite User Mutation
    const inviteUserMutation = useMutation({
        mutationFn: async (newUser: any) => {
            const res = await fetch('/api/admin/users/invite', { // Use new Invite endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to invite user');
            }
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            if (data.tempPassword) {
                setTempPassword(data.tempPassword); // Store password if manual copy needed
            } else {
                setTempPassword(undefined);
            }
            setShowSuccess(true);
        },
        onError: (err) => {
            alert(err.message);
        }
    });

    // Update User Mutation
    const updateUserMutation = useMutation({
        mutationFn: async (data: { id: string, updates: any }) => {
            const res = await fetch(`/api/admin/users/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.updates),
            });
            if (!res.ok) throw new Error('Failed to update user');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            setEditingUser(null);
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete user');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    // Handlers
    const handleInviteUser = (formData: any) => {
        inviteUserMutation.mutate(formData);
    };

    const handleEditUser = (formData: any) => {
        if (!editingUser) return;
        updateUserMutation.mutate({
            id: editingUser.id,
            updates: formData
        });
    };

    const handleDeleteUser = (id: string) => {
        confirmCheck.open({
            title: 'Delete User',
            description: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: () => {
                deleteUserMutation.mutate(id);
            }
        });
    };

    const filteredUsers = useMemo(() => users?.filter(user =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-top-2 duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Access Management</h1>
                    <p className="text-gray-500 mt-1 max-w-xl">Control permissions, manage team roles, and invite new members to the platform.</p>
                </div>
                <button
                    onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
                    className="group flex items-center gap-2.5 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
                >
                    <div className="bg-white/20 p-1 rounded-lg">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span>Invite Team Member</span>
                </button>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sticky top-0 z-20">
                    <h2 className="font-bold text-gray-900 text-lg">Active Members ({filteredUsers?.length || 0})</h2>
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full sm:w-72 transition-all hover:bg-white"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Profile</th>
                                <th className="px-6 py-4">Access Level</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isUsersLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="flex gap-3"><div className="w-10 h-10 bg-gray-100 rounded-full"></div><div className="space-y-2"><div className="h-3 bg-gray-100 rounded w-24"></div><div className="h-2 bg-gray-100 rounded w-32"></div></div></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-2 bg-gray-100 rounded w-12"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-60">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-500 font-medium">No members found</p>
                                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search query</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers?.map((user) => {
                                    const roleConfig = getRole(user.role);
                                    const assignedEvent = user.managedEventId && events?.find(e => e.id === user.managedEventId);

                                    return (
                                        <tr key={user.id} className="group hover:bg-violet-50/20 transition-all duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-white border-2 border-dashed border-gray-200 group-hover:border-violet-200 flex items-center justify-center text-gray-400 group-hover:text-violet-600 font-bold shrink-0 transition-colors shadow-sm overflow-hidden">
                                                        {user.photoUrl ? (
                                                            <Image src={user.photoUrl} alt={user.displayName} width={44} height={44} className="object-cover w-full h-full" />
                                                        ) : (
                                                            user.displayName.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{user.displayName}</p>
                                                        <p className="text-xs text-gray-500 font-medium group-hover:text-gray-600 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={cn("px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ring-1", roleConfig.color, roleConfig.ring)}>
                                                        {roleConfig.label}
                                                    </span>
                                                    {user.role === 'event_manager' && (
                                                        <div className="flex items-center gap-1.5 mt-1 text-[10px] bg-orange-50 border border-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
                                                            <Check className="w-3 h-3 text-orange-500" />
                                                            <span className="truncate max-w-[120px] font-medium" title={assignedEvent ? assignedEvent.title : 'No event'}>
                                                                {assignedEvent ? assignedEvent.title : 'Unassigned'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm", user.active !== false ? "bg-emerald-500" : "bg-rose-500")} />
                                                    <span className={cn("text-xs font-semibold", user.active !== false ? "text-emerald-700" : "text-rose-700")}>
                                                        {user.active !== false ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100">
                                                    <button
                                                        onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                                                        className="p-2 hover:bg-white bg-transparent hover:shadow-md border border-transparent hover:border-gray-100 rounded-xl text-gray-400 hover:text-violet-600 transition-all"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 hover:bg-white bg-transparent hover:shadow-md border border-transparent hover:border-red-100 rounded-xl text-gray-400 hover:text-red-500 transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite/Edit Modal */}
            {isModalOpen && (
                <UserModal
                    user={editingUser}
                    onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
                    onSave={editingUser ? handleEditUser : handleInviteUser}
                    events={events}
                    isProcessing={inviteUserMutation.isPending || updateUserMutation.isPending}
                />
            )}

            {/* Success Modal */}
            {showSuccess && (
                <InviteSuccessModal
                    password={tempPassword}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
}

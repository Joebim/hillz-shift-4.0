'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole, SessionUser, ADMIN_ROLES } from '@/src/types/user';
import { Event } from '@/src/types/event';
import { Search, Plus, Edit, Trash2, X, Check, Send, Mail, Copy, ShieldOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const roles: { value: UserRole; label: string; color: string; ring: string; desc: string }[] = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-red-50 text-red-700', ring: 'ring-red-500/10', desc: 'Full system access' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-50 text-purple-700', ring: 'ring-purple-500/10', desc: 'Manage all content' },
    { value: 'moderator', label: 'Moderator', color: 'bg-blue-50 text-blue-700', ring: 'ring-blue-500/10', desc: 'Event attendee + invites' },
    { value: 'event_manager', label: 'Event Manager', color: 'bg-orange-50 text-orange-700', ring: 'ring-orange-500/10', desc: 'Full event management' },
];

function getRole(role: string) {
    return roles.find(r => r.value === role) || { label: role, color: 'bg-gray-100 text-gray-600', ring: 'ring-gray-500/10', desc: '' };
}

/** Multi-event selector used by event_manager and moderator roles */
function EventMultiSelect({
    events,
    selectedIds,
    onChange,
    accentClass,
}: {
    events: Event[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    accentClass: string;
}) {
    const [q, setQ] = useState('');
    const filtered = events.filter(e =>
        !q || e.title.toLowerCase().includes(q.toLowerCase())
    );

    const toggle = (id: string) => {
        const next = selectedIds.includes(id)
            ? selectedIds.filter(s => s !== id)
            : [...selectedIds, id];
        onChange(next);
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1 rounded-xl border border-gray-100 p-1 bg-white">
                {filtered.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No events found</p>
                )}
                {filtered.map(event => {
                    const selected = selectedIds.includes(event.id);
                    return (
                        <button
                            key={event.id}
                            type="button"
                            onClick={() => toggle(event.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm',
                                selected ? `${accentClass} font-semibold` : 'hover:bg-gray-50 text-gray-700'
                            )}
                        >
                            <div className={cn(
                                'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                                selected ? 'border-violet-600 bg-violet-600' : 'border-gray-300'
                            )}>
                                {selected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="truncate">{event.title}</span>
                        </button>
                    );
                })}
            </div>
            {selectedIds.length > 0 && (
                <p className="text-[11px] font-medium text-violet-600">
                    {selectedIds.length} event{selectedIds.length !== 1 ? 's' : ''} selected
                </p>
            )}
        </div>
    );
}

function UserModal({
    user,
    onClose,
    onSave,
    events,
    isProcessing,
}: {
    user?: Partial<User> | null;
    onClose: () => void;
    onSave: (data: { displayName: string; email: string; role: UserRole; managedEventIds: string[] }) => void;
    events?: Event[];
    isProcessing?: boolean;
}) {
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        role: (user?.role || 'moderator') as UserRole,
        managedEventIds: user?.managedEventIds?.length
            ? user.managedEventIds
            : user?.managedEventId
                ? [user.managedEventId]
                : [] as string[],
    });

    const isEditing = !!user?.id;
    const isEventScoped = formData.role === 'event_manager' || formData.role === 'moderator';

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-violet-600 to-indigo-600 p-6 text-white relative overflow-hidden sticky top-0 z-10">
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
                    {/* Name + email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-gray-300"
                                value={formData.displayName}
                                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                placeholder="e.g. Sarah Connor"
                            />
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

                    {/* Role picker */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Access Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            {roles.map(role => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.value, managedEventIds: [] })}
                                    className={cn(
                                        "relative flex flex-col items-start gap-1 p-3 rounded-xl border transition-all duration-200 text-left hover:border-violet-200 hover:bg-violet-50/50",
                                        formData.role === role.value
                                            ? "border-violet-500 bg-violet-50/80 ring-2 ring-violet-500/10 shadow-sm"
                                            : "border-gray-100 bg-white"
                                    )}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <div className={cn("w-3 h-3 rounded-full shrink-0", role.color.split(' ')[0], formData.role === role.value ? "ring-2 ring-current ring-offset-2" : "")} />
                                        <p className={cn("text-sm font-semibold truncate flex-1", formData.role === role.value ? "text-violet-900" : "text-gray-600")}>
                                            {role.label}
                                        </p>
                                        {formData.role === role.value && (
                                            <Check className="w-4 h-4 text-violet-600 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 ml-5">{role.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Event picker for scoped roles */}
                    {isEventScoped && (
                        <div className={cn(
                            "animate-in fade-in slide-in-from-top-4 duration-300 p-4 rounded-xl border",
                            formData.role === 'event_manager'
                                ? "bg-orange-50/50 border-orange-100"
                                : "bg-blue-50/50 border-blue-100"
                        )}>
                            <label className={cn(
                                "text-xs font-semibold uppercase tracking-wider mb-3 block",
                                formData.role === 'event_manager' ? "text-orange-500" : "text-blue-500"
                            )}>
                                Assign Events ({formData.role === 'event_manager' ? 'Event Manager' : 'Moderator'})
                            </label>
                            <EventMultiSelect
                                events={events || []}
                                selectedIds={formData.managedEventIds}
                                onChange={ids => setFormData({ ...formData, managedEventIds: ids })}
                                accentClass={formData.role === 'event_manager' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}
                            />
                            <p className={cn(
                                "text-[11px] mt-3 flex items-start gap-1.5",
                                formData.role === 'event_manager' ? "text-orange-600/80" : "text-blue-600/80"
                            )}>
                                <span className="mt-0.5">•</span>
                                User will only see and manage the selected event(s) in their dashboard.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
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

function InviteSuccessModal({ password, onClose }: { password?: string; onClose: () => void }) {
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

import { useConfirmModal } from '@/src/hooks/useConfirmModal';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const confirmCheck = useConfirmModal();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [tempPassword, setTempPassword] = useState<string | undefined>(undefined);
    const [showSuccess, setShowSuccess] = useState(false);

    // --- Role guard ---
    const { data: session, isLoading: isSessionLoading } = useQuery<SessionUser | null>({
        queryKey: ['session'],
        queryFn: async () => {
            const res = await fetch('/api/auth/session');
            if (!res.ok) return null;
            const json = await res.json();
            return json.data as SessionUser;
        },
    });

    useEffect(() => {
        if (!isSessionLoading && session && !ADMIN_ROLES.includes(session.role)) {
            router.replace('/admin/events');
        }
    }, [session, isSessionLoading, router]);

    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const json = await res.json();
            return json.data as User[];
        },
        enabled: !!session && ADMIN_ROLES.includes(session.role),
    });

    const { data: events } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await fetch('/api/events');
            if (!res.ok) return [];
            const json = await res.json();
            return json.data as Event[];
        },
        enabled: !!session && ADMIN_ROLES.includes(session.role),
    });

    const inviteUserMutation = useMutation({
        mutationFn: async (newUser: { displayName: string; email: string; role: UserRole; managedEventIds: string[] }) => {
            const res = await fetch('/api/admin/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newUser,
                    managedEventId: newUser.managedEventIds[0] || null,
                }),
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
            setTempPassword(data.tempPassword ? data.tempPassword : undefined);
            setShowSuccess(true);
        },
        onError: (err) => { alert(err.message); }
    });

    const updateUserMutation = useMutation({
        mutationFn: async (data: { id: string; updates: Partial<User> & { managedEventIds: string[] } }) => {
            const res = await fetch(`/api/admin/users/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data.updates,
                    managedEventId: data.updates.managedEventIds?.[0] || null,
                }),
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
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete user');
            return res.json();
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); }
    });

    const handleSave = (formData: { displayName: string; email: string; role: UserRole; managedEventIds: string[] }) => {
        if (editingUser) {
            updateUserMutation.mutate({ id: editingUser.id, updates: formData });
        } else {
            inviteUserMutation.mutate(formData);
        }
    };

    const handleDeleteUser = (id: string) => {
        confirmCheck.open({
            title: 'Delete User',
            description: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: () => { deleteUserMutation.mutate(id); }
        });
    };

    const filteredUsers = useMemo(() => users?.filter(user =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [users, searchQuery]);

    // Show guard UI while checking
    if (isSessionLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (session && !ADMIN_ROLES.includes(session.role)) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <ShieldOff className="w-12 h-12 text-gray-300" />
                <p className="text-gray-500 font-medium">You don&apos;t have access to this page.</p>
            </div>
        );
    }

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

            {/* Table */}
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
                                <th className="px-6 py-4">Assigned Events</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isUsersLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="flex gap-3"><div className="w-10 h-10 bg-gray-100 rounded-full" /><div className="space-y-2"><div className="h-3 bg-gray-100 rounded w-24" /><div className="h-2 bg-gray-100 rounded w-32" /></div></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                                        <td className="px-6 py-4"><div className="h-2 bg-gray-100 rounded w-12" /></td>
                                        <td className="px-6 py-4" />
                                    </tr>
                                ))
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-60">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-500 font-medium">No members found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers?.map((user) => {
                                    const roleConfig = getRole(user.role);
                                    const isScoped = user.role === 'event_manager' || user.role === 'moderator';

                                    const userEventIds: string[] = user.managedEventIds?.length
                                        ? user.managedEventIds
                                        : user.managedEventId
                                            ? [user.managedEventId]
                                            : [];

                                    const assignedEvents = events?.filter(e => userEventIds.includes(e.id)) || [];

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
                                                        <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn("px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ring-1", roleConfig.color, roleConfig.ring)}>
                                                    {roleConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isScoped ? (
                                                    assignedEvents.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            {assignedEvents.slice(0, 2).map(ev => (
                                                                <span key={ev.id} className="inline-flex items-center gap-1 text-[10px] bg-violet-50 border border-violet-100 text-violet-700 px-2 py-0.5 rounded-md font-medium max-w-[160px] truncate">
                                                                    <Check className="w-2.5 h-2.5 text-violet-500 shrink-0" />
                                                                    {ev.title}
                                                                </span>
                                                            ))}
                                                            {assignedEvents.length > 2 && (
                                                                <span className="text-[10px] text-gray-400">+{assignedEvents.length - 2} more</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-gray-300">—</span>
                                                )}
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

            {isModalOpen && (
                <UserModal
                    user={editingUser}
                    onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
                    onSave={handleSave}
                    events={events}
                    isProcessing={inviteUserMutation.isPending || updateUserMutation.isPending}
                />
            )}

            {showSuccess && (
                <InviteSuccessModal
                    password={tempPassword}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
}

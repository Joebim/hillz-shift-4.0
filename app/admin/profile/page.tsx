'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    User,
    Mail,
    Shield,
    Camera,
    Save,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminTopNav } from '@/src/components/admin/AdminTopNav';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useToast } from '@/src/contexts/ToastContext';
import { format } from 'date-fns';

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch session and user details
    const { data: session, isLoading } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const res = await fetch('/api/auth/session');
            if (!res.ok) throw new Error('Failed to fetch session');
            const json = await res.json();
            return json.data;
        }
    });

    const [displayName, setDisplayName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    // Pre-fill form when data is loaded
    React.useEffect(() => {
        if (session) {
            setDisplayName(session.displayName || '');
            setPhotoUrl(session.photoUrl || '');
        }
    }, [session]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { displayName: string, photoUrl: string }) => {
            const res = await fetch(`/api/admin/users/${session.userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update profile');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session'] });
            toast({
                title: 'Profile Updated',
                description: 'Your profile details have been successfully saved.',
                type: 'success'
            });
        },
        onError: (error) => {
            toast({
                title: 'Update Failed',
                description: error.message || 'Something went wrong while saving.',
                type: 'error'
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateProfileMutation.mutateAsync({ displayName, photoUrl });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <AdminTopNav title="Profile" showSearch={false} />
                <div className="p-8 flex items-center justify-center flex-1">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-gray-200" />
                        <div className="h-4 bg-gray-200 rounded w-48" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminTopNav title="Profile Settings" showSearch={false} />

            <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="relative group">
                    <div className="h-48 md:h-64 rounded-3xl bg-linear-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden shadow-2xl relative">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from),transparent_50%)] from-white/20" />
                    </div>

                    <div className="px-6 md:px-12 -mt-16 relative flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white">
                                {photoUrl ? (
                                    <Image src={photoUrl} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-violet-100 to-indigo-50 flex items-center justify-center text-violet-500 font-bold text-4xl">
                                        {displayName?.charAt(0) || session?.email?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-violet-600 text-white rounded-xl shadow-lg hover:bg-violet-700 transition-all border-2 border-white ring-4 ring-violet-50">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left mb-4">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{displayName || 'User'}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider border border-violet-100">
                                    <Shield className="w-3.5 h-3.5" /> {session?.role || 'Administrator'}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                                    <Mail className="w-3.5 h-3.5" /> {session?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    {/* Main Settings Form */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card variant="glass" padding="lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-none">Public Information</h3>
                                    <p className="text-xs text-gray-500 mt-1">This information will be visible to other team members.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Display Name</label>
                                        <Input
                                            placeholder="Your full name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="px-4 py-3 h-12 rounded-2xl border-gray-100 bg-white shadow-sm focus:ring-violet-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                                        <Input
                                            type="email"
                                            value={session?.email}
                                            disabled
                                            className="px-4 py-3 h-12 rounded-2xl bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed italic"
                                        />
                                        <p className="text-[10px] text-gray-400 px-1 font-medium italic">* To change your email, contact a super administrator.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Profile Photo</label>
                                    <ImageUpload
                                        value={photoUrl}
                                        onChange={setPhotoUrl}
                                        folder="admin-profiles"
                                        aspectRatio="square"
                                    />
                                </div>

                                <div className="pt-4 flex border-t border-gray-100">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={isSubmitting}
                                        className="bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-200 rounded-2xl px-10"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="ml-4 rounded-2xl"
                                        onClick={() => window.location.reload()}
                                    >
                                        Discard Changes
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <Card variant="glass" padding="lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-none">Security Settings</h3>
                                    <p className="text-xs text-gray-500 mt-1">Manage your account protection and authentication.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-xs text-gray-500">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Change Password</p>
                                            <p className="text-[10px] text-gray-500 font-medium tracking-wide">Update your current account password.</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-violet-600 hover:text-violet-700 underline underline-offset-4">Update</button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar / Activity */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card variant="glass" padding="lg">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Account Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Verification</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-black">Verified Member</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Joined Since</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-black">
                                            {session?.expiresAt ? format(new Date(), 'MMMM yyyy') : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-linear-to-br from-gray-900 to-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-lg font-black tracking-tight mb-2">Need Assistance?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">If you need to change your role or access level, please contact the IT support team.</p>
                            <Link href="mailto:support@ministry.com" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                                Get Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

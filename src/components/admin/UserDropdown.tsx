
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    User,
    Settings,
    LogOut,
    ChevronDown,
    Shield,
    Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface UserDropdownProps {
    session: any;
}

export function UserDropdown({ session }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 p-1.5 md:pr-3 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200",
                    isOpen ? "bg-gray-100 shadow-inner" : "hover:bg-gray-100"
                )}
            >
                {session?.photoUrl ? (
                    <Image
                        src={session.photoUrl}
                        alt={session.displayName || 'User'}
                        width={36}
                        height={36}
                        className="rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                ) : (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {(session?.displayName || session?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-sm font-bold text-gray-800">
                        {session?.displayName || (session?.email ? session.email.split('@')[0] : 'Admin User')}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {session?.role || 'Administrator'}
                    </span>
                </div>
                <ChevronDown className={cn(
                    "hidden lg:block w-4 h-4 text-gray-400 transition-transform duration-200",
                    isOpen && "rotate-180 text-violet-500"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-linear-to-br from-gray-50/80 to-white border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Member Account</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{session?.displayName || 'Admin User'}</p>
                                <p className="text-[11px] text-gray-500 truncate">{session?.email || 'admin@hillzshift.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <Link
                            href="/admin/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-violet-600 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <span>Personal Profile</span>
                        </Link>

                        <Link
                            href="/admin/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <Settings className="w-4 h-4" />
                            </div>
                            <span>Account Settings</span>
                        </Link>

                        <div className="my-1 h-px bg-gray-50 mx-2" />

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Status: Online</span>
                        <div className="flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Active</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

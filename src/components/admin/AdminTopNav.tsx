import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserDropdown } from './UserDropdown';
import { NotificationsDropdown } from './NotificationsDropdown';

export interface AdminTopNavProps {
    title: string;
    subtitle?: string;
    titleIcon?: React.ReactNode;

    action?: {
        label: string;
        href: string;
        icon?: React.ReactNode;
    };

    showSearch?: boolean;
    searchQuery?: string;
    onSearchChange?: (val: string) => void;
    searchPlaceholder?: string;
    
    searchDropdownContent?: React.ReactNode;
    customAction?: React.ReactNode;
    
    onMenuClick?: () => void;
}

export function AdminTopNav({
    title,
    subtitle,
    titleIcon,
    action,
    showSearch = true,
    searchQuery = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    searchDropdownContent,
    customAction,
    onMenuClick,
}: AdminTopNavProps) {
    const { data: session } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const res = await fetch('/api/auth/session');
            if (!res.ok) return null;
            const json = await res.json();
            return json.data;
        }
    });

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close desktop search results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasDropdown = !!(searchDropdownContent && isSearchFocused && searchQuery.length > 0);

    return (
        <>
            <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 sticky top-0 z-20">
                {/* ── Left Side (Title / Icon) ── */}
                <div className="flex items-center gap-3 shrink-0">
                    {titleIcon && (
                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-violet-100 text-violet-600 items-center justify-center">
                            {titleIcon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                        {subtitle && <p className="text-xs text-gray-500 font-medium hidden sm:block">{subtitle}</p>}
                    </div>
                </div>

                {/* ── Desktop Search ── */}
                {showSearch && (
                    <div className="relative flex-1 max-w-sm hidden md:block" ref={searchRef}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-700 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-violet-200"
                                value={searchQuery}
                                onChange={(e) => {
                                    onSearchChange?.(e.target.value);
                                    setIsSearchFocused(true);
                                }}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                        </div>
                        {hasDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                                {searchDropdownContent}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Right side actions ── */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
                    {showSearch && (
                        <button
                            className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            onClick={() => setMobileSearchOpen(true)}
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4 text-gray-600" />
                        </button>
                    )}

                    <NotificationsDropdown />

                    {customAction}

                    {!customAction && action && (
                        <Link href={action.href}
                            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors shadow-md shadow-violet-200"
                        >
                            {action.icon}
                            <span className="hidden sm:inline">{action.label}</span>
                        </Link>
                    )}

                    <div className="hidden lg:block h-8 w-px bg-gray-100 mx-1" />
                    
                    <div className="hidden lg:block">
                        <UserDropdown session={session} />
                    </div>

                    <Link href="/admin/profile" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 lg:hidden hover:bg-gray-200 transition-colors">
                        <User className="w-4 h-4" />
                    </Link>

                    {onMenuClick && (
                        <button onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <Menu className="w-4 h-4 text-gray-600" />
                        </button>
                    )}
                </div>
            </header>

            {/* ── Mobile Search Overlay ── */}
            {mobileSearchOpen && showSearch && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden" onClick={(e) => { if (e.target === e.currentTarget) setMobileSearchOpen(false); }}>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                autoFocus
                                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-700 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-violet-200"
                                value={searchQuery}
                                onChange={(e) => {
                                    onSearchChange?.(e.target.value);
                                    setIsSearchFocused(true);
                                }}
                            />
                        </div>
                        <button
                            onClick={() => { setMobileSearchOpen(false); onSearchChange?.(''); }}
                            className="shrink-0 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {!searchQuery && (
                            <div className="p-8 text-center text-gray-400">
                                <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Start typing to search...</p>
                            </div>
                        )}
                        {searchQuery && searchDropdownContent ? (
                            <div className="py-2" onClick={() => setMobileSearchOpen(false)}>
                                {searchDropdownContent}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </>
    );
}

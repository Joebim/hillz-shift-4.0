'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type DbSource =
    | 'registrations'
    | 'invitations'
    | 'events'
    | 'tags'
    | 'ministers'
    | 'channels'
    | 'participants';

interface DbOption {
    id: string;
    label: string;
    sub?: string;
}

async function fetchOptions(source: DbSource, search: string, eventId?: string): Promise<DbOption[]> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';

    switch (source) {
        case 'registrations': {
            const url = eventId
                ? `/api/events/${eventId}/registrations${q}`
                : `/api/registrations${q}`;
            const res = await fetch(url);
            const json = await res.json();
            const data = (json.data || []) as {
                id: string;
                name?: string;
                email?: string;
                attendee?: { firstName?: string; lastName?: string; email?: string };
            }[];
            return data.map(r => ({
                id: r.id,
                label: r.name ?? (r.attendee ? `${r.attendee.firstName} ${r.attendee.lastName}` : 'Unknown'),
                sub: r.email ?? r.attendee?.email,
            }));
        }

        case 'participants': {
            const res = await fetch(`/api/participants${q}`);
            const json = await res.json();
            const data = (json.participants || []) as { id: string; name: string; email?: string }[];
            return data.map(p => ({ id: p.id, label: p.name, sub: p.email }));
        }

        case 'invitations': {
            const url = eventId
                ? `/api/events/${eventId}/invitations${q}`
                : `/api/invitations${q}`;
            const res = await fetch(url);
            const json = await res.json();
            const data = (json.data || []) as {
                id: string;
                recipientName?: string;
                inviteeName?: string;
                recipientEmail?: string;
            }[];
            return data.map(i => ({
                id: i.id,
                label: i.recipientName ?? i.inviteeName ?? 'Unknown',
                sub: i.recipientEmail,
            }));
        }

        case 'events': {
            const res = await fetch(`/api/events${q}`);
            const json = await res.json();
            const data = (json.data || []) as { id: string; title: string; category?: string }[];
            return data.map(e => ({ id: e.id, label: e.title, sub: e.category }));
        }

        case 'tags': {
            const res = await fetch('/api/events');
            const json = await res.json();
            const events = (json.data || []) as { tags?: string[] }[];
            const all = events.flatMap(e => e.tags ?? []);
            const unique = [...new Set(all)].filter(t =>
                !search || t.toLowerCase().includes(search.toLowerCase())
            );
            return unique.map(t => ({ id: t, label: t }));
        }

        case 'ministers': {
            const res = await fetch('/api/events');
            const json = await res.json();
            const events = (json.data || []) as { ministers?: { id: string; name: string; position?: string }[] }[];
            const seen = new Set<string>();
            const ministers: DbOption[] = [];
            events.forEach(e => {
                (e.ministers ?? []).forEach(m => {
                    if (!seen.has(m.id)) {
                        seen.add(m.id);
                        if (!search || m.name.toLowerCase().includes(search.toLowerCase())) {
                            ministers.push({ id: m.id, label: m.name, sub: m.position });
                        }
                    }
                });
            });
            return ministers;
        }

        case 'channels': {
            const res = await fetch('/api/events');
            const json = await res.json();
            const events = (json.data || []) as { channels?: { name: string; title?: string }[] }[];
            const seen = new Set<string>();
            const channels: DbOption[] = [];
            events.forEach(e => {
                (e.channels ?? []).forEach(ch => {
                    const key = ch.name;
                    if (!seen.has(key)) {
                        seen.add(key);
                        if (!search || ch.name.toLowerCase().includes(search.toLowerCase())) {
                            channels.push({ id: key, label: ch.name, sub: ch.title });
                        }
                    }
                });
            });
            return channels;
        }

        default:
            return [];
    }
}

interface DbSearchSelectProps {
    source: DbSource;
    eventId?: string;
    value: string;
    onChange: (value: string) => void;
    onSelect?: (option: DbOption | null) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const DbSearchSelect: React.FC<DbSearchSelectProps> = ({
    source,
    eventId,
    value,
    onChange,
    onSelect,
    label,
    placeholder = 'Type to search...',
    required = false,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debounced, setDebounced] = useState('');
    const [selected, setSelected] = useState<DbOption | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(searchQuery), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const normalised = debounced.trim().toLowerCase();

    const { data: options = [], isLoading } = useQuery<DbOption[]>({
        queryKey: ['db-search', source, eventId, normalised],
        queryFn: () => fetchOptions(source, debounced, eventId),
        enabled: normalised.length >= 1,
        staleTime: 30_000,
    });

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        onChange(v);
        setSearchQuery(v);
        setIsOpen(true);
        setSelected(null);
        onSelect?.(null);
    };

    const handleSelect = (opt: DbOption) => {
        setSelected(opt);
        onChange(opt.label);
        setSearchQuery('');
        setIsOpen(false);
        onSelect?.(opt);
    };

    const showDropdown = isOpen && normalised.length >= 1;

    return (
        <div className="space-y-1.5" ref={wrapperRef}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => { if (value.length >= 1) setIsOpen(true); }}
                    placeholder={placeholder}
                    required={required}
                    className={cn(
                        'w-full h-11 rounded-xl border pl-10 pr-4 py-2 text-sm transition-all',
                        'focus:outline-none focus:ring-4',
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/10'
                    )}
                />

                {showDropdown && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-3 text-center text-sm text-gray-400">Searching...</div>
                        ) : options.length > 0 ? (
                            <ul className="py-1.5">
                                {options.map(opt => (
                                    <li
                                        key={opt.id}
                                        onClick={() => handleSelect(opt)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-primary/5 transition-colors',
                                            selected?.id === opt.id && 'bg-primary/10'
                                        )}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{opt.label}</p>
                                            {opt.sub && <p className="text-xs text-gray-400 truncate">{opt.sub}</p>}
                                        </div>
                                        {selected?.id === opt.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-3 text-center text-sm text-gray-400">No results found</div>
                        )}
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

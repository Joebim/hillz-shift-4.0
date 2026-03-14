'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Check, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/src/constants/routes';
import { cn } from '@/src/lib/utils';

interface Participant {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface ParticipantsSearchSelectProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (participant: Participant | null) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    showRegisterPrompt?: boolean;
}

async function fetchParticipants(search: string): Promise<Participant[]> {
    const params = new URLSearchParams();
    if (search) {
        params.set('search', search);
    }

    const response = await fetch(`/api/participants?${params.toString()}`);
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch participants');
    }

    return data.participants || [];
}

export const ParticipantsSearchSelect: React.FC<ParticipantsSearchSelectProps> = ({
    value,
    onChange,
    onSelect,
    label = 'Your Name',
    placeholder = 'Type your name to search...',
    required = false,
    showRegisterPrompt = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]);

    const normalizedSearchQuery = useMemo(() => {
        return debouncedSearchQuery.trim().toLowerCase();
    }, [debouncedSearchQuery]);

    const { data: participants = [], isLoading, error } = useQuery<Participant[]>({
        queryKey: ['participants', normalizedSearchQuery],
        queryFn: () => fetchParticipants(debouncedSearchQuery),
        enabled: normalizedSearchQuery.length >= 2,
        staleTime: 60000,
        gcTime: 300000,
    });

    const filteredParticipants = useMemo(() => {
        if (!normalizedSearchQuery || normalizedSearchQuery.length < 2) {
            return []; 
        }
        return participants;
    }, [participants, normalizedSearchQuery]);

    const hasExactMatch = useMemo(() => {
        if (!value || value.length < 2) return false;
        const query = value.toLowerCase().trim();
        return participants.some((p) => p.name.toLowerCase().trim() === query);
    }, [participants, value]);

    const hasSimilarMatches = useMemo(() => {
        if (!value || value.length < 2) return false;
        return filteredParticipants.length > 0;
    }, [filteredParticipants, value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setSearchQuery(newValue);
        setIsOpen(true);
        setSelectedParticipant(null);

        if (onSelect) {
            onSelect(null);
        }
    };

    const handleSelectParticipant = (participant: Participant) => {
        setSelectedParticipant(participant);
        onChange(participant.name);
        setSearchQuery('');
        setIsOpen(false);

        if (onSelect) {
            onSelect(participant);
        }

        setTimeout(() => {
            inputRef.current?.blur();
        }, 100);
    };

    const shouldShowDropdown = useMemo(() => {
        if (!isOpen) return false;
        if (isLoading) return true;
        if (normalizedSearchQuery.length < 2) return false;
        return filteredParticipants.length > 0;
    }, [isOpen, isLoading, normalizedSearchQuery.length, filteredParticipants.length]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const shouldShowRegisterButton = useMemo(() => {
        if (!showRegisterPrompt) return false; 
        if (value.length < 2) return false;
        if (isLoading) return false;
        if (normalizedSearchQuery.length < 2) return false;
        if (hasExactMatch || hasSimilarMatches) return false;
        
        return filteredParticipants.length === 0 && !shouldShowDropdown;
    }, [showRegisterPrompt, value.length, isLoading, normalizedSearchQuery.length, hasExactMatch, hasSimilarMatches, filteredParticipants.length, shouldShowDropdown]);

    return (
        <div className="space-y-1.5" ref={wrapperRef}>
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                {}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => {
                            if (value.length >= 2) {
                                setIsOpen(true);
                            }
                        }}
                        placeholder={placeholder}
                        required={required}
                        className={cn(
                            "w-full h-11 rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm transition-all",
                            "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    />
                </div>

                {}
                {shouldShowDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                        ) : filteredParticipants.length > 0 ? (
                            <ul className="py-2">
                                {filteredParticipants.map((participant) => (
                                    <li
                                        key={participant.id}
                                        onClick={() => handleSelectParticipant(participant)}
                                        className={cn(
                                            "px-4 py-2.5 cursor-pointer hover:bg-primary/5 transition-colors group",
                                            "flex items-center gap-3",
                                            selectedParticipant?.id === participant.id && "bg-primary/10"
                                        )}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">{participant.name}</div>
                                        </div>
                                        {selectedParticipant?.id === participant.id && (
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">No participants found</div>
                        )}
                    </div>
                )}

                {}
                {shouldShowRegisterButton && (
                    <div className="mt-2 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-yellow-800 font-medium mb-2">
                                It seems you haven&apos;t registered yet. Please register first to invite others.
                            </p>
                            <a
                                href={ROUTES.REGISTER}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold rounded-lg transition-colors"
                            >
                                Register Now
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {}
            {error && (
                <p className="text-xs text-red-600 mt-1">
                    Failed to load participants. You can still type your name manually.
                </p>
            )}
        </div>
    );
};

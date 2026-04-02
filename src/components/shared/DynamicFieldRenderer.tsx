'use client';

import React from 'react';
import { EventFormField } from '@/src/types/event';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { DbSearchSelect, DbSource } from '@/src/components/shared/DbSearchSelect';
import { cn } from '@/src/lib/utils';

interface DynamicFieldRendererProps {
    fields: EventFormField[];
    values: Record<string, unknown>;
    onChange: (label: string, value: unknown) => void;
    errors?: Record<string, string>;
    
    eventId?: string;
}

export function DynamicFieldRenderer({ fields, values, onChange, errors, eventId }: DynamicFieldRendererProps) {
    if (!fields || fields.length === 0) return null;

    return (
        <div className="space-y-6">
            {fields.map((field) => {
                const value = values[field.label];
                const error = errors?.[field.label];

                if (field.type === 'select' && field.searchEnabled && field.searchDbSource) {
                    return (
                        <DbSearchSelect
                            key={field.id}
                            source={field.searchDbSource as DbSource}
                            eventId={eventId}
                            label={field.label}
                            placeholder={field.placeholder || 'Type to search...'}
                            required={field.required}
                            value={(value as string) || ''}
                            onChange={(v) => onChange(field.label, v)}
                            error={error}
                        />
                    );
                }

                switch (field.type) {
                    case 'textarea':
                        return (
                            <Textarea
                                key={field.id}
                                label={field.label}
                                placeholder={field.placeholder}
                                required={field.required}
                                value={(value as string) || ''}
                                onChange={(e) => onChange(field.label, e.target.value)}
                                error={error}
                            />
                        );
                    case 'select':
                        return (
                            <div key={field.id} className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <select
                                    value={(value as string) || ''}
                                    onChange={(e) => onChange(field.label, e.target.value)}
                                    required={field.required}
                                    className={`flex h-11 w-full rounded-xl border px-4 py-2 text-sm transition-all focus:outline-none focus:ring-4 ${error
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-gray-200 bg-white focus:border-primary focus:ring-primary/10'
                                        }`}
                                >
                                    <option value="">Select an option</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {error && <span className="text-xs text-red-500">{error}</span>}
                            </div>
                        );
                    case 'radio':
                        return (
                            <div key={field.id} className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">
                                    {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {field.options?.map((opt) => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={field.label}
                                                value={opt}
                                                checked={value === opt}
                                                onChange={() => onChange(field.label, opt)}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-600">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                                {error && <span className="text-xs text-red-500">{error}</span>}
                            </div>
                        );
                    case 'checkbox':
                        return (
                            <div key={field.id} className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">
                                    {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {field.options?.map((opt) => {
                                        const currentValues = Array.isArray(value) ? value : [];
                                        const isChecked = currentValues.includes(opt);
                                        return (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => {
                                                        const newValues = isChecked
                                                            ? currentValues.filter((v: string) => v !== opt)
                                                            : [...currentValues, opt];
                                                        onChange(field.label, newValues);
                                                    }}
                                                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-gray-600">{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {error && <span className="text-xs text-red-500">{error}</span>}
                            </div>
                        );
                    case 'tick_check':
                        return (
                            <div key={field.id} className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-violet-200 transition-all cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={!!value}
                                            onChange={(e) => onChange(field.label, e.target.checked)}
                                            required={field.required}
                                            className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500/20 transition-all"
                                        />
                                    </div>
                                    <span className={cn(
                                        "text-sm font-semibold transition-colors",
                                        !!value ? "text-violet-900" : "text-gray-600 group-hover:text-gray-900"
                                    )}>
                                        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                                    </span>
                                </label>
                                {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
                            </div>
                        );
                    default:
                        return (
                            <Input
                                key={field.id}
                                label={field.label}
                                type={field.type}
                                placeholder={field.placeholder}
                                required={field.required}
                                value={(value as string) || ''}
                                onChange={(e) => onChange(field.label, e.target.value)}
                                error={error}
                            />
                        );
                }
            })}
        </div>
    );
}

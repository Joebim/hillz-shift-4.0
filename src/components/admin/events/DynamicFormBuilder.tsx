import React from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors, FieldValues, UseFormWatch, UseFormSetValue, ArrayPath, FieldArrayPath } from 'react-hook-form';
import { Plus, Trash2, GripVertical, Lock, User, Mail, Phone } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// ─── Default Fields (always present, cannot be removed) ───────────────────────
export const DEFAULT_FORM_FIELDS = [
    { id: '_name', label: 'Full Name', type: 'text', icon: User, placeholder: 'e.g. John Doe' },
    { id: '_email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'e.g. john@example.com' },
    { id: '_phone', label: 'Phone Number', type: 'phone', icon: Phone, placeholder: 'e.g. +234...' },
] as const;

// ─── Locked preview row for default fields ────────────────────────────────────
function DefaultFieldsPreview() {
    return (
        <div className="space-y-2 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Default Fields (always included)</p>
            {DEFAULT_FORM_FIELDS.map(({ id, label, type, icon: Icon }) => (
                <div
                    key={id}
                    className="bg-gray-50 rounded-xl border border-gray-200 p-3 flex items-center gap-3 opacity-70"
                >
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 truncate">{label}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{type} · Required</p>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-100">
                        <Lock className="w-2.5 h-2.5" /> Default
                    </span>
                </div>
            ))}
        </div>
    );
}


// Simple inputs matching the style of EventForm
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
            {children}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
}

function FormInput({ label, required, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string; required?: boolean; error?: string;
}) {
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <input
                className={cn(
                    'w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function Select({ label, required, error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string; required?: boolean; error?: string;
}) {
    return (
        <div>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            <select
                className={cn(
                    'w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                )}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
                onClick={() => onChange(!checked)}
                className={cn(
                    'relative w-10 h-6 rounded-full transition-colors duration-200',
                    checked ? 'bg-violet-600' : 'bg-gray-200'
                )}
            >
                <div className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                    checked ? 'translate-x-5' : 'translate-x-1'
                )} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    );
}

interface DynamicFormBuilderProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    path: ArrayPath<TFieldValues>;
    watch: UseFormWatch<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
}

export function DynamicFormBuilder<TFieldValues extends FieldValues = FieldValues>({ control, register, errors, path, watch, setValue }: DynamicFormBuilderProps<TFieldValues>) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: path as FieldArrayPath<TFieldValues>,
    });

    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const watchField = (name: string) => watch(name as any) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registerField = (name: string, options?: any) => register(name as any, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setValueField = (name: string, value: any) => setValue(name as any, value);

    const addField = () => {
        append({
            id: crypto.randomUUID(),
            label: '',
            type: 'text',
            required: false,
            options: [],
        } as unknown as Parameters<typeof append>[0]);
    };

    return (
        <div className="space-y-4">
            {/* Always-present default fields */}
            <DefaultFieldsPreview />

            {/* Divider */}
            {fields.length > 0 && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-2">Custom Fields</p>
            )}

            {fields.map((field, index) => {
                const pathParts = path.split('.');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let fieldError: any = errors;
                for (const part of pathParts) {
                    fieldError = fieldError?.[part];
                }
                fieldError = fieldError?.[index];
                const fieldPath = `${path}.${index}`;
                const currentType = watchField(`${fieldPath}.type`);
                const isOptionsType = ['select', 'radio', 'checkbox'].includes(currentType);
                const hasSearch = watchField(`${fieldPath}.searchEnabled`);
                const currentOptionsStr = (watchField(`${fieldPath}.options`) || []).join(', ');

                return (
                    <div
                        key={field.id}
                        className={cn(
                            "bg-white rounded-xl border p-4 relative flex items-start gap-4 transition-all duration-200",
                            draggedIndex === index ? "border-violet-500 shadow-md opacity-50" : "border-gray-200",
                        )}
                        draggable
                        onDragStart={(e) => {
                            setDraggedIndex(index);
                            e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIndex !== null && draggedIndex !== index) {
                                move(draggedIndex, index);
                            }
                            setDraggedIndex(null);
                        }}
                        onDragEnd={() => setDraggedIndex(null)}
                    >
                        <div className="pt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                            <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-gray-700">Field #{index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Field Label"
                                    required
                                    placeholder="e.g. T-Shirt Size"
                                    error={fieldError?.label?.message}
                                    {...registerField(`${fieldPath}.label`)}
                                />
                                <Select
                                    label="Field Type"
                                    required
                                    error={fieldError?.type?.message}
                                    {...registerField(`${fieldPath}.type`)}
                                >
                                    <option value="text">Short Text</option>
                                    <option value="textarea">Long Text</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="select">Dropdown Menu</option>
                                    <option value="radio">Radio Buttons</option>
                                    <option value="checkbox">Checkboxes</option>
                                </Select>
                            </div>

                            {['text', 'textarea', 'email', 'phone'].includes(currentType) && (
                                <FormInput
                                    label="Placeholder Text"
                                    placeholder="e.g. Please enter your answer"
                                    error={fieldError?.placeholder?.message}
                                    {...registerField(`${fieldPath}.placeholder`)}
                                />
                            )}

                            <div className="flex items-center gap-4">
                                <Toggle
                                    checked={watchField(`${fieldPath}.required`)}
                                    onChange={(v) => setValueField(`${fieldPath}.required`, v)}
                                    label="Required Field"
                                />

                                {currentType === 'select' && (
                                    <Toggle
                                        checked={watchField(`${fieldPath}.searchEnabled`)}
                                        onChange={(v) => setValueField(`${fieldPath}.searchEnabled`, v)}
                                        label="Enable Search"
                                    />
                                )}
                            </div>

                            {isOptionsType && !hasSearch && (
                                <FormInput
                                    label="Options (Comma Separated)"
                                    placeholder="Option A, Option B, Option C"
                                    defaultValue={currentOptionsStr}
                                    onChange={(e) => {
                                        const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
                                        setValueField(`${fieldPath}.options`, values);
                                    }}
                                />
                            )}

                            {isOptionsType && hasSearch && (
                                <Select
                                    label="Search Database Source"
                                    {...registerField(`${fieldPath}.searchDbSource`)}
                                >
                                    <option value="">Select source...</option>
                                    <option value="registrations">Registrations List</option>
                                    <option value="invitations">Invitations List</option>
                                    <option value="events">Active Events List</option>
                                    <option value="tags">Tags</option>
                                    <option value="ministers">Ministers</option>
                                    <option value="channels">Channels</option>
                                </Select>
                            )}
                        </div>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={addField}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-violet-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
                <Plus className="w-4 h-4" /> Add Custom Field
            </button>
        </div>
    );
}

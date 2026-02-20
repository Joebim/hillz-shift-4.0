import React from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { EventFormField } from '@/src/types/event';

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

interface DynamicFormBuilderProps {
    control: Control<any>;
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    path: string;
    watch: any;
    setValue: any;
}

export function DynamicFormBuilder({ control, register, errors, path, watch, setValue }: DynamicFormBuilderProps) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: path,
    });

    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

    const addField = () => {
        append({
            id: crypto.randomUUID(),
            label: '',
            type: 'text',
            required: false,
            options: [],
        });
    };

    return (
        <div className="space-y-4">
            {fields.map((field, index) => {
                const fieldError = (errors as any)?.[path.split('.')[0]]?.[path.split('.')[1]]?.fields?.[index];
                const fieldPath = `${path}.${index}`;
                const currentType = watch(`${fieldPath}.type`);
                const isOptionsType = ['select', 'radio', 'checkbox'].includes(currentType);
                const hasSearch = watch(`${fieldPath}.searchEnabled`);
                const currentOptionsStr = (watch(`${fieldPath}.options`) || []).join(', ');

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
                                    {...register(`${fieldPath}.label`)}
                                />
                                <Select
                                    label="Field Type"
                                    required
                                    error={fieldError?.type?.message}
                                    {...register(`${fieldPath}.type`)}
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
                                    {...register(`${fieldPath}.placeholder`)}
                                />
                            )}

                            <div className="flex items-center gap-4">
                                <Toggle
                                    checked={watch(`${fieldPath}.required`)}
                                    onChange={(v) => setValue(`${fieldPath}.required`, v)}
                                    label="Required Field"
                                />

                                {currentType === 'select' && (
                                    <Toggle
                                        checked={watch(`${fieldPath}.searchEnabled`)}
                                        onChange={(v) => setValue(`${fieldPath}.searchEnabled`, v)}
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
                                        setValue(`${fieldPath}.options`, values);
                                    }}
                                />
                            )}

                            {isOptionsType && hasSearch && (
                                <Select
                                    label="Search Database Source"
                                    {...register(`${fieldPath}.searchDbSource`)}
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

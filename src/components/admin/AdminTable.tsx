import { ReactNode } from 'react';

import { Button } from '@/src/components/ui/Button';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: {
        view?: (item: T) => string;
        edit?: (item: T) => string;
        delete?: (item: T) => Promise<void>;
    };
    isLoading?: boolean;
}

import { useConfirmModal } from '@/src/hooks/useConfirmModal';

export function AdminTable<T extends { id: string }>({
    data,
    columns,
    actions,
    isLoading
}: AdminTableProps<T>) {
    const confirmCheck = useConfirmModal();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl w-full animate-pulse" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <Eye className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No records found</h3>
                <p className="text-gray-500 max-w-sm">There are currently no items to display in this list.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={cn("px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400", column.className)}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {(actions?.view || actions?.edit || actions?.delete) && (
                                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                {columns.map((column, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className={cn("px-6 py-4 text-gray-600 font-medium", column.className)}
                                    >
                                        {column.cell
                                            ? column.cell(item)
                                            : (column.accessorKey ? String(item[column.accessorKey]) : '-')}
                                    </td>
                                ))}
                                {(actions?.view || actions?.edit || actions?.delete) && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {actions?.view && (
                                                <Link href={actions.view(item)}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-violet-50 hover:text-violet-600 text-gray-400">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {actions?.edit && (
                                                <Link href={actions.edit(item)}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600 text-gray-400">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {actions?.delete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600 text-gray-400"
                                                    onClick={() => {
                                                        confirmCheck.open({
                                                            title: 'Delete Item',
                                                            description: 'Are you sure you want to delete this item? This action cannot be undone.',
                                                            confirmText: 'Delete',
                                                            variant: 'danger',
                                                            onConfirm: async () => {
                                                                await actions.delete!(item);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

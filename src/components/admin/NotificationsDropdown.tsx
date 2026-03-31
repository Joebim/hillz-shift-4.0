import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch('/api/notifications');
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const json = await res.json();
            return json.data;
        },
        refetchInterval: 30000,
    });

    const unreadCount = notifications ? notifications.filter((n: { read: boolean }) => !n.read).length : 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-violet-200 outline-none"
            >
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 left-auto mt-2 !mr-[-130px] !sm:mr-0 w-80 md:w-96 max-w-[calc(100vw-4rem)] bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                            <Link href="#" className="text-xs text-violet-600 font-medium hover:underline">Mark all as read</Link>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {isLoading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-3 animate-pulse">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-2 bg-gray-200 rounded w-3/4" />
                                                <div className="h-2 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : notifications && notifications.length > 0 ? (
                                <div className="py-2">
                                    {notifications.map((notif: any) => (
                                        <div key={notif.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none relative group">
                                            {!notif.read && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-violet-500 rounded-r" />
                                            )}
                                            <div className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow-sm",
                                                notif.type === 'registration' ? "bg-linear-to-br from-violet-400 to-purple-600" :
                                                    notif.type === 'invitation' ? "bg-linear-to-br from-blue-400 to-cyan-600" :
                                                        "bg-linear-to-br from-orange-400 to-pink-500"
                                            )}>
                                                {notif.actorName ? notif.actorName.charAt(0).toUpperCase() : 'S'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-700 text-xs leading-snug">
                                                    <span className="font-semibold text-gray-900">{notif.actorName}</span>{' '}
                                                    <span className="text-gray-500">{notif.action}</span>{' '}
                                                    <span className={cn(notif.highlightColor || 'font-semibold', "wrap-break-word")}>{notif.highlight}</span>
                                                </p>
                                                {(notif.eventTitle || notif.suffix) && (
                                                    <p className="text-[10px] text-gray-400 mt-0.5 truncate italic">
                                                        {notif.suffix} {notif.eventTitle ? `on ${notif.eventTitle}` : ''}
                                                    </p>
                                                )}
                                                <p className="text-[10px] text-gray-400 mt-1 font-medium">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                                    <Bell className="w-8 h-8 text-gray-200" />
                                    <p>No notifications yet</p>
                                </div>
                            )}
                        </div>
                        <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                            <Link href="/admin/notifications" className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">
                                View All Notifications
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

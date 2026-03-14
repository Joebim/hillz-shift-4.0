'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, Bell } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    actorName: string;
    action: string;
    highlight: string;
    suffix: string;
    eventTitle?: string;
    createdAt: string;
    read: boolean;
    type: 'registration' | 'invitation' | 'system' | 'info';
    highlightColor?: string;
}

export default function NotificationsPage() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['notifications-infinite'],
        queryFn: async ({ pageParam = undefined }) => {
            const res = await fetch(`/api/notifications?limit=20${pageParam ? `&lastId=${pageParam}` : ''}`);
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const json = await res.json();
            return {
                notifications: json.data as Notification[],
                nextId: json.data.length > 0 ? json.data[json.data.length - 1].id : undefined,
                hasMore: json.hasMore
            };
        },
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextId : undefined,
        initialPageParam: undefined,
    });

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Bell className="w-6 h-6 text-violet-600" />
                        Notifications
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with all activities.</p>
                </div>
                {}
                {}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {status === 'pending' ? (
                    <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                        <p>Loading notifications...</p>
                    </div>
                ) : status === 'error' ? (
                    <div className="p-12 text-center text-red-500">
                        Error loading notifications. Please try again.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {data?.pages.map((page) => (
                            page.notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-5 hover:bg-gray-50 transition-colors flex gap-4 group relative",
                                        !notification.read && "bg-violet-50/30"
                                    )}
                                >
                                    {}
                                    {!notification.read && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-violet-500 rounded-r-lg" />
                                    )}

                                    {}
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm",
                                        notification.type === 'registration' ? "bg-linear-to-br from-violet-400 to-purple-600" :
                                            notification.type === 'invitation' ? "bg-linear-to-br from-blue-400 to-cyan-600" :
                                                "bg-linear-to-br from-orange-400 to-pink-500"
                                    )}>
                                        {notification.actorName ? notification.actorName.charAt(0).toUpperCase() : 'S'}
                                    </div>

                                    {}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                                            <p className="text-sm text-gray-900 leading-snug">
                                                <span className="font-semibold">{notification.actorName}</span>{' '}
                                                <span className="text-gray-500">{notification.action}</span>{' '}
                                                <span className={notification.highlightColor || "font-semibold text-gray-900"}>{notification.highlight}</span>
                                            </p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>

                                        {(notification.eventTitle || notification.suffix) && (
                                            <p className="text-xs text-gray-500 italic">
                                                {notification.suffix} {notification.eventTitle && <span className="font-medium not-italic text-gray-600">on {notification.eventTitle}</span>}
                                            </p>
                                        )}
                                    </div>

                                    {}
                                    {}
                                </div>
                            ))
                        ))}

                        {data?.pages[0].notifications.length === 0 && (
                            <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-3">
                                <Bell className="w-12 h-12 text-gray-200" />
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                )}

                {}
                {hasNextPage && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-violet-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading more...
                                </>
                            ) : (
                                'Load More Notifications'
                            )}
                        </button>
                    </div>
                )}
                {!hasNextPage && data && data.pages[0].notifications.length > 0 && (
                    <div className="p-6 text-center text-xs text-gray-400 border-t border-gray-50 uppercase tracking-widest font-semibold">
                        You&apos;re all caught up
                    </div>
                )}
            </div>
        </div>
    );
}

import { notFound } from 'next/navigation';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import React from 'react';
import { StoreInitializer } from '@/src/components/shared/StoreInitializer';
import { serializeFirestoreData } from '@/src/lib/utils';

export default async function EventHubLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    const events = await queryDocuments<Event>('events', { slug: eventId, status: 'published' });

    if (!events.length) {
        return notFound();
    }

    const event = events[0];

    const serializedEvent = serializeFirestoreData(event);

    const themeStyles = {
        '--primary': event.branding.primaryColor || '#6B46C1',
        '--primary-dark': event.branding.secondaryColor || '#553C9A',
        '--accent': event.branding.accentColor || '#D4AF37',
        '--accent-foreground': '#FFFFFF',
    } as React.CSSProperties;

    return (
        <div style={themeStyles} className="event-hub-wrapper font-sans text-gray-900 bg-white min-h-screen">
            <StoreInitializer event={serializedEvent} />
            <style>{`
                .event-hub-wrapper .bg-primary { background-color: var(--primary); }
                .event-hub-wrapper .bg-primary\\/5 { background-color: color-mix(in srgb, var(--primary) 5%, transparent); }
                .event-hub-wrapper .bg-primary\\/10 { background-color: color-mix(in srgb, var(--primary) 10%, transparent); }
                .event-hub-wrapper .bg-primary\\/20 { background-color: color-mix(in srgb, var(--primary) 20%, transparent); }
                
                .event-hub-wrapper .text-primary { color: var(--primary); }
                .event-hub-wrapper .text-primary-dark { color: var(--primary-dark); }
                
                .event-hub-wrapper .border-primary\\/10 { border-color: color-mix(in srgb, var(--primary) 10%, transparent); }
                
                .event-hub-wrapper .bg-accent { background-color: var(--accent); }
                .event-hub-wrapper .text-accent { color: var(--accent); }
                .event-hub-wrapper .text-accent-foreground { color: var(--accent-foreground); }
                
                .event-hub-wrapper .bg-accent\\/5 { background-color: color-mix(in srgb, var(--accent) 5%, transparent); }
                .event-hub-wrapper .bg-accent\\/10 { background-color: color-mix(in srgb, var(--accent) 10%, transparent); }
                .event-hub-wrapper .border-accent\\/10 { border-color: color-mix(in srgb, var(--accent) 10%, transparent); }
                
                .event-hub-wrapper .btn-primary { background-color: var(--primary); color: white; }
                .event-hub-wrapper .btn-primary:hover { opacity: 0.9; }
            `}</style>
            {children}
        </div>
    );
}

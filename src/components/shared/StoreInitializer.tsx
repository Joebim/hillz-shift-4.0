'use client';

import { useEffect, useRef } from 'react';
import { useEventStore } from '@/src/store/useEventStore';
import { Event } from '@/src/types/event';

export function StoreInitializer({ event }: { event: Event }) {
    const initialized = useRef(false);

    if (!initialized.current) {
        useEventStore.getState().setActiveEvent(event);
        initialized.current = true;
    }

    return null;
}

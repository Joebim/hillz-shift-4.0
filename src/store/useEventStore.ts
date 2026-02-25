import { create } from "zustand";
import { Event } from "@/src/types/event";

interface EventStore {
  activeEvent: Event | null;
  setActiveEvent: (event: Event | null) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  activeEvent: null,
  setActiveEvent: (event) => set({ activeEvent: event }),
}));

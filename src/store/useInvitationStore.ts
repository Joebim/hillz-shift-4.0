import { create } from "zustand";
import { InvitationFormData } from "../types/Invitation";

interface InvitationState {
  form: InvitationFormData;
  setField: (key: keyof InvitationFormData, value: string) => void;
  resetForm: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (status: boolean) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  form: {
    inviterName: "",
    inviteeName: "",
    inviteePhone: "",
    inviteeEmail: "",
    location: "",
    customMessage: "",
  },
  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),
  resetForm: () =>
    set({
      form: {
        inviterName: "",
        inviteeName: "",
        inviteePhone: "",
        inviteeEmail: "",
        location: "",
        customMessage: "",
      },
    }),
  isSubmitting: false,
  setIsSubmitting: (status) => set({ isSubmitting: status }),
}));

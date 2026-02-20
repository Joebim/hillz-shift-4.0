import { create } from "zustand";

interface InvitationFormData {
  inviterName: string;
  inviteeName: string;
  inviteePhone: string;
  inviteeEmail: string;
  location: string;
  customMessage: string;
}

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

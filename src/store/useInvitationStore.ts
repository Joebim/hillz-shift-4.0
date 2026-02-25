import { create } from "zustand";

interface InvitationFormData {
  inviterName: string;
  inviteeName: string;
  inviteePhone: string;
  inviteeEmail: string;
  location: string;
  customMessage: string;
  customFields: Record<string, unknown>;
}

interface InvitationState {
  form: InvitationFormData;
  setField: (key: keyof InvitationFormData, value: unknown) => void;
  setCustomField: (label: string, value: unknown) => void;
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
    customFields: {},
  },
  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
    })),
  setCustomField: (label, value) =>
    set((state) => ({
      form: {
        ...state.form,
        customFields: { ...state.form.customFields, [label]: value },
      },
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
        customFields: {},
      },
    }),
  isSubmitting: false,
  setIsSubmitting: (status) => set({ isSubmitting: status }),
}));

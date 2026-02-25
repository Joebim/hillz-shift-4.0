import { create } from "zustand";

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  whoInvited: string;
  heardFrom: string;
  joiningMethod: string;
  customFields: Record<string, unknown>;
}

interface RegistrationState {
  form: RegistrationFormData;
  setField: (key: keyof RegistrationFormData, value: unknown) => void;
  setCustomField: (label: string, value: unknown) => void;
  resetForm: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (status: boolean) => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  form: {
    name: "",
    email: "",
    phone: "",
    address: "",
    whoInvited: "",
    heardFrom: "",
    joiningMethod: "",
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
        name: "",
        email: "",
        phone: "",
        address: "",
        whoInvited: "",
        heardFrom: "",
        joiningMethod: "",
        customFields: {},
      },
    }),
  isSubmitting: false,
  setIsSubmitting: (status) => set({ isSubmitting: status }),
}));

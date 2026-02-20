import { create } from "zustand";

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  whoInvited: string;
  heardFrom: string;
  joiningMethod: string;
}

interface RegistrationState {
  form: RegistrationFormData;
  setField: (key: keyof RegistrationFormData, value: string) => void;
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
  },
  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
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
      },
    }),
  isSubmitting: false,
  setIsSubmitting: (status) => set({ isSubmitting: status }),
}));

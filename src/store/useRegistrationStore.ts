import { create } from "zustand";
import { RegistrationFormData } from "../types/Registration";

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
      form: { name: "", email: "", phone: "", address: "", whoInvited: "", heardFrom: "", joiningMethod: "" },
    }),
  isSubmitting: false,
  setIsSubmitting: (status) => set({ isSubmitting: status }),
}));

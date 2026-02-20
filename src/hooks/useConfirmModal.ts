"use client";

import { create } from "zustand";

interface ConfirmModalState {
  isValid: boolean;
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  open: (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  close: () => void;
}

export const useConfirmModal = create<ConfirmModalState>((set) => ({
  isValid: false,
  isOpen: false,
  title: "",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",
  onConfirm: () => {},
  onCancel: () => {},
  open: (options) =>
    set({
      isValid: true,
      isOpen: true,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      variant: options.variant || "danger",
      onConfirm: options.onConfirm,
      onCancel: options.onCancel || (() => {}),
    }),
  close: () => set({ isOpen: false }),
}));

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Format a date to a readable string
 */
/**
 * Helper to convert various date formats to JS Date
 */
export function toJsDate(date: Date | string | any): Date {
  if (!date) return new Date();
  if (typeof date === "string") return new Date(date);
  if (typeof date.toDate === "function") return date.toDate();
  if (date instanceof Date) return date;

  // Handle Firestore Timestamp object (serialized)
  if (typeof date === "object" && (date._seconds || date.seconds)) {
    const seconds = date._seconds || date.seconds;
    const nanoseconds = date._nanoseconds || date.nanoseconds || 0;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }

  return new Date(date);
}

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string | any,
  format: "short" | "long" | "full" = "long",
): string {
  const d = toJsDate(date);

  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a time to a readable string
 */
export function formatTime(date: Date | string | any): string {
  const d = toJsDate(date);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/**
 * Calculate days until a date
 */
export function daysUntil(date: Date | string | any): number {
  const d = toJsDate(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string | any): boolean {
  const d = toJsDate(date);
  return d.getTime() < Date.now();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string | any): boolean {
  const d = toJsDate(date);
  return d.getTime() > Date.now();
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | any): boolean {
  const d = toJsDate(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

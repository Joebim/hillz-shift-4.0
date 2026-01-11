"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { auth as firebaseAuth } from "@/src/lib/firebaseClient";
import { signOut } from "firebase/auth";
import { useToast } from "@/src/contexts/ToastContext";

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();

  const navItems = [
    { name: "Dashboard", href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { name: "Registrations", href: ROUTES.ADMIN.REGISTRATIONS, icon: Users },
    { name: "Invitations", href: ROUTES.ADMIN.INVITATIONS, icon: UserPlus },
    { name: "Analytics", href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      if (firebaseAuth) await signOut(firebaseAuth);
      toast.success("Logged out successfully", 2000);
      
      // Use hard redirect to ensure cookie is cleared and we navigate properly
      setTimeout(() => {
        window.location.href = ROUTES.ADMIN.LOGIN;
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 items-center px-6">
          <span className="text-xl font-bold text-indigo-900">
            HS 4.0 Admin
          </span>
        </div>
        <nav className="mt-4 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8">
          <button
            className="lg:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium text-gray-700">
              {userEmail || "Admin User"}
            </span>
            <button
              onClick={handleLogout}
              className={cn(
                "inline-flex items-center justify-center",
                isLoggingOut
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:text-red-500"
              )}
              aria-label="Log out"
              disabled={isLoggingOut}
            >
              <LogOut
                size={20}
                className="text-gray-400 transition-colors"
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10 lg:px-10 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden">
          <aside className="h-full w-64 bg-white p-4 shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-indigo-900">
                HS 4.0 Admin
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                      pathname === item.href
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className={cn(
                  "mt-4 w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors text-gray-600 hover:bg-gray-50 cursor-pointer",
                  isLoggingOut && "opacity-60 cursor-not-allowed"
                )}
                disabled={isLoggingOut}
              >
                <LogOut size={20} />
                Log out
              </button>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}


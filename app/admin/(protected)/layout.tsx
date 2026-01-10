import React from "react";
import { redirect } from "next/navigation";
import { requireAdminSession, AdminAuthError } from "@/src/lib/adminSession";
import AdminShell from "./AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[Protected Admin Layout] Checking admin session...');
  
  try {
    const decoded = await requireAdminSession();
    console.log('[Protected Admin Layout] Session verified successfully', {
      email: decoded.email,
      uid: decoded.uid,
      hasAdminClaim: (decoded as any)?.admin === true,
    });
    return <AdminShell userEmail={decoded.email || null}>{children}</AdminShell>;
  } catch (e) {
    // Any auth failure redirects to login.
    const isAuthError = e instanceof AdminAuthError;
    console.warn('[Protected Admin Layout] Session verification failed', {
      isAdminAuthError: isAuthError,
      errorCode: isAuthError ? e.code : 'UNKNOWN',
      errorMessage: e instanceof Error ? e.message : String(e),
      errorType: e?.constructor?.name,
    });
    console.log('[Protected Admin Layout] Redirecting to login page...', { 
      redirectTo: '/admin/login',
    });
    
    if (e instanceof AdminAuthError) {
      redirect("/admin/login");
    }
    redirect("/admin/login");
  }
}


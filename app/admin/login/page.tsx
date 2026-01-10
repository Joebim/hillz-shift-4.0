'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { ROUTES } from '@/src/constants/routes';
import { Lock } from 'lucide-react';
import { auth } from '@/src/lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/src/contexts/ToastContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        console.log('[Admin Login Page] Login page mounted/loaded', {
            pathname: window.location.pathname,
            search: window.location.search,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
        });

        // Check if we were redirected here from a protected route
        if (document.referrer && document.referrer.includes('/admin')) {
            console.warn('[Admin Login Page] Redirected to login page from admin route', {
                referrer: document.referrer,
                currentPath: window.location.pathname,
            });
        }

        // If already authenticated, redirect away from login.
        (async () => {
            try {
                console.log('[Admin Login Page] Checking existing session via GET /api/auth ...');
                const res = await fetch('/api/auth', { method: 'GET', credentials: 'include' });
                const data = await res.json().catch(() => ({}));
                console.log('[Admin Login Page] Session check result', {
                    status: res.status,
                    ok: res.ok,
                    data,
                });

                if (data?.authenticated === true) {
                    console.log('[Admin Login Page] Already authenticated; redirecting to dashboard', {
                        destination: ROUTES.ADMIN.DASHBOARD,
                    });
                    window.location.replace(ROUTES.ADMIN.DASHBOARD);
                }
            } catch (e) {
                console.warn('[Admin Login Page] Session check failed', e);
            }
        })();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log('[Admin Login] Starting login process...', { email });

        try {
            if (!auth) {
                console.error('[Admin Login] Firebase auth not available');
                throw new Error('Firebase auth is not available in this environment.');
            }

            console.log('[Admin Login] Attempting Firebase authentication...');
            const cred = await signInWithEmailAndPassword(auth, email, password);
            console.log('[Admin Login] Firebase authentication successful', { uid: cred.user.uid });

            const idToken = await cred.user.getIdToken();
            console.log('[Admin Login] ID token obtained', { tokenLength: idToken.length });

            // Make the auth request with credentials
            console.log('[Admin Login] Sending auth request to /api/auth...');
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Critical: ensures cookies are sent and received
                body: JSON.stringify({ idToken }),
            });

            console.log('[Admin Login] Auth API response received', {
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
            });

            const data = await res.json().catch(() => ({}));
            console.log('[Admin Login] Auth API response data', {
                success: data.success,
                hasError: !!data.error,
                error: data.error,
                hasUser: !!data.user,
            });

            if (!res.ok || data?.success === false) {
                const errorMessage = data?.error || 'Login failed';
                console.error('[Admin Login] Auth API request failed', { errorMessage });
                throw new Error(errorMessage);
            }

            // Verify the response was successful
            if (!data.success) {
                const errorMessage = data.error || 'Login failed';
                console.error('[Admin Login] Auth response indicates failure', { errorMessage });
                throw new Error(errorMessage);
            }

            // Check if Set-Cookie header is in the response
            // This helps us verify the cookie was set
            const setCookieHeader = res.headers.get('set-cookie');
            console.log('[Admin Login] Checking Set-Cookie header', {
                hasSetCookie: !!setCookieHeader,
                setCookieHeader: setCookieHeader ? setCookieHeader.substring(0, 150) : null,
                allHeaders: Object.fromEntries(res.headers.entries()),
            });

            // Show success toast
            console.log('[Admin Login] Login successful! Showing toast and preparing redirect...');
            toast.success('Login successful! Redirecting...', 2000);

            // IMPORTANT: Wait for the cookie to be set in the browser
            // Cookies set via Set-Cookie header need a moment to be processed
            console.log('[Admin Login] Waiting 1000ms for cookie to be set in browser...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verify session is actually present BEFORE redirecting.
            console.log('[Admin Login] Verifying session via GET /api/auth before redirect...');
            const verifyRes = await fetch('/api/auth', { method: 'GET', credentials: 'include' });
            const verifyData = await verifyRes.json().catch(() => ({}));
            console.log('[Admin Login] Session verify result', {
                status: verifyRes.status,
                ok: verifyRes.ok,
                verifyData,
            });

            if (verifyData?.authenticated !== true) {
                console.error('[Admin Login] Cookie not active yet; staying on login', verifyData);
                toast.error(
                    `Not logged in (${verifyData?.reason || 'UNKNOWN'}). Make sure ADMIN_COOKIE_SECRET is set.`,
                    6000
                );
                setLoading(false);
                return;
            }

            console.log('[Admin Login] Redirecting to dashboard...', {
                destination: ROUTES.ADMIN.DASHBOARD,
                method: 'window.location.href',
            });

            // Use window.location for a hard redirect that includes cookies
            // router.push might not trigger a full server-side render that reads cookies
            window.location.replace(ROUTES.ADMIN.DASHBOARD);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            const errorStack = err instanceof Error ? err.stack : undefined;
            console.error('[Admin Login] Login error occurred', {
                error: errorMessage,
                errorObject: err,
                stack: errorStack,
            });
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl md:rounded-3xl bg-white p-6 md:p-10 shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Admin Portal</h2>
                    <p className="mt-2 text-gray-600">Secure access to Hillz Shift 4.0 management</p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <Input
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@hillzshift.org"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Forgot your password? Please contact the super admin.
                    </p>
                </div>
            </div>
        </div>
    );
}

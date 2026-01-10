'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';

export default function QRPage() {
    const router = useRouter();

    useEffect(() => {
        // Analytics can be tracked here
        console.log('QR Code Scanned');

        // Redirect to registration with source param
        router.replace(`${ROUTES.REGISTER}?utm_source=qr-code`);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-indigo-900 text-white">
            <div className="text-center">
                <div className="mb-6 inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-400 border-t-white"></div>
                <h1 className="text-2xl font-bold">Welcome to Hillz Shift 4.0</h1>
                <p className="mt-2 text-indigo-300">Redirecting you to the registration page...</p>
            </div>
        </div>
    );
}

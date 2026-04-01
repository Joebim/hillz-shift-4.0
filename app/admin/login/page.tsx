'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/lib/firebase/client';
import { Card } from '@/src/components/ui/Card';
import { useToast } from '@/src/contexts/ToastContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid = email.includes('@') && password.length >= 6;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            toast('Please enter a valid email and password (min 6 chars).', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (response.ok) {
                toast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    router.push('/admin');
                }, 500);
            } else {
                const data = await response.json();
                toast(data.message || 'Login failed', 'error');
            }
        } catch (err: unknown) {
            const errorCode = (err as { code?: string }).code;
            if (errorCode === 'auth/invalid-credential') {
                toast('Invalid email or password.', 'error');
            } else if (errorCode === 'auth/too-many-requests') {
                toast('Too many attempts. Please try again later.', 'error');
            } else {
                toast('An unexpected error occurred. Please try again.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative font-sans">
            <div className="max-w-md w-full px-4 relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center mb-4 cursor-default">
                        <img 
                            src="/icons/hillz-logo-light-transparent.svg" 
                            alt="The Hillz Logo" 
                            className="w-40 h-auto opacity-90 transition-opacity hover:opacity-100"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Admin Portal</h1>
                        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase opacity-60">System Authentication Required</p>
                    </div>
                </div>

                <Card variant="elevated" padding="lg" className="border-none shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] bg-white rounded-[40px] overflow-visible">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Admin Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            placeholder="admin@thehillz.com"
                            className="bg-slate-50 border-none focus:ring-2 focus:ring-slate-100 focus:bg-white h-14 rounded-2xl font-bold transition-all"
                            endAdornment={<Mail className="w-5 h-5 text-slate-300" />}
                        />

                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="bg-slate-50 border-none focus:ring-2 focus:ring-slate-100 focus:bg-white h-14 rounded-2xl font-bold transition-all"
                            endAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none hover:text-slate-900 transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-slate-300 transition-colors hover:text-slate-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-slate-300 transition-colors hover:text-slate-400" />
                                    )}
                                </button>
                            }
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] border-none"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>Authenticating...</>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Enter Dashboard <Lock className="w-4 h-4 opacity-40 ml-1" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-200 cursor-default">
                            The Hillz Shift OS &copy; {new Date().getFullYear()} • Secure Environment
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

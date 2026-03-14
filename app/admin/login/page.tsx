'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/lib/firebase/client';
import { Card } from '@/src/components/ui/Card';
import { useToast } from '@/src/contexts/ToastContext';
import { Eye, EyeOff, Sparkles, Lock, Mail } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-gray-50 to-gray-50 overflow-hidden relative">

            {}
            <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-white/0 via-violet-500/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="max-w-md w-full px-4 relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out">
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 mb-4 ring-4 ring-white">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to access your administrative dashboard</p>
                </div>

                <Card variant="elevated" padding="lg" className="border-t-4 border-t-violet-500 shadow-xl shadow-violet-100/50 backdrop-blur-sm bg-white/90">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            placeholder="admin@example.com"
                            className="bg-gray-50 focus:bg-white"
                            endAdornment={<Mail className="w-5 h-5 text-gray-400" />}
                        />

                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="bg-gray-50 focus:bg-white"
                            endAdornment={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none hover:text-violet-600 transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            }
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-12 text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all active:scale-[0.98]"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>Sign In</>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <Lock className="w-4 h-4 opacity-50" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            Protected by Hillz Shift Security System &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

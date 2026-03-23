import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AtSign, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        emailOrUsername: '',
        password: '',
    });
    const [showPw, setShowPw] = useState(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <AuthLayout title="Sign In">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
                <p className="text-muted-foreground text-sm mb-8">Sign in to your MovieLandia24 account</p>

                <form onSubmit={submit} className="space-y-4">
                    {/* Email / Username */}
                    <div className="space-y-1.5">
                        <Label htmlFor="emailOrUsername">Email or Username</Label>
                        <div className="relative">
                            <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="emailOrUsername"
                                type="text"
                                value={data.emailOrUsername}
                                onChange={(e) => setData('emailOrUsername', e.target.value)}
                                className="pl-9"
                                placeholder="Email or Username"
                                autoComplete="username"
                                required
                            />
                        </div>
                        {errors.emailOrUsername && (
                            <p className="text-destructive text-xs">{errors.emailOrUsername}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="password"
                                type={showPw ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-9 pr-10"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowPw((v) => !v)}
                            >
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-destructive text-xs">{errors.password}</p>
                        )}
                    </div>

                    {/* Sign In button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full gap-2 mt-2"
                    >
                        <Lock size={15} />
                        {processing ? 'Signing in…' : 'Sign In'}
                    </Button>
                </form>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-5">
                    <Separator className="flex-1" />
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">OR</span>
                    <Separator className="flex-1" />
                </div>

                {/* Google */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-3"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue With Google
                </Button>

                {/* Links */}
                <div className="mt-6 space-y-2 text-center text-sm">
                    <p>
                        <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                            Forgot Password?
                        </Link>
                    </p>
                    <p className="text-muted-foreground">
                        Don&apos;t Have An Account?{' '}
                        <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}


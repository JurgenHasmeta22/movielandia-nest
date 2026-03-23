import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

export default function ResetPassword({ token }: { token: string }) {
    const { data, setData, post, processing, errors } = useForm({ token, password: '' });
    const [showPw, setShowPw] = useState(false);

    return (
        <AuthLayout title="Reset Password">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-foreground mb-1">Reset Password</h1>
                <p className="text-muted-foreground text-sm mb-8">Enter your new password below.</p>

                <form onSubmit={(e) => { e.preventDefault(); post('/reset-password'); }} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="new-password"
                                type={showPw ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-9 pr-10"
                                placeholder="New password"
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
                        {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                    </div>
                    <Button type="submit" disabled={processing} className="w-full gap-2">
                        <Lock size={15} />
                        {processing ? 'Resetting…' : 'Reset Password'}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Back to Sign In</Link>
                </p>
            </div>
        </AuthLayout>
    );
}

import { useForm, Link } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({ email: '' });

    return (
        <AuthLayout title="Forgot Password">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-foreground mb-1">Forgot Password?</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Enter your email and we'll send you a reset link.
                </p>

                {wasSuccessful && (
                    <div className="mb-4 px-4 py-3 bg-green-900/40 border border-green-700 text-green-300 rounded-lg text-sm">
                        Reset link sent! Check your inbox.
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); post('/forgot-password'); }} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="fp-email">Email address</Label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="fp-email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="pl-9"
                                placeholder="Email address"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Sending…' : 'Send Reset Link'}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    <Link href="/login" className="text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                        <ArrowLeft size={14} /> Back to Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

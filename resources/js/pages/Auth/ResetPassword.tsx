import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

export default function ResetPassword({ token }: { token: string }) {
    const { data, setData, post, processing, errors } = useForm({ token, password: '' });
    const [showPw, setShowPw] = useState(false);

    return (
        <AuthLayout title="Reset Password">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
                <p className="text-gray-400 text-sm mb-8">Enter your new password below.</p>

                <form onSubmit={(e) => { e.preventDefault(); post('/reset-password'); }} className="space-y-4">
                    <div>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-[#1e2a3a] border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
                                placeholder="New password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        <Lock size={15} />
                        {processing ? 'Resetting…' : 'Reset Password'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Back to Sign In</Link>
                </p>
            </div>
        </AuthLayout>
    );
}

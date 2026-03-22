import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({ email: '' });

    return (
        <AuthLayout title="Forgot Password">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-white mb-1">Forgot Password?</h1>
                <p className="text-gray-400 text-sm mb-8">
                    Enter your email and we'll send you a reset link.
                </p>

                {wasSuccessful && (
                    <div className="mb-4 px-4 py-3 bg-green-900/40 border border-green-700 text-green-300 rounded-lg text-sm">
                        Reset link sent! Check your inbox.
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); post('/forgot-password'); }} className="space-y-4">
                    <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-[#1e2a3a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
                            placeholder="Email address"
                            required
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {processing ? 'Sending…' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors">
                        <ArrowLeft size={14} /> Back to Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({ email: '' });

    return (
        <AppLayout title="Forgot Password">
            <div className="max-w-md mx-auto mt-10">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-2 text-center">Forgot Password</h1>
                    <p className="text-gray-400 text-sm text-center mb-6">
                        Enter your email and we'll send you a reset link.
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); post('/forgot-password'); }} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="your@email.com"
                                required
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors">
                            {processing ? 'Sending…' : 'Send Reset Link'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-400 mt-6">
                        <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

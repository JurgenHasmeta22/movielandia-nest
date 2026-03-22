import { useForm } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        emailOrUsername: '',
        password: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <AppLayout title="Sign In">
            <div className="max-w-md mx-auto mt-10">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                value={data.emailOrUsername}
                                onChange={(e) => setData('emailOrUsername', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Enter your email or username"
                                required
                            />
                            {errors.emailOrUsername && (
                                <p className="text-red-400 text-sm mt-1">{errors.emailOrUsername}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            {processing ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

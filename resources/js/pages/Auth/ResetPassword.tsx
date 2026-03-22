import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../layouts/AppLayout';

export default function ResetPassword({ token }: { token: string }) {
    const { data, setData, post, processing, errors } = useForm({ token, password: '' });

    return (
        <AppLayout title="Reset Password">
            <div className="max-w-md mx-auto mt-10">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h1>
                    <form onSubmit={(e) => { e.preventDefault(); post('/reset-password'); }} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors">
                            {processing ? 'Resetting…' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

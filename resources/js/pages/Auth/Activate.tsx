import { Link, router } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Props {
    token?: string;
    error?: string;
}

export default function AuthActivate({ token, error }: Props) {
    return (
        <AppLayout title="Activate Account">
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 text-center">
                    {error ? (
                        <>
                            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-400 text-3xl">✕</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Activation Failed</h1>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <Link
                                href="/register"
                                className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                            >
                                Register Again
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-400 text-3xl">✓</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Account Activated!</h1>
                            <p className="text-gray-400 mb-6">
                                Your account has been successfully activated. You can now log in.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

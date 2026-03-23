import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface Props {
    token?: string;
    error?: string;
}

export default function AuthActivate({ token, error }: Props) {
    return (
        <AppLayout title="Activate Account">
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-8">
                        {error ? (
                            <>
                                <div className="w-16 h-16 bg-destructive/15 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-destructive text-3xl">✕</span>
                                </div>
                                <h1 className="text-2xl font-bold text-foreground mb-2">Activation Failed</h1>
                                <p className="text-muted-foreground mb-6">{error}</p>
                                <Button asChild>
                                    <Link href="/register">Register Again</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-green-400 text-3xl">✓</span>
                                </div>
                                <h1 className="text-2xl font-bold text-foreground mb-2">Account Activated!</h1>
                                <p className="text-muted-foreground mb-6">
                                    Your account has been successfully activated. You can now log in.
                                </p>
                                <Button asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

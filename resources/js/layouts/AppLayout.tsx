import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeaderSearch } from '../components/HeaderSearch';
import { PageTransition } from '../components/PageTransition';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Separator } from '../components/ui/separator';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from '../components/ui/navigation-menu';

interface AuthUser {
    id: number;
    userName: string;
    email: string;
    avatar: string | null;
}

interface Flash {
    type: 'success' | 'error' | 'info';
    message: string;
}

interface SharedProps {
    auth: { user: AuthUser | null };
    flash: Flash | null;
    [key: string]: unknown;
}

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { auth, flash } = usePage<SharedProps>().props;
    const user = auth?.user;

    useEffect(() => {
        if (!flash) return;
        const fn = flash.type === 'success' ? toast.success
                 : flash.type === 'error'   ? toast.error
                 : toast.info;
        fn(flash.message);
    }, [flash]);
    const avatarSrc = user?.avatar
        ? (user.avatar.startsWith('http') ? user.avatar : `/images/users/${user.avatar}`)
        : null;

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                {/* Navbar */}
                <nav className="bg-card border-b border-border sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                                Movielandia24
                            </Link>

                            {/* Primary nav */}
                            <NavigationMenu className="hidden md:flex">
                                <NavigationMenuList>
                                    {[
                                        { href: '/movies', label: 'Movies' },
                                        { href: '/series', label: 'Series' },
                                        { href: '/genres', label: 'Genres' },
                                        { href: '/actors', label: 'Actors' },
                                        { href: '/crew', label: 'Crew' },
                                        { href: '/forum', label: 'Forum' },
                                    ].map(({ href, label }) => (
                                        <NavigationMenuItem key={href}>
                                            <NavigationMenuLink
                                                href={href}
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                {label}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* Auth + Search */}
                            <div className="flex items-center gap-2">
                                <HeaderSearch />
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2 pl-2">
                                                <Avatar className="h-7 w-7">
                                                    {avatarSrc && (
                                                        <AvatarImage
                                                            src={avatarSrc}
                                                            alt={user.userName}
                                                        />
                                                    )}
                                                    <AvatarFallback>
                                                        {user.userName.slice(0, 1).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="hidden sm:inline max-w-28 truncate text-sm">
                                                    {user.userName}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>
                                                <p className="font-medium truncate">{user.userName}</p>
                                                <p className="text-xs text-muted-foreground truncate font-normal">{user.email}</p>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/users/me">My Profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/users/favorites/list">Favorites</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/users/reviews/list">Reviews</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/users/messages/inbox">Messages</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/lists">My Lists</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <form action="/logout" method="POST" className="w-full">
                                                    <button
                                                        type="submit"
                                                        className="w-full text-left text-destructive focus:text-destructive"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </form>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href="/login">Sign In</Link>
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href="/register">Sign Up</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Flash toasts */}
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />

                {/* Page content */}
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>

                {/* Footer */}
                <footer className="bg-card border-t border-border mt-auto">
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <p className="text-primary font-bold text-lg mb-3">Movielandia24</p>
                                <p className="text-muted-foreground text-sm">Your home for movies, series, ratings and community discussion.</p>
                            </div>
                            <div>
                                <p className="text-foreground font-semibold text-sm mb-3 uppercase tracking-wider">Browse</p>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/movies" className="text-muted-foreground hover:text-foreground transition-colors">Movies</Link></li>
                                    <li><Link href="/series" className="text-muted-foreground hover:text-foreground transition-colors">Series</Link></li>
                                    <li><Link href="/genres" className="text-muted-foreground hover:text-foreground transition-colors">Genres</Link></li>
                                    <li><Link href="/actors" className="text-muted-foreground hover:text-foreground transition-colors">Actors</Link></li>
                                    <li><Link href="/crew" className="text-muted-foreground hover:text-foreground transition-colors">Crew</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-foreground font-semibold text-sm mb-3 uppercase tracking-wider">Community</p>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/forum" className="text-muted-foreground hover:text-foreground transition-colors">Forum</Link></li>
                                    <li><Link href="/lists" className="text-muted-foreground hover:text-foreground transition-colors">Lists</Link></li>
                                    <li><Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">Search</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-foreground font-semibold text-sm mb-3 uppercase tracking-wider">Account</p>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link></li>
                                    <li><Link href="/register" className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link></li>
                                </ul>
                            </div>
                        </div>
                        <Separator />
                        <div className="pt-6 text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Movielandia24. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff, Phone, Globe, Calendar, Users, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const COUNTRIES = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
    'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
    'Bolivia','Bosnia','Brazil','Bulgaria','Cambodia','Canada','Chile','China','Colombia',
    'Costa Rica','Croatia','Cuba','Czech Republic','Denmark','Ecuador','Egypt','Estonia',
    'Ethiopia','Finland','France','Georgia','Germany','Ghana','Greece','Guatemala','Haiti',
    'Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
    'Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Latvia','Lebanon',
    'Libya','Lithuania','Luxembourg','Malaysia','Maldives','Malta','Mexico','Moldova',
    'Monaco','Mongolia','Morocco','Nepal','Netherlands','New Zealand','Nigeria','North Korea',
    'Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru','Philippines','Poland',
    'Portugal','Qatar','Romania','Russia','Saudi Arabia','Serbia','Singapore','Slovakia',
    'Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Sweden',
    'Switzerland','Syria','Taiwan','Thailand','Tunisia','Turkey','Ukraine','United Arab Emirates',
    'United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen',
];

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        userName: '',
        email: '',
        birthday: '',
        gender: 'Male',
        phone: '',
        countryFrom: '',
        password: '',
        confirmPassword: '',
    });

    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [localError, setLocalError] = useState('');

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError('');
        if (data.password !== data.confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }
        if (!agreed) {
            setLocalError('You must accept the Terms of Service and Privacy Policy.');
            return;
        }
        post('/register');
    }

    return (
        <AuthLayout title="Create Account">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-foreground mb-1">Create Account</h1>
                <p className="text-muted-foreground text-sm mb-6">Join MovieLandia24 for free today</p>

                {localError && (
                    <div className="mb-4 px-4 py-2.5 bg-destructive/20 border border-destructive/40 text-destructive-foreground rounded-lg text-sm">
                        {localError}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-3.5">
                    {/* Username */}
                    <div className="space-y-1.5">
                        <Label htmlFor="userName">Username</Label>
                        <div className="relative">
                            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="userName"
                                type="text"
                                value={data.userName}
                                onChange={(e) => setData('userName', e.target.value)}
                                className="pl-9"
                                placeholder="Username"
                                autoComplete="username"
                                required
                            />
                        </div>
                        {errors.userName && <p className="text-destructive text-xs">{errors.userName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="pl-9"
                                placeholder="Email"
                                autoComplete="email"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                    </div>

                    {/* Birthday */}
                    <div className="space-y-1.5">
                        <Label htmlFor="birthday">Birthday <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <div className="relative">
                            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="birthday"
                                type="date"
                                value={data.birthday}
                                onChange={(e) => setData('birthday', e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                            <SelectTrigger id="gender">
                                <Users size={15} className="text-muted-foreground mr-1" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <div className="relative">
                            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="pl-9"
                                placeholder="Phone Number"
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                        <Label htmlFor="countryFrom">Country <span className="text-muted-foreground font-normal">(optional)</span></Label>
                        <Select value={data.countryFrom} onValueChange={(v) => setData('countryFrom', v)}>
                            <SelectTrigger id="countryFrom">
                                <Globe size={15} className="text-muted-foreground mr-1" />
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="reg-password">Password</Label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="reg-password"
                                type={showPw ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-9 pr-10"
                                placeholder="Password"
                                autoComplete="new-password"
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

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                id="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                value={data.confirmPassword}
                                onChange={(e) => setData('confirmPassword', e.target.value)}
                                className="pl-9 pr-10"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowConfirm((v) => !v)}
                            >
                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                            </Button>
                        </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                        <div className="relative mt-0.5">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                agreed ? 'bg-primary border-primary' : 'bg-transparent border-border'
                            }`}>
                                {agreed && <span className="text-primary-foreground text-[10px] font-bold">âœ“</span>}
                            </div>
                        </div>
                        <span className="text-muted-foreground text-xs leading-relaxed">
                            I accept the{' '}
                            <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                        </span>
                    </label>

                    {/* Sign Up button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full gap-2 mt-1"
                    >
                        <ShieldCheck size={15} />
                        {processing ? 'Creating accountâ€¦' : 'Sign Up'}
                    </Button>
                </form>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-4">
                    <Separator className="flex-1" />
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">OR</span>
                    <Separator className="flex-1" />
                </div>

                {/* Google */}
                <Button type="button" variant="outline" className="w-full gap-3">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue With Google
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-5">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

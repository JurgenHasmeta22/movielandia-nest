import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff, Phone, Globe, Calendar, Users, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';

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

    const inputCls =
        'w-full bg-[#1e2a3a] border border-gray-700 rounded-lg py-3 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm';

    return (
        <AuthLayout title="Create Account">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
                <p className="text-gray-400 text-sm mb-6">Join MovieLandia24 for free today</p>

                {localError && (
                    <div className="mb-4 px-4 py-2.5 bg-red-900/40 border border-red-700 text-red-300 rounded-lg text-sm">
                        {localError}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-3.5">
                    {/* Username */}
                    <div>
                        <div className="relative">
                            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="text"
                                value={data.userName}
                                onChange={(e) => setData('userName', e.target.value)}
                                className={`${inputCls} pl-10`}
                                placeholder="Username"
                                autoComplete="username"
                                required
                            />
                        </div>
                        {errors.userName && <p className="text-red-400 text-xs mt-1">{errors.userName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`${inputCls} pl-10`}
                                placeholder="Email"
                                autoComplete="email"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Birthday */}
                    <div>
                        <div className="relative">
                            <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="date"
                                value={data.birthday}
                                onChange={(e) => setData('birthday', e.target.value)}
                                className={`${inputCls} pl-10 text-gray-400`}
                            />
                        </div>
                        <span className="text-gray-600 text-[10px] ml-1">Birthday (optional)</span>
                    </div>

                    {/* Gender */}
                    <div>
                        <div className="relative">
                            <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <select
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className={`${inputCls} pl-10 appearance-none cursor-pointer`}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={`${inputCls} pl-10`}
                                placeholder="Phone Number (optional)"
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div>
                        <div className="relative">
                            <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <select
                                value={data.countryFrom}
                                onChange={(e) => setData('countryFrom', e.target.value)}
                                className={`${inputCls} pl-10 appearance-none cursor-pointer`}
                            >
                                <option value="">Select Country (optional)</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`${inputCls} pl-10 pr-10`}
                                placeholder="Password"
                                autoComplete="new-password"
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

                    {/* Confirm Password */}
                    <div>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={data.confirmPassword}
                                onChange={(e) => setData('confirmPassword', e.target.value)}
                                className={`${inputCls} pl-10 pr-10`}
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
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
                                agreed ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-gray-600'
                            }`}>
                                {agreed && <span className="text-white text-[10px] font-bold">✓</span>}
                            </div>
                        </div>
                        <span className="text-gray-400 text-xs leading-relaxed">
                            I accept the{' '}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
                        </span>
                    </label>

                    {/* Sign Up button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors mt-1"
                    >
                        <ShieldCheck size={15} />
                        {processing ? 'Creating account…' : 'Sign Up'}
                    </button>
                </form>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                {/* Google */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-[#1e2a3a] border border-gray-700 hover:bg-[#253449] text-white font-medium py-3 rounded-lg transition-colors text-sm"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue With Google
                </button>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}


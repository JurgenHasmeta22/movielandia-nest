import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";

interface Credit {
    id: number;
    title: string;
    photoSrc?: string;
    releaseYear?: number;
    role?: string;
}

interface CrewMember {
    id: number;
    fullname: string;
    photoSrc?: string;
    description?: string;
    department?: string;
    movieCredits?: Credit[];
    serieCredits?: Credit[];
}

interface Props {
    member: CrewMember;
}

export default function CrewShow({ member }: Props) {
    const movieCredits = member.movieCredits ?? [];
    const serieCredits = member.serieCredits ?? [];

    const cardClass =
        'group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900';

    return (
        <AppLayout title={member.fullname}>
            <div className="space-y-10 max-w-6xl mx-auto px-4 py-8">
                <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={member.photoSrc
                            ? (member.photoSrc.startsWith('http') ? member.photoSrc : `/images/crew/${member.photoSrc}`)
                            : '/images/placeholder.jpg'}
                        alt={member.fullname}
                        className="w-52 h-72 rounded-2xl shadow-2xl object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                    />
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{member.fullname}</h1>
                        {member.department && (
                            <p className="inline-flex rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 text-sm font-medium mb-4">
                                {member.department}
                            </p>
                        )}
                        {member.description && (
                            <p className="text-gray-300 leading-relaxed max-w-3xl">{member.description}</p>
                        )}
                    </div>
                </div>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Movies</h2>
                        <span className="text-sm text-gray-400">{movieCredits.length} credits</span>
                    </div>
                    {movieCredits.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 px-4 py-6 text-center text-gray-400">
                            No movie credits available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {movieCredits.slice(0, 18).map((credit) => (
                                <Link key={credit.id} href={`/movies/${credit.id}`} className="group">
                                    <div className={cardClass}>
                                        <img
                                            src={credit.photoSrc ? `/images/movies/${credit.photoSrc}` : '/images/placeholder.jpg'}
                                            alt={credit.title}
                                            className="w-full aspect-[2/3] rounded-lg object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                        />
                                        <p className="mt-2 text-xs text-gray-300 group-hover:text-white truncate transition-colors">{credit.title}</p>
                                        {credit.role && <p className="text-[11px] text-gray-500 truncate">{credit.role}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Series</h2>
                        <span className="text-sm text-gray-400">{serieCredits.length} credits</span>
                    </div>
                    {serieCredits.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-gray-800 bg-gray-900/40 px-4 py-6 text-center text-gray-400">
                            No series credits available yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {serieCredits.slice(0, 18).map((credit) => (
                                <Link key={credit.id} href={`/series/${credit.id}`} className="group">
                                    <div className={cardClass}>
                                        <img
                                            src={credit.photoSrc ? `/images/series/${credit.photoSrc}` : '/images/placeholder.jpg'}
                                            alt={credit.title}
                                            className="w-full aspect-[2/3] rounded-lg object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                        />
                                        <p className="mt-2 text-xs text-gray-300 group-hover:text-white truncate transition-colors">{credit.title}</p>
                                        {credit.role && <p className="text-[11px] text-gray-500 truncate">{credit.role}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}

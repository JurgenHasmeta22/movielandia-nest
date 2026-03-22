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
    return (
        <AppLayout title={member.fullname}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex gap-8 mb-10">
                    <img
                        src={member.photoSrc ? `/images/crew/${member.photoSrc}` : '/images/placeholder.jpg'}
                        alt={member.fullname}
                        className="w-48 h-64 rounded-xl shadow-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                    />
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-1">{member.fullname}</h1>
                        {member.department && (
                            <p className="text-indigo-400 font-medium mb-3">{member.department}</p>
                        )}
                        {member.description && (
                            <p className="text-gray-300 leading-relaxed">{member.description}</p>
                        )}
                    </div>
                </div>

                {member.movieCredits && member.movieCredits.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">Movies</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {member.movieCredits.map((credit) => (
                                <Link key={credit.id} href={`/movies/${credit.id}`} className="group">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                        <img
                                            src={credit.photoSrc ? `/images/movies/${credit.photoSrc}` : '/images/placeholder.jpg'}
                                            alt={credit.title}
                                            className="w-full aspect-[2/3] object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                        />
                                        <div className="p-2">
                                            <p className="text-white text-sm font-medium truncate">{credit.title}</p>
                                            {credit.role && <p className="text-gray-400 text-xs truncate">{credit.role}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {member.serieCredits && member.serieCredits.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Series</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {member.serieCredits.map((credit) => (
                                <Link key={credit.id} href={`/series/${credit.id}`} className="group">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition">
                                        <img
                                            src={credit.photoSrc ? `/images/series/${credit.photoSrc}` : '/images/placeholder.jpg'}
                                            alt={credit.title}
                                            className="w-full aspect-[2/3] object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; }}
                                        />
                                        <div className="p-2">
                                            <p className="text-white text-sm font-medium truncate">{credit.title}</p>
                                            {credit.role && <p className="text-gray-400 text-xs truncate">{credit.role}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}

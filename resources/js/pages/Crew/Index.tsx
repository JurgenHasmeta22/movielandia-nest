import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import AppLayout from "../../layouts/AppLayout";
import { SortControls } from "../../components/SortControls";
import { PaginationBar } from "../../components/PaginationBar";
import type { Pagination, SortFilters } from "../../types/media";

interface CrewMember {
    id: number;
    fullname: string;
    photoSrc?: string | null;
    role?: string | null;
    department?: string | null;
}

const SORT_OPTIONS = [
    { value: "fullname", label: "Name" },
    { value: "role", label: "Role" },
];

function buildUrl(params: Record<string, string | number | undefined>) {
    const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&");
    return `/crew${qs ? `?${qs}` : ""}`;
}

function crewImgSrc(photoSrc: string | null | undefined): string {
    if (!photoSrc) return "/images/placeholder.jpg";
    if (photoSrc.startsWith("http://") || photoSrc.startsWith("https://")) return photoSrc;
    return `/images/crew/${photoSrc}`;
}

export default function CrewIndex({
    crew,
    pagination,
    filters = {},
}: {
    crew: CrewMember[];
    pagination: Pagination;
    filters?: SortFilters;
}) {
    const sortBy = filters.sortBy ?? "fullname";
    const ascOrDesc = filters.ascOrDesc ?? "asc";
    const perPage = filters.perPage ?? 12;

    const navigate = (overrides: Partial<SortFilters>) =>
        router.get("/crew", { sortBy, ascOrDesc, page: 1, perPage, ...overrides }, { preserveScroll: false });

    return (
        <AppLayout title="Crew">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-white">Crew</h1>
                    <SortControls
                        sortBy={sortBy}
                        ascOrDesc={ascOrDesc}
                        perPage={perPage}
                        sortOptions={SORT_OPTIONS}
                        onSortChange={(s) => navigate({ sortBy: s, ascOrDesc: s === sortBy && ascOrDesc === "asc" ? "desc" : "asc" })}
                        onOrderChange={(o) => navigate({ ascOrDesc: o })}
                        onPerPageChange={(p) => navigate({ perPage: Number(p) })}
                    />
                </div>

                {pagination?.total > 0 && (
                    <p className="text-gray-400 text-sm">{pagination.total.toLocaleString()} crew members</p>
                )}

                {crew.length === 0 ? (
                    <p className="text-gray-400 text-center py-16">No crew members found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-5">
                        {crew.map((member) => (
                            <Link key={member.id} href={`/crew/${member.id}`} className="group text-center">
                                <div className="aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden mb-2 group-hover:border-2 group-hover:border-indigo-500 transition-all">
                                    <img
                                        src={crewImgSrc(member.photoSrc)}
                                        alt={member.fullname}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg";
                                        }}
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                                    {member.fullname}
                                </h3>
                                {(member.role || member.department) && (
                                    <p className="text-xs text-gray-500 truncate">{member.role ?? member.department}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}

                <PaginationBar
                    pagination={pagination}
                    urlBuilder={(p) => buildUrl({ sortBy, ascOrDesc, page: p, perPage })}
                />
            </div>
        </AppLayout>
    );
}

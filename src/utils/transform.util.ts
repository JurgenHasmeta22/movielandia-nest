export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function parseRuntime(runtime: number): string {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + "...";
}

export function generateUniqueSlug(title: string, existingSlugs: string[]): string {
    let slug = slugify(title);
    let counter = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${slugify(title)}-${counter}`;
        counter++;
    }

    return slug;
}

export function formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

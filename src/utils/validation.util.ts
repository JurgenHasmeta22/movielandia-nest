export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
export const IMDB_ID_REGEX = /^tt\d{7,8}$/;

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= 1888 && year <= currentYear + 5;
}

export function isValidDuration(minutes: number): boolean {
    return minutes > 0 && minutes < 1000;
}

export function isValidRating(rating: number): boolean {
    return rating >= 0 && rating <= 10;
}

export function sanitizeSearchString(search: string): string {
    return search.trim().replace(/[<>]/g, "");
}

export function validateImageUrl(url: string): boolean {
    const imageRegex = /\.(jpg|jpeg|png|webp|avif)$/i;
    return imageRegex.test(url);
}

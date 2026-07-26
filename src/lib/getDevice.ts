export function getDevice(userAgent: string): string {
    if (/iPhone/i.test(userAgent)) {
        return "iPhone";
    }

    if (/iPad/i.test(userAgent)) {
        return "iPad";
    }

    if (/Android/i.test(userAgent)) {
        return "Android Device";
    }

    if (/Windows NT/i.test(userAgent)) {
        return "Windows PC";
    }

    if (/Macintosh/i.test(userAgent)) {
        return "Mac";
    }

    if (/Linux/i.test(userAgent)) {
        return "Linux PC";
    }

    return "Unknown";
}
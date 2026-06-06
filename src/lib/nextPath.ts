
export function isSafeNext(path: string) {
    if (!path) return false;

    // must be relative internal path
    if (!path.startsWith("/")) return false;

    // block protocol-relative and absolute URLs
    if (path.startsWith("//")) return false;
    if (path.includes("://")) return false;

    return true;
}
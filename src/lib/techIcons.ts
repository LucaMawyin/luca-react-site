import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

export function getTechIcon(name: string): SimpleIcon | undefined {
    const normalized = name.toLowerCase().trim();

    return Object.values(icons).find((icon) => {
        if (!icon || typeof icon !== "object" || !("title" in icon)) {
            return false;
        }

        const simpleIcon = icon as SimpleIcon;

        return (
            simpleIcon.title.toLowerCase() === normalized ||
            simpleIcon.slug.toLowerCase() === normalized
        );
    }) as SimpleIcon | undefined;
}
import { unstable_cache } from "next/cache";
import { getDB } from "./db";

export const getTags = (type:string) => unstable_cache(
    async () => {
        const db = await getDB();

        const result = await db
            .prepare(`SELECT * FROM tags where category = ?`)
            .bind(type)
            .all();

        return result.results;
    },
    [`tags:${type}`],
    {
        tags: [`tags:${type}`],
    }
)();

export function shadow(hex: string): {
    glowColour: string;
    glowRGB: string;
    borderColour: string;
} {
    if (hex === "#000000") {
        return {
            glowColour: "",
            glowRGB: "#000000",
            borderColour: "#000000",
        };
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Slightly darker border
    const borderFactor = 0.85;

    const borderColour = `#${[
        Math.round(r * borderFactor),
        Math.round(g * borderFactor),
        Math.round(b * borderFactor),
    ]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")}`;


    // Convert RGB to HSL for stronger glow
    let rH = r / 255;
    let gH = g / 255;
    let bH = b / 255;

    const max = Math.max(rH, gH, bH);
    const min = Math.min(rH, gH, bH);

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {
            case rH:
                h = (gH - bH) / d + (gH < bH ? 6 : 0);
                break;
            case gH:
                h = (bH - rH) / d + 2;
                break;
            case bH:
                h = (rH - gH) / d + 4;
                break;
        }

        h /= 6;
    }

    // Darker + more saturated glow
    l = Math.max(0, l * 0.30);
    s = Math.min(1, s * 1.4);

    const hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let r2: number;
    let g2: number;
    let b2: number;

    if (s === 0) {
        r2 = g2 = b2 = l;
    } else {
        const q = l < 0.5
            ? l * (1 + s)
            : l + s - l * s;

        const p = 2 * l - q;

        r2 = hueToRgb(p, q, h + 1 / 3);
        g2 = hueToRgb(p, q, h);
        b2 = hueToRgb(p, q, h - 1 / 3);
    }

    return {
        glowColour: `rgb(${Math.round(r2 * 255)}, ${Math.round(g2 * 255)}, ${Math.round(b2 * 255)})`,
        glowRGB: `${Math.round(r2 * 255)}, ${Math.round(g2 * 255)}, ${Math.round(b2 * 255)}`,
        borderColour,
    };
}
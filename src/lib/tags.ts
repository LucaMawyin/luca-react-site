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
        revalidate: false,
        tags: [`tags:${type}`],
    }
)();


export function getTagStyle(tag?: string) {
    switch (tag?.toLowerCase()) {
        case "live":
            return {
                className: "bg-green-100 text-green-700 border-green-200",
                glow: "22, 163, 74"
            };

        case "in progress":
            return {
                className: "bg-yellow-100 text-yellow-800 border-yellow-300",
                glow: "202, 138, 4"
            };

        case "hackathon":
            return {
                className: "bg-purple-100 text-purple-700 border-purple-200",
                glow: "147, 51, 234"
            };

        case "winner":
            return {
                className: "bg-amber-100 text-amber-800 border-amber-300",
                glow: "217, 119, 6"
            };

        case "tool":
            return {
                className: "bg-blue-100 text-blue-700 border-blue-200",
                glow: "37, 99, 235"
            };

        case "game":
            return {
                className: "bg-indigo-100 text-indigo-700 border-indigo-200",
                glow: "79, 70, 229"
            };

        case "fullstack":
            return {
                className: "bg-cyan-100 text-cyan-700 border-cyan-200",
                glow: "8, 145, 178"
            };

        case "web":
            return {
                className: "bg-sky-100 text-sky-700 border-sky-200",
                glow: "2, 132, 199"
            };

        case "ai":
            return {
                className: "bg-violet-100 text-violet-700 border-violet-200",
                glow: "124, 58, 237"
            };

        default:
            return {
                className: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
                glow: "192, 38, 211"
            };
    }
}
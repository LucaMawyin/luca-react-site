export function getTagStyle(tag?: string) {
    switch (tag?.toLowerCase()) {

        case "live":
            return "bg-green-100 text-green-700 border-green-200";

        case "in progress":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";

        case "hackathon":
            return "bg-purple-100 text-purple-700 border-purple-200";

        case "winner":
            return "bg-amber-100 text-amber-800 border-amber-300";

        case "tool":
            return "bg-blue-100 text-blue-700 border-blue-200";

        case "game":
            return "bg-indigo-100 text-indigo-700 border-indigo-200";

        case "fullstack":
            return "bg-cyan-100 text-cyan-700 border-cyan-200";

        case "web":
            return "bg-sky-100 text-sky-700 border-sky-200";

        case "ai":
            return "bg-violet-100 text-violet-700 border-violet-200";

        default:
            return "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200";
    }
}

export const tagOptions = [
    "",
    "Live",
    "In Progress",
    "Hackathon",
    "Winner",
    "Tool",
    "Game",
    "Fullstack",
    "Web",
    "AI",
];

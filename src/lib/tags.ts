export function getTagStyle(tag?: string) {
    switch (tag?.toLowerCase()) {

        case "in progress":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";

        case "live":
            return "bg-green-100 text-green-700 border-green-200";

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
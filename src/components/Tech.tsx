"use client";

import Tile from "./Tile";

export default function Tech() {
    const languages = [
        "TypeScript",
        "JavaScript",
        "Python",
        "Java",
        "C",
        "PHP",
        "Go",
        "Haskell"
    ];

    const libraries = [
        "React",
        "Next.js",
        "Node.js",
        "Tailwind CSS",
        "OpenCV",
        "PyTorch",
        "MediaPipe"
    ];

    const tools = [
        "Git",
        "Linux",
        "CVAT",
        "MySQL",
        "SQLite",
        "Cloudflare D1",
        "Cloudflare Workers",
        "Cloudflare Pages",
        "Resend API",
        "YouTube Data API",
        "IPInfo API"
    ];

    const sections = [
        { title: "Languages", items: languages },
        { title: "Libraries & Frameworks", items: libraries },
        { title: "Tools", items: tools }
    ];

    return (
        <div
            id="tech"
            className="
                w-full
                flex flex-col
                flex-1
                items-center
                text-center
            "
        >
            <h1 className="mb-8">Tech I Use</h1>

            <div className="
                px-[10%]
                grid
                grid-cols-1 md:grid-cols-3
                gap-6
                items-stretch
                auto-rows-fr
            ">
                {sections.map((section) => (
                    <Tile
                        key={section.title}
                        title={section.title}
                        className="
                            text-center
                            items-center
                            justify-evenly
                            min-w-full
                            max-w-full
                            p-[2.5%]!
                        "
                        titleClassName="text-[2em]! w-full"
                        childClassName="mt-0!"
                        disableHover={true}
                    >
                        <div className="
                            flex flex-wrap
                            justify-center
                            gap-2
                            mt-4
                        ">
                            {section.items.map((item) => (
                                <span
                                    key={item}
                                    className="
                                        px-3 py-1
                                        border border-black/20
                                        rounded-full
                                        text-sm
                                    "
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </Tile>
                ))}
            </div>
        </div>
    );
}
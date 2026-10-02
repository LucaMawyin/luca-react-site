"use client";

import { Tech } from "@/lib/types";
import FadeInOnView from "./FadeInOnView";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Badge from "./Badge";
import { useEffect, useState } from "react";

export default function TechStack(props: {
    isLoggedIn: boolean;
    tech: Tech[];
}) {

    const [highlighted, setHighlighted] = useState<Record<string, string>>({});

    useEffect(() => {
        const grouped = props.tech.reduce(
            (acc: Record<string, string[]>, item) => {
                acc[item.category] ??= [];
                acc[item.category].push(item.name);
                return acc;
            },
            {}
        );

        const categories = [
            "languages",
            "libraries",
            "tools",
        ].filter((category) => grouped[category]?.length);

        const updateHighlight = () => {
            if (!categories.length) return;

            // Pick a random section
            const category =
                categories[Math.floor(Math.random() * categories.length)];

            const items = grouped[category];

            // Pick a random technology from that section
            const item =
                items[Math.floor(Math.random() * items.length)];

            // Only update the selected section
            setHighlighted((current) => ({
                ...current,
                [category]: item,
            }));
        };

        // Pick an initial technology for every section
        setHighlighted(() => {
            const initial: Record<string, string> = {};

            categories.forEach((category) => {
                const items = grouped[category];

                initial[category] =
                    items[Math.floor(Math.random() * items.length)];
            });

            return initial;
        });

        const interval = setInterval(updateHighlight, 2000);

        return () => clearInterval(interval);
    }, [props.tech]);

    const grouped = props.tech.reduce(
        (acc: Record<string, string[]>, item) => {
            acc[item.category] ??= [];
            acc[item.category].push(item.name);
            return acc;
        },
        {}
    );

    const sections = [
        { key: "languages", title: "Languages" },
        { key: "libraries", title: "Libraries & Frameworks" },
        { key: "tools", title: "Tools" },
    ];

    const router = useRouter();

    return (
        <div
            id="tech"
            className="
                w-full
                flex flex-col
                items-center
                text-center
            "
        >
            <FadeInOnView>
                <h1>
                    Tech I Use
                </h1>
                {props.isLoggedIn && 
                    <div className="
                        flex 
                        w-full
                        justify-center
                        p-4 sm:p-0
                    ">
                        <Button
                            text="Edit"
                            onClick={() => router.push("/edit-tech")}
                        />        
                    </div>
                }
            </FadeInOnView>
            

            <div
                className="
                    w-full
                    max-w-7xl
                    px-[5%]
                    flex flex-col
                "
            >
                {sections.map((section, index) => {
                    const items = [...(grouped[section.key] ?? [])].sort();

                    return (
                        <FadeInOnView
                            key={section.key}
                        >
                            <div
                                className={`
                                    py-8
                                    ${index !== 0 ? "border-t border-gray-200" : ""}
                                `}
                            >
                                
                                <div
                                    className="
                                        flex
                                        flex-col
                                        md:flex-row
                                        md:items-start
                                        gap-5
                                    "
                                >

                                    {/* TITLE */}
                                    <div
                                        className="
                                            md:w-56
                                            shrink-0
                                            text-left
                                        "
                                    >
                                        <h2
                                            className="
                                                text-2xl
                                                font-semibold
                                            "
                                        >
                                            {section.title}
                                        </h2>

                                        <span
                                            className="
                                                text-sm
                                                text-gray-400
                                            "
                                        >
                                            {items.length} technologies
                                        </span>
                                    </div>

                                    {/* BADGES */}
                                    <div
                                        className="
                                            flex-1
                                            flex
                                            flex-wrap
                                            gap-2
                                            justify-start
                                        "
                                    >
                                        {items.map((item) => {
                                            const isHighlighted = highlighted[section.key] === item;

                                            const initials = item
                                                .split(/[\s.+#-]+/)
                                                .filter(Boolean)
                                                .map((word) => word[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase();

                                            return (
                                                <Badge
                                                    key={item}
                                                    textSize="sm"
                                                    borderRadius="xl"
                                                    shadow={`${isHighlighted ? "md" : "none"}`}
                                                    fontWeight={`${isHighlighted ? "semibold" : "normal"}`}
                                                    px={2}
                                                    className={`
                                                        bg-white
                                                        border
                                                        transition-all
                                                        duration-500

                                                        ${
                                                            isHighlighted
                                                                ? `
                                                                    border-gray-400
                                                                    -translate-y-1
                                                                `
                                                                : `
                                                                    border-gray-300
                                                                `
                                                        }
                                                    `}

                                                    text={item}
                                                >
                                                    <div
                                                        className="
                                                            flex items-center justify-center
                                                            w-6 h-6
                                                            rounded-md
                                                            bg-gray-100
                                                            text-[10px]
                                                            font-semibold
                                                            text-gray-500
                                                        "
                                                    >
                                                        {initials}
                                                    </div>
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </FadeInOnView>
                    );
                })}
            </div>
        </div>
    );
}
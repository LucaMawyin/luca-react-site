"use client";

import { Tech } from "@/lib/types";
import FadeInOnView from "./FadeInOnView";
import Tile from "./Tile";

export default function TechStack(props : {
    isLoggedIn : boolean,
    tech : Tech[]
  }) {

    const grouped = props.tech.reduce((acc: Record<string, string[]>, item) => {
        acc[item.category] ??= [];
        acc[item.category].push(item.name);
        return acc;
    }, {});

    const sections = [
        { title: "Languages", items: grouped.languages || [] },
        { title: "Libraries & Frameworks", items: grouped.libraries || [] },
        { title: "Tools", items: grouped.tools || [] }
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
                    <FadeInOnView
                        key={section.title}
                    >
                        <Tile
                            title={section.title}
                            className="
                                text-center
                                items-center
                                justify-evenly
                                min-w-full
                                max-w-full
                                h-full
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
                    </FadeInOnView>

                ))}
            </div>
        </div>
    );
}
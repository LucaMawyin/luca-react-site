"use client";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { Tech } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTechClient(props : {
    tech : Tech[];
    referrer ?: string | null;
}) {

    const grouped = props.tech.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item.name);
        return acc;
    }, {} as Record<string, string[]>);

    const [form, setForm] = useState({
        languages: grouped.languages?.join(",") ?? "",
        libraries: grouped.libraries?.join(",") ?? "",
        tools: grouped.tools?.join(",") ?? ""
    });

    const [nextPage, setNextPage] = useState<string | null>(() => {
        if (typeof window === "undefined") return props.referrer ?? null;

        return sessionStorage.getItem("nextPage") ?? props.referrer ?? null;
    });

    // Auto capitalize project name, tools and languages
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        const shouldCapitalize =
            name === "tools" ||
            name === "languages" || 
            name === "libraries";

        setForm({
            ...form,
            [name]: shouldCapitalize
                ? capitalizeNamesAndTitles(value)
                : value,
        });
        
        if (e.target instanceof HTMLTextAreaElement) {
            const el = e.target;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };

    const handleSubmit = async () => {
        const res = await fetch("/api/tech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            router.refresh();
            router.push(nextPage ?? "/tech");
        }
    };

    const router = useRouter();

    useEffect(() => {
        const textareas = document.querySelectorAll("textarea");
            textareas.forEach((ta) => {
                ta.style.height = "auto";
                ta.style.height = ta.scrollHeight + "px";
            }
        );
    }, []);

    return (
        <div className="flex justify-center min-h-[90vh]">
            <div className="flex flex-col md:w-[40%] w-full max-w-full justify-center mt-[10vh]">
                <Link href={nextPage ?? "/tech"} className="self-start pt-4 pb-4 pl-6 md:pl-0">&lt; Return </Link>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <Tile
                        title="Edit Tech"
                        disableHover={true}
                        className="max-w-full sm:max-h-fit"
                        childClassName="mt-0! flex-1 gap-8"
                    >
                    
                        <div className="flex flex-col">
                            <label htmlFor="languages">Languages</label>
                            <textarea
                                name="languages"
                                placeholder="Languages"
                                value={form.languages}
                                rows={1}
                                style={{
                                    overflow: "hidden",
                                    resize: "none",
                                }}
                                onChange={handleChange}
                            />                        
                        </div>
                        
                        <div className="flex flex-col">
                            <label htmlFor="libraries">Libraries</label>
                            <textarea
                                name="libraries"
                                placeholder="Libraries"
                                value={form.libraries}
                                rows={1}
                                style={{
                                    overflow: "hidden",
                                    resize: "none",
                                }}
                                onChange={handleChange}
                            />                        
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="tools">Tools</label>
                            <textarea
                                name="tools"
                                placeholder="Tools"
                                value={form.tools}
                                rows={1}
                                style={{
                                    overflow: "hidden",
                                    resize: "none",
                                }}
                                onChange={handleChange}
                            />                        
                        </div>

                        {/* Button container */}
                        <div className="
                            flex 
                            flex-col 
                            gap-2
                            sm:flex-row justify-between
                        ">
                            <Button
                                text="Post" 
                                type="submit" 
                                name="mode"
                                className="w-full sm:w-48"
                            />

                            <Button
                                text="Cancel"
                                type="reset"
                                variant="secondary"
                                className="w-full sm:w-48"
                                onClick={() => {
                                    router.push(props.referrer ?? "/tech");
                                }}
                            />                            
                        </div>                        
                    </Tile>
                </form>
            </div>                
        </div>

    );
}
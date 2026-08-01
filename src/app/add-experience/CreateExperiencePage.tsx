"use client";

import { useRef, useState } from "react";
import Tile from "@/components/Tile";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginResponse, Tag } from "@/lib/types";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { ensurePunctuation } from "@/lib/ensurePunctuation";
import { useEffect } from "react";
import DeleteButton from "@/components/DeleteButton";

export default function CreateExperiencePage(props : {
    initialData? : any;
    tags : Tag[];
    referrer ?: string | null;
}) {

    const router = useRouter();

    const safeString = (v: any) => (v ?? "").toString();

    // Initial form data
    const [form, setForm] = useState({
        title: safeString(props.initialData?.title),
        description: safeString(props.initialData?.description),
        company: safeString(props.initialData?.company),
        city: safeString(props.initialData?.city),
        region:safeString(props.initialData?.region),
        tag: safeString(props.initialData?.tag),
        start_date: safeString(props.initialData?.start_date),
        end_date: safeString(props.initialData?.end_date),
    });

    const currentDate = new Date();
    const currentYear = String(currentDate.getFullYear());
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

    const startDate = form.start_date || `${currentYear}${currentMonth}`;
    const startYear =
        startDate.length >= 4 ? startDate.slice(0, 4) : new Date().getFullYear().toString();
    const startMonth =
        startDate.length >= 6 ? startDate.slice(4, 6) : "01";

    const endDate = form.end_date || "";
    const endYear = endDate.length >= 4 ? endDate.slice(0, 4) : "";
    const endMonth = endDate.length >= 6 ? endDate.slice(4, 6) : "01";

    const [customTag, setCustomTag] = useState("");
    const [useCustomTag, setUseCustomTag] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [fadeOut, setFadeOut] = useState(false);

    const [nextPage, setNextPage] = useState<string | null>(() => {
        if (typeof window === "undefined") return props.referrer ?? null;

        return sessionStorage.getItem("nextPage") ?? props.referrer ?? null;
    });
    console.log(nextPage);


    // Auto resize text area on load
    useEffect(() => {
        const textareas = document.querySelectorAll("textarea");
            textareas.forEach((ta) => {
                ta.style.height = "auto";
                ta.style.height = ta.scrollHeight + "px";
            }
        );
    }, []);

    // Auto capitalize project title, company, city, region
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        const shouldCapitalize =
            name === "title" ||
            name === "company" ||
            name === "region" || 
            name === "city";

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

    // Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();

        const formData = new FormData();

        // If we already have an id we will add it to form
        if (props.initialData?.id) {
            formData.append("id", props.initialData.id);
        }

        const start_date =
            form.start_date && form.start_date.length === 6
                ? form.start_date
                : `${startDate}${startMonth}`;

        const end_date =
            form.end_date && form.end_date.length === 6
                ? form.end_date
                : "";


        // Append form data
        formData.append("title", form.title);
        formData.append("company", form.company);
        formData.append("description", form.description);
        formData.append("tag", form.tag);
        formData.append("city", form.city);
        formData.append("region", form.region);
        formData.append("start_date", start_date);
        formData.append("end_date", end_date);


        const res = await fetch("/api/experience", {
            method: "POST",
            body: formData,
        });

        // Reset form
        if (res.ok) {

            setForm({
                title: "",
                company:"",
                description: "",
                tag:"",
                city:"",
                region:"",
                start_date : "",
                end_date : "",
            });

            setError(null);

            router.refresh();
            router.push(nextPage ?? "/experience");
        } 

        // Unauthorized redirect to login
        else if (res.status == 401){
            setError(null);
            router.push("/login");
        }

        // Submission error
        else {
            const data = await res.json() as LoginResponse;
            setFadeOut(false);
            setError(data.error || "Failed to add experience");

            requestAnimationFrame(() => {
                setTimeout(() => {
                    setFadeOut(true);
                }, 2000);

                setTimeout(() => {
                    setError(null);
                    setFadeOut(false);
                }, 3000);
            });
        }
    };

    return (
        <div className="flex justify-center min-h-[90vh]">
            <div className="flex flex-col md:w-[40%] w-full max-w-full justify-center mt-[10vh]">
                <Link href={nextPage ?? "/experience"} className="self-start pt-4 pb-4 pl-6 md:pl-0">&lt; Return </Link>
                <Tile 
                    title="Add Experience"
                    disableHover={true}
                    className=" max-w-full"
                >
                    <form 
                        onSubmit={handleSubmit}             
                        className="
                            w-full
                            flex flex-col
                            justify-center
                            gap-3
                        "
                    >

                        {/* Name, description, link, languages, tools */}
                        <label htmlFor="title">Experience Title</label>
                        <input
                            name="title"
                            placeholder="Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="company">Experience Title</label>
                        <input
                            name="company"
                            placeholder="Company"
                            value={form.company}
                            onChange={handleChange}
                            required
                        />
                        
                        <label htmlFor="description">Experience Description</label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            rows={1}
                            style={{
                                overflow: "hidden",
                                resize: "none",
                            }}
                            onChange={handleChange}
                            onBlur={(e) => {
                                setForm({
                                    ...form,
                                    description: ensurePunctuation(e.target.value),
                                });
                            }}
                            required
                        />

                        <label htmlFor="start_date">Start Date</label>
                        <div className="flex gap-2">
                            {/* Month */}
                            <select
                                value={Number(startMonth) - 1}
                                onChange={(e) => {
                                    const m = String(Number(e.target.value) + 1).padStart(2, "0");

                                    setForm((prev) => ({
                                        ...prev,
                                        start_date: `${startYear}${m}`,
                                    }));
                                }}
                            >
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(0, i).toLocaleString("en", { month: "long" })}
                                    </option>
                                ))}
                            </select>

                            {/* Year */}
                            <select
                                value={startYear}
                                onChange={(e) => {
                                    const y = e.target.value;

                                    setForm((prev) => ({
                                        ...prev,
                                        start_date: `${y}${startMonth}`,
                                    }));
                                }}
                            >
                                
                                {Array.from({ length: 50 }).map((_, i) => {
                                    const y = new Date().getFullYear() - i;
                                    return (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <label htmlFor="end_date">End Date</label>
                        <div className="flex gap-2">
                            {/* Month */}
                            <select
                                disabled={!form.end_date}
                                value={!form.end_date ? "" : Number(endMonth) - 1}
                                onChange={(e) => {
                                    const m = String(Number(e.target.value) + 1).padStart(2, "0");

                                    setForm((prev) => ({
                                        ...prev,
                                        end_date: `${endYear}${m}`,
                                    }));
                                }}
                            >
                                <option value="">Present</option>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(0, i).toLocaleString("en", { month: "long" })}
                                    </option>
                                ))}
                            </select>

                            {/* Year */}
                            <select
                                value={endYear}
                                onChange={(e) => {
                                    const y = e.target.value;

                                    setForm((prev) => ({
                                        ...prev,
                                        end_date: y ? `${y}${endMonth}` : "",
                                    }));
                                }}
                            >
                                <option value="">Present</option>
                                {Array.from({ length: 50 }).map((_, i) => {
                                    const y = new Date().getFullYear() - i;
                                    return (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>


                        <label htmlFor="city">Company City</label>
                        <input
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="region">Company Region</label>
                        <input
                            name="region"
                            placeholder="Region"
                            value={form.region}
                            onChange={handleChange}
                            required
                        />


                        {/* EXPERIENCE TAGS */}
                        <label htmlFor="tag">Tag</label>
                        <div className="flex items-center justify-between gap-2">
                        <select
                            name="tag"
                            className="flex-1"
                            value={form.tag}
                                onChange={(e) => {
                                    if (e.target.value === "custom") {
                                        setUseCustomTag(true);
                                        setForm({ ...form, tag: "" });
                                    } else {
                                        setUseCustomTag(false);
                                        setForm({ ...form, tag: e.target.value });
                                    }
                                }}
                        >

                            {props.tags.map((tag) => (
                                <option key={tag.id} value={tag.name}>
                                    {tag.name === "" ? "No tag" : tag.name}
                                </option>
                            ))}

                            <option value="custom">Add new tag</option>
                        </select>

                        <DeleteButton
                            disabled={
                                !form.tag ||
                                useCustomTag || 
                                props.tags.find(tag => tag.name === form.tag)?.builtin
                            }
                            text="Tag"
                            className="flex py-2! px-4! min-h-fit"
                            action={async () => {
                                if (!form.tag) return;

                                await fetch("/api/tags", {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ 
                                        name: form.tag,
                                        category: "experience",
                                    }),
                                });

                                setForm((prev) => ({ ...prev, tag: "" }));
                                router.refresh();
                            }}
                        />
                        </div>
                        {useCustomTag && (
                            <input
                                placeholder="Add New Tag"
                                value={capitalizeNamesAndTitles(customTag)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCustomTag(value);
                                    setForm({ ...form, tag: value });
                                }}
                                required
                            />
                        )}

                        {/* Error messages */}
                        <div className="h-5">
                            {error && (
                                <p
                                className={`
                                    text-red-500 
                                    text-sm 
                                    transition-opacity 
                                    duration-500 
                                    text-center
                                    ${fadeOut ? "opacity-0" : "opacity-100"}
                                `}
                                >
                                {error}
                                </p>
                            )}
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
                                    router.push(props.referrer ?? "/experience");
                                }}
                            />                            
                        </div>


                    </form>
                </Tile>                
            </div>
            
        </div>

    );
}
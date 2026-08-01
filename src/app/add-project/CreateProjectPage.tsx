"use client";

import { useRef, useState } from "react";
import resizeImage from "@/lib/resizeImage";
import Tile from "@/components/Tile";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginResponse, Tag } from "@/lib/types";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { ensurePunctuation } from "@/lib/ensurePunctuation";
import { useEffect } from "react";
import { normalizeArray } from "@/lib/normalizeJSON";
import DeleteButton from "@/components/DeleteButton";

export default function CreateProjectPage(props : {
    initialData? : any;
    tags : Tag[];
    statuses : Tag[];
    referrer ?: string | null;
}) {

    // Max image size is 200KB
    const MAX_SIZE = 0.2 * 1024 * 1024;

    const router = useRouter();

    const safeString = (v: any) => (v ?? "").toString();

    // Initial form data
    const [form, setForm] = useState({
        name: safeString(props.initialData?.name),
        description: safeString(props.initialData?.description),
        link: safeString(props.initialData?.link),
        languages: safeString(normalizeArray(props.initialData?.languages)),
        tools: safeString(normalizeArray(props.initialData?.tools)),
        libraries: safeString(normalizeArray(props.initialData?.libraries)),
        tag: safeString(props.initialData?.tag),
        colour: safeString(props.initialData?.colour),
        status: safeString(props.initialData?.status),
        status_colour: safeString(props.initialData?.status_colour),
        pinned: !!props.initialData?.pinned,
        hidden: !!props.initialData?.hidden,
    });

    // Custom tag
    const [ customTag, setCustomTag ] = useState("");
    const [ useCustomTag, setUseCustomTag ] = useState(false);

    // Custom Status
    const [ customStatus, setCustomStatus ] = useState("");
    const [ useCustomStatus, setUseCustomStatus ] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const [ imageFile, setImageFile ] = useState<File | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ preview, setPreview ] = useState<string | null>(null);
    const [ fadeOut, setFadeOut ] = useState(false);

    const [nextPage, setNextPage] = useState<string | null>(() => {
        if (typeof window === "undefined") return props.referrer ?? null;

        return sessionStorage.getItem("nextPage") ?? props.referrer ?? null;
    });

    // Setting data if loading a draft that exists
    useEffect(() => {
        if (!props.initialData) return;
        
        setPreview(props.initialData.imageUrl ?? null);
        
    }, [props.initialData]); 

    // Auto resize text area on load
    useEffect(() => {
        const textareas = document.querySelectorAll("textarea");
            textareas.forEach((ta) => {
                ta.style.height = "auto";
                ta.style.height = ta.scrollHeight + "px";
            }
        );
    }, []);

    const updateNextPage = (page: string | null) => {
        setNextPage(page);

        if (page) {
            sessionStorage.setItem("nextPage", page);
        } else {
            sessionStorage.removeItem("nextPage");
        }
    };

    // Auto capitalize project name, tools and languages
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        const shouldCapitalize =
            name === "name" ||
            name === "tools" ||
            name === "languages" || 
            name === "libraries";

        const formattedValue = shouldCapitalize
            ? capitalizeNamesAndTitles(value.replace(/\s{2,}/g, ", "))
            : value;

        setForm({
            ...form,
            [name]: formattedValue,
        });
        
        if (e.target instanceof HTMLTextAreaElement) {
            const el = e.target;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };
  
    // Image select
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const file = e.target.files?.[0];
        if (!file) return;

        // Resize image until it's under the max size
        let finalFile = await resizeImage(file);
        while (finalFile.size > MAX_SIZE) {
            finalFile = await resizeImage(finalFile);
        }

        setError(null);
        setImageFile(finalFile);
        setPreview(URL.createObjectURL(finalFile));
    };

    // Image drop
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;

        // Resize image until it's under the max size
        let finalFile = await resizeImage(file);
        while (finalFile.size > MAX_SIZE) {
            finalFile = await resizeImage(finalFile);
        }

        setError(null);
        setImageFile(finalFile);
        setPreview(URL.createObjectURL(finalFile));
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();

        // No image file and no id means there is no image
        if (!imageFile && !props.initialData?.id) {
            setError("Please upload an image");
            setFadeOut(false);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    setFadeOut(true);
                }, 2000);

                setTimeout(() => {
                    setError(null);
                    setFadeOut(false);
                }, 3000);
            });
            return;
        }

        const formData = new FormData();

        // If we already have an id we will add it to form
        if (props.initialData?.id) {
            formData.append("id", props.initialData.id);
        }

        // Append form data
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("link", form.link);
        formData.append("languages", form.languages);
        formData.append("tools", form.tools);
        formData.append("libraries", form.libraries);
        formData.append("tag", form.tag);
        formData.append("colour", form.colour);
        formData.append("status", form.status);
        formData.append("status_colour", form.status_colour);
        formData.append("pinned", form.pinned ? "1" : "0");
        formData.append("hidden", form.hidden ? "1" : "0");
        if (imageFile){
            formData.append("image", imageFile);
            formData.append("imageType", imageFile.type);            
        }

        const res = await fetch("/api/projects", {
            method: "POST",
            body: formData,
        });

        // Reset form
        if (res.ok) {

            setForm({
                name: "",
                description: "",
                link: "",
                languages: "",
                tools: "",
                libraries:"",
                tag:"",
                colour:"",
                status:"",
                status_colour:"",
                pinned:false,
                hidden:false,
            });

            setImageFile(null);
            setPreview(null);
            setError(null);

            router.refresh();
            router.push(nextPage ?? "/projects");
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
            setError(data.error || "Failed to add project");

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
                <Link href={nextPage ?? "/projects"} className="self-start pt-4 pb-4 pl-6 md:pl-0">&lt; Return </Link>
                <Tile 
                    title="Add Project"
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
                        <label htmlFor="name">Project Name</label>
                        <textarea
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            rows={1}
                            style={{
                                overflow: "hidden",
                                resize: "none",
                            }}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                        />
                        
                        <label htmlFor="description">Project Description</label>
                        <textarea
                            id="description"
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

                        <label htmlFor="link">Project Link</label>
                        <input
                            id="link"
                            name="link"
                            type="url"
                            placeholder="Link"
                            value={form.link}
                            onChange={handleChange}
                        />

                        <label htmlFor="languages">Languages Used</label>
                        <textarea
                            id="languages"
                            name="languages"
                            placeholder="Languages (comma separated)"
                            value={form.languages}
                            rows={1}
                            style={{
                                overflow: "hidden",
                                resize: "none",
                            }}
                            onChange={handleChange}
                        />

                        <label htmlFor="libraries">Libraries Used</label>
                        <textarea
                            id="libraries"
                            name="libraries"
                            placeholder="Libraries (comma separated)"
                            value={form.libraries}
                            rows={1}
                            style={{
                                overflow: "hidden",
                                resize: "none",
                            }}
                            onChange={handleChange}
                        />

                        <label htmlFor="tools">Tools Used</label>
                        <textarea
                            id="tools"
                            name="tools"
                            placeholder="Tools (comma separated)"
                            value={form.tools}
                            rows={1}
                            style={{
                                overflow: "hidden",
                                resize: "none",
                            }}
                            onChange={handleChange}
                        />

                        {/* PROJECT TAGS */}
                        <label htmlFor="tag">Tag</label>
                        <div className="flex items-center justify-between gap-2">
                            <select
                                id="tag"
                                name="tag"
                                className="flex-1"
                                value={form.tag}
                                    onChange={(e) => {
                                        const selectedTag = props.tags.find(tag => tag.name === e.target.value);
                                        if (e.target.value === "custom") {
                                            setUseCustomTag(true);
                                            setForm({ 
                                                ...form, 
                                                tag: "",
                                                colour: "#FAE8FF"
                                            });
                                        } else {
                                            setUseCustomTag(false);
                                            setForm({ 
                                                ...form, 
                                                tag: e.target.value,
                                                colour: selectedTag?.colour || form.colour
                                            });
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
                                className="flex py-0! px-2! min-h-fit"
                                action={async () => {
                                    if (!form.tag) return;

                                    await fetch("/api/tags", {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ 
                                            name: form.tag,
                                            category: "project",
                                        }),
                                    });

                                    setForm((prev) => ({ ...prev, tag: "" }));
                                    router.refresh();
                                }}
                            />
                        </div>
                        {useCustomTag && (
                            <>
                                <input
                                    id="tag"
                                    placeholder="Add New Tag"
                                    value={capitalizeNamesAndTitles(customTag)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCustomTag(value);
                                        setForm({ ...form, tag: value });
                                    }}
                                    required
                                />
                            </>
                        )}
                        {props.tags.find(tag => tag.name === form.tag)?.builtin ? null : (
                            <>
                                <label htmlFor="colour">Color</label>
                                <input
                                    id="colour"
                                    name="colour"
                                    type="color"
                                    placeholder="Colour"
                                    value={form.colour}
                                    onChange={(e) => {
                                        setForm({ ...form, colour: e.target.value });
                                    }}
                                    required
                                />
                            </>
                        )}

                        {/* PROJECT STATUS */}
                        <label htmlFor="status">Status</label>
                        <div className="flex items-center justify-between gap-2">
                            <select
                                id="status"
                                name="status"
                                className="flex-1"
                                value={form.status}
                                    onChange={(e) => {
                                        const selectedStatus = props.statuses.find(status => status.name === e.target.value);
                                        if (e.target.value === "custom-status") {
                                            setUseCustomStatus(true);
                                            setForm({ 
                                                ...form, 
                                                status: "",
                                                status_colour: "#FAE8FF"
                                            });
                                        } else {
                                            setUseCustomStatus(false);
                                            setForm({ 
                                                ...form, 
                                                status: e.target.value,
                                                status_colour: selectedStatus?.colour || form.status_colour
                                            });
                                        }
                                        
                                    }}
                            >

                                {props.statuses.map((status) => (
                                    <option key={status.id} value={status.name}>
                                        {status.name === "" ? "No status" : status.name}
                                    </option>
                                ))}

                                <option value="custom-status">Add new status</option>
                            </select>

                            <DeleteButton
                                disabled={
                                    !form.status ||
                                    useCustomStatus || 
                                    props.statuses.find(status => status.name === form.status)?.builtin
                                }
                                text="Status"
                                className="flex py-0! px-2! min-h-fit"
                                action={async () => {
                                    if (!form.status) return;

                                    await fetch("/api/tags", {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ 
                                            name: form.status,
                                            category: "status",
                                        }),
                                    });

                                    setForm((prev) => ({ ...prev, status: "" }));
                                    router.refresh();
                                }}
                            />
                        </div>
                        {useCustomStatus && (
                            <>
                                <input
                                    id="status"
                                    placeholder="Add New Status"
                                    value={capitalizeNamesAndTitles(customStatus)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCustomStatus(value);
                                        setForm({ ...form, status: value });
                                    }}
                                    required
                                />
                            </>
                        )}
                        {props.statuses.find(status => status.name === form.status)?.builtin ? null : (
                            <>
                                <label htmlFor="status-colour">Color</label>
                                <input
                                    id="status-colour"
                                    name="status-colour"
                                    type="color"
                                    placeholder="Colour"
                                    value={form.status_colour}
                                    onChange={(e) => {
                                        setForm({ ...form, status_colour: e.target.value });
                                    }}
                                    required
                                />
                            </>
                        )}

                        {/* PIN & HIDE */}
                        <div className="flex flex-wrap justify-evenly">
                            <label className="flex gap-2 items-center cursor-pointer">
                                <span>Pin Project</span>
                                <input
                                    name="pinned"
                                    type="checkbox"
                                    checked={form.pinned}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                pinned: e.target.checked,
                                            })
                                        }
                                />                            
                            </label>
                            
                            <label className="flex gap-2 items-center cursor-pointer">
                                <span>Hide Project</span>
                                <input
                                    name="hidden"
                                    type="checkbox"
                                    checked={form.hidden}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                hidden: e.target.checked,
                                            })
                                        }
                                />                            
                            </label>
                        </div>


                        {/* IMAGE INPUT */}
                        <div
                            onDragOver={(e) => {e.preventDefault()}}
                            onDrop={handleDrop}
                            className="flex flex-col gap-3"
                        >
                            <label htmlFor="thumbnail">Drag & drop an image here, or click to select</label>
                            <input 
                                id="thumbnail"
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                ref={inputRef}
                                className="hidden"
                            />            
                            <Button 
                                text="Select Image" 
                                variant="secondary" 
                                className="w-fit sm:w-48"
                                onClick={() => inputRef.current?.click()} 
                            />

                            {preview && (
                                <img src={preview} alt="Preview" />
                            )}
                        </div>

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
                                    router.push(props.referrer ?? "/projects");
                                }}
                            />                            
                        </div>


                    </form>
                </Tile>                
            </div>
            
        </div>

    );
}
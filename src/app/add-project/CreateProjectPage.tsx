"use client";

import { useRef, useState } from "react";
import resizeImage from "@/lib/resizeImage";
import Tile from "@/components/Tile";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginResponse, Project, Tag } from "@/lib/types";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { ensurePunctuation } from "@/lib/ensurePunctuation";
import { useEffect } from "react";
import { normalizeArray } from "@/lib/normalizeJSON";

export default function CreateProjectPage(props : {
    initialData? : any;
    tags : string[]
}) {

    // Max image size is 200KB
    const MAX_SIZE = 0.2 * 1024 * 1024;

    const router = useRouter();

    // Initial form data
    const [form, setForm] = useState({
        name: props.initialData?.name ?? "",
        description: props.initialData?.description ?? "",
        link: props.initialData?.link ?? "",
        languages: props.initialData?.languages ? normalizeArray(props.initialData?.languages) : "",
        tools: props.initialData?.tools ? normalizeArray(props.initialData?.tools) : "",
        tag : props.initialData?.tag ?? "",
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const [ imageFile, setImageFile ] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fadeOut, setFadeOut] = useState(false);

    // Setting data if loading a draft that exists
    useEffect(() => {
        if (!props.initialData) return;

        if (props.initialData.imageUrl) {
            setPreview(props.initialData.imageUrl);
        }
        
    }, [props.initialData]); 

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
            name === "languages";

        setForm({
            ...form,
            [name]: shouldCapitalize
                ? capitalizeNamesAndTitles(value)
                : value,
        });
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
        formData.append("tag", form.tag)
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
                tag:"",
            });

            setImageFile(null);
            setPreview(null);
            setError(null);

            router.push("/projects");
            router.refresh();
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
                <Link href="/projects" className="self-start pt-4 pb-4 pl-6 md:pl-0">&lt; Return </Link>
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
                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        
                        <label htmlFor="description">Project Description</label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
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
                            name="link"
                            placeholder="Link"
                            value={form.link}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="link">Languages Used</label>
                        <input
                            name="languages"
                            placeholder="Languages (comma separated)"
                            value={form.languages}
                            onChange={handleChange}
                        />

                        <label htmlFor="tools">Tools Used</label>
                        <input
                            name="tools"
                            placeholder="Tools (comma separated)"
                            value={form.tools}
                            onChange={handleChange}
                        />

                        <label htmlFor="tag">Tag</label>
                        <select
                            name="tag"
                            value={form.tag}
                            onChange={handleChange}
                        >

                            {props.tags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag === "" ? "No tag" : tag}
                                </option>
                            ))}
                        </select>

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
                                    router.push("/#projects");
                                }}
                            />                            
                        </div>


                    </form>
                </Tile>                
            </div>
            
        </div>

    );
}
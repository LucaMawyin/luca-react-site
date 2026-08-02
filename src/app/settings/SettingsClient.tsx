"use client";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Tile from "@/components/Tile";
import { getDevice } from "@/lib/getDevice";
import resizeImage from "@/lib/resizeImage";
import { shadow } from "@/lib/tags";
import { ChangePasswordResponse, Project, Session, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Message = {
    text: string;
    status: "error" | "success";
    type : "about" | "password" | "resume" | "sessions" | "headshot";
} | null;

function getMessageClass(message?: Message) {
    if (!message) return "";

    if (message.status === "error") return "text-red-500!";
    if (message.status === "success") return "text-green-500!";

    return "";
}

export default function SettingsClient(props : {
    user : User, 
    about : string, 
    activeSessions : Session[],
    currentSession : Session,
    projects : Project[],
}){

    const router = useRouter();

    // Resume file input stuff
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ resumeName, setResumeName] = useState<string | null>(null);
    const [ resumeFile, setResumeFile] = useState<File | null>(null);

    // Headshot file input stuff
    const headshotInputRef = useRef<HTMLInputElement>(null);
    const [ headshotName, setHeadshotName] = useState<string | null>(null);
    const [ headshotFile, setHeadshotFile] = useState<File | null>(null);

    // Password states
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Success / error states
    const [message, setMessage] = useState<Message>(null);
    const [visible, setVisible] = useState(true);

    // About me
    const [ about, setAbout ] = useState(props.about || "");

    // Projects
    const [projects, setProjects] = useState<Project[]>(props.projects);
    const projectLengthIncrement = 4;
    const [visibleCount, setVisibleCount] = useState(projectLengthIncrement);
    const visibleProjects = projects
        .filter((project) => project.deleted === 0)
        .slice(0, visibleCount);

    // Deleted projects
    const deletedProjects = projects.filter(
        (project) => project.deleted === 1
    );
    const [showDeletedProjects, setShowDeletedProjects] = useState(false);

    useEffect(() => {
        if (deletedProjects.length === 0) {
            setShowDeletedProjects(false);
        }
    }, [deletedProjects.length]);

    useEffect(() => {
        const resizeTextAreas = () => {
            const textareas = document.querySelectorAll("textarea");
                textareas.forEach((ta) => {
                    ta.style.height = "auto";
                    ta.style.height = ta.scrollHeight + "px";
                }
            );
        }

        resizeTextAreas();

        // run on resize
        window.addEventListener("resize", resizeTextAreas);

        // cleanup
        return () => {
            window.removeEventListener("resize", resizeTextAreas);
        };

    }, []);


    // Handling password change
    async function handlePasswordChange(
        e: React.FormEvent
    ){
        e.preventDefault();

        setMessage(null);

        // Simple password check
        if (newPassword !== confirmPassword){
            setMessage({
                type:"password",
                status: "error",
                text: "Passwords do not match",
            });
            return;
        }

        // Changing password
        const response = await fetch("/api/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        const data = await response.json() as ChangePasswordResponse;

        // Showing success or error message for 300ms
        if (response.ok){
            setMessage({
                type:"password",
                status: "success",
                text: "Password updated",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setVisible(true);
            setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
        } else {
            setMessage({
                type:"password",
                status: "error",
                text: data.error || "Failed to update password",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
        }
    }


    // Resume pdf drop
    const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        // Only PDF
        if (file.type !== "application/pdf") {
            setMessage({
                type:"resume",
                status: "error",
                text: "Only PDF files are allowed",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        setMessage(null);

        setResumeFile(file);
        setResumeName(file.name);
    };

    // Resume submit
    const handleResumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // No resume file
        if (!resumeFile) {
            setMessage({
                type:"resume",
                status: "error",
                text: "Please select a resume first",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        // Uploading file
        const formData = new FormData();
        formData.append("file", resumeFile);
        formData.append("name", "resume");
        formData.append("type", "pdf");

        const res = await fetch("/api/upload-file", {
            method: "POST",
            body: formData,
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            setMessage({
                type:"resume",
                status: "error",
                text: data.error || "Upload failed",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        // Nullify files
        setResumeFile(null);
        setResumeName(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Success message
        setMessage({
            type:"resume",
            status: "success",
            text: "Successfully Uploaded Resume",
        });
        setVisible(true);
            setTimeout(() => {
            setVisible(false);
            setTimeout(() => setMessage(null), 300);
        }, 3000);
    };

    // Headshot image drop
    const MAX_SIZE = 1024 * 1024; // Max size is 1MB
    const handleHeadshotDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage({
                type:"headshot",
                status: "error",
                text: "Only images are allowed",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        // Resize image until it's under the max size
        let finalFile = await resizeImage(file);
        while (finalFile.size > MAX_SIZE) {
            finalFile = await resizeImage(finalFile);
        }

        setMessage(null);

        setHeadshotFile(file);
        setHeadshotName(file.name);
    };

    // Headshot submit
    const handleHeadshotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // No image
        if (!headshotFile) {
            setMessage({
                type:"headshot",
                status: "error",
                text: "Please select an image",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        // FormData
        const formData = new FormData();
        formData.append("file", headshotFile);
        formData.append("name", "headshot");
        formData.append("type", "image");

        // API call
        const res = await fetch("/api/upload-file", {
            method: "POST",
            body: formData,
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            setMessage({
                type:"headshot",
                status: "error",
                text: data.error || "Upload failed",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        // Nullify files
        setHeadshotFile(null);
        setHeadshotName(null);

        if (headshotInputRef.current) {
            headshotInputRef.current.value = "";
        }

        // Success message
        setMessage({
            type:"headshot",
            status: "success",
            text: "Successfully Uploaded Headshot",
        });
        setVisible(true);
            setTimeout(() => {
            setVisible(false);
            setTimeout(() => setMessage(null), 300);
        }, 3000);
    };

    // Updating about me
    async function handleAboutSubmit() {

        if (!about.length){
            setMessage({
                type:"about",
                status: "error",
                text: "Please enter a bio",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        const res = await fetch("/api/update-about", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ about }),
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            setMessage({
                type:"about", 
                status:"error",
                text: data.error || "Failed to update about"
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);

            router.refresh();
            return;
        }

        // Success message
        setMessage({
            type:"about",
            status: "success",
            text: "Successfully changed about me",
        });
        setVisible(true);
            setTimeout(() => {
            setVisible(false);
            setTimeout(() => setMessage(null), 300);
        }, 3000);
    }

    // Clearing all active sessions
    async function handleClearSessions(){
        const res = await fetch("/api/clear-sessions", {
            method: "POST",
        });

        const data = await res.json() as any;

        // Error
        if (!res.ok) {
            setMessage({
                type:"sessions",
                status: "error",
                text: data.error || "Failed to Clear Sessions",
            });
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);
            return;
        }

        router.refresh();

        // Success message
        setMessage({
            type:"sessions",
            status: "success",
            text: "Successfully cleared all active sessions",
        });
        setVisible(true);
            setTimeout(() => {
            setVisible(false);
            setTimeout(() => setMessage(null), 300);
        }, 3000);
    }

    // Removing individual session
    async function handleRemoveSession(id: number) {
        const res = await fetch("/api/remove-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        const data = await res.json() as any;

        if (!res.ok) {
            setMessage({
                type: "sessions",
                status: "error",
                text: data.error || "Failed to remove session",
            });
            setVisible(true);

            setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(null), 300);
            }, 3000);

            return;
        }

        await router.refresh();

        setMessage({
            type: "sessions",
            status: "success",
            text: "Successfully removed session",
        });
        setVisible(true);

        setTimeout(() => {
            setVisible(false);
            setTimeout(() => setMessage(null), 300);
        }, 3000);
    }

    return (
        <div className="
            mt-[10vh]
            min-h-[90vh]
            flex flex-wrap justify-center items-center
        ">
            <div
                className="
                    flex flex-wrap
                    justify-center
                    w-full
                    min-h-[90vh]
                "
            >

                {/* INFO & ABOUT */}
                <Tile 
                    title="Profile Settings"
                    disableHover={true}
                    className="lg:max-w-[40vw] shadow-none pb-0"
                    childClassName="mt-0!"
                    titleClassName="border-b"
                >

                    {/* ABOUT ME */}
                    <div className="space-y-4 py-6 border-b">
                        <h2 className="text-xl">
                            About Me
                        </h2>
                        <div className="flex flex-col gap-2">
                            <textarea
                                name="about-me"
                                value={about}
                                className="
                                    w-full
                                    min-h-28
                                    rounded-md
                                    border
                                    text-sm
                                    text-gray-700
                                    bg-gray-50
                                "
                                rows={1}
                                style={{
                                    overflow: "hidden",
                                    resize: "none",
                                }}
                                onChange={(e) => {
                                    setAbout(e.target.value)
                                    if (e.target instanceof HTMLTextAreaElement) {
                                        const el = e.target;
                                        el.style.height = "auto";
                                        el.style.height = el.scrollHeight + "px";
                                    }
                                }}
                            />

                            <p   
                                className={`
                                    text-sm text-center min-h-5
                                    transition-opacity duration-300
                                    ${visible ? "opacity-100" : "opacity-0"}
                                `}
                            >
                                {message?.type === "about" && (
                                    <span className={getMessageClass(message)}>
                                        {message.text}
                                    </span>
                                )}
                            </p>

                            <Button
                                text="Change About"
                                className="w-full sm:w-56"
                                onClick={handleAboutSubmit}
                            />                            
                        </div>
                    </div>

                    {/* HEADSHOT UPLOAD */}
                    <div 
                        className="py-6 border-b sm:border-b-0"
                        onDragOver={(e) => {e.preventDefault()}}
                        onDrop={handleHeadshotDrop}
                    >

                        <form 
                            className="flex flex-col gap-4"
                            onSubmit={handleHeadshotSubmit}
                        >
                            <h2 className="text-xl">
                                Upload New Headshot
                            </h2>
                            <label htmlFor="headshot" className="text-gray-500">Drag & drop image here, or click to select</label>
                            <div className="space-y-2">
                                <input
                                    id="headshot"
                                    name="headshot"
                                    type="file"
                                    ref={headshotInputRef}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setHeadshotFile(file);
                                        setHeadshotName(file.name);
                                    }}
                                    className="hidden"
                                />
                                <Button 
                                    text="Select Image" 
                                    variant="secondary" 
                                    className="w-full self-center"
                                    onClick={() => headshotInputRef.current?.click()}
                                />
                                {headshotName && (
                                    <p className="text-sm text-gray-500">
                                        Selected: {headshotName}
                                    </p>
                                )}
                                
                                <p   
                                    className={`
                                        text-sm text-center min-h-5
                                        transition-opacity duration-300
                                        ${visible ? "opacity-100" : "opacity-0"}
                                    `}
                                >
                                    {message?.type === "headshot" && (
                                        <span className={getMessageClass(message)}>
                                            {message.text}
                                        </span>
                                    )}
                                </p>
                                
                                <Button
                                    text="Submit Headshot"
                                    type="submit"
                                    className="w-full sm:w-56"
                                />                            
                            </div>
                            
                        </form>

                    </div>
                    
                    {/* RESUME UPLOAD */}
                    <div 
                        className="py-6 border-b sm:border-b-0"
                        onDragOver={(e) => {e.preventDefault()}}
                        onDrop={handleResumeDrop}
                    >

                        <form 
                            className="flex flex-col gap-4"
                            onSubmit={handleResumeSubmit}
                        >
                            <h2 className="text-xl">
                                Upload New Resume
                            </h2>
                            <label htmlFor="resume" className="text-gray-500">Drag & drop resume here, or click to select</label>
                            <div className="space-y-2">
                                <input
                                    id="resume"
                                    name="resume"
                                    type="file"
                                    ref={fileInputRef}
                                    accept="application/pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setResumeFile(file);
                                        setResumeName(file.name);
                                    }}
                                    className="hidden"
                                />
                                <Button 
                                    text="Select PDF" 
                                    variant="secondary" 
                                    className="w-full self-center"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                {resumeName && (
                                    <p className="text-sm text-gray-500">
                                        Selected: {resumeName}
                                    </p>
                                )}
                                
                                <p   
                                    className={`
                                        text-sm text-center min-h-5
                                        transition-opacity duration-300
                                        ${visible ? "opacity-100" : "opacity-0"}
                                    `}
                                >
                                    {message?.type === "resume" && (
                                        <span className={getMessageClass(message)}>
                                            {message.text}
                                        </span>
                                    )}
                                </p>
                                
                                <Button
                                    text="Submit Resume"
                                    type="submit"
                                    className="w-full sm:w-56"
                                />                            
                            </div>
                            
                        </form>

                    </div>

                </Tile>

                {/* SECURITY */}
                <Tile
                    className="lg:max-w-[40vw] shadow-none pb-0"
                    disableHover={true}
                >

                    {/* Change password section */}
                    <div className="space-y-4 pb-6 border-b">
                        <h2 className="text-xl">
                            Change Password
                        </h2>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="current-password"
                                className="text-gray-500"
                            >
                                Current Password
                            </label>
                            <div className="flex gap-2 w-full">
                                <input
                                    id="current-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="flex-1"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="flex-0 hover:cursor-pointer"
                                    onClick={() => setShowPassword((p) => !p)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <label
                                htmlFor="new-password"
                                className="text-gray-500"
                            >
                                New Password
                            </label>
                            <div className="flex w-full">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    name="new-password"
                                    className="flex-1"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <label
                                htmlFor="confirm-new-password"
                                className="text-gray-500"
                            >
                                Confirm New Password
                            </label>
                            <div className="flex w-full">
                                <input
                                    id="confirm-new-password"
                                    type={showPassword ? "text" : "password"}
                                    name="confirm-new-password"
                                    className="flex-1"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Message area */}
                            <div className="space-y-2">
                                <p   
                                    className={`
                                        text-sm text-center min-h-5
                                        transition-opacity duration-300
                                        ${visible ? "opacity-100" : "opacity-0"}
                                    `}
                                >
                                    {message?.type === "password" && (
                                        <span className={getMessageClass(message)}>
                                            {message.text}
                                        </span>
                                    )}
                                </p>

                                <Button 
                                    text="Change Password" 
                                    type="submit"
                                    className="self-center w-full sm:w-56"
                                    onClick={handlePasswordChange}
                                />                            
                            </div>                            
                        </div>
                        
                    </div>

                    {/* Active sessions */}
                    <div className="py-6">
                        <h2 className="text-xl mb-4">
                            Active Sessions
                        </h2>
                        <div className="space-y-2 [&_span]:text-gray-500">
                            {props.activeSessions.map((session : Session) => (
                                <details 
                                    key={session.id} 
                                    className="
                                        bg-gray-100 
                                        rounded-lg 
                                        wrap-break-word 
                                    "
                                >
                                    <summary className="
                                        cursor-pointer 
                                        font-medium
                                        flex
                                        items-center
                                        justify-between
                                        p-3
                                        rounded-lg 

                                        hover:bg-gray-300
                                        transition-colors
                                        duration-300
                                    ">
                                        <div>
                                            <p>
                                                {getDevice(session.user_agent)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Session {session.id}
                                            </p>
                                        </div>
                                        
                                        {props.currentSession.id === session.id && (
                                            <span className="
                                                text-sm
                                                text-gray-500
                                                bg-gray-200
                                                px-2
                                                py-1
                                                rounded-full
                                            ">
                                                Current
                                            </span>
                                        )}
                                    </summary>

                                    <div className="space-y-1 p-3 pt-0">
                                        <p><span>Device: </span>{getDevice(session.user_agent)}</p>
                                        <p><span>IP Address: </span>{session.ip_address}</p>
                                        <p>
                                            <span>Location: </span>
                                            {(() => {
                                                try {
                                                    const geo = JSON.parse(session.geo);
                                                    return `${geo.city}, ${geo.country}`;
                                                } catch {
                                                    return session.geo;
                                                }
                                            })()}
                                        </p>
                                        <p>
                                            <span>Created: </span>
                                            {new Date(session.created_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p>
                                            <span>Expires: </span>
                                            {new Date(session.expires_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>       
                                        {props.currentSession.id !== session.id && (
                                            <DeleteButton
                                                customText="Remove"
                                                customDescription=" Session"
                                                className="flex justify-center py-0! px-2! min-h-fit w-full sm:w-fit"
                                                action={() => handleRemoveSession(session.id)}
                                            />
                                        )}                              
                                    </div>
                                    
     

                                </details>
                            ))}
                            <p   
                                className={`
                                    text-sm text-center min-h-5
                                    transition-opacity duration-300
                                    ${visible ? "opacity-100" : "opacity-0"}
                                `}
                            >
                                {message?.type === "sessions" && (
                                    <span className={getMessageClass(message)}>
                                        {message.text}
                                    </span>
                                )}
                            </p>
                            <DeleteButton
                                customText="Clear"
                                customDescription="Sessions"
                                className="w-full sm:w-56"
                                action={handleClearSessions}
                            />                             
                        </div>

                    </div>
                </Tile>


            </div>
            <div className="
                flex flex-wrap
                justify-center
                w-full
                max-h-fit
            ">
                <Tile
                    title="Projects"
                    disableHover={true}
                    className="lg:max-w-[80vw] shadow-none py-0"
                    childClassName="mt-0!"
                    titleClassName="border-b"
                >
                    <Button 
                        text="Add Project"
                        className="mt-4 w-full sm:w-56 self-center"
                        onClick={() => (router.push("/add-project"))}
                    />            
                    {visibleProjects.length > 0 && 
                        <div className="
                            grid
                            grid-cols-1
                            lg:grid-cols-2
                            items-stretch
                            auto-rows-fr
                            mt-4
                            gap-4
                        ">
                            {visibleProjects.map((project) => (
                                <div 
                                    key={project.id}
                                    className="
                                        flex
                                        flex-wrap
                                        justify-between
                                        bg-gray-100 
                                        rounded-lg 
                                        p-2
                                        gap-2
                                    "
                                >
                                    <div className="
                                        flex 
                                        flex-col 
                                        flex-1 
                                        min-w-[70%] 
                                        wrap-break-word
                                        [&_span]:text-gray-500
                                        gap-1
                                    ">
                                        
                                        {/* PROJECT PIN & HIDDEN */}
                                        <div className="
                                            flex 
                                            gap-4
                                        ">
                                            <p className="font-medium">{project.name}</p>
                                            {project.status && (
                                                <p>
                                                    <Badge
                                                        text={project.status}
                                                        shadow={false}
                                                        fit="short"
                                                        style={
                                                            {
                                                                color: shadow(project.status_colour).glowColour,
                                                                backgroundColor: project.status_colour,
                                                                borderColor: shadow(project.status_colour).borderColour,
                                                            }
                                                        }
                                                        className="border font-normal"
                                                    />
                                                </p>                                            
                                            )}        
                                        </div>   

                                        {(project.pinned === 1 || project.hidden === 1) && (
                                            <div className="flex gap-4">
                                                {/* PIN */}
                                                {(project.pinned === 1) && (
                                                    <Badge
                                                        text="Pinned"
                                                        className="bg-yellow-400"
                                                        shadow={false}
                                                    />
                                                )}

                                                {/* HIDDEN */}
                                                {(project.hidden === 1) && (
                                                    <Badge
                                                        text="Hidden"
                                                        className="bg-orange-400"
                                                        shadow={false}
                                                    />
                                                )}
                                            </div>
                                        )}
  

                                        {project.tag && (
                                            <p>
                                                <span>Tag: </span>

                                                <Badge
                                                    text={project.tag}
                                                    shadow={false}
                                                    fit="short"
                                                    className="border font-normal"
                                                    style={
                                                        {
                                                            color: shadow(project.colour).glowColour,
                                                            backgroundColor: project.colour,
                                                            borderColor: shadow(project.colour).borderColour,
                                                        }
                                                    }
                                                />
                                            </p>                                            
                                        )}

                                        <p>
                                            <span>Created: </span>
                                            {new Date(project.created_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p>
                                            <span>Updated: </span>
                                            {new Date(project.updated_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>

                                        {!!project.link && (
                                            <p className="flex flex-wrap">
                                                <span>Link:&nbsp;</span>
                                                <a 
                                                    href={project.link}
                                                    target="_blank"
                                                    className="
                                                        block
                                                        max-w-[75%]
                                                        truncate
                                                        text-blue-300
                                                        hover:text-blue-600
                                                        transition-all
                                                        ease-in-out
                                                        duration-50
                                                    "
                                                >
                                                    {project.link}
                                                </a>
                                            </p>
                                        )}
                                        {project.languages && (
                                            <p>
                                                <span>Languages: </span>
                                                {JSON.parse(project.languages).join(", ")}
                                            </p>                                            
                                        )}
                                        {project.libraries && (
                                            <p>
                                                <span>Libraries: </span>
                                                {JSON.parse(project.libraries).join(", ")}
                                            </p>                                            
                                        )}
                                        {project.tools && (
                                            <p>
                                                <span>Tools: </span>
                                                {JSON.parse(project.tools).join(", ")}
                                            </p>                                            
                                        )}

                                    </div>

                                    {/* Delete/Edit Buttons */}
                                    <div className="shrink-0 self-center flex gap-4">
                                        <Button
                                            text="Edit"
                                            className="py-0! px-2! min-h-fit w-20! sm:w-fit"
                                            onClick={() => {router.push(`add-project/edit?id=${project.id}`)}}
                                        />
                                        <DeleteButton
                                            className="py-0! px-2! min-h-fit w-20! sm:w-fit"
                                            text="Project"
                                            action={async () => {
                                                const res = await fetch("/api/projects", {
                                                    method: "DELETE",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ id: project.id }),
                                                });

                                                if (res.status === 401) {
                                                    router.push("/login");
                                                    return;
                                                }

                                                if (!res.ok) {
                                                    return;
                                                }
                                                
                                                setProjects((prev) =>
                                                    prev.map((p) =>
                                                        p.id === project.id
                                                            ? {
                                                                ...p,
                                                                deleted: 1,
                                                                deleted_at: new Date()
                                                                    .toISOString()
                                                                    .slice(0, 19)
                                                                    .replace("T", " "),
                                                            }
                                                            : p
                                                    )
                                                );
                                            }}
                                        />                        
                                    </div>
                                </div>
                            ))}
                        </div> 
                    }
                    
                    <div className="
                        flex 
                        flex-wrap 
                        justify-center 
                        my-4
                        gap-4
                    ">
                        {visibleCount > projectLengthIncrement && (
                            <button
                                onClick={() => setVisibleCount((prev) => prev - projectLengthIncrement)}
                                className="
                                    cursor-pointer
                                    w-24
                                    h-10 
                                    p-3

                                    flex 
                                    items-center 
                                    justify-center

                                    rounded-xl
                                    transition-all
                                    duration-(--transition-duration)
                                    shadow-[0_4px_10px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]
                                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_-2px_4px_rgba(0,0,0,0.05)]
                                    hover:scale-(--subtle-scale)
                                "
                            >
                                <img
                                    src="/arrow-up.svg"
                                    className="h-6"
                                />
                            </button>
                        )}                        

                        {visibleCount < projects.length && (
                            <button
                                onClick={() => setVisibleCount((prev) => prev + projectLengthIncrement)}
                                className="
                                    cursor-pointer
                                    w-24
                                    h-10 
                                    p-3

                                    flex 
                                    items-center 
                                    justify-center

                                    rounded-xl
                                    transition-all
                                    duration-(--transition-duration)
                                    shadow-[0_4px_10px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]
                                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_-2px_4px_rgba(0,0,0,0.05)]
                                    hover:scale-(--subtle-scale)
                                "
                            >
                                <img
                                    src="/arrow-down.svg"
                                    className="h-6"
                                />
                            </button>

                        )}
                    </div>
                </Tile>
            </div>


            {/* DELETED PROJECTS */}
            {deletedProjects.length > 0 && (
                <Button
                    text={showDeletedProjects ? "Hide Deleted Projects" : "Show Deleted Projects"}
                    className="w-fit self-center my-4"
                    onClick={() => setShowDeletedProjects((prev) => !prev)}
                />                
            )}

            {showDeletedProjects && (
                <div className="
                    flex flex-wrap
                    justify-center
                    w-full
                    max-h-fit
                ">

                    <Tile
                        title="Deleted Projects"
                        disableHover={true}
                        className="lg:max-w-[80vw] shadow-none py-0"
                        childClassName="mt-0!"
                        titleClassName="border-b"
                    >
                        { 
                            <div className="
                                grid
                                grid-cols-1
                                lg:grid-cols-2
                                items-stretch
                                auto-rows-fr
                                mt-4
                                gap-4
                            ">
                                {deletedProjects.map((project) => (
                                    <div 
                                        key={project.id}
                                        className="
                                            flex
                                            flex-wrap
                                            justify-between
                                            bg-gray-100 
                                            rounded-lg 
                                            p-2
                                            gap-2
                                        "
                                    >
                                        <div className="
                                            flex 
                                            flex-col 
                                            flex-1 
                                            min-w-[70%] 
                                            wrap-break-word
                                            [&_span]:text-gray-500
                                            gap-1
                                        ">
                                            
                                            {/* PROJECT PIN & HIDDEN */}
                                            <div className="
                                                flex 
                                                gap-4
                                            ">
                                                <p className="font-medium">{project.name}</p>

                                                {project.status && (
                                                    <p>
                                                        <Badge
                                                            text={project.status}
                                                            shadow={false}
                                                            fit="short"
                                                            style={
                                                                {
                                                                    color: shadow(project.status_colour).glowColour,
                                                                    backgroundColor: project.status_colour,
                                                                    borderColor: shadow(project.status_colour).borderColour,
                                                                }
                                                            }
                                                            className="border font-normal"
                                                        />
                                                    </p>                                            
                                                )}        
                                            </div>   

                                            <div className="flex gap-4">
                                                {/* DELETED */}
                                                <Badge
                                                    text="Deleted"
                                                    className="bg-red-400"
                                                    shadow={false}
                                                />

                                                {/* PIN */}
                                                {(project.pinned === 1) && (
                                                    <Badge
                                                        text="Pinned"
                                                        className="bg-yellow-400"
                                                        shadow={false}
                                                    />
                                                )}

                                                {/* HIDDEN */}
                                                {(project.hidden === 1) && (
                                                    <Badge
                                                        text="Hidden"
                                                        className="bg-orange-400"
                                                        shadow={false}
                                                    />
                                                )}
                                            </div>
    

                                            {project.tag && (
                                                <p>
                                                    <span>Tag: </span>

                                                    <Badge
                                                        text={project.tag}
                                                        shadow={false}
                                                        fit="short"
                                                        className="border font-normal"
                                                        style={
                                                            {
                                                                color: shadow(project.colour).glowColour,
                                                                backgroundColor: project.colour,
                                                                borderColor: shadow(project.colour).borderColour,
                                                            }
                                                        }
                                                    />
                                                </p>                                            
                                            )}

                                            <p>
                                                <span>Created: </span>
                                                {new Date(project.created_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                            <p>
                                                <span>Updated: </span>
                                                {new Date(project.updated_at.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                            <p>
                                                <span>Deleted: </span>
                                                {new Date(project.deleted_at?.replace(" ", "T") + "Z").toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                            {!!project.link && (
                                                <p className="flex flex-wrap">
                                                    <span>Link:&nbsp;</span>
                                                    <a 
                                                        href={project.link}
                                                        target="_blank"
                                                        className="
                                                            block
                                                            max-w-[75%]
                                                            truncate
                                                            text-blue-300
                                                            hover:text-blue-600
                                                            transition-all
                                                            ease-in-out
                                                            duration-50
                                                        "
                                                    >
                                                        {project.link}
                                                    </a>
                                                </p>
                                            )}
                                            {project.languages && (
                                                <p>
                                                    <span>Languages: </span>
                                                    {JSON.parse(project.languages).join(", ")}
                                                </p>                                            
                                            )}
                                            {project.libraries && (
                                                <p>
                                                    <span>Libraries: </span>
                                                    {JSON.parse(project.libraries).join(", ")}
                                                </p>                                            
                                            )}
                                            {project.tools && (
                                                <p>
                                                    <span>Tools: </span>
                                                    {JSON.parse(project.tools).join(", ")}
                                                </p>                                            
                                            )}

                                        </div>

                                        {/* Delete/Edit Buttons */}
                                        <div className="shrink-0 self-center flex gap-4">
                                            <Button
                                                text="Restore"
                                                className="py-0! px-2! min-h-fit w-20! sm:w-fit"
                                                onClick={async () => {
                                                    const res = await fetch("/api/projects", {
                                                        method: "PATCH",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({ id: project.id }),
                                                    });

                                                    if (res.status === 401) {
                                                        router.push("/login");
                                                        return;
                                                    }

                                                    if (!res.ok) {
                                                        return;
                                                    }

                                                    setProjects((prev) =>
                                                        prev.map((p) =>
                                                            p.id === project.id
                                                                ? { ...p, deleted: 0, deleted_at: null }
                                                                : p
                                                        )
                                                    );
                                                }}

                                            />
                                            <DeleteButton
                                                className="py-0! px-2! min-h-fit w-20! sm:w-fit"
                                                text="Project"
                                                action={async () => {
                                                    const res = await fetch("/api/projects", {
                                                        method: "DELETE",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({ id: project.id }),
                                                    });

                                                    if (res.status === 401) {
                                                        router.push("/login");
                                                        return;
                                                    }
                                                    
                                                    setProjects((prev) =>
                                                        prev.filter((p) => p.id !== project.id)
                                                    );
                                                }}
                                            />                        
                                        </div>
                                    </div>
                                ))}
                            </div> 
                        }
                    </Tile>                
                </div>
            )}

        </div>
    );
}
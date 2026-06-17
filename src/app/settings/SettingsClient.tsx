"use client";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { ChangePasswordResponse, User } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

type Message = {
    text: string;
    status: "error" | "success";
    type : "about" | "password" | "resume";
} | null;

function getMessageClass(message?: Message) {
    if (!message) return "";

    if (message.status === "error") return "text-red-500";
    if (message.status === "success") return "text-green-500";

    return "";
}

export default function SettingsClient(props : {user : User, about : string}){

    // Resume file input stuff
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ resumeName, setResumeName] = useState<string | null>(null);
    const [ resumeFile, setResumeFile] = useState<File | null>(null);


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
        const res = await fetch("/api/upload-resume", {
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

    // Updating about me
    async function handleAboutSubmit() {
        const res = await fetch("/api/update-about", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ about }),
        });

        const data = await res.json() as any;

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

    return (
        <div className="
            mt-[10vh]
            min-h-[90vh]
            flex justify-center items-center
        ">
            <div
                className="
                    flex flex-wrap
                    justify-center
                    w-full
                    max-h-fit
                "
            >

                {/* INFO & ABOUT */}
                <Tile 
                    title="Profile Settings"
                    disableHover={true}
                    className="lg:max-w-[40vw] max-w-full gap-4 shadow-none"
                    childClassName="mt-0!"
                    titleClassName="border-b"
                >

                    {/* INFO */}
                    <div className="space-y-4 pb-6 border-b">
                        <h2 className="text-xl">
                            User Information
                        </h2>
                        
                        <div className="flex flex-col">
                            <span className="text-gray-500">First Name</span>
                            <span>
                                {props.user.firstName}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-gray-500">Last Name</span>
                            <span>
                                {props.user.lastName}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">
                                Email
                            </span>
                            <span>
                                {props.user.email}
                            </span>
                        </div>
                    </div>

                    {/* ABOUT ME */}
                    <div className="space-y-4 pt-6">
                        <h2 className="text-xl">
                            About Me
                        </h2>
                        <div className="flex flex-col gap-2">
                            <textarea
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

                </Tile>

                {/* RESUME & PASSWORD */}
                <Tile
                    className="lg:max-w-[40vw] max-w-full gap-4 shadow-none"
                    disableHover={true}
                >

                    {/* RESUME UPLOAD */}
                    <div 
                        className="
                            py-6
                            border-b
                        "
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

                    {/* Change password section */}
                    <div className="pt-6 space-y-4">
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
                                    name="password"
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
                                    name="password"
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
                </Tile>
            </div>
        </div>
    );
}
"use client";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { ChangePasswordResponse, User } from "@/lib/types";
import { useState } from "react";

export default function SettingsClient(props : {user : User}){

    // Passwords
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Success / error
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [visible, setVisible] = useState(true);

    async function handlePasswordChange(
        e: React.FormEvent
    ){
        e.preventDefault();

        setError(null);
        setSuccess(null);

        // Simple password check
        if (newPassword !== confirmPassword){
            setError("Passwords do not match");
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

        if (response.ok){
            setSuccess("Password updated");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setVisible(true);
            setTimeout(() => {
                setVisible(false);
                setTimeout(() => setSuccess(null), 300);
            }, 3000);
        } else {
            setError(data.error || "Failed to update password");
            setVisible(true);
                setTimeout(() => {
                setVisible(false);
                setTimeout(() => setError(null), 300);
            }, 3000);
        }
    }

    return (
        <div className="
            mt-[10vh]
            min-h-[90vh]
            flex justify-center items-center
        ">
            <Tile 
                title="Profile Settings"
                disableHover={true}
                className="lg:max-w-[40vw] max-w-full gap-4"
            >
                <div className="space-y-4">
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

                <div className="border-t pt-6 space-y-4">
                        <h2 className="text-lg">
                            Change Password
                        </h2>

                        <div className="flex flex-col gap-1">
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
                            <div className="flex gap-2 w-full">
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
                            <div className="flex gap-2 w-full">
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
                        </div>

                        <p   
                            className={`
                                text-sm text-center min-h-5
                                transition-opacity duration-300
                                ${visible ? "opacity-100" : "opacity-0"}
                            `}
                        >
                            {error ? (
                                <span className="text-red-500">{error}</span>
                            ) : success ? (
                                <span className="text-green-500">{success}</span>
                            ):(
                                ""
                            )}
                        </p>

                        <Button 
                            text="Save Changes" 
                            type="submit"
                            className="self-center"
                            onClick={handlePasswordChange}
                        />
                    </div>

                
            </Tile>
        </div>
    );
}
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { LoginResponse } from "@/lib/types";

export default function Login(props : {isLoggedIn : boolean}){

    // Email, password and error states
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Login form submission
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";

    async function handleSubmit(e : React.FormEvent){

        e.preventDefault();

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email,password}),
        });

        let data : LoginResponse;

        try {
            data = await response.json();
        } catch {
            setError("Server error");
            return;
        }

        // Push to verification page (TODO)
        if (data.status === "verification_required") {

            router.push(
            `/verify-login?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`
            );
            return;
        } 

        // Redirect to next page on successful login
        if (data.status === "success"){
            router.push(next);
            router.refresh();
        }

        // Show error message on failure
        if (data.status === "error") {
            setError(data.error || "Login failed");
            return;
        }

    }

    // Show message if user is already logged in
    if (props.isLoggedIn){
        return (
            <div className="
                h-[90vh] 
                flex flex-col 
                gap-8 
                justify-center items-center"
            >
                <h1 className="text-[2em]!">You are already logged in</h1>
                <Button 
                    text="Return to Home" 
                    onClick={() => {
                        router.push("/");
                    }}
                />
            </div>
        );
    }


    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <Tile 
            title="Login"
            disableHover={true}
            className="md:max-w-[30vw] max-w-full"
            >
                <form 
                    autoComplete="on"
                    onSubmit={handleSubmit}
                    className="
                        w-full
                        flex flex-col
                        justify-center
                        gap-3"
                >
                    {/* Email input */}
                    <label htmlFor="email">Enter Your Email:</label>
                    <input 
                        id="email" 
                        type="text" 
                        name="email" 
                        autoComplete="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Password input */}
                    <label htmlFor="password">Enter Your Password:</label>
                    <div className="flex gap-2 w-full">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="current-password"
                            className="flex-1"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Show/hide password button */}
                        <button
                            type="button"
                            className="flex-0 hover:cursor-pointer"
                            onClick={() => setShowPassword((p) => !p)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <Button 
                        text="Login" 
                        type="submit"
                        className="self-center"
                    />
                </form>
            </Tile>
        </div>
    );
}
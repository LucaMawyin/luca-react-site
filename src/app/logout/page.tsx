"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Logout() {
  
  const router = useRouter();

  // Logout on component mount
  useEffect(() => {
    async function logout() {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.replace("/")
      router.refresh();
    }

    logout();

  }, [router]);



  return (
    <div className="
        flex flex-col 
        flex-1
        mt-[10vh]
        gap-8 
        justify-center items-center"
    >
        <h2>Successfully Logged Out</h2>
        <h2>Redirecting to Home...</h2>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { CapitalizeTitle } from "@/lib/CapitalizeTitle";
import { pages } from "@/lib/info";

export default function NavBar(props : {visible : boolean}){

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Override open state if window is brought back to large
    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)");

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setOpen(false);
            }
        };

        // initial check (important if user loads already on desktop)
        if (media.matches) {
            setOpen(false);
        }

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);
    }, []);

    return (
        <header className={`
                bg-(--primary-colour)
                h-[10vh]
                fixed top-0 z-50
                w-full 
                flex items-center
                shadow-sm

                transition-all duration-150 ease-out
                ${props.visible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }
        `}>

            {/* Desktop navbar */}
            <div className="
                m-8
                hidden
                md:flex gap-8

            ">  
                <a
                    href="/"
                    className="
                        transition-transform duration-(--transition-duration)
                        hover:scale-(--link-scale)
                    "
                >
                    Luca Mawyin
                </a>
                {pages.map((page) => (
                    <a
                        key={page.title}
                        href={page.href}
                        target={page.href.endsWith(".pdf") ? "_blank" : undefined}
                        className="
                            transition-transform duration-(--transition-duration)
                            hover:scale-(--link-scale)
                        "
                    >
                        {CapitalizeTitle(page.title)}
                    </a>
                ))}
            </div>

            {/* Mobile navbar */}
            <div className="
                flex
                md:hidden
                justify-between
                items-center
                pl-6 pr-6
                w-full
            ">
                <a
                    href="/"
                    className="
                        transition-transform duration-(--transition-duration)
                        hover:scale-(--link-scale)
                    "
                >
                    Luca Mawyin
                </a>
                <button 
                    className="
                        flex md:hidden
                        flex-col gap-1
                        hover:cursor-pointer
                    " 
                    onClick={() => {setOpen(!open)}}
                >
                    <span className="w-6 h-0.5 bg-black"></span>
                    <span className="w-6 h-0.5 bg-black"></span>
                    <span className="w-6 h-0.5 bg-black"></span>                    
                </button>                
            </div>

            <div className={`
                md:hidden
                fixed inset-0
                w-full h-screen
                bg-(--primary-colour)

                flex flex-col items-center justify-center
                gap-8

                z-50
                
                transition-all duration-(--transition-duration) ease-out
                ${open
                    ? "translate-y-0 shadow-sm"
                    : "-translate-y-full"
                }
            `}>
                <a
                    className="
                        transition-transform duration-(--transition-duration)
                        hover:scale-(--link-scale)
                        hover:cursor-pointer
                    "
                    onClick={() => setOpen(false)}
                >
                    X
                </a>

                {pages.map((page) => (
                    <a
                        key={page.title}
                        href={page.href}
                        target={page.href.endsWith(".pdf") ? "_blank" : undefined}
                        className="
                            transition-transform duration-(--transition-duration)
                            hover:scale-(--link-scale)
                        "
                        onClick={() => setOpen(false)}
                    >
                        {CapitalizeTitle(page.title)}
                    </a>
                ))}
            </div>
         

        </header>
    );
}
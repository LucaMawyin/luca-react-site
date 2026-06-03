"use client";

import { useEffect, useState } from "react";
import { capitalizeNamesAndTitles } from "@/lib/capitalizeNamesAndTitles";
import { icons, pages } from "@/lib/info";
import { usePathname, useRouter } from "next/navigation";
import { Page } from "@/lib/types";
import { getHref } from "@/lib/getHref";

export default function NavBar(props : {isLoggedIn : boolean}){

    // Checking what pages are allowed to be shown to user
    const visiblePages = pages.filter(page =>
        !page.requireLogin || props.isLoggedIn
    );

    // Handling clicks on navbar links
    const [pendingScroll, setPendingScroll] = useState<{
        path: string;
        id: string;
    } | null>(null);
    
    const router = useRouter();
    const pathname = usePathname();
    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        page: Page
    ) => {

        if (page.newTab) return;

        const normalizePath = (href: string) => "/" + href.split("#")[1];

        if (normalizePath(page.href) === pathname) {
            return;
        }

        if (page.section) {
            e.preventDefault();

            const id = page.section;

            if (pathname !== "/") {
                setPendingScroll({ path: pathname, id });
                router.push("/");
                return;
            }

            document.getElementById(id)?.scrollIntoView({
                behavior: "smooth",
            });

            return;
        }

        router.push(page.href);
    };

    // Scroll to section if user clicks link before page has loaded
    useEffect(() => {
        if (!pendingScroll) return;
        if (pathname !== "/") return;

        const el = document.getElementById(pendingScroll?.id);

        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setPendingScroll(null);
        }
    }, [pathname, pendingScroll]);

    // Show navbar on scroll or if not on home page
    const isHome = pathname === "/";
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        if (!isHome) {
            setScrolled(true);
            return;
        }

        const onScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener("scroll", onScroll);
        onScroll();

        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    const visible = isHome ? scrolled : true;

    // Locking page when mobile navbar is dropped
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
                ${visible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }
        `}>

            {/* Desktop navbar */}
            <div className="
                w-full
                m-8
                hidden
                md:flex
                justify-between
                text-lg
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
                <div className="flex gap-8">
                    {visiblePages
                        .filter((page) => !page.mobile)
                        .map((page) => (
                        <a
                            key={page.title}
                            href={getHref(page)}
                            onClick={(e) => {
                                handleClick(e, page)
                            }}
                            target={page.newTab ? "_blank" : undefined}
                            className="
                                transition-transform duration-(--transition-duration)
                                hover:scale-(--link-scale)
                            "
                        >
                            {capitalizeNamesAndTitles(page.title)}
                        </a>
                        ))
                    }                    
                </div>

            </div>

            {/* Mobile navbar */}
            <div className="
                flex
                md:hidden
                justify-between
                items-center
                pl-4 pr-4
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
                gap-12

                z-50
                
                transition-all duration-(--transition-duration) ease-out
                ${open
                    ? "translate-y-0 shadow-sm"
                    : "-translate-y-full"
                }
            `}>
                <a
                    className="hover:cursor-pointer text-xl"
                    onClick={() => setOpen(false)}
                >
                    x
                </a>

                {visiblePages.map((page) => (
                    <a
                        key={page.title}
                        href={getHref(page)}
                        target={page.newTab ? "_blank" : undefined}
                        className="
                            text-xl
                            transition-transform duration-(--transition-duration)
                            hover:scale-(--link-scale) 
                        "
                        onClick={(e) => {
                            setOpen(false);
                            handleClick(e, page);
                        }}
                    >
                        {capitalizeNamesAndTitles(page.title)}
                    </a>
                ))}
            </div>

            {/* Logos hang in top right */}
            <div className="
                fixed right-0 top-[10vh] z-40
            ">
                {icons.map((icon) => (
                    <a
                        key={icon.title}
                        href={icon.href}
                        target="_blank"
                        className="
                            block w-fit 
                            sm:p-3 p-2
                            transition-all duration-(--transition-duration) ease-out
                            hover:scale-(--link-scale)
                        "
                    >
                        <img 
                            src={`/icons/${icon.title}.svg`}
                            className="sm:w-[4vh] w-[5vh]"
                        />
                    </a>
                ))}
            </div>              
        </header>   

    );
}
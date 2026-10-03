"use client";

import { useEffect, useRef, useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Button from "./Button";
import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton";
import FadeInOnView from "./FadeInOnView";
import { useNotifications } from "./NotificationProvider";
import Link from "next/link";

export default function Projects(props : {
    isLoggedIn : boolean,
    projects : Project[]
}) {

    const router = useRouter();
    const { notify } = useNotifications();

    // Fetching projects on load
    const [projects, setProjects] = useState<Project[]>(
        props.projects.filter((project) => project.deleted === 0)
    );

    const featuredPool = projects;

    const [featuredStart, setFeaturedStart] = useState(0);

    const featuredProjects = Array.from(
        { length: Math.min(3, featuredPool.length) },
        (_, i) => featuredPool[(featuredStart + i) % featuredPool.length]
    );

    const [startX, setStartX] = useState<number | null>(null);
    const [timerDeadline, setTimerDeadline] = useState(Date.now() + 10000);
    const [isInteracting, setIsInteracting] = useState(false);
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

    const goPrev = () => {
        setFeaturedStart(
            (prev) => (prev - 1 + featuredPool.length) % featuredPool.length
        );
        setTimerDeadline(Date.now() + 10000);
    };

    const goNext = () => {
        setFeaturedStart(
            (prev) => (prev + 1) % featuredPool.length
        );
        setTimerDeadline(Date.now() + 10000);
    };

    const advanceIfExpired = () => {
        if (Date.now() >= timerDeadline) {
            goNext();
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsInteracting(true);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) {
            setIsInteracting(false);
            advanceIfExpired();
            return;
        }

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const threshold = 50;

        if (diff > threshold) {
            goNext();
        } else if (diff < -threshold) {
            goPrev();
        } else {
            advanceIfExpired();
        }

        setStartX(null);
        setIsInteracting(false);
    };

    useEffect(() => {
        if (featuredPool.length <= 3) return;

        const remaining = timerDeadline - Date.now();

        const timeout = setTimeout(() => {
            if (isInteracting) {
                return;
            }

            goNext();
        }, Math.max(remaining, 0));

        return () => clearTimeout(timeout);
    }, [timerDeadline, featuredPool.length, isInteracting]);

    return(
        <>

            {/* FEATURED PROJECTS */}
            <FadeInOnView>
                <div className={`
                    flex
                    flex-wrap
                    px-[10%]
                    justify-between
                    items-center
                    gap-4
                    ${props.isLoggedIn ? "pb-4 lg:pb-0" : "pb-8"}
                `}>
                    <h1 className="
                        flex-1
                        min-w-min
                        text-start
                    ">
                        Featured Projects
                    </h1>
                    <div className="
                        flex
                        flex-row
                        gap-2
                        sm:gap-4
                        shrink-0
                    ">
                        <button
                            type="button"
                            onClick={goPrev}
                            className="
                                cursor-pointer
                                w-10 h-10 p-3
                                flex items-center justify-center
                                rounded-xl
                                transition-all duration-(--transition-duration)
                                shadow-[0_4px_10px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]
                                hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_-2px_4px_rgba(0,0,0,0.05)]
                                hover:scale-(--link-scale)
                                pillow
                                squircle
                            "
                        >
                            <img src="/arrow-left.svg" alt="Previous projects" />
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            className="
                                cursor-pointer
                                w-10 h-10 p-3
                                flex items-center justify-center
                                rounded-xl
                                transition-all duration-(--transition-duration)
                                shadow-[0_4px_10px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]
                                hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_-2px_4px_rgba(0,0,0,0.05)]
                                hover:scale-(--link-scale)
                                pillow
                                squircle
                            "
                        >
                            <img src="/arrow-right.svg" alt="Next projects" />
                        </button>
                    </div>            
                </div>

                <div className={`
                    flex
                    sm:hidden
                    justify-center
                    gap-2
                    mt-3
                    ${props.isLoggedIn ? "pb-4 lg:pb-0" : "pb-8"}
                `}>
                    {featuredPool.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => {
                                setFeaturedStart(i);
                                setTimerDeadline(Date.now() + 10000);
                            }}
                            aria-label={`Show projects starting at position ${i + 1}`}
                            className={`
                                w-2 h-2
                                rounded-full
                                cursor-pointer
                                transition-all duration-300
                                ${i === featuredStart
                                    ? "scale-125 bg-current"
                                    : "bg-black/25"
                                }
                            `}
                        />
                    ))}
                </div>


                {/* Add Project button if logged in */}
                {props.isLoggedIn && 
                    <div className="
                        flex 
                        w-full
                        justify-center
                        pb-8
                    ">
                        <Button 
                            text="Add Project"
                            onClick={() => (router.push("/add-project"))}
                        />            
                    </div>
                }
                                
            </FadeInOnView>

            {/* Project cards */}
            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    auto-rows-fr
                    items-stretch
                    px-[5%]
                    gap-16
                "
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onTouchCancel={() => {
                    setStartX(null);
                    setIsInteracting(false);
                    advanceIfExpired();
                }}
            >
                {                
                    featuredProjects.map((project,i) => (
                        <FadeInOnView
                            key={`${project.id}-${featuredStart}`}
                            className="w-full flex flex-col items-center gap-8 justify-between"
                            style={{
                                "--delay": `${i * 150}ms`,
                            } as React.CSSProperties}
                        >
                            <div
                                className="flex flex-1"
                                onMouseEnter={() => {
                                    setIsInteracting(true);
                                    setHoveredProject(project);
                                }}
                                onMouseLeave={() => {
                                    setIsInteracting(false);
                                    advanceIfExpired();
                                }}
                            >
                                <ProjectCard
                                    key={project.id ?? i}
                                    project={project}
                                    condenseTech={true}
                                    isLoggedIn={props.isLoggedIn}
                                    childClassName="xl:flex-col!"
                                    position={`${i % 2 === 0 ? "start" : "end"}`}
                                />                                
                            </div>


                            {/* Delete button if logged in */}
                            {props.isLoggedIn && (
                                <div className="w-full max-w-5xl flex justify-between">
                                    <Button
                                        text="Edit"
                                        className="min-w-32"
                                        onClick={() => {router.push(`add-project/edit?id=${project.id}`)}}
                                    />
                                    <DeleteButton
                                        className="min-w-32"
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
                                            
                                            notify("Project deleted successfully", "success");
                                        }}
                                    />                        
                                </div>
                            )}
                        </FadeInOnView>
                    ))
                }
            </div>    

            <Link
                href="/projects/all"
                className="
                    group
                    flex flex-col items-center
                    pt-[10%] sm:pt-[5%]
                    px-[5%]
                "
            >
                <h2 className="
                    relative
                    whitespace-nowrap
                    text-[clamp(2rem,5vw,3rem)]
                    font-bold
                    text-center
                    transition-transform duration-300
                    group-hover:translate-x-2
                ">
                    View All Projects

                    <span className="
                        inline-block
                        ml-3
                        transition-transform duration-300
                        group-hover:translate-x-2
                    ">
                        →
                    </span>

                    <span className="
                        absolute
                        left-0
                        -bottom-1.5
                        h-1
                        w-0
                        bg-current
                        transition-all duration-300
                        group-hover:w-full
                    " />
                </h2>

                <span className="
                    mt-8 sm:mt-12
                    h-px
                    w-24
                    bg-black/30
                    transition-all duration-300
                    group-hover:w-40
                    group-hover:bg-black
                " />
            </Link>
        </>

    );
}
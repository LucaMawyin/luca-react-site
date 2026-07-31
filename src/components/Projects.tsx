"use client";

import { useEffect, useRef, useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Button from "./Button";
import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton";
import FadeInOnView from "./FadeInOnView";

export default function Projects(props : {
    isLoggedIn : boolean,
    projects : Project[]
}) {

    const router = useRouter();

    // Fetching projects on load
    const [projects, setProjects] = useState<Project[]>(
        props.projects.filter((project) => project.deleted === 0)
    );
    const featuredProjects = projects.slice(0,5);
    const otherProjects = projects.slice(5);

    const [index, setIndex] = useState(0);

    const goPrev = () => {
        setIndex((prev) => (prev - 1 + otherProjects.length) % otherProjects.length);
    };

    const goNext = () => {
        setIndex((prev) => (prev + 1) % otherProjects.length);
    };

    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto flipping through cards
    useEffect(() => {
        if (otherProjects.length === 0) return;

        if (paused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = null;
            return;
        }

        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % otherProjects.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [paused, otherProjects.length]);


    // Swipe through cards on mobile
    const [startX, setStartX] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        const threshold = 50;

        if (diff > threshold) {
            goNext();
        } else if (diff < -threshold) {
            goPrev();
        }

        setStartX(null);
    };

    return(
        <>

            {/* FEATURED PROJECTS */}
            <h1 className={`
                text-center
                ${props.isLoggedIn ? "pb-0" : "pb-8"}
            `}>
                Featured Projects
            </h1>

            {/* Add Project button if logged in */}
            {props.isLoggedIn && 
                <div className="
                    flex 
                    w-full
                    justify-center
                    p-4 sm:p-0
                ">
                    <Button 
                        text="Add Project"
                        onClick={() => (router.push("/add-project"))}
                    />            
                </div>
            }
            
            {/* Project cards */}
            <div className="
                grid
                items-stretch
                auto-rows-fr
                pt-[2.5%]
                p-[5%]
                gap-16
            ">  
                {                
                    featuredProjects.map((project,i) => (
                        <FadeInOnView
                            key={project.id}
                            className="w-full flex flex-col items-center gap-8 justify-between"
                        >

                            <ProjectCard
                                key={project.id ?? i}
                                project={project}
                                isLoggedIn={props.isLoggedIn}
                                position={`${i % 2 === 0 ? "start" : "end"}`}
                            />

                            {/* Delete button if logged in */}
                            {props.isLoggedIn && (
                                <div className="w-full md:w-[70%] flex justify-between">
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
                                        }}
                                    />                        
                                </div>
                            )}
                        </FadeInOnView>
                    ))
                }
            </div>    

            {/* OTHER PROJECTS */}
            {otherProjects.length && (
                <>
                    <div className="
                        flex 
                        items-center 
                        justify-center
                        px-[5%]
                    ">

                        {/* TITLE + BUTTONS */}
                        <div
                            className="flex w-full md:w-[70%] h-fit justify-between"
                        >
                            <h3>
                                Other Projects
                            </h3>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={goPrev}
                                    className="
                                        cursor-pointer
                                        w-10 
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
                                        src="/arrow-left.svg"
                                        alt="left"
                                    />
                                </button>

                                <button
                                    onClick={goNext}
                                    className="
                                        cursor-pointer
                                        w-10 
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
                                        src="/arrow-right.svg"
                                        alt="right"
                                    />
                                </button>
                            </div>                    
                        </div>

                    </div>
                    
                    <FadeInOnView className="relative overflow-hidden w-full">
                        <div className="flex justify-center gap-2 mt-4">
                            {otherProjects.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`h-2 w-2 rounded-full transition-all ${
                                        index === i ? "bg-black w-4" : "bg-black/30"
                                    }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>   
                        <div 
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{
                                transform: `translateX(-${index*100}%)`
                            }}
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                        >
                            {otherProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="w-full shrink-0 flex justify-center p-[5%] md:pt-[2.5%] md:pb-[2.5%]"
                                >
                                    <div
                                        className="flex flex-col justify-center items-center gap-8"
                                    >
                                        <ProjectCard
                                            project={project}
                                            position="start"
                                            isLoggedIn={props.isLoggedIn}
                                            onHoverStart={() => setPaused(true)}
                                            onHoverEnd={() => setPaused(false)}
                                        />
                                        {/* Delete button if logged in */}
                                        {props.isLoggedIn && (
                                            <div className="w-full md:w-[70%] flex justify-between">
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
                                                    }}
                                                />                        
                                            </div>
                                        )}                                
                                    </div>
                

                                </div>
                            ))}
                        </div>       
            
                    </FadeInOnView>    
                </>            
            )}
        </>

    );
}
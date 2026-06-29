"use client";

import { useEffect, useState } from "react";
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
    const [projects, setProjects] = useState<Project[]>(props.projects);
    const featuredProjects = projects.slice(0,5);
    const otherProjects = projects.slice(5);

    const [index, setIndex] = useState(0);
    const total = otherProjects.length;

    const goPrev = () => {
        setIndex((prev) => (prev - 1 + total) % total);
    };

    const goNext = () => {
        setIndex((prev) => (prev + 1) % total);
    };

    useEffect(() => {
        if (otherProjects.length === 0) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % otherProjects.length)
        }, 4000);

        return () => clearInterval(interval);

    }, [otherProjects.length])


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
                gap-8
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
                                <div className="w-full md:w-[60%] flex justify-between">
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

            <h3 className={`
                text-center
            `}>
                Other Projects
            </h3>
            <div className="relative overflow-hidden w-full">
                {/* Left button */}
                <button
                    onClick={goPrev}
                    className="hidden md:flex absolute left-[5%] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-3 py-2 rounded-full cursor-pointer"
                >
                    &lt;
                </button>

                {/* Right button */}
                <button
                    onClick={goNext}
                    className="hidden md:flex absolute right-[5%] top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-3 py-2 rounded-full cursor-pointer"
                >
                    &gt;
                </button>
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
                            className="w-full shrink-0 flex justify-center p-[5%]"
                        >
                            <div
                                className="flex flex-col justify-center items-center gap-8"
                            >
                                <ProjectCard
                                    project={project}
                                    position="start"
                                    isLoggedIn={props.isLoggedIn}
                                />
                                {/* Delete button if logged in */}
                                {props.isLoggedIn && (
                                    <div className="w-full md:w-[60%] flex justify-between">
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
                <div className="flex justify-center gap-2 mt-4 md:hidden">
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
            </div>

            
        </>

    );
}
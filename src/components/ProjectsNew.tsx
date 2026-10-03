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

    const [isPaused, setIsPaused] = useState(false);
    useEffect(() => {
        if (featuredPool.length <= 3 || isPaused) return;

        const timeout = setTimeout(() => {
            setFeaturedStart((prev) => (prev + 1) % featuredPool.length);
        }, 10000);

        return () => clearTimeout(timeout);
    }, [featuredStart, featuredPool.length, isPaused]);

    return(
        <>

            {/* FEATURED PROJECTS */}
            <FadeInOnView>
                <h1 className={`
                    text-center
                    ${props.isLoggedIn ? "pb-4 lg:pb-0" : "pb-8"}
                `}>
                    Featured Projects
                </h1>

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
            <div className="
                grid
                grid-cols-1
                xl:grid-cols-3
                auto-rows-fr
                items-stretch
                px-[5%]
                gap-16
            ">
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
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                onTouchStart={() => setIsPaused(true)}
                                onTouchEnd={() => setIsPaused(false)}
                                onTouchCancel={() => setIsPaused(false)}
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
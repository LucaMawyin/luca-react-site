"use client";

import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/lib/types";

export default function AllProjects(props: {
    projects: Project[];
    isLoggedIn: boolean;
}) {
    return (
        <div className="w-full mt-[10vh]">
            <h1 className="text-center pb-4 px-8">
                All Projects
            </h1>

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-2
                xl:grid-cols-3
                auto-rows-fr
                items-stretch
                px-[5%]
                pb-4
                gap-8
            ">
                {props.projects.map((project) => (
                    <div
                        key={project.id}
                        className="w-full h-full flex justify-center"
                    >
                        <ProjectCard
                            project={project}
                            isLoggedIn={props.isLoggedIn}
                            position="start"
                            className="w-full max-w-lg! h-full!"
                            childClassName="flex-col! h-full!"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
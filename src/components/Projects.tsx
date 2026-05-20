"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects");

        if (!res.ok) throw new Error("Failed to fetch");

        const data: { projects?: Project[] } = await res.json();

        setProjects(data.projects ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return(
    <>
        <h1 className="text-center">Most Recent Projects</h1>
        <div className="
            min-h-[90vh]
            flex flex-col
            items-center
            pt-[2.5%]
            p-[5%]
            gap-8
        ">  
            {loading ? (
                <p>Loading...</p>
            ):(                
                projects.map((project,i) => (
                    <ProjectCard
                        key={project.id ?? i}
                        project={project}
                        position={`${i % 2 === 0 ? "start" : "end"}`}
                    />
                ))
            )}

        </div>    
    </>

  );
}
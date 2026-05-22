"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Button from "./Button";

export default function Projects(props : {isLoggedIn : boolean}) {
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
        <h1 className={`
          text-center
          ${props.isLoggedIn ? "pb-[1%]" : "pb-0"}
        `}>
          Most Recent Projects
        </h1>
        {props.isLoggedIn && 
          <div className="
            flex 
            w-screen
            justify-center
          ">
            <Button 
              text="Add Project"
            />            
          </div>

        }
        <div className="
            min-h-[90vh]
            grid
            justify-items-center
            items-stretch
            auto-rows-fr
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
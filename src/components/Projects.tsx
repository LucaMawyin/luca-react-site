"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Button from "./Button";
import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton";

export default function Projects(props : {
    isLoggedIn : boolean,
    projects : Project[]
  }) {

  const router = useRouter();

  // Fetching projects on load
  const [projects, setProjects] = useState<Project[]>(props.projects);

  return(
    <>
        <h1 className={`
          text-center
          ${props.isLoggedIn ? "pb-[1%]" : "pb-0"}
        `}>
          Most Recent Projects
        </h1>

        {/* Add Project button if logged in */}
        {props.isLoggedIn && 
          <div className="
            flex 
            w-full
            justify-center
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
              projects.map((project,i) => (
                  <div
                    key={project.id}
                    className="w-full flex flex-col items-center gap-8 justify-between"
                  >
                    <ProjectCard
                        key={project.id ?? i}
                        project={project}
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
                          action={async () => {
                            await fetch("/api/projects", {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ id: project.id }),
                            });
                            
                            setProjects((prev) =>
                              prev.filter((p) => p.id !== project.id)
                            );
                          }}
                        />                        
                      </div>


                    )}
                </div>
              ))
            }

        </div>    
    </>

  );
}
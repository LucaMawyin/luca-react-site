"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Button from "./Button";
import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton";

export default function Projects(props : {isLoggedIn : boolean}) {

  const router = useRouter();

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
            w-full
            justify-center
          ">
            <Button 
              text="Add Project"
              onClick={() => (router.push("/add-project"))}
            />            
          </div>

        }
        <div className="
            min-h-[90vh]
            grid
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
                    <div
                      key={project.id}
                      className="w-full flex flex-col items-center gap-8 justify-between"
                    >
                      <ProjectCard
                          key={project.id ?? i}
                          project={project}
                          position={`${i % 2 === 0 ? "start" : "end"}`}
                      />

                      {props.isLoggedIn && (
                        <DeleteButton
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
                      )}
                    </div>
                ))
            )}

        </div>    
    </>

  );
}
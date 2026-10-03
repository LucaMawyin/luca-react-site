"use client";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import { useNotifications } from "@/components/NotificationProvider";
import { getProject } from "@/lib/getProjects";
import { Project } from "@/lib/types";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function ProjectPageClient({
    project,
    isLoggedIn,
}: {
    project: Project;
    isLoggedIn: boolean;
}) {

    const router = useRouter();
    const { notify } = useNotifications();

    const tools = (
    typeof project.tools === "string"
        ? JSON.parse(project.tools || "[]")
        : project.tools || []
    ) as string[];

    const languages = (
    typeof project.languages === "string"
        ? JSON.parse(project.languages || "[]")
        : project.languages || []
    ) as string[];

    const libraries = (
    typeof project.libraries === "string"
        ? JSON.parse(project.libraries || "[]")
        : project.libraries || []
    ) as string[];

    return (
        <div className="
            mt-[10vh]
            flex
            flex-1
            justify-center
        ">
            <div className="
                flex
                flex-col
                flex-1
                max-w-2xl
                p-4
                gap-4
            ">
                {/* RETURN */}
                <Link 
                    href="/projects" 
                    className="
                        w-fit 
                        transition-all
                        duration-(--transition-duration)
                        hover:scale-(--subtle-scale)
                        hover:font-semibold
                    "
                >
                    &lt; Return to Projects
                </Link>

                {/* PROJECT */}
                {project.image && (
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full rounded-2xl"
                    />
                )}
                
                <a
                    href={project.link}
                    target="_blank"
                    className="
                        group
                        flex
                        flex-row
                        w-fit
                        transition-colors
                        duration-200
                        hover:text-blue-800
                    "
                >
                    <h2 className="m-0 text-6xl leading-none">
                        {project.name}
                    </h2>

                    <img
                        src="/new-tab.svg"
                        alt="Open In New Tab"
                        className="ml-4 h-8 w-8 brightness-0 self-center"
                    />
                </a>

                <div className="
                    text-gray-400 
                    text-sm
                    flex
                    flex-col
                    gap-2
                ">
                    <p>
                        Created{" "}
                        {new Date(project.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}                    
                    </p>

                    <p>
                        Updated{" "}
                        {new Date(project.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}                    
                    </p>                    
                </div>

                

                {project.subtitle && (
                    <h2 className="
                        min-w-full
                        prose
                        prose-sm
                        prose-a:text-blue-400
                        prose-a:transition-colors
                        prose-a:duration-100
                        prose-a:no-underline
                        prose-a:hover:text-blue-800
                        prose-h1:mb-0
                        prose-h1:text-6xl!
                        prose-h2:mt-0
                        prose-h2:mb-4
                        prose-h2:text-4xl!
                        prose-h3:mt-0
                        prose-h3:text-2xl!
                    ">
                        <ReactMarkdown>
                            {project.subtitle}
                        </ReactMarkdown>
                    </h2>  
                )}
                
                <div className="
                    min-w-full
                    prose
                    prose-sm
                    prose-a:text-blue-400
                    prose-a:transition-colors
                    prose-a:duration-100
                    prose-a:no-underline
                    prose-a:hover:text-blue-800
                    prose-h1:mb-0
                    prose-h1:text-6xl!
                    prose-h2:mt-0
                    prose-h2:mb-4
                    prose-h2:text-4xl!
                    prose-h3:mt-0
                    prose-h3:text-2xl!
                ">
                    <ReactMarkdown>
                        {project.content}
                    </ReactMarkdown>
                </div>  


                {/* TECHNOLOGIES */}
                <div className="
                    pt-4
                    border-t
                    border-gray-200
                ">
                    <h2 className="text-2xl font-bold">
                        Technologies
                    </h2>

                    {/* LANGUAGES */}
                    {languages.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <b>Languages:</b>

                            {languages.map((lang, i) => (
                                <Badge
                                    key={i}
                                    fontWeight="normal"
                                    borderRadius="lg"
                                    textSize="xs"
                                    shadow="sm"
                                    px={2}
                                    py={1}
                                    className="bg-gray-200 border border-gray-300"
                                    text={lang}
                                />
                            ))}
                        </div>
                    )}

                    {/* LIBRARIES */}
                    {libraries.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <b>Libraries:</b>

                            {libraries.map((library, i) => (
                                <Badge
                                    key={i}
                                    fontWeight="normal"
                                    borderRadius="lg"
                                    textSize="xs"
                                    shadow="sm"
                                    px={2}
                                    py={1}
                                    className="bg-gray-100 border border-gray-300"
                                    text={library}
                                />
                            ))}
                        </div>
                    )}

                    {/* TOOLS */}
                    {tools.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <b>Tools:</b>

                            {tools.map((tool, i) => (
                                <Badge
                                    key={i}
                                    fontWeight="normal"
                                    borderRadius="lg"
                                    textSize="xs"
                                    shadow="sm"
                                    px={2}
                                    py={1}
                                    className="bg-gray-300 border border-gray-400"
                                    text={tool}
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Delete button if logged in */}
                {isLoggedIn && (
                    <div className="w-full flex flex-wrap justify-between mt-8 gap-6">
                        <Button
                            text="Edit"
                            className="h-fit w-full sm:w-1/4!"
                            y={2}
                            x={0}
                            onClick={() => {router.push(`/add-project/edit?id=${project.id}`)}}
                        />
                        <DeleteButton
                            text="Project"
                            className="h-fit w-full sm:w-1/4!"
                            y={2}
                            x={0}
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
                                
                                router.push("/projects");
                                
                                notify("Project deleted successfully", "success");
                            }}
                        />                        
                    </div>
                )}
            </div>
        </div>
    );
}
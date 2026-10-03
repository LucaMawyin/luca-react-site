import Badge from "@/components/Badge";
import { getProject } from "@/lib/getProjects";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

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
                        transition-transform duration-(--transition-duration)
                        hover:scale-(--link-scale)
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
                        className="ml-2 h-12 w-12 brightness-0 self-center"
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
            </div>
        </div>
    );
}
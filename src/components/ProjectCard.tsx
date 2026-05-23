import { Project } from "@/lib/types";

export default function ProjectCard( props : {
    project : Project;
    position : "start" | "end";
}){
    const tools = (
    typeof props.project.tools === "string"
        ? JSON.parse(props.project.tools || "[]")
        : props.project.tools || []
    ) as string[];

    const languages = (
    typeof props.project.languages === "string"
        ? JSON.parse(props.project.languages || "[]")
        : props.project.languages || []
    ) as string[];

    return (
        <a
            href={props.project.link}
            target="_blank"
            className={`
                flex
                flex-col
                rounded-xl
                shadow-[0_4px_10px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]
                w-full
                h-full
                md:w-[60%]
                md:p-8
                p-4
                gap-8

                transition-all
                duration-(--transition-duration)
                hover:scale-(--subtle-scale)
                hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_-2px_4px_rgba(0,0,0,0.05)]
                justify-evenly
            `}
        >   

            {/* Tile title */}
            <h1 className={`
                text-2xl! 
                text-center 
                ${props.position === "end"
                    ? "md:text-right"
                    : "md:text-left"
                }
                border-b border-gray-200
            `}>
                {props.project.name}
            </h1>

            {/* Tile Content */}
            <div
                className={`
                    flex
                    flex-wrap
                    ${props.position === "end" ? "flex-row-reverse" : "flex-row"}
                    justify-between
                    gap-8
                `}
            >
                {/* Image */}
                <div className="flex-1 min-w-75 flex justify-center">
                    {props.project.image_type && 
                        <img
                            src={`/api/projects/image/${props.project.id}`}
                            alt={`Project ${props.project.id}`}
                            className="w-full h-auto object-contain rounded-xl"
                        />                        
                    }
                </div>

                {/* Text Content */}
                <div className="
                    flex-1 
                    flex flex-col
                    min-w-75
                    justify-between
                ">
                    {props.project.description}
                    <div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(languages ?? []).length > 0 && <b>Languages:</b>}
                            {(languages ?? []).map((lang, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-sm rounded-full bg-gray-200"
                            >
                                {lang}
                            </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {(tools ?? []).length > 0 && <b>Tools:</b>}
                            {(tools ?? []).map((tool, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-sm rounded-full bg-gray-300"
                            >
                                {tool}
                            </span>
                            ))}
                        </div>                        
                    </div>

                </div>
            </div>
        </a>
    );
}
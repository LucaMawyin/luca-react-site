import { getTagStyle } from "@/lib/tags";
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

    const libraries = (
    typeof props.project.libraries === "string"
        ? JSON.parse(props.project.libraries || "[]")
        : props.project.libraries || []
    ) as string[];

    const tagStyle = getTagStyle(props.project.tag);

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
            <div className={`
                flex 
                flex-col
                ${props.position === "start" ? "sm:flex-row" : "sm:flex-row-reverse"}
                justify-between 
                w-full 
                border-b border-gray-200 
                items-center sm:items-stretch 
                md:gap-6 gap-4
                sm:pb-6
                pb-4
            `}>
                <h1
                    className={`
                        text-2xl!
                        w-fit
                        text-center
                        ${props.position === "start" ? "sm:mr-auto" : "sm:ml-auto"}
                    `}
                >
                    {props.project.name}
                </h1>
                
                {props.project.tag && (
                    <h2 
                        style={{ "--glow": tagStyle.glow } as React.CSSProperties}

                        className={`
                            self-center sm:self-start
                            text-xl
                            min-w-fit
                            w-fit
                            inline-flex
                            text-center
                            justify-center
                            px-3
                            py-1
                            mt-2
                            sm:mt-0
                            font-semibold
                            rounded-full
                            border
                            leading-none
                            animate-tag-pulse
                            ${tagStyle.className}
                        `}
                    >
                        {props.project.tag}
                    </h2>
                )}
            </div>


            {/* Tile Content */}
            <div
                className={`
                    flex
                    flex-1
                    flex-wrap
                    ${props.position === "end" ? "flex-row-reverse" : "flex-row"}
                    justify-between
                    gap-8
                `}
            >
                {/* Image */}
                <div className="flex-1 min-w-75 flex justify-center">
                    {props.project.image && 
                        <div className="flex items-center">
                            <img
                                src={props.project.image}
                                alt={`Project ${props.project.id}`}
                                className="w-full h-auto rounded-xl"
                            />                                   
                        </div>
                 
                    }
                </div>

                {/* Text Content */}
                <div className="
                    flex-1 
                    flex flex-col
                    min-w-75
                    justify-evenly
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

                        <div className="flex flex-wrap gap-2 mt-2">
                            {(libraries ?? []).length > 0 && <b>libraries:</b>}
                            {(libraries ?? []).map((libraries, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-sm rounded-full bg-gray-100"
                            >
                                {libraries}
                            </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </a>
    );
}
import { shadow } from "@/lib/tags";
import { Project } from "@/lib/types";
import React from "react";
import ReactMarkdown from "react-markdown";
import Badge from "./Badge";
import TechBadges from "./TechBadges";


export default function ProjectCard( props : {
    project : Project;
    position : "start" | "end";
    isLoggedIn : boolean;
    className?:string;
    childClassName?:string;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    condenseTech?:boolean;
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

    const techLimit = props.condenseTech ? 2 : Infinity;

    const visibleLanguages = languages.slice(0, techLimit);
    const visibleLibraries = libraries.slice(0, techLimit);
    const visibleTools = tools.slice(0, techLimit);

    const remainingLanguages = Math.max(0, languages.length - techLimit);
    const remainingLibraries = Math.max(0, libraries.length - techLimit);
    const remainingTools = Math.max(0, tools.length - techLimit);

    
    const { glowColour, glowRGB, borderColour } = shadow(props.project.colour);
    const { 
        glowColour: statusGlowColour, 
        glowRGB: statusGlowRGB, 
        borderColour: statusBorderColour
    } = shadow(props.project.status_colour);

    const [isPressed, setIsPressed] = React.useState(false);

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
                max-w-5xl
                md:p-8
                p-4
                

                transition-all
                duration-(--transition-duration)
                ${isPressed ? "scale-(--subtle-scale) shadow-[0_8px_20px_rgba(0,0,0,0.12)]" : ""}
                hover:scale-(--subtle-scale)
                hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_-2px_4px_rgba(0,0,0,0.05)]
                justify-evenly
                squircle-large
                pillow
                pillow-hover
                ${props.className}
            `}
            onMouseEnter={props.onHoverStart}
            onMouseLeave={props.onHoverEnd}
            onTouchStart={() => {
                setIsPressed(true)
                props.onHoverStart?.();
            }}
            onTouchEnd={() => {
                setIsPressed(false);
                props.onHoverEnd?.();
            }}
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
                gap-2
                pb-4
            `}>
                <h1
                    className={`
                        text-2xl!
                        w-fit
                        text-center
                        ${props.position === "start" ? "sm:mr-auto sm:text-left" : "sm:ml-auto sm:text-right"}
                    `}
                >
                    {props.project.name}
                </h1>
                
                {props.project.tag && (
                    
                    <h2 
                        style={{ 
                            "--glow": glowRGB,
                            backgroundColor: props.project.colour,
                            color: glowColour,
                            borderColor: borderColour,
                        } as React.CSSProperties}

                        className={`
                            self-center sm:self-start
                            text-xl
                            max-w-fit
                            w-fit
                            inline-flex
                            text-center
                            justify-center
                            px-3
                            py-1
                            font-semibold
                            rounded-full
                            border
                            leading-none
                            animate-tag-pulse
                            ${props.childClassName?.includes("flex-col") ? "flex-wrap" : ""}
                        `}
                    >
                        {props.project.tag}
                    </h2>
                )}
            </div>

            {/* STATUS / PIN / HIDDEN */}
            <div className={`
                min-h-8
                flex 
                ${props.position === "start" ? "sm:flex-row" : "sm:flex-row-reverse"}
                items-center 
                justify-center
                sm:justify-between
                gap-4
            `}>
                
                {/* STATUS */}
                {props.project.status && (
                    <Badge
                        text={props.project.status}
                        style={{
                            "--glow" : statusGlowRGB,
                            backgroundColor: props.project.status_colour,
                            borderColor: statusBorderColour,
                            color: statusGlowColour,
                        } as React.CSSProperties}
                        className="
                            border
                            animate-tag-pulse
                        "
                    />
                        
                )}
                
                {(props.project.pinned === 1|| props.project.hidden === 1) && props.isLoggedIn &&(
                    <div className="flex flex-row gap-4">
                        {/* PIN */}
                        {(props.project.pinned === 1) && (
                            <Badge
                                text="Pinned"
                                className="bg-yellow-400"
                            />

                        )}

                        {/* HIDDEN */}
                        {(props.project.hidden === 1) && (
                            <Badge
                                text="Hidden"
                                className="bg-orange-400"
                            />
                        )}                    
                    </div>                    
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
                    ${props.childClassName}
                `}
            >

                
                {/* Image */}
                <div className="flex-1 min-w-75 lg:min-w-0 max-w-full flex justify-center">
                    {props.project.image && 
                        <div className="flex items-center">
                            <img
                                src={props.project.image}
                                alt={`Project ${props.project.id}`}
                                className="w-full h-auto rounded-xl"
                                loading="lazy"
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
                    text-sm
                ">
                    <ReactMarkdown>{props.project.description}</ReactMarkdown> 
                    <div>

                        <TechBadges
                            label="Languages"
                            items={languages}
                            condensed={props.condenseTech}
                            className="bg-gray-200 border border-gray-300"
                        />

                        <TechBadges
                            label="Libraries"
                            items={libraries}
                            condensed={props.condenseTech}
                            className="bg-gray-100 border border-gray-300"
                        />

                        <TechBadges
                            label="Tools"
                            items={tools}
                            condensed={props.condenseTech}
                            className="bg-gray-300 border border-gray-400"
                        />


                    </div>

                </div>
            </div>
        </a>
    );
}
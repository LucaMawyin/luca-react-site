"use client";

import { Experience } from "@/lib/types";
import FadeInOnView from "./FadeInOnView";
import Button from "./Button";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { formatToMonthYear } from "@/lib/formatMonthYear";
import DeleteButton from "./DeleteButton";
import { useState } from "react";


export default function ExperienceClient(props: { isLoggedIn:boolean; experienceList: Experience[] }) {

    const router = useRouter();
    const [experience, setExperience] = useState<Experience[]>(props.experienceList);

    return (
        <div
            className="
                flex w-full flex-col items-center py-4 sm:pt-16 px-4
            "
        >
            <h1 className={`
                text-3xl 
                font-bold
                pt-4 sm:pt-0
                ${props.isLoggedIn ? "" : "pb-8 sm:pb-0"}
            `}>
                Experience
            </h1>

            {/* Add Experience button if logged in */}
            {props.isLoggedIn && 
                <div className="
                    flex 
                    w-full
                    justify-center
                    p-4 sm:p-0 sm:pt-4
                ">
                    <Button 
                        text="Add Experience"
                        onClick={() => (router.push("/add-experience"))}
                    />            
                </div>
    
            }

            {/* CARDS */}
            <div className={`
                relative
                w-full
                grid
                
                p-[2.5%]
                gap-8
            `}>

                {/* CENTER LINE */}
                <div className="
                    absolute
                    hidden md:block
                    left-1/2
                    top-[5%]
                    bottom-[5%]
                    w-0.5
                    bg-neutral-300
                    -translate-x-1/2
                " />

                {experience.map((exp,index) => (
                    <FadeInOnView 
                        key={index}
                        className={`
                            flex 
                            flex-col
                            w-full
                            lg:px-[5%]
                            gap-8
                            md:mb-[-5%]
                            last:md:mb-0
                        `}
                    >

                        {/* CARD & DOT */}
                        <div className="
                            relative
                            flex
                            flex-col
                            gap-8
                            w-full
                        ">
                            {/* DOT */}
                            <div className="
                                hidden md:block
                                absolute
                                left-1/2
                                top-1/2
                                w-4 h-4
                                rounded-full
                                bg-neutral-400
                                -translate-x-1/2
                                -translate-y-1/2
                                z-10
                            " />

                     
                            <div
                                className={`
                                    flex
                                    flex-col
                                    rounded-xl
                                    shadow-[0_4px_10px_rgba(0,0,0,0.08),0_-1px_3px_rgba(0,0,0,0.04)]
                                    p-6
                                    gap-4
                                    w-full
                                    md:w-[45%]
                                    ${index % 2 === 0 
                                        ? "md:self-start" 
                                        : "md:self-end"
                                    }
                                `}
                            >
                                {/* TITLE + DATE */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                    <h2 className="text-lg sm:text-xl font-semibold">
                                        {exp.title}
                                    </h2>

                                    <span className="hidden sm:inline text-neutral-400">•</span>

                                    <span className="text-sm text-neutral-500">
                                        {formatToMonthYear(exp.start_date)} - {exp.end_date ? formatToMonthYear(exp.end_date) : "Present"}
                                    </span>
                                </div>

                                {/* COMPANY + LOCATION */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                    <span className="text-sm">
                                        {exp.company}
                                    </span>

                                    <span className="hidden sm:inline text-neutral-400">|</span>

                                    <span className="text-sm text-neutral-500">
                                        {exp.city}, {exp.region}
                                    </span>
                                </div>

                                {/* TAG */}
                                {exp.tag && (
                                    <div>
                                        <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                                            {exp.tag}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="text-sm mt-2">
                                    <ReactMarkdown
                                        components={{
                                            ul: ({ ...props }) => (
                                                <ul className="list-disc pl-5 space-y-1" {...props} />
                                            ),
                                            li: ({ ...props }) => (
                                                <li {...props} />
                                            ),
                                        }}
                                        >
                                        {exp.description}
                                    </ReactMarkdown>
                                </div>

                            </div>
                        </div>


                        {/* BUTTONS */}
                        {props.isLoggedIn && (
                            <div className={`
                                flex 
                                h-fit
                                w-full 
                                md:w-[45%] 
                                justify-between
                                ${index % 2 === 0 
                                    ? "md:self-start" 
                                    : "md:self-end"
                                }
                            `}>
                                <Button
                                    text="Edit"
                                    className="min-w-32 h-fit"
                                    onClick={() => {router.push(`add-experience/edit?id=${exp.id}`)}}
                                />
                                <DeleteButton
                                    className="min-w-32 h-fit"
                                    text="Experience"
                                    action={async () => {
                                    const res = await fetch("/api/experience", {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ id: exp.id }),
                                    });
        
                                    if (res.status === 401) {
                                        router.push("/login");
                                        return;
                                    }
                                    
                                        setExperience((prev) =>
                                            prev.filter((p) => p.id !== exp.id)
                                        );
                                    }}
                                />                        
                            </div>
    
    
                        )}
                        
                    </FadeInOnView>
                    
                ))}
            </div>


        </div>
    );
}

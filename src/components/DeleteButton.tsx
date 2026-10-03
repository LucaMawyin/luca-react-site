"use client";

import Button from "@/components/Button";
import { useEffect, useState, useTransition } from "react";
import Tile from "./Tile";
import { createPortal } from "react-dom";
import { getLenis } from "./SmoothScroll";

export default function DeleteButton({
    action,
    className = "",
    disabled= false,
    text="",
    customText="",
    customDescription="",
    x,
    y,
}: {
    action: () => void;
    className?: string;
    disabled?: boolean;
    text?:string;
    customText?:string;
    customDescription?:string;
    x?:number;
    y?:number;
}) {
    
    // Handle delete action with transition
    const [isPending, startTransition] = useTransition();
    const handleDelete = () => {
        startTransition(async () => {
            await action();
        });
    };

    // Prevent background scrolling on confirmation dialog
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";

            getLenis()?.stop();
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

            getLenis()?.start();
        }

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            getLenis()?.start();
        };
    }, [open]);

    return (
        <>
            <Button
                text={customText ? `${customText} ${customDescription ? customDescription : ""}` : `Delete`}
                type="button"
                variant="red"
                disabled={disabled}
                className={className}
                onClick={() => setOpen(true)}
                x={x}
                y={y}
            />

            {/* Confirmation dialog */}
            {open && createPortal(
                <div 
                    className="
                        fixed inset-0
                        bg-black/50
                        flex items-center justify-center
                        z-60
                        touch-none
                    "
                    onClick={() => setOpen(false)}
                >
                    
                    <Tile 
                        title={customText ? `${customText} ${customDescription}?` : `Delete ${customText ? customText : text}?`} 
                        className="bg-white p-[5%] rounded shadow-md max-w-full sm:max-w-fit sm:p-[2%]"
                        disableHover={true}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <p className="text-sm text-gray-600 mb-6 mt-4">
                            This action cannot be undone.
                        </p>


                        <div className="flex justify-between gap-3">

                            <Button
                                text="Cancel"
                                variant="secondary"
                                x={4}
                                y={2}
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                
                            </Button>
                            <Button
                                text={customText ? customText : "Delete"}
                                variant="red"
                                x={6}
                                y={2}
                                onClick={() => {
                                    setOpen(false);
                                    handleDelete();
                                }}
                                disabled={isPending}
                            >

                            </Button>
                        </div>
                    </Tile>
                </div>, document.body
            )}
        </>
    );
}
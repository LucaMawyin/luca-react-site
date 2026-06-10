"use client";

import Button from "@/components/Button";
import { useEffect, useState, useTransition } from "react";
import Tile from "./Tile";
import { createPortal } from "react-dom";

export default function DeleteButton({
    action,
    className = "",
    disabled= false,
    text="",
}: {
    action: () => void;
    className?: string;
    disabled?: boolean;
    text?:string;
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
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    return (
        <>
            <Button
                text="Delete"
                type="button"
                disabled={disabled}
                className={`bg-red-600 hover:bg-red-700 ${className}`}
                onClick={() => setOpen(true)}
            />

            {/* Confirmation dialog */}
            {open && createPortal(
                <div 
                    className="
                        fixed inset-0
                        bg-black/50
                        flex items-center justify-center
                        z-60
                ">
                    <Tile 
                        title={`Delete ${text}?`} 
                        className="bg-white p-[5%] rounded shadow-md max-w-full sm:max-w-fit sm:p-[2%]"
                        disableHover={true}
                    >

                        <p className="text-sm text-gray-600 mb-6 mt-4">
                            This action cannot be undone.
                        </p>


                        <div className="flex justify-between gap-3">

                            <Button
                                text="Cancel"
                                variant="secondary"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                
                            </Button>
                            <Button
                                text="Delete"
                                className="bg-red-600 hover:bg-red-700"
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
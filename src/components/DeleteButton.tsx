"use client";

import Button from "@/components/Button";
import { useEffect, useState, useTransition } from "react";
import Tile from "./Tile";

export default function DeleteButton({
  action,
  className = "",
}: {
  action: () => void;
  className?: string;
}) {

    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            await action();
        });
    };

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
                text="Delete Project"
                type="button"
                className="bg-red-600 hover:bg-red-700 w-fit"
                onClick={() => setOpen(true)}
            />
            {open && (
                <div 
                    className="
                    fixed inset-0 
                    bg-black/50 
                    flex items-center justify-center
                    z-50"
                >
                    <Tile 
                        title="Delete project?" 
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
                </div>
            )}
        </>
    );
}
"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import Button from "./Button";

type DayPickerClientProps = {
    onChange: (date: Date | undefined) => void;
    initialDate?: Date;
    initialMonth?: Date;
    className?: string;
};

export default function DayPickerClient({
    onChange,
    initialDate,
    initialMonth,
    className = "",
}: DayPickerClientProps) {
    const [date, setDate] = useState<Date | undefined>(initialDate);

    useEffect(() => {
        setDate(initialDate);
    }, [initialDate]);

    const [open, setOpen] = useState(false);

    const formatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
            date.getDate()
        ).padStart(2, "0")}/${date.getFullYear()}`;

    const dateLabel = date ? formatDate(date) : "Select date";

    const handleApply = () => {
        if (!date) return;

        onChange(date);
        setOpen(false);
    };

    const today = new Date();

    return (
        <div className={`relative mt-0! [&_div]:mt-0! [&_select]:mb-0! ${className}`}>
            <button
                type="button"
                id="date-picker"
                className="hover:cursor-pointer"
                onClick={() => setOpen(true)}
            >
                📅 {dateLabel}
            </button>

            {open && (
                <>
                    <div
                        className="mt-0! fixed inset-0 z-9998 bg-black/60"
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className="
                            fixed
                            left-1/2
                            top-1/4
                            z-9999
                            -translate-x-1/2
                            rounded-xl
                            bg-(--bg)
                            p-4
                            shadow-2xl
                            scheme-dark
                        "
                    >
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            defaultMonth={initialMonth}
                            captionLayout="dropdown"
                            startMonth={
                                new Date(
                                    today.getFullYear() - 5,
                                    today.getMonth(),
                                    1
                                )
                            }
                            endMonth={
                                new Date(
                                    today.getFullYear() + 1,
                                    today.getMonth(),
                                    1
                                )
                            }
                            classNames={{
                                dropdown:
                                    "rounded-md bg-(--bg) px-2 py-1 cursor-pointer",
                                dropdowns: "flex gap-2",
                                caption_label: "hidden",

                                button_next:
                                    "ml-2 text-(--contrast-colour) cursor-pointer [&_svg]:fill-(--contrast-colour)!",

                                button_previous:
                                    "text-(--contrast-colour) cursor-pointer [&_svg]:fill-(--contrast-colour)!",

                                day_button: "cursor-pointer",

                                selected:
                                    "bg-(--contrast-colour) text-(--bg) rounded-full",
                            }}
                        />

                        <Button
                            text="Apply Date"
                            x={0}
                            y={2}
                            type="button"
                            disabled={!date}
                            onClick={handleApply}
                            className="
                                mt-2
                                w-full
                                rounded-lg!
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        />
                    </div>
                </>
            )}
        </div>
    );
}
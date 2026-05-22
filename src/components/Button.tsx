"use client";

export default function Button(props : {
    text : string; 
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "red";
    children?:React.ReactNode;
    className?:string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    name?:string;
    value?:string;
}){

    function clickEvent(e: React.MouseEvent<HTMLButtonElement>) {
        props.onClick?.(e);
    }

    const base = "min-h-14 py-4 px-8 rounded-lg transition duration-(--transition-duration) cursor-pointer";

    const styles = {
        primary:
        "bg-(--contrast-light) text-white hover:bg-(--contrast-colour) hover:shadow-xl",
        secondary:
        "bg-gray-200 text-black hover:bg-gray-300 hover:shadow-md",
        red : "bg-red-600 text-white hover:bg-red-700 hover:shadow-md",
    };

    const disabledStyle = props.disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

    return(
        <button 
            type={props.type ?? "button"}
            onClick={clickEvent} 
            disabled={props.disabled}
            className={`${base} ${styles[props.variant ?? "primary"]} ${props.className ?? ""} ${disabledStyle}`}
            name={props.name}
            value={props.value}
        >
                
            {props.text}
            {props.children}
        </button>
    )
}
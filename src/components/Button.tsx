"use client";

export default function Button(props : {
    text : string; 
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "red" | "transparent";
    children?:React.ReactNode;
    className?:string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    name?:string;
    value?:string;
    x?:number;
    y?:number;
}){

    // Handle click event
    function clickEvent(e: React.MouseEvent<HTMLButtonElement>) {
        props.onClick?.(e);
    }

    // Base button style
    const base = `w-fit ${props.y ? "" : "py-4"}  ${props.x ? "" : "px-8"} rounded-xl transition duration-(--transition-duration) cursor-pointer`;

    // Variant styles
    const styles = {
        primary:
            "bg-(--contrast-light) text-white hover:bg-(--contrast-colour) hover:shadow-xl",
        secondary:
            "bg-gray-200 text-black border border-gray-300 hover:bg-gray-300 hover:border-gray-400 hover:shadow-md",
        red : 
            "bg-red-600 text-white hover:bg-red-700 hover:shadow-md",
        transparent:
            "bg-transparent text-black",
    };

    // Add disabled styles if the button is disabled
    const disabledStyle = props.disabled
        ? "opacity-50 hover:bg-red-600! cursor-default!"
        : "";

    return(
        <button 
            type={props.type ?? "button"}
            onClick={clickEvent} 
            disabled={props.disabled}
            className={`${base} ${styles[props.variant ?? "primary"]} ${props.className ?? ""} ${disabledStyle}`}
            name={props.name}
            value={props.value}
            style={{
                ...(props.y != null && {
                    paddingTop: `${props.y * 0.25}rem`,
                    paddingBottom: `${props.y * 0.25}rem`,
                }),
                ...(props.x != null && {
                    paddingRight: `${props.x * 0.25}rem`,
                    paddingLeft: `${props.x * 0.25}rem`,
                }),
            }}
        >
                
            {props.text}
            {props.children}
        </button>
    )
}
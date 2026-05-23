
export default function Tile(props : {
    title? : string, 
    children?: React.ReactNode, 
    className?: string, 
    titleClassName?: string, 
    disableHover?: boolean
}){
    return (
        <div 
            className={`
            flex
            ${props.className?.includes("flex-0")? "" : "flex-1"}
            flex-col
            
            ${props.className?.includes("max-w")? "" : "max-w-[40vw]"} 
            ${props.className?.includes("min-w")? "" : "min-w-87.5"}
            rounded-xl 
            shadow-[0_15px_30px_rgba(0,0,0,0.13)] 
            p-[2%]
            
            transition-all duration-(--transition-time) ease-out
            ${props.disableHover? "" : "hover:shadow-2xl hover:-translate-y-2"}
            ${props.className??""}`}>
            <h1 
                className={`
                    ${props.titleClassName?.includes("text-") ? "" : "text-[3em]!" } 
                    ${props.titleClassName}`
                }
            >
                {props.title}
            </h1>

            <div className="mt-auto flex flex-col">
                {props.children}
            </div>
            
            
        </div>
    );
}
export default function Badge(props : {
    text: string;
    className?: string;
    shadow?: boolean;
    style?: React.CSSProperties;
    fit?: "tight" | "short" | "wide" | "tall";
}) {
    return (
        <span
            style={{
                color: "black",
                ...props.style,
            }}
            className={`
                ${props.className?.includes("font-") ? "" : "font-semibold"}
                rounded-full
                ${props.shadow !== false ? "shadow-md" : ""}
                ${
                    props.fit === "tight"
                        ? "px-2 py-1 text-sm"
                        : props.fit === "short"
                        ? "px-3 py-0 text-base"
                        : props.fit === "wide"
                        ? "px-5 py-1 text-xs"
                        : props.fit === "tall"
                        ? "px-3 py-2 text-xs"
                        : "px-3 py-1 text-xs"
                }
                ${props.className ?? ""}
            `}
        >
            {props.text}
        </span>
    );
}
export default function Badge(props : {
    text: string;
    className?: string;
    shadow?: boolean;
    style?: React.CSSProperties;
}) {
    return (
        <span
            style={{
                color: "black",
                ...props.style,
            }}
            className={`
                px-3
                py-1
                text-xs
                font-semibold
                rounded-full
                ${props.shadow !== false ? "shadow-md" : ""}
                ${props.className ?? ""}
            `}
        >
            {props.text}
        </span>
    );
}
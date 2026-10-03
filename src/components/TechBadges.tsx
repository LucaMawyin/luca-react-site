import Badge from "./Badge";

export default function TechBadges({
    label,
    items,
    className,
    condensed = false,
}: {
    label: string;
    items: string[];
    className?: string;
    condensed?: boolean;
}) {
    if (items.length === 0) return null;

    const visible = condensed ? items.slice(0, 2) : items;
    const remaining = items.slice(visible.length);

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            <b>{label}:</b>

            {visible.map((item, i) => (
                <Badge
                    key={i}
                    fontWeight="normal"
                    borderRadius="lg"
                    textSize="xs"
                    shadow="sm"
                    px={2}
                    py={1}
                    className={className}
                    text={item}
                />
            ))}

            {condensed && remaining.length > 0 && (
                remaining.length === 1 ? (
                    <Badge
                        fontWeight="normal"
                        borderRadius="lg"
                        textSize="xs"
                        shadow="sm"
                        px={2}
                        py={1}
                        className={className}
                        text={remaining[0]}
                    />
                ) : (
                    <Badge
                        fontWeight="normal"
                        borderRadius="lg"
                        textSize="xs"
                        shadow="sm"
                        px={2}
                        py={1}
                        className={className}
                        text={`+${remaining.length} others`}
                    />
                )
            )}
        </div>
    );
}
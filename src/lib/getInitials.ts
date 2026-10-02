export function getInitials(item: string){
    return (
        item
            .split(/[\s.+#-]+/)
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    );
}
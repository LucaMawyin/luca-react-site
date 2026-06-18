export function formatToMonthYear(value: string | undefined) {
    if (!value) return "";

    const str = value.toString();

    const year = Number(str.slice(0, 4));
    const month = Number(str.slice(4, 6));

    const date = new Date(year, month - 1);

    return date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
    });
}
export function capitalizeTitle(title: string): string {
	return title
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
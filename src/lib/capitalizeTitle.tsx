export function capitalizeTitle(title: string): string {
	const minorWords = new Set([
		"a", "an", "the",
		"and", "but", "or", "nor",
		"for", "so", "yet",
		"at", "by", "in", "of", "on", "to", "up",
		"as", "if", "off", "out", "per", "via"
	]);

	const words = title.toLowerCase().split(" ");

	return words
		.map((word, index) => {
			// Always capitalize first and last word
			if (
				index === 0 ||
				index === words.length - 1 ||
				!minorWords.has(word)
			) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			}

			return word;
		})
		.join(" ");
}
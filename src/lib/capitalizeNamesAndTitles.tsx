import { minorWords, specialWords } from "@/lib/titleCaseRules";

export function capitalizeNamesAndTitles(title: string): string {
	const normalized = title.toLowerCase();

	for (const key in specialWords) {
		if (normalized === key) {
			return specialWords[key];
		}
	}

	const words = title.split(" ");

	return words
		.map((word, index) => {
			if (!word) return "";

			const key = word.toLowerCase();

			if (specialWords[key]) return specialWords[key];

			if (
				index === 0 ||
				index === words.length - 1 ||
				!minorWords.has(key)
			) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			}

			return word;
		})
		.join(" ");
}
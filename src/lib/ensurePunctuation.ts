export function ensurePunctuation(value: string): string {
	const trimmed = value.trim();

	if (!trimmed) return "";

	const endsWithPunctuation = /[.!?]$/.test(trimmed);

	return endsWithPunctuation ? trimmed : `${trimmed}.`;
}
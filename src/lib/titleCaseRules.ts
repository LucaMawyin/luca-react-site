export const minorWords = new Set([
	"a", "an", "the",
	"and", "but", "or", "nor",
	"for", "so", "yet",
	"at", "by", "in", "of", "on", "to", "up",
	"as", "if", "off", "out", "per", "via"
]);

export const specialWords: Record<string, string> = {
	javascript: "JavaScript",
	typescript: "TypeScript",
	nodejs: "Node.js",
	"node.js": "Node.js",
	reactjs: "ReactJS",
	nextjs: "Next.js",
	tailwindcss: "Tailwind CSS",
	html: "HTML",
	css: "CSS",
	json: "JSON",
	sql: "SQL",
	graphql: "GraphQL",
	php: "PHP",
	python: "Python",
	rust: "Rust",
	go: "Go",
	docker: "Docker",
	kubernetes: "Kubernetes",
	github: "GitHub",
};
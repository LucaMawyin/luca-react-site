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
	react: "React",

	nextjs: "Next.js",
	"next.js": "Next.js",

	vuejs: "Vue.js",
	vue: "Vue",

	angularjs: "AngularJS",
	angular: "Angular",

	svelte: "Svelte",
	sveltekit: "SvelteKit",

	tailwind: "Tailwind CSS",

	html: "HTML",
	css: "CSS",

	sass: "Sass",
	scss: "SCSS",
	less: "Less",

	json: "JSON",
	xml: "XML",
	yaml: "YAML",

	sql: "SQL",
	mysql: "MySQL",
	postgresql: "PostgreSQL",
	postgres: "Postgres",
	mongodb: "MongoDB",
	sqlite: "SQLite",

	graphql: "GraphQL",
	rest: "REST",
	api: "API",

	php: "PHP",
	python: "Python",
	rust: "Rust",
	go: "Go",
	golang: "Go",
	java: "Java",
	kotlin: "Kotlin",
	swift: "Swift",
	csharp: "C#",
	"c#": "C#",
	cpp: "C++",
	"c++": "C++",
	c: "C",

	dart: "Dart",

	docker: "Docker",
	kubernetes: "Kubernetes",
	k8s: "Kubernetes",

	github: "GitHub",
	gitlab: "GitLab",
	git: "Git",

	npm: "npm",
	yarn: "Yarn",
	pnpm: "pnpm",

	expressjs: "Express.js",
	express: "Express",

	nestjs: "NestJS",
	deno: "Deno",
	bun: "Bun",

	firebase: "Firebase",
	supabase: "Supabase",

	vercel: "Vercel",
	netlify: "Netlify",

	redis: "Redis",
	elasticsearch: "Elasticsearch",

	linux: "Linux",
	windows: "Windows",
	macos: "macOS",
	ios: "iOS",
	android: "Android",
};
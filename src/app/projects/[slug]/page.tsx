import { getProject } from "@/lib/getProjects";
import { validateSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProjectPageClient from "./ProjectPageClient";

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    const session = await validateSession();

    return (
        <ProjectPageClient
            project={project}
            isLoggedIn={!!session}
        />
    );
}
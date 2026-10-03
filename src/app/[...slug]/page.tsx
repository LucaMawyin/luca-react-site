import { notFound } from "next/navigation";
import { validateSession } from "@/lib/auth";
import HomeClient from "../HomeClient";
import { getProjects, getTech } from "@/lib/getProjects";
import { Session } from "@/lib/types";
import { getContent } from "@/lib/getContent";
import { getExperience } from "@/lib/getExperience";
import { pages } from "@/lib/info";

export default async function Home({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;

    const path = `/${slug.join("/")}`;

    const validPage = pages.some((page) => {
        if (page.href === "/") {
            // Home and home sections
            return path === "/" || path === `/${page.section}`;
        }

        return page.href === path;
    });

    if (!validPage) {
        notFound();
    }

    const session = await validateSession() as Session;
    const projects = await getProjects(session);
    const tech = await getTech();
    const content = await getContent();
    const experience = await getExperience();

    return (
        <HomeClient
            isLoggedIn={!!session}
            projects={projects}
            tech={tech}
            content={content}
            experience={experience}
        />
    );
}
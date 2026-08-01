import { validateSession } from "@/lib/auth";
import HomeClient from "./HomeClient";
import { getProjects, getTech } from "@/lib/getProjects";
import { Session } from "@/lib/types";
import { getContent } from "@/lib/getContent";
import { getExperience } from "@/lib/getExperience";

export default async function Home() {

    const session = await validateSession() as Session;

    console.log("SESSION DONE");

    const projects = await getProjects(session);

    console.log("PROJECTS DONE");

    const tech = await getTech();

    console.log("TECH DONE");

    const about = await getContent();

    console.log("CONTENT DONE");

    const experience = await getExperience();

    console.log("EXPERIENCE DONE");

    return (
        <HomeClient 
            isLoggedIn={!!session} 
            projects={projects}
            tech={tech}
            about={about}
            experience={experience}
        />
    );
}
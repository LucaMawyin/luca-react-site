import { validateSession } from "@/lib/auth";
import HomeClient from "../HomeClient";
import { getProjects, getTech } from "@/lib/getProjects";
import { Session } from "@/lib/types";
import { getContent } from "@/lib/getContent";
import { getExperience } from "@/lib/getExperience";

export default async function Home() {

    const session = await validateSession() as Session;
    const projects = await getProjects(session);
    const tech = await getTech();
    const about = await getContent();
    const experience = await getExperience();

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
import { validateSession } from "@/lib/auth";
import HomeClient from "./HomeClient";
import { getProjects, getTech } from "@/lib/getProjects";
import { Session } from "@/lib/types";
import { getContent } from "@/lib/getContent";
import { getExperience } from "@/lib/getExperience";

export default async function Home() {

    console.log("HOME START");

    const session = await validateSession() as Session;

    console.log("SESSION COMPLETE");

    const [
        projects,
        tech,
        about,
        experience
    ] = await Promise.all([
        getProjects(session),
        getTech(),
        getContent(),
        getExperience()
    ]);

    console.log("DATA COMPLETE");

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
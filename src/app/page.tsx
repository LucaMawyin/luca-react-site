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

    console.log("PROJECTS START");
    const projects = await getProjects(session);
    console.log("PROJECTS COMPLETE");

    console.log("TECH START");
    const tech = await getTech();
    console.log("TECH COMPLETE");

    console.log("CONTENT START");
    const about = await getContent();
    console.log("CONTENT COMPLETE");

    console.log("EXPERIENCE START");
    const experience = await getExperience();
    console.log("EXPERIENCE COMPLETE");

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
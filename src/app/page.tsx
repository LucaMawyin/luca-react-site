import { validateSession } from "@/lib/auth";
import HomeClient from "./HomeClient";
import getProjects, { getTech } from "@/lib/getProjects";
import { Session } from "@/lib/types";

export default async function Home() {

    const session = await validateSession() as Session;
    const projects = await getProjects(session);
    const tech = await getTech();
    

    return (
        <HomeClient 
            isLoggedIn={!!session} 
            projects={projects}
            tech={tech}
        />
    );
}
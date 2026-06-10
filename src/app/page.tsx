import HomeClient from "./HomeClient";
import getSessionAndProjects from "@/lib/getProjects";

export default async function Home() {

    const { session, projects } = await getSessionAndProjects();

    return (
        <HomeClient 
            isLoggedIn={!!session} 
            projects={projects}
        />
    );
}
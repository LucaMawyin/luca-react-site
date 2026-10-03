import { getProjects } from "@/lib/getProjects";
import AllProjects from "./AllProjects";
import { validateSession } from "@/lib/auth";

export default async function Page() {
    const session = await validateSession();

    const projects = await getProjects(session);

    return (
        <AllProjects
            projects={projects}
            isLoggedIn={!!session}
        />
    );
}
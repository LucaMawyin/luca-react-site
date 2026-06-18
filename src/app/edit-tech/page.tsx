import { getTech } from "@/lib/getProjects";
import EditTechClient from "./editTechClient";
import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function Page() {
    // Authenticate before proceeding
    const session = await validateSession();

    if (!session) {
        // Redirect to login with next page
        redirect(`/login?next=/edit-tech`);
    }
    const tech = await getTech();

    return <EditTechClient tech={tech} />;
}
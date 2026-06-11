import { getTech } from "@/lib/getProjects";
import EditTechClient from "./editTechClient";
import { validateSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function Page() {
    // Authenticate before proceeding
    const session = await validateSession();

    if (!session) {
        // Get current path for redirect after login
        const headersList = await headers();
        const pathname =
            headersList.get("x-next-url") ||
            headersList.get("x-invoke-path") ||
            "/";

        // Redirect to login with next page
        redirect(`/login?next=/edit-tech`);
    }
    const tech = await getTech();

    return <EditTechClient tech={tech} />;
}
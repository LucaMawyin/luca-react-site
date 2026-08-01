import { getTech } from "@/lib/getProjects";
import EditTechClient from "./editTechClient";
import { validateSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


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
        redirect(`/login?next=${encodeURIComponent(pathname)}`);
    }

    const tech = await getTech();

    const headersList = await headers();
    const referrer = headersList.get("referer")
        ? new URL(headersList.get("referer")!).pathname
        : null;

    return (
        <EditTechClient 
            tech={tech} 
            referrer={referrer}
        />
    );
}
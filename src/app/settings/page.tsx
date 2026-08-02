import { getActiveSessions, requireSession } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import SettingsClient from "./SettingsClient";
import { getContent } from "@/lib/getContent";
import { getProjects } from "@/lib/getProjects";

export default async function DashboardPage() {
    const session = await requireSession();

    const user = await getUserById(session.user_id);
    const content = await getContent();
    const { currentSession, activeSessions} = await getActiveSessions();
    const projects = await getProjects(session);

    if (user){
        return (
            <SettingsClient 
                user={user} 
                content={content} 
                activeSessions={activeSessions} 
                currentSession={currentSession}
                projects={projects}
            />
        );
    }

    return <p>User not found</p>
}
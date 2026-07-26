import { getActiveSessions, requireSession } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import SettingsClient from "./SettingsClient";
import { getContent } from "@/lib/getContent";

export default async function DashboardPage() {
    const session = await requireSession();

    const user = await getUserById(session.user_id);
    const about = await getContent();
    const { currentSession, activeSessions} = await getActiveSessions();

    if (user){
        return (
            <SettingsClient 
                user={user} 
                about={about} 
                activeSessions={activeSessions} 
                currentSession={currentSession}
            />
        );
    }

    return <p>User not found</p>
}
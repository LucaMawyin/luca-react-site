import HomeClient from "@/app/HomeClient";
import { validateSession } from "@/lib/auth";

export default async function Page() {
    const session = await validateSession();

    return <HomeClient isLoggedIn={!!session} />;
}
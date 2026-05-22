import { validateSession } from "@/lib/auth";
import HomeClient from "./HomeClient";

export default async function Home() {
    const session = await validateSession();

    return <HomeClient isLoggedIn={!!session} />;
}
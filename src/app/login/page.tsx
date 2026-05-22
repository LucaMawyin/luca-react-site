import LoginClient from "./LoginClient";
import { validateSession } from "@/lib/auth";

export default async function LoginPage() {
    const session = await validateSession();

    return <LoginClient isLoggedIn={!!session} />;
}
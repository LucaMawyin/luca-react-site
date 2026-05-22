import { cookies, headers } from "next/headers";
import { getDB } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const headersList = await headers();
  const pathname =
    headersList.get("x-next-url") ||
    headersList.get("x-invoke-path") ||
    "/";

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  const db = await getDB();

  const session = await db
    .prepare(`SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')`)
    .bind(token)
    .first();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  return <>{children}</>;
}
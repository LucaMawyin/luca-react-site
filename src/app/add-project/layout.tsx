import { cookies, headers } from "next/headers";
import { getDB } from "@/lib/db";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

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

  return <>{children}</>;
}
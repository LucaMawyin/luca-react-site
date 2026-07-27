import { getDB } from "@/lib/db";
import CreateProjectPage from "../CreateProjectPage";
import { getTags } from "@/lib/tags";
import { Tag } from "@/lib/types";
import { getImageDataUrl } from "@/lib/r2";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
    const sp = await searchParams;

    const id = sp?.id ? Number(sp.id) : null;

    if (!id) {
        redirect("/add-project");
    }

    let draft = null;

    const db = await getDB();

    if (id) {
        draft = await db
        .prepare(`
            SELECT p.*, t.colour
            FROM projects p
            LEFT JOIN tags t ON t.name = p.tag AND t.category = 'project'
            WHERE p.id = ?
        `)
        .bind(id)
        .first();
    }

    const tags = await getTags("project") as Tag[];

    const data = draft;

    const imageUrl = data?.id
        ? await getImageDataUrl(String(data.id))
        : null;

    const headersList = await headers();
    const referrer = headersList.get("referer")
        ? new URL(headersList.get("referer")!).pathname
        : "/";

    return (
        <CreateProjectPage
            initialData={{ ...data, imageUrl }}
            tags={tags}
            referrer={referrer}
        />
    );
}
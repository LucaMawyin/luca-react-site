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

    let draft = null;

    const db = await getDB();

    // Getting tag & status for project
    if (id) {
        draft = await db
        .prepare(`
            SELECT 
                p.*, 
                project_tag.colour AS colour,
                status_tag.colour AS status_colour
            FROM projects p
            LEFT JOIN tags project_tag 
                ON project_tag.name = p.tag 
                AND project_tag.category = 'project'
            LEFT JOIN tags status_tag 
                ON status_tag.name = p.status
                AND status_tag.category = 'status'
            WHERE p.id = ?
            AND p.deleted = 0
        `)
        .bind(id)
        .first();
    }

    // No draft exists
    if (!draft) {
        redirect("/add-project");
    }

    const tags = await getTags("project") as Tag[];
    const statuses = await getTags("status") as Tag[];

    const data = draft;

    const imageUrl = data?.id
        ? await getImageDataUrl("projects", String(data.id))
        : null;

    const headersList = await headers();
    const referrer = headersList.get("referer")
        ? new URL(headersList.get("referer")!).pathname
        : "/";

    return (
        <CreateProjectPage
            initialData={{ ...data, imageUrl }}
            tags={tags}
            statuses={statuses}
            referrer={referrer}
        />
    );
}
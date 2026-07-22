import { getDB } from "@/lib/db";
import CreateProjectPage from "../CreateProjectPage";
import { getTags } from "@/lib/tags";
import { Tag } from "@/lib/types";
import { getImageDataUrl } from "@/lib/r2";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
    const sp = await searchParams;

    const id = sp?.id ? Number(sp.id) : null;

    let draft = null;

    const db = await getDB();

    if (id) {
        draft = await db
        .prepare(`
            SELECT p.*, t.colour
            FROM projects p
            JOIN tags t ON t.name = p.tag AND t.category = 'project'
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

    return (
        <CreateProjectPage
        initialData={{ ...data, imageUrl }}
        tags={tags}
        />
    );
}
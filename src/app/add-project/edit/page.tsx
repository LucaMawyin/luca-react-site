import { getDB } from "@/lib/db";
import CreateProjectPage from "../CreateProjectPage";
import { getTags } from "@/lib/tags";
import { Tag } from "@/lib/types";

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
        SELECT * FROM projects
        WHERE id = ?
      `)
      .bind(id)
      .first();
  }

  const tags = await getTags("project") as Tag[];

  const data = draft;

    const imageUrl = data?.id
        ? `/api/image/${data.id}`
        : null;

  return (
    <CreateProjectPage
      initialData={{ ...data, imageUrl }}
      tags={tags}
    />
  );
}
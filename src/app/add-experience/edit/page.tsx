import { getDB } from "@/lib/db";
import CreateExperiencePage from "../CreateExperiencePage";
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
        SELECT * FROM experience
        WHERE id = ?
      `)
      .bind(id)
      .first();
  }

  const tags = await getTags("experience") as Tag[];

  const data = draft;


  return (
    <CreateExperiencePage
      initialData={{ ...data }}
      tags={tags}
    />
  );
}
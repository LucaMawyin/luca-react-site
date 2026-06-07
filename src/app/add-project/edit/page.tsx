import { getDB } from "@/lib/db";
import CreateProjectPage from "../page";

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

  const data = draft;

  let imageUrl = null;

  if (data?.image) {
    const base64 = Buffer.from(data.image as any).toString("base64");
    imageUrl = `data:${data.image_type};base64,${base64}`;
  }

  return (
    <CreateProjectPage
      initialData={{ ...data, imageUrl }}
    />
  );
}
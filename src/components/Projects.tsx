import { getDB } from "@/lib/db";

export default async function Projects() {
  const db = await getDB();

  const { results } = await db
    .prepare("SELECT name FROM projects ORDER BY created_at DESC LIMIT 5")
    .all();

  return (
    <div>
      {results.map((p: any, i: number) => (
        <p key={i}>{p.name}</p>
      ))}
    </div>
  );
}
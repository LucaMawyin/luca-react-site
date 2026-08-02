import { getDB } from "./db";

type SiteContentRow = {
    key: string;
    content: string;
};

export async function getContent(): Promise<Record<string, string>> {
    const db = await getDB();

    const result = await db
        .prepare("SELECT key, content FROM site_content")
        .all<SiteContentRow>();

    return Object.fromEntries(
        result.results.map((row) => [
            row.key,
            row.content,
        ])
    );
}
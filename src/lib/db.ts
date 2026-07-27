import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Env } from "./types";

export async function getDB(env?: Env): Promise<D1Database> {
    if (env?.luca_db) {
        return env.luca_db;
    }

    const context = await getCloudflareContext({ async: true });
    return context.env.luca_db;
}
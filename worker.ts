// @ts-ignore
import { default as handler } from "./.open-next/worker.js";
import { getDB } from "./src/lib/db";

export default {
    fetch: handler.fetch,

    async scheduled(
        event: ScheduledEvent,
        env: any,
        ctx: ExecutionContext
    ) {
        ctx.waitUntil(
            (async () => {
                const db = await getDB(env);

                await db.prepare(`
                    DELETE FROM sessions
                    WHERE expires_at < datetime('now')
                `).run();
            })()
        );
    },
};
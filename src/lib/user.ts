import { getDB } from "@/lib/db";
import { User } from "./types";

export async function getUserById(id: number): Promise<User | null> {
    const db = await getDB();

    const user = await db
        .prepare("SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ?")
        .bind(id)
        .first<User>();

    return user ?? null;
}
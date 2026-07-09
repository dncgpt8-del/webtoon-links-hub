import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type D1DatabaseLike = Parameters<typeof drizzle>[0];

export function getDb() {
  const db = (globalThis as { DB?: D1DatabaseLike }).DB;

  if (!db) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or inject the real binding before using the database."
    );
  }

  return drizzle(db, { schema });
}

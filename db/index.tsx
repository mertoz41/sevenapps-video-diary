import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
            CREATE TABLE IF NOT EXISTS post (id INTEGER PRIMARY KEY NOT NULL, video_uri TEXT, thumbnail TEXT, name TEXT, description TEXT);
            `);
}

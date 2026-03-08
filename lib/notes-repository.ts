import { getDb, initDb } from "@/lib/db";

export type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type NotePayload = {
  title: string;
  content: string;
};

export async function listNotes() {
  await initDb();
  const db = await getDb();

  return db.getAllAsync<Note>(
    "SELECT id, title, content, created_at, updated_at FROM notes ORDER BY datetime(updated_at) DESC",
  );
}

export async function getNoteById(id: number) {
  await initDb();
  const db = await getDb();

  return db.getFirstAsync<Note>(
    "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ?",
    id,
  );
}

export async function createNote(payload: NotePayload) {
  await initDb();
  const db = await getDb();
  const now = new Date().toISOString();

  const result = await db.runAsync(
    "INSERT INTO notes (title, content, created_at, updated_at) VALUES (?, ?, ?, ?)",
    payload.title,
    payload.content,
    now,
    now,
  );

  return getNoteById(result.lastInsertRowId);
}

export async function updateNote(id: number, payload: NotePayload) {
  await initDb();
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    "UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?",
    payload.title,
    payload.content,
    now,
    id,
  );

  return getNoteById(id);
}

export async function deleteNote(id: number) {
  await initDb();
  const db = await getDb();

  await db.runAsync("DELETE FROM notes WHERE id = ?", id);
}
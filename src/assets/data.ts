import Database from "tauri-plugin-sql-api";

async function Load() {
  // sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.
  const db = await Database.load("sqlite:habits.db");

  await db.execute("INSERT INTO ...");
}

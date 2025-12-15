import Database from "better-sqlite3";
import { resolve } from "path";
import type { Paper } from "@shared/types";

export interface IStorage {
  getAllPapers(): Promise<Paper[]>;
}

export class MemStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    // Initialize SQLite database connection
    const dbPath = resolve(process.cwd(), "papers.db");
    this.db = new Database(dbPath);
  }

  async getAllPapers(): Promise<Paper[]> {
    const stmt = this.db.prepare("SELECT * FROM papers ORDER BY date DESC");
    const rows = stmt.all() as any[];
    
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      authors: JSON.parse(row.authors),
      abstract: row.abstract,
      summary: row.summary,
      keyPoints: JSON.parse(row.keyPoints),
      impact: row.impact,
      links: JSON.parse(row.links),
      date: row.date,
      upvotes: row.upvotes,
      tags: JSON.parse(row.tags),
    }));
  }
}

export const storage = new MemStorage();

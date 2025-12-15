import { BigQuery } from "@google-cloud/bigquery";
import type { Paper } from "@shared/types";

export interface IStorage {
  getAllPapers(): Promise<Paper[]>;
}

export class BigQueryStorage implements IStorage {
  private bigquery: BigQuery;
  private projectId: string;
  private datasetId: string;
  private tableId: string;

  constructor() {
    // Load environment variables
    const serviceAccountJson = process.env.GBQ_SERVICE_ACCOUNT;
    this.projectId = process.env.GBQ_PROJECT_ID || "";
    this.datasetId = process.env.GBQ_DATASET || "";
    this.tableId = process.env.GBQ_TABLE || "";

    if (!serviceAccountJson || !this.projectId || !this.datasetId || !this.tableId) {
      throw new Error(
        "Missing required BigQuery environment variables: GBQ_SERVICE_ACCOUNT, GBQ_PROJECT_ID, GBQ_DATASET, GBQ_TABLE"
      );
    }

    // Parse service account credentials from JSON string
    const credentials = JSON.parse(serviceAccountJson);

    // Initialize BigQuery client
    this.bigquery = new BigQuery({
      projectId: this.projectId,
      credentials: credentials,
    });
  }

  async getAllPapers(): Promise<Paper[]> {
    try {
      const query = `
        SELECT 
          id,
          title,
          authors,
          abstract,
          summary,
          keyPoints,
          impact,
          links,
          date,
          upvotes,
          tags
        FROM \`${this.projectId}.${this.datasetId}.${this.tableId}\`
        ORDER BY date DESC
      `;

      const [rows] = await this.bigquery.query({ query });

      return rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        authors: typeof row.authors === "string" ? JSON.parse(row.authors) : row.authors,
        abstract: row.abstract,
        summary: row.summary,
        keyPoints: typeof row.keyPoints === "string" ? JSON.parse(row.keyPoints) : row.keyPoints,
        impact: row.impact,
        links: typeof row.links === "string" ? JSON.parse(row.links) : row.links,
        date: row.date,
        upvotes: row.upvotes,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
      }));
    } catch (error) {
      console.error("Error querying BigQuery:", error);
      throw new Error(`Failed to fetch papers from BigQuery: ${error}`);
    }
  }
}

export const storage = new BigQueryStorage();

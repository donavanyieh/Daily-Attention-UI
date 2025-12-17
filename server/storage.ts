import { BigQuery } from "@google-cloud/bigquery";
import type { Paper, DailySummary } from "@shared/types";

export interface IStorage {
  getAllPapers(): Promise<Paper[]>;
  getAllDailySummaries(): Promise<DailySummary[]>;
}

export class BigQueryStorage implements IStorage {
  private bigquery: BigQuery;
  private projectId: string;
  private datasetId: string;
  private tableId: string;
  private dailySummaryTableId: string;

  constructor() {
    // Load environment variables
    const serviceAccountJson = process.env.GBQ_SERVICE_ACCOUNT;
    this.projectId = process.env.GBQ_PROJECT_ID || "";
    this.datasetId = process.env.GBQ_DATASET || "";
    this.tableId = process.env.GBQ_PAPERS_TABLE || "";
    this.dailySummaryTableId = process.env.GBQ_DAILY_SUMMARY_TABLE || "";

    if (!serviceAccountJson || !this.projectId || !this.datasetId || !this.tableId) {
      throw new Error(
        "Missing required BigQuery environment variables: GBQ_SERVICE_ACCOUNT, GBQ_PROJECT_ID, GBQ_DATASET, GBQ_PAPERS_TABLE"
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

  async getAllDailySummaries(): Promise<DailySummary[]> {
    try {
      const query = `
        SELECT 
          Summary,
          Impact,
          \`Exciting Topics\` as ExcitingTopics,
          date
        FROM \`${this.projectId}.${this.datasetId}.${this.dailySummaryTableId}\`
        ORDER BY date DESC
      `;

      const [rows] = await this.bigquery.query({ query });

      return rows.map((row: any) => ({
        Summary: row.Summary,
        Impact: row.Impact,
        "Exciting Topics": typeof row.ExcitingTopics === "string" ? JSON.parse(row.ExcitingTopics) : row.ExcitingTopics,
        date: row.date,
      }));
    } catch (error) {
      console.error("Error querying BigQuery for daily summaries:", error);
      throw new Error(`Failed to fetch daily summaries from BigQuery: ${error}`);
    }
  }
}

export const storage = new BigQueryStorage();

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  summary: string;
  keyPoints: string[];
  impact: string;
  links: Record<string, string>;
  date: string;
  upvotes: number;
  tags: string[];
}

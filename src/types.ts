export type EventType =
  | "Visit"
  | "Imaging"
  | "Lab"
  | "Procedure"
  | "Medication";

export type ReviewStatus = "pending" | "verified" | "flagged";

export interface MedicalEvent {
  id: number;
  date: string;
  type: EventType;
  title: string;
  provider: string;
  summary: string;
  sourcePage: number;
  document: string;
  excerpt: string;
  confidence: number; // 0–100: how sure the AI is about this extraction
  keyFinding?: boolean;
  status: ReviewStatus;
}

export interface CaseInfo {
  name: string;
  claimNumber: string;
  injuryDate: string;
  claimType: string;
  pagesReviewed: number;
  documents: number;
  adjuster: string;
  status: string;
}

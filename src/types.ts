export type EventType = 'Visit' | 'Imaging' | 'Lab' | 'Procedure' | 'Medication';

export type ReviewStatus = 'pending' | 'verified' | 'flagged';

export interface MedicalEvent {
  id: number;
  date: string;
  type: EventType;
  title: string;
  provider: string;
  summary: string;
  sourcePage: number;
  status: ReviewStatus;
}

export interface CaseInfo {
  name: string;
  claimNumber: string;
  injuryDate: string;
  claimType: string;
  pagesReviewed: number;
}
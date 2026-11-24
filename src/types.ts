export type EventType =
  | "Visit"
  | "Imaging"
  | "Lab"
  | "Procedure"
  | "Medication";

export interface MedicalEvent {
  id: number;
  date: string;
  type: EventType;
  title: string;
  provider: string;
  summary: string;
  sourcePage: number;
}

import { claimant, events } from "../data/events";
import type { MedicalEvent } from "../types";

export const db = {
  caseInfo: claimant,
  events: events.map(
    (event): MedicalEvent => ({ ...event, status: "pending" }),
  ),
};

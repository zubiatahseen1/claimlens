import { claimant, events } from "../data/events";
import type { MedicalEvent } from "../types";

function freshEvents() {
  return events.map((event): MedicalEvent => ({ ...event, status: "pending" }));
}

// Just an im memory db for the mock API.
export const db = {
  caseInfo: claimant,
  events: freshEvents(),
};

export function resetDb() {
  db.events = freshEvents();
}

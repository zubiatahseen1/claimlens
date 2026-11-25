import { claimant, events } from "../data/events";
import type { MedicalEvent } from "../types";
import { generateEvents } from "./generate";

function requestedEventCount() {
  const value = Number(
    new URLSearchParams(window.location.search).get("events"),
  );
  return Number.isInteger(value) && value > 0 ? Math.min(value, 20000) : 0;
}

function freshEvents(): MedicalEvent[] {
  const count = requestedEventCount();
  if (count > 0) return generateEvents(count);
  return events.map((event) => ({ ...event, status: "pending" }));
}

// An inmemory database for the mock API. Every event starts as pending until a reviewer verifies or flags it.
export const db = {
  caseInfo: claimant,
  events: freshEvents(),
};

// Used by tests so each test starts with clean data.
export function resetDb() {
  db.events = freshEvents();
}

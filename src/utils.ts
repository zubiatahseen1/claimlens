import type { EventType, MedicalEvent } from "./types";

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMonth(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export interface EventFilters {
  query: string;
  types: EventType[];
  year: string;
}

export function filterEvents(
  events: MedicalEvent[],
  { query, types, year }: EventFilters,
) {
  const q = query.trim().toLowerCase();
  return events
    .filter((e) => types.length === 0 || types.includes(e.type))
    .filter((e) => year === "all" || e.date.startsWith(year))
    .filter(
      (e) =>
        q === "" ||
        [e.title, e.provider, e.summary].some((text) =>
          text.toLowerCase().includes(q),
        ),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

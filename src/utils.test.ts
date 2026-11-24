import { describe, expect, it } from "vitest";
import { filterEvents, getInitials } from "./utils";
import { events } from "./data/events";
import type { MedicalEvent } from "./types";

const allEvents: MedicalEvent[] = events.map((e) => ({
  ...e,
  status: "pending",
}));
const noFilters = { query: "", types: [], year: "all" };

describe("filterEvents", () => {
  it("returns every event, sorted by date, when no filters are set", () => {
    const result = filterEvents(allEvents, noFilters);
    expect(result).toHaveLength(10);
    expect(result[0].date <= result[result.length - 1].date).toBe(true);
  });

  it("filters by event type", () => {
    const result = filterEvents(allEvents, {
      ...noFilters,
      types: ["Imaging"],
    });
    expect(result.map((e) => e.title)).toEqual([
      "Lumbar spine X-ray",
      "Lumbar spine MRI",
    ]);
  });

  it("filters by year", () => {
    const result = filterEvents(allEvents, { ...noFilters, year: "2025" });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Return-to-work assessment");
  });

  it("searches title, provider and summary, ignoring case", () => {
    expect(
      filterEvents(allEvents, { ...noFilters, query: "mri" }),
    ).toHaveLength(3);
    expect(
      filterEvents(allEvents, { ...noFilters, query: "westview" }),
    ).toHaveLength(2);
  });

  it("combines filters", () => {
    const result = filterEvents(allEvents, {
      query: "l4",
      types: ["Procedure"],
      year: "2024",
    });
    expect(result.map((e) => e.title)).toEqual(["Epidural steroid injection"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterEvents(allEvents, { ...noFilters, query: "zzz" })).toEqual([]);
  });
});

describe("getInitials", () => {
  it("returns up to two uppercase initials", () => {
    expect(getInitials("Jordan Reyes")).toBe("JR");
    expect(getInitials("mary ann smith")).toBe("MA");
  });
});

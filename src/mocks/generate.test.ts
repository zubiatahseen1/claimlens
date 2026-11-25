import { describe, expect, it } from "vitest";
import { generateEvents } from "./generate";

describe("generateEvents", () => {
  it("creates the requested number of events with unique ids", () => {
    const events = generateEvents(2000);
    expect(events).toHaveLength(2000);
    expect(new Set(events.map((e) => e.id)).size).toBe(2000);
  });

  it("is deterministic, so performance runs are repeatable", () => {
    expect(generateEvents(50)).toEqual(generateEvents(50));
  });

  it("keeps confidence between 70 and 99", () => {
    const confidences = generateEvents(500).map((e) => e.confidence);
    expect(Math.min(...confidences)).toBeGreaterThanOrEqual(70);
    expect(Math.max(...confidences)).toBeLessThanOrEqual(99);
  });
});

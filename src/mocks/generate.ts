import { events as seedEvents } from "../data/events";
import type { MedicalEvent } from "../types";

// Small seeded random number generator, so the generated data is the same on every page load.
function createRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const START = Date.UTC(2019, 0, 1);
const TOTAL_PAGES = 412;

// Builds a large, realistic-looking claim file for performance testing.
export function generateEvents(count: number): MedicalEvent[] {
  const random = createRandom(42);

  return Array.from({ length: count }, (_, i) => {
    const template = seedEvents[i % seedEvents.length];
    const dayOffset = Math.floor(random() * 365 * 6);

    return {
      ...template,
      id: i + 1,
      date: new Date(START + dayOffset * DAY_MS).toISOString().slice(0, 10),
      sourcePage: 1 + Math.floor(random() * TOTAL_PAGES),
      confidence: 70 + Math.floor(random() * 30),
      keyFinding: random() < 0.01,
      status: "pending",
    };
  });
}

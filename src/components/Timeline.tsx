import { memo, useMemo, useState } from "react";
import type { MedicalEvent } from "../types";
import { formatDate, formatMonth } from "../utils";
import Highlight from "./Highlight";

export const PAGE_SIZE = 50;

interface TimelineProps {
  events: MedicalEvent[];
  query: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function Timeline({ events, query, selectedId, onSelect }: TimelineProps) {
  // Render events in pages instead of all at once, so large files stay fast.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = useMemo(
    () => events.slice(0, visibleCount),
    [events, visibleCount],
  );
  const remaining = events.length - visible.length;

  // Group events by month, e.g. { "2024-02": [...], "2024-03": [...] }
  const groups = useMemo(
    () =>
      visible.reduce<Record<string, MedicalEvent[]>>((acc, event) => {
        const key = event.date.slice(0, 7);
        (acc[key] ??= []).push(event);
        return acc;
      }, {}),
    [visible],
  );

  return (
    <div className="months">
      {Object.entries(groups).map(([month, items]) => (
        <section
          key={month}
          className="month"
          aria-label={formatMonth(items[0].date)}
        >
          <h3 className="month__label">{formatMonth(items[0].date)}</h3>
          <ol className="events">
            {items.map((event) => (
              <li
                key={event.id}
                className={`event type--${event.type.toLowerCase()}`}
              >
                <span className="event__dot" aria-hidden="true" />
                <button
                  type="button"
                  className="event__card"
                  aria-current={event.id === selectedId ? "true" : undefined}
                  onClick={() => onSelect(event.id)}
                >
                  <span className="event__top">
                    <time dateTime={event.date}>{formatDate(event.date)}</time>
                    <span className="event__tags">
                      {event.status === "verified" && (
                        <span className="badge badge--verified">
                          ✓ Verified
                        </span>
                      )}
                      {event.status === "flagged" && (
                        <span className="badge badge--flagged">⚑ Flagged</span>
                      )}
                      {event.keyFinding && (
                        <span className="badge badge--key">Key finding</span>
                      )}
                      <span className="badge badge--type">{event.type}</span>
                    </span>
                  </span>
                  <span className="event__title">
                    <Highlight text={event.title} query={query} />
                  </span>
                  <span className="event__provider">
                    <Highlight text={event.provider} query={query} />
                  </span>
                  <span className="event__summary">
                    <Highlight text={event.summary} query={query} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {remaining > 0 && (
        <button
          type="button"
          className="btn show-more"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Show {Math.min(PAGE_SIZE, remaining)} more ({remaining} remaining)
        </button>
      )}
    </div>
  );
}

export default memo(Timeline);

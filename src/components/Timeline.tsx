import type { MedicalEvent } from "../types";
import { formatDate, formatMonth } from "../utils";
import Highlight from "./Highlight";

interface TimelineProps {
  events: MedicalEvent[];
  query: string;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function Timeline({
  events,
  query,
  selectedId,
  onSelect,
}: TimelineProps) {
  const groups = events.reduce<Record<string, MedicalEvent[]>>((acc, event) => {
    const key = event.date.slice(0, 7);
    (acc[key] ??= []).push(event);
    return acc;
  }, {});

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
    </div>
  );
}

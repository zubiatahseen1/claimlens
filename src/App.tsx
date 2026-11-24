import { useMemo, useState } from "react";
import Filters from "./components/Filters";
import EventCard from "./components/EventCard";
import { claimant, events } from "./data/events";
import type { EventType } from "./types";

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<EventType[]>([]);
  const [year, setYear] = useState("all");

  const years = useMemo(
    () => [...new Set(events.map((e) => e.date.slice(0, 4)))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => activeTypes.length === 0 || activeTypes.includes(e.type))
      .filter((e) => year === "all" || e.date.startsWith(year))
      .filter(
        (e) =>
          q === "" ||
          [e.title, e.provider, e.summary].some((text) =>
            text.toLowerCase().includes(q),
          ),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [query, activeTypes, year]);

  function toggleType(type: EventType) {
    setActiveTypes((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    );
  }

  function clearFilters() {
    setQuery("");
    setActiveTypes([]);
    setYear("all");
  }

  return (
    <>
      <a href="#timeline" className="skip-link">
        Skip to timeline
      </a>

      <header className="topbar">
        <p className="brand">ClaimLens</p>
        <p className="demo-note">Demo · fictional data</p>
      </header>

      <main className="layout">
        <section className="case" aria-labelledby="case-title">
          <h1 id="case-title">Medical chronology</h1>
          <dl className="case__meta">
            <div>
              <dt>Claimant</dt>
              <dd>{claimant.name}</dd>
            </div>
            <div>
              <dt>Claim</dt>
              <dd>{claimant.claimNumber}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{claimant.claimType}</dd>
            </div>
            <div>
              <dt>Pages reviewed</dt>
              <dd>{claimant.pagesReviewed}</dd>
            </div>
          </dl>
        </section>

        <Filters
          query={query}
          onQueryChange={setQuery}
          activeTypes={activeTypes}
          onToggleType={toggleType}
          year={year}
          years={years}
          onYearChange={setYear}
        />

        <section
          id="timeline"
          className="timeline"
          aria-labelledby="timeline-title"
          tabIndex={-1}
        >
          <div className="timeline__head">
            <h2 id="timeline-title">Timeline</h2>
            <p className="count" aria-live="polite">
              Showing {filtered.length} of {events.length} events
            </p>
          </div>

          {filtered.length > 0 ? (
            <ol className="events">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ol>
          ) : (
            <div className="empty">
              <p>No events match your filters.</p>
              <button
                type="button"
                className="link-button"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

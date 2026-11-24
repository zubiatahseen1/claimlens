import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Filters from "./components/Filters";
import Timeline from "./components/Timeline";
import EventDetail from "./components/EventDetail";
import { useCaseData } from "./hooks/useCaseData";
import type { EventType } from "./types";
import { formatDate, getInitials } from "./utils";

export default function App() {
  const { caseInfo, events, state, error, reload } = useCaseData();
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<EventType[]>([]);
  const [year, setYear] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const years = useMemo(
    () => [...new Set(events.map((e) => e.date.slice(0, 4)))].sort(),
    [events],
  );
  const providerCount = useMemo(
    () => new Set(events.map((e) => e.provider)).size,
    [events],
  );
  const keyFindings = useMemo(
    () => events.filter((e) => e.keyFinding),
    [events],
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
  }, [events, query, activeTypes, year]);

  const selected = events.find((e) => e.id === selectedId) ?? filtered[0];

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

  function showEvent(id: number) {
    clearFilters();
    setSelectedId(id);
    document.getElementById("timeline")?.scrollIntoView();
  }

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Sidebar />

      <div className="shell">
        <header className="topbar">
          <p className="breadcrumb">
            <span>Cases</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{caseInfo?.claimNumber ?? "…"}</span>
          </p>
          <div className="topbar__right">
            <span className="demo-pill">Demo · fictional data</span>
            <span className="avatar" aria-label="Signed in as Zubia Tahseen">
              ZT
            </span>
          </div>
        </header>

        <main id="main" className="content" tabIndex={-1}>
          {state === "loading" && (
            <p className="status-message" role="status">
              Loading case…
            </p>
          )}

          {state === "error" && (
            <div className="status-message" role="alert">
              <p>Couldn't load this case: {error}</p>
              <button type="button" className="btn" onClick={reload}>
                Try again
              </button>
            </div>
          )}

          {state === "success" && caseInfo && (
            <>
              <section
                id="overview"
                className="case-header"
                aria-labelledby="case-title"
              >
                <div className="case-header__id">
                  <span className="case-avatar" aria-hidden="true">
                    {getInitials(caseInfo.name)}
                  </span>
                  <div>
                    <h1 id="case-title">{caseInfo.name}</h1>
                    <p className="case-header__sub">
                      {caseInfo.claimType} · Injury date{" "}
                      {formatDate(caseInfo.injuryDate)} · Adjuster{" "}
                      {caseInfo.adjuster}
                    </p>
                  </div>
                </div>
                <div className="case-header__actions">
                  <span className="status">{caseInfo.status}</span>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => window.print()}
                  >
                    Export summary
                  </button>
                </div>
              </section>

              <section className="stats" aria-label="Case statistics">
                <div className="stat">
                  <p className="stat__value">{caseInfo.pagesReviewed}</p>
                  <p className="stat__label">Pages reviewed</p>
                </div>
                <div className="stat">
                  <p className="stat__value">{caseInfo.documents}</p>
                  <p className="stat__label">Source documents</p>
                </div>
                <div className="stat">
                  <p className="stat__value">{events.length}</p>
                  <p className="stat__label">Events extracted</p>
                </div>
                <div className="stat">
                  <p className="stat__value">{providerCount}</p>
                  <p className="stat__label">Providers</p>
                </div>
              </section>

              <section
                id="findings"
                className="panel"
                aria-labelledby="findings-title"
              >
                <h2 id="findings-title" className="panel__title">
                  Key findings
                </h2>
                <ul className="findings">
                  {keyFindings.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        className="finding"
                        onClick={() => showEvent(e.id)}
                      >
                        <span className="finding__date">
                          {formatDate(e.date)}
                        </span>
                        <span className="finding__title">{e.title}</span>
                        <span className="finding__summary">{e.summary}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                id="timeline"
                className="panel"
                aria-labelledby="timeline-title"
              >
                <div className="panel__head">
                  <h2 id="timeline-title" className="panel__title">
                    Medical chronology
                  </h2>
                  <p className="count" aria-live="polite">
                    Showing {filtered.length} of {events.length} events
                  </p>
                </div>

                <Filters
                  query={query}
                  onQueryChange={setQuery}
                  activeTypes={activeTypes}
                  onToggleType={toggleType}
                  year={year}
                  years={years}
                  onYearChange={setYear}
                />

                <div className="split">
                  <div className="split__main">
                    {filtered.length > 0 ? (
                      <Timeline
                        events={filtered}
                        query={query}
                        selectedId={selected?.id ?? null}
                        onSelect={setSelectedId}
                      />
                    ) : (
                      <div className="empty">
                        <p>No events match your filters.</p>
                        <button
                          type="button"
                          className="btn"
                          onClick={clearFilters}
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                  <EventDetail event={selected} />
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

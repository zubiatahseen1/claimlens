import type { MedicalEvent, ReviewStatus } from "../types";
import { formatDate } from "../utils";

interface EventDetailProps {
  event: MedicalEvent | undefined;
  saving: boolean;
  saveError: string | null;
  onStatusChange: (id: number, status: ReviewStatus) => void;
  onOpenSource: (event: MedicalEvent) => void;
}

function confidenceLevel(confidence: number) {
  if (confidence >= 90) return "high";
  if (confidence >= 80) return "medium";
  return "low";
}

export default function EventDetail({
  event,
  saving,
  saveError,
  onStatusChange,
  onOpenSource,
}: EventDetailProps) {
  if (!event) {
    return (
      <aside className="detail detail--empty" aria-label="Event details">
        <p>Select an event to see its details and source.</p>
      </aside>
    );
  }

  const level = confidenceLevel(event.confidence);

  // Clicking an active button again sets the event back to pending.
  function toggle(status: ReviewStatus) {
    if (!event) return;
    onStatusChange(event.id, event.status === status ? "pending" : status);
  }

  return (
    <aside
      className={`detail type--${event.type.toLowerCase()}`}
      aria-label="Event details"
    >
      <p className="detail__eyebrow">
        <span className="badge badge--type">{event.type}</span>
        {event.keyFinding && (
          <span className="badge badge--key">Key finding</span>
        )}
      </p>
      <h3 className="detail__title">{event.title}</h3>

      <dl className="detail__meta">
        <div>
          <dt>Date</dt>
          <dd>{formatDate(event.date)}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{event.provider}</dd>
        </div>
      </dl>

      <div className={`confidence confidence--${level}`}>
        <div className="confidence__row">
          <span className="detail__label">AI confidence</span>
          <span className="confidence__value">{event.confidence}%</span>
        </div>
        <div
          className="confidence__bar"
          role="meter"
          aria-label="AI extraction confidence"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={event.confidence}
        >
          <span style={{ width: `${event.confidence}%` }} />
        </div>
        {level === "low" && (
          <p className="confidence__hint">
            Low confidence — check against the source before verifying.
          </p>
        )}
      </div>

      <h4 className="detail__label">Summary</h4>
      <p className="detail__summary">{event.summary}</p>

      <h4 className="detail__label">Source</h4>
      <figure className="source">
        <figcaption className="source__head">
          <span className="source__file">{event.document}</span>
          <span className="source__page">Page {event.sourcePage}</span>
        </figcaption>
        <blockquote className="source__quote">{event.excerpt}</blockquote>
        <button
          type="button"
          className="source__open"
          onClick={() => onOpenSource(event)}
        >
          Open page {event.sourcePage} in document →
        </button>
      </figure>

      <div className="review" role="group" aria-label="Review this event">
        <button
          type="button"
          className="btn btn--verify"
          aria-pressed={event.status === "verified"}
          disabled={saving}
          onClick={() => toggle("verified")}
        >
          {event.status === "verified" ? "✓ Verified" : "Mark verified"}
        </button>
        <button
          type="button"
          className="btn btn--flag"
          aria-pressed={event.status === "flagged"}
          disabled={saving}
          onClick={() => toggle("flagged")}
        >
          {event.status === "flagged" ? "⚑ Flagged" : "Flag for review"}
        </button>
      </div>

      <p className="save-state" role="status">
        {saving ? "Saving…" : ""}
      </p>
      {saveError && (
        <p className="save-error" role="alert">
          Couldn't save: {saveError}
        </p>
      )}
    </aside>
  );
}

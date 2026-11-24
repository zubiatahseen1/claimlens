import type { MedicalEvent } from "../types";
import { formatDate } from "../utils";

export default function EventDetail({
  event,
}: {
  event: MedicalEvent | undefined;
}) {
  if (!event) {
    return (
      <aside className="detail detail--empty" aria-label="Event details">
        <p>Select an event to see its details.</p>
      </aside>
    );
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

      <h4 className="detail__label">Summary</h4>
      <p className="detail__summary">{event.summary}</p>
      <p className="detail__source">Source: record page {event.sourcePage}</p>
    </aside>
  );
}

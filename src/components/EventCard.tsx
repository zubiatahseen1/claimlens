import { useState } from 'react';
import type { MedicalEvent } from '../types';

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function EventCard({ event }: { event: MedicalEvent }) {
  const [open, setOpen] = useState(false);
  const detailsId = `event-details-${event.id}`;

  return (
    <li className="event">
      <span className={`dot dot--${event.type.toLowerCase()}`} aria-hidden="true" />
      <article className="card">
        <header className="card__header">
          <time dateTime={event.date}>{formatDate(event.date)}</time>
          <span className={`tag tag--${event.type.toLowerCase()}`}>{event.type}</span>
        </header>
        <h3 className="card__title">{event.title}</h3>
        <p className="card__provider">{event.provider}</p>

        <button
          type="button"
          className="card__toggle"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Hide summary' : 'Show summary'}
          <span className="visually-hidden"> for {event.title}</span>
        </button>

        <div id={detailsId} className="card__details" hidden={!open}>
          <p>{event.summary}</p>
          <p className="card__source">Source: record page {event.sourcePage}</p>
        </div>
      </article>
    </li>
  );
}
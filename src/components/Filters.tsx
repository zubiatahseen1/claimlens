import type { EventType } from "../types";

const TYPES: EventType[] = [
  "Visit",
  "Imaging",
  "Lab",
  "Procedure",
  "Medication",
];

interface FiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeTypes: EventType[];
  onToggleType: (type: EventType) => void;
  year: string;
  years: string[];
  onYearChange: (value: string) => void;
}

export default function Filters({
  query,
  onQueryChange,
  activeTypes,
  onToggleType,
  year,
  years,
  onYearChange,
}: FiltersProps) {
  return (
    <section className="filters" aria-label="Filter events">
      <div className="field">
        <label htmlFor="search">Search records</label>
        <input
          id="search"
          type="search"
          placeholder="e.g. MRI, L4–L5, physio"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="year">Year</label>
        <select
          id="year"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="chips">
        <legend>Event type</legend>
        {TYPES.map((type) => {
          const active = activeTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              className={`chip chip--${type.toLowerCase()}`}
              aria-pressed={active}
              onClick={() => onToggleType(type)}
            >
              {type}
            </button>
          );
        })}
      </fieldset>
    </section>
  );
}

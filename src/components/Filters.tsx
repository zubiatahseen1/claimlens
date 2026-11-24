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
    <div className="filters">
      <div className="filters__row">
        <div className="field field--grow">
          <label htmlFor="search" className="visually-hidden">
            Search records
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search records — e.g. MRI, L4–L5, physio"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="year" className="visually-hidden">
            Year
          </label>
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
      </div>

      <fieldset className="chips">
        <legend className="visually-hidden">Event type</legend>
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`chip type--${type.toLowerCase()}`}
            aria-pressed={activeTypes.includes(type)}
            onClick={() => onToggleType(type)}
          >
            <span className="chip__dot" aria-hidden="true" />
            {type}
          </button>
        ))}
      </fieldset>
    </div>
  );
}

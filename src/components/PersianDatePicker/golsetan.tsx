/** Presentational bits for the golsetan storefront appearance. No logic here. */

/** Golsetan storefront green (reminder date field look). */
export const GOLESTAN_GREEN = "#1d7d5e";

export function GolsetanCalendarGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="7" y="13" width="3" height="3" rx="0.6" fill="currentColor" />
    </svg>
  );
}

export function GolsetanChevronGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GolsetanMonthChevron({ dir }: { dir: "prev" | "next" }) {
  // In RTL the "previous month" arrow points right, matching the reference.
  const d = dir === "prev" ? "m14.5 6.5 6 5.5-6 5.5" : "m9.5 6.5-6 5.5 6 5.5";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GolsetanDayCell(props: {
  day: string;
  weekday: string;
  isHoliday?: boolean;
}) {
  return (
    <span className="pdp-g-day">
      <span className="pdp-g-num">{props.day}</span>
      <span className="pdp-g-sub">{props.weekday}</span>
      {props.isHoliday ? <span className="pdp-holiday-dot" aria-hidden /> : null}
    </span>
  );
}

export function GolsetanPanelHeader(props: {
  month: string;
  year: string;
  prevLabel: string;
  nextLabel: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMonthClick: () => void;
  onYearClick: () => void;
}) {
  return (
    <div className="pdp-g-head">
      <button
        type="button"
        className="pdp-g-nav"
        onClick={props.onPrev}
        disabled={!props.canPrev}
        aria-label={props.prevLabel}
      >
        <GolsetanMonthChevron dir="prev" />
      </button>
      <span className="pdp-g-title" aria-live="polite">
        <button type="button" className="pdp-g-title-btn" onClick={props.onMonthClick}>
          {props.month}
        </button>
        <button type="button" className="pdp-g-title-btn" onClick={props.onYearClick}>
          {props.year}
        </button>
      </span>
      <button
        type="button"
        className="pdp-g-nav"
        onClick={props.onNext}
        disabled={!props.canNext}
        aria-label={props.nextLabel}
      >
        <GolsetanMonthChevron dir="next" />
      </button>
    </div>
  );
}

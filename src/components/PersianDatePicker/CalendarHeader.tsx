import type { ReactNode } from "react";
import type { CalendarKind, HeaderRenderInfo, PanelView, RenderHeader } from "../../types";

function Chevron({ dir }: { dir: "next" | "prev" }) {
  const d = dir === "next" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6";
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg className="pdp-nav-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SegmentToggle(props: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Official-theme pill, same control as the فا/EN calendar switch. */
  pill?: boolean;
}) {
  const groupClass = props.pill ? "pdp-cal-toggle" : "pdp-tabs";
  const btnClass = props.pill ? "pdp-cal-toggle-btn" : "pdp-tab";
  const activeClass = props.pill ? "pdp-cal-toggle-btn--active" : "pdp-tab--active";
  return (
    <div className={groupClass} role="group" aria-label={props.ariaLabel}>
      {props.options.map((option) => {
        const active = props.value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`${btnClass}${active ? ` ${activeClass}` : ""}`}
            aria-pressed={active}
            onClick={() => props.onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function HeaderCalendarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PanelBanner(props: {
  kicker?: string;
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  calendarToggle?: { value: CalendarKind; onChange: (c: CalendarKind) => void };
}) {
  const t = props.calendarToggle;
  return (
    <div className="pdp-header">
      <span className="pdp-header-icon" aria-hidden>
        <HeaderCalendarIcon />
      </span>
      <div className="pdp-header-text">
        {props.kicker ? <div className="pdp-header-kicker">{props.kicker}</div> : null}
        <div className="pdp-header-title">{props.title}</div>
        {props.subtitle ? <div className="pdp-header-sub">{props.subtitle}</div> : null}
        {props.extra}
      </div>
      {t ? (
        <div className="pdp-cal-toggle" role="group" aria-label="calendar type">
          <button
            type="button"
            className={`pdp-cal-toggle-btn${t.value === "jalali" ? " pdp-cal-toggle-btn--active" : ""}`}
            aria-pressed={t.value === "jalali"}
            onClick={() => t.onChange("jalali")}
          >
            فا
          </button>
          <button
            type="button"
            className={`pdp-cal-toggle-btn${t.value === "gregorian" ? " pdp-cal-toggle-btn--active" : ""}`}
            aria-pressed={t.value === "gregorian"}
            onClick={() => t.onChange("gregorian")}
          >
            EN
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function CalendarHeader(props: {
  monthLabel: string;
  yearLabel: string;
  rtl: boolean;
  labels: { nextMonth: string; prevMonth: string; nextYear: string; prevYear: string };
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onMonthClick: () => void;
  onYearClick: () => void;
  view: PanelView;
  renderHeader?: RenderHeader;
  headerInfo?: HeaderRenderInfo;
  canPrevMonth?: boolean;
  canNextMonth?: boolean;
  /** Hide the « » year-jump buttons (golsetan shows month stepping only). */
  hideYearNav?: boolean;
  /** Render the year as a static label instead of a month/year-grid opener. */
  staticYear?: boolean;
  /** Disable the month-grid opener (month label stays visible). */
  disableMonthPicker?: boolean;
  /** Disable the year-grid opener (year label stays visible). */
  disableYearPicker?: boolean;
  /** Hide the month / year label pills entirely. */
  hideMonth?: boolean;
  hideYear?: boolean;
}) {
  if (props.renderHeader && props.headerInfo) {
    return (
      <>
        {props.renderHeader({
          ...props.headerInfo,
          onPrevMonth: props.onPrevMonth,
          onNextMonth: props.onNextMonth,
          canPrevMonth: props.canPrevMonth,
          canNextMonth: props.canNextMonth,
        })}
      </>
    );
  }

  const prevMonth = props.rtl ? "next" : "prev";
  const nextMonth = props.rtl ? "prev" : "next";

  return (
    <div className="pdp-nav">
      <div className="pdp-nav-group">
        {props.hideYearNav ? null : (
          <button
            type="button"
            className="pdp-nav-btn"
            onClick={props.onPrevYear}
            aria-label={props.labels.prevYear}
          >
            <Chevron dir={prevMonth} />
            <Chevron dir={prevMonth} />
          </button>
        )}
        <button
          type="button"
          className="pdp-nav-btn"
          onClick={props.onPrevMonth}
          aria-label={props.labels.prevMonth}
        >
          <Chevron dir={prevMonth} />
        </button>
      </div>
      <div className="pdp-nav-label">
        {props.hideMonth ? null : props.disableMonthPicker ? (
          <span className="pdp-nav-pill pdp-nav-pill--static" aria-live="polite">
            {props.monthLabel}
          </span>
        ) : (
          <button type="button" className="pdp-nav-pill" onClick={props.onMonthClick}>
            {props.monthLabel}
            <ChevronDown />
          </button>
        )}
        {props.hideYear ? null : props.staticYear || props.disableYearPicker ? (
          <span className="pdp-nav-pill pdp-nav-pill--static" aria-live="polite">
            {props.yearLabel}
          </span>
        ) : (
          <button type="button" className="pdp-nav-pill" onClick={props.onYearClick}>
            {props.yearLabel}
            <ChevronDown />
          </button>
        )}
      </div>
      <div className="pdp-nav-group">
        <button
          type="button"
          className="pdp-nav-btn"
          onClick={props.onNextMonth}
          aria-label={props.labels.nextMonth}
        >
          <Chevron dir={nextMonth} />
        </button>
        {props.hideYearNav ? null : (
          <button
            type="button"
            className="pdp-nav-btn"
            onClick={props.onNextYear}
            aria-label={props.labels.nextYear}
          >
            <Chevron dir={nextMonth} />
            <Chevron dir={nextMonth} />
          </button>
        )}
      </div>
    </div>
  );
}

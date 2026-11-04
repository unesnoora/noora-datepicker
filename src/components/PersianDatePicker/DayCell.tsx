import { memo } from "react";
import type { CalendarDate, PublicDate, RenderDay } from "../../types";
import { applyNumberSystem } from "../../utils/numbers";

export interface DayCellProps {
  date: CalendarDate;
  publicDate: PublicDate;
  dayNumber: number;
  numberSystem: "persian" | "latin";
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  rangeMiddle: boolean;
  hoverRange: boolean;
  disabled: boolean;
  focused: boolean;
  isOutside: boolean;
  onSelect: (d: CalendarDate) => void;
  onHover: (d: CalendarDate | null) => void;
  renderDay?: RenderDay;
  highlightToday?: boolean;
}

export const DayCell = memo(function DayCell(props: DayCellProps) {
  const {
    date,
    publicDate,
    dayNumber,
    numberSystem,
    selected,
    rangeStart,
    rangeEnd,
    rangeMiddle,
    hoverRange,
    disabled,
    focused,
    isOutside,
    onSelect,
    onHover,
    renderDay,
    highlightToday,
  } = props;

  const label = applyNumberSystem(dayNumber, numberSystem);
  const classNames = [
    "pdp-day",
    publicDate.isToday && highlightToday !== false ? "pdp-day--today" : "",
    selected ? "pdp-day--selected" : "",
    rangeStart ? "pdp-day--range-start" : "",
    rangeEnd ? "pdp-day--range-end" : "",
    rangeMiddle ? "pdp-day--range-middle" : "",
    hoverRange ? "pdp-day--hover-range" : "",
    disabled ? "pdp-day--disabled" : "",
    isOutside ? "pdp-day--outside" : "",
    publicDate.isWeekend ? "pdp-day--weekend" : "",
    publicDate.isHoliday ? "pdp-day--holiday" : "",
    focused ? "pdp-day--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <span className="pdp-day-inner">
      {label}
      {publicDate.isHoliday ? <span className="pdp-holiday-dot" /> : null}
    </span>
  );

  return (
    <button
      type="button"
      className={classNames}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onSelect(date);
      }}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(date)}
      aria-label={publicDate.holidayTitle ? `${label}، ${publicDate.holidayTitle}` : label}
      aria-selected={selected || rangeStart || rangeEnd}
      aria-disabled={disabled}
      aria-current={publicDate.isToday ? "date" : undefined}
      role="gridcell"
      tabIndex={focused ? 0 : -1}
      title={publicDate.holidayTitle}
    >
      {renderDay ? renderDay(publicDate, inner) : inner}
    </button>
  );
});

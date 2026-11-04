import { useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { CalendarDate, CalendarKind } from "../types";
import { addDays, addMonths, addYears, getDay, monthLength } from "../calendar/calendar-utils";

export function useKeyboardNavigation(options: {
  calendar: CalendarKind;
  rtl: boolean;
  focused: CalendarDate | null;
  setFocused: (d: CalendarDate) => void;
  onSelect: (d: CalendarDate) => void;
  onClose: () => void;
  onConfirm: () => void;
  enabled: boolean;
}) {
  const { calendar, rtl, focused, setFocused, onSelect, onClose, onConfirm, enabled } =
    options;

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (!enabled) return;
      const current = focused;
      if (!current) return;

      const horizontal = (dir: 1 | -1) => {
        const next = addDays(current, rtl ? -dir : dir);
        setFocused(next);
      };

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          horizontal(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          horizontal(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocused(addDays(current, -7));
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocused(addDays(current, 7));
          break;
        case "Home": {
          e.preventDefault();
          const weekday = calendar === "jalali" ? current.weekday : current.weekDayGregorian;
          setFocused(addDays(current, -weekday));
          break;
        }
        case "End": {
          e.preventDefault();
          const weekday = calendar === "jalali" ? current.weekday : current.weekDayGregorian;
          setFocused(addDays(current, 6 - weekday));
          break;
        }
        case "PageUp":
          e.preventDefault();
          setFocused(e.shiftKey ? addYears(current, -1, calendar) : addMonths(current, -1, calendar));
          break;
        case "PageDown":
          e.preventDefault();
          setFocused(e.shiftKey ? addYears(current, 1, calendar) : addMonths(current, 1, calendar));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onSelect(current);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "Tab":
          break;
        default:
          if (e.key === "Enter") onConfirm();
      }
    },
    [enabled, focused, rtl, calendar, setFocused, onSelect, onClose, onConfirm],
  );

  return { onKeyDown };
}

export function clampDay(
  year: number,
  month: number,
  day: number,
  calendar: CalendarKind,
): number {
  const dim = monthLength(year, month, calendar);
  return Math.min(Math.max(1, day), dim);
}

export function withClampedDay(
  d: CalendarDate,
  year: number,
  month: number,
  calendar: CalendarKind,
): { year: number; month: number; day: number } {
  const day = clampDay(year, month, getDay(d, calendar), calendar);
  return { year, month, day };
}

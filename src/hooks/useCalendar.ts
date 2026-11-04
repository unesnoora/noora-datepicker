import { useCallback, useMemo, useState } from "react";
import type { CalendarDate, CalendarKind, PanelView } from "../types";
import {
  addMonths,
  addYears,
  buildMonthGrid,
  createFromGregorian,
  createFromJalali,
  getMonth,
  getToday,
  getYear,
  monthLength,
} from "../calendar/calendar-utils";

export function useCalendar(options: {
  calendar: CalendarKind;
  initial?: CalendarDate | null;
  yearRange?: { from: number; to: number };
}) {
  const today = useMemo(() => getToday(options.calendar), [options.calendar]);
  const seed = options.initial ?? today;
  const [view, setView] = useState<PanelView>("date");
  const [cursor, setCursor] = useState<CalendarDate>(seed);

  const year = getYear(cursor, options.calendar);
  const month = getMonth(cursor, options.calendar);

  const grid = useMemo(
    () => buildMonthGrid(year, month, options.calendar),
    [year, month, options.calendar],
  );

  const goMonth = useCallback(
    (delta: number) => {
      setCursor((c) => addMonths(c, delta, options.calendar));
    },
    [options.calendar],
  );

  const goYear = useCallback(
    (delta: number) => {
      setCursor((c) => addYears(c, delta, options.calendar));
    },
    [options.calendar],
  );

  const setYearMonth = useCallback(
    (y: number, m: number) => {
      setCursor((c) => {
        const dim = monthLength(y, m, options.calendar);
        if (options.calendar === "gregorian") {
          return createFromGregorian(
            y,
            m,
            Math.min(c.gd, dim),
            c.hour,
            c.minute,
            c.second,
          );
        }
        return createFromJalali(
          y,
          m,
          Math.min(c.jd, dim),
          c.hour,
          c.minute,
          c.second,
        );
      });
    },
    [options.calendar],
  );

  const jumpTo = useCallback((d: CalendarDate) => {
    setCursor(d);
  }, []);

  return {
    today,
    view,
    setView,
    cursor,
    setCursor,
    year,
    month,
    grid,
    goMonth,
    goYear,
    setYearMonth,
    jumpTo,
  };
}

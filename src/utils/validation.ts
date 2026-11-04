import type { CalendarDate, CalendarKind, DateLike, PublicDate } from "../types";
import {
  compareDate,
  isValidRange as isValidRangeDates,
  parseDateLike,
  toPublicDate,
  getToday,
} from "../calendar/calendar-utils";
import { isValidJalaliDate } from "../calendar/jalali";
import { isValidGregorianDate } from "../calendar/gregorian";

export function isValidJalaliDateParts(y: number, m: number, d: number): boolean {
  return isValidJalaliDate(y, m, d);
}

export function isValidGregorianDateParts(y: number, m: number, d: number): boolean {
  return isValidGregorianDate(y, m, d);
}

export function isValidRange(
  start: DateLike,
  end: DateLike,
  allowSameDay = true,
  calendar: CalendarKind = "jalali",
): boolean {
  const s = parseDateLike(start, calendar);
  const e = parseDateLike(end, calendar);
  return isValidRangeDates(s, e, allowSameDay);
}

export function isDateDisabled(
  date: CalendarDate,
  opts: {
    minDate?: CalendarDate | null;
    maxDate?: CalendarDate | null;
    disabledDate?: (d: PublicDate) => boolean;
    calendar?: CalendarKind;
    holidays?: Map<string, string>;
  },
): boolean {
  if (opts.minDate && compareDate(date, opts.minDate, "day") < 0) return true;
  if (opts.maxDate && compareDate(date, opts.maxDate, "day") > 0) return true;
  if (opts.disabledDate) {
    const pub = toPublicDate(date, {
      calendar: opts.calendar ?? "jalali",
      today: getToday(opts.calendar ?? "jalali"),
      holidays: opts.holidays,
    });
    return opts.disabledDate(pub);
  }
  return false;
}

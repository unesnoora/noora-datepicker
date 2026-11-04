import type { CalendarDate, CalendarKind, DateLike } from "../types";
import { parseDateLike } from "../calendar/calendar-utils";
import { toLatinDigits } from "./numbers";

export function parseJalali(
  input: DateLike,
  calendar: CalendarKind = "jalali",
): CalendarDate | null {
  return parseDateLike(input, calendar);
}

export function parseInputString(
  input: string,
  calendar: CalendarKind = "jalali",
): CalendarDate | null {
  return parseDateLike(toLatinDigits(input.trim()), calendar);
}

import type {
  CalendarDate,
  CalendarKind,
  DateLike,
  DateParts,
  Holiday,
  PublicDate,
} from "../types";
import {
  addGregorianDays,
  addGregorianMonths,
  addGregorianYears,
  gregorianMonthLength,
  gregorianWeekday,
  isLeapGregorianYear,
  isValidGregorianDate,
} from "./gregorian";
import {
  addJalaliDays,
  addJalaliMonths,
  addJalaliYears,
  isLeapJalaliYear,
  isValidJalaliDate,
  jalaliMonthLength,
  jalaliWeekday,
  toGregorian,
  toJalali,
} from "./jalali";

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function getTodayParts(): {
  gy: number;
  gm: number;
  gd: number;
  hour: number;
  minute: number;
  second: number;
} {
  const now = new Date();
  return {
    gy: now.getFullYear(),
    gm: now.getMonth() + 1,
    gd: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

export function getToday(calendar: CalendarKind = "jalali"): CalendarDate {
  const t = getTodayParts();
  if (calendar === "gregorian") {
    return createFromGregorian(t.gy, t.gm, t.gd, t.hour, t.minute, t.second);
  }
  const j = toJalali(t.gy, t.gm, t.gd);
  return createFromJalali(j.jy, j.jm, j.jd, t.hour, t.minute, t.second);
}

export function createFromJalali(
  jy: number,
  jm: number,
  jd: number,
  hour = 0,
  minute = 0,
  second = 0,
): CalendarDate {
  const g = toGregorian(jy, jm, jd);
  const weekday = jalaliWeekday(jy, jm, jd);
  return {
    jy,
    jm,
    jd,
    gy: g.gy,
    gm: g.gm,
    gd: g.gd,
    hour,
    minute,
    second,
    weekday,
    weekDayGregorian: (weekday + 6) % 7,
  };
}

export function createFromGregorian(
  gy: number,
  gm: number,
  gd: number,
  hour = 0,
  minute = 0,
  second = 0,
): CalendarDate {
  const j = toJalali(gy, gm, gd);
  const weekday = jalaliWeekday(j.jy, j.jm, j.jd);
  return {
    jy: j.jy,
    jm: j.jm,
    jd: j.jd,
    gy,
    gm,
    gd,
    hour,
    minute,
    second,
    weekday,
    weekDayGregorian: gregorianWeekday(gy, gm, gd),
  };
}

export function cloneDate(
  d: CalendarDate,
  patch?: Partial<CalendarDate>,
): CalendarDate {
  const merged = { ...d, ...patch };
  if (
    patch?.jy !== undefined ||
    patch?.jm !== undefined ||
    patch?.jd !== undefined
  ) {
    return createFromJalali(
      merged.jy,
      merged.jm,
      merged.jd,
      merged.hour,
      merged.minute,
      merged.second,
    );
  }
  if (
    patch?.gy !== undefined ||
    patch?.gm !== undefined ||
    patch?.gd !== undefined
  ) {
    return createFromGregorian(
      merged.gy,
      merged.gm,
      merged.gd,
      merged.hour,
      merged.minute,
      merged.second,
    );
  }
  return merged;
}

export function toNativeDate(d: CalendarDate): Date {
  return new Date(d.gy, d.gm - 1, d.gd, d.hour, d.minute, d.second);
}

export function compareDate(
  a: CalendarDate,
  b: CalendarDate,
  precision: "day" | "month" | "year" | "time" = "day",
): number {
  if (a.jy !== b.jy) return a.jy - b.jy;
  if (precision === "year") return 0;
  if (a.jm !== b.jm) return a.jm - b.jm;
  if (precision === "month") return 0;
  if (a.jd !== b.jd) return a.jd - b.jd;
  if (precision === "day") return 0;
  if (a.hour !== b.hour) return a.hour - b.hour;
  if (a.minute !== b.minute) return a.minute - b.minute;
  return a.second - b.second;
}

export function isSameDay(a: CalendarDate | null, b: CalendarDate | null): boolean {
  if (!a || !b) return false;
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

export function isSameMonth(a: CalendarDate | null, b: CalendarDate | null): boolean {
  if (!a || !b) return false;
  return a.jy === b.jy && a.jm === b.jm;
}

export function isBetween(
  d: CalendarDate,
  start: CalendarDate | null,
  end: CalendarDate | null,
  inclusive = true,
): boolean {
  if (!start || !end) return false;
  const ds = compareDate(d, start, "day");
  const de = compareDate(d, end, "day");
  if (inclusive) return ds >= 0 && de <= 0;
  return ds > 0 && de < 0;
}

export function monthLength(
  year: number,
  month: number,
  calendar: CalendarKind,
): number {
  return calendar === "jalali"
    ? jalaliMonthLength(year, month)
    : gregorianMonthLength(year, month);
}

export function isLeapYear(year: number, calendar: CalendarKind): boolean {
  return calendar === "jalali"
    ? isLeapJalaliYear(year)
    : isLeapGregorianYear(year);
}

export function addMonths(
  d: CalendarDate,
  months: number,
  calendar: CalendarKind,
): CalendarDate {
  if (calendar === "gregorian") {
    const n = addGregorianMonths(d.gy, d.gm, d.gd, months);
    return createFromGregorian(n.gy, n.gm, n.gd, d.hour, d.minute, d.second);
  }
  const n = addJalaliMonths(d.jy, d.jm, d.jd, months);
  return createFromJalali(n.jy, n.jm, n.jd, d.hour, d.minute, d.second);
}

export function addYears(
  d: CalendarDate,
  years: number,
  calendar: CalendarKind,
): CalendarDate {
  if (calendar === "gregorian") {
    const n = addGregorianYears(d.gy, d.gm, d.gd, years);
    return createFromGregorian(n.gy, n.gm, n.gd, d.hour, d.minute, d.second);
  }
  const n = addJalaliYears(d.jy, d.jm, d.jd, years);
  return createFromJalali(n.jy, n.jm, n.jd, d.hour, d.minute, d.second);
}

export function addDays(d: CalendarDate, days: number): CalendarDate {
  const n = addJalaliDays(d.jy, d.jm, d.jd, days);
  return createFromJalali(n.jy, n.jm, n.jd, d.hour, d.minute, d.second);
}

export function addGregorianDaysToDate(d: CalendarDate, days: number): CalendarDate {
  const n = addGregorianDays(d.gy, d.gm, d.gd, days);
  return createFromGregorian(n.gy, n.gm, n.gd, d.hour, d.minute, d.second);
}

export function startOfMonth(
  d: CalendarDate,
  calendar: CalendarKind,
): CalendarDate {
  if (calendar === "gregorian") {
    return createFromGregorian(d.gy, d.gm, 1, 0, 0, 0);
  }
  return createFromJalali(d.jy, d.jm, 1, 0, 0, 0);
}

export function getYear(d: CalendarDate, calendar: CalendarKind): number {
  return calendar === "gregorian" ? d.gy : d.jy;
}

export function getMonth(d: CalendarDate, calendar: CalendarKind): number {
  return calendar === "gregorian" ? d.gm : d.jm;
}

export function getDay(d: CalendarDate, calendar: CalendarKind): number {
  return calendar === "gregorian" ? d.gd : d.jd;
}

export interface GridCell {
  date: CalendarDate;
  isOutside: boolean;
  weekNumber: number;
}

/**
 * 6×7 month grid. For Jalali, week starts Saturday.
 * For Gregorian, week starts Sunday.
 */
export function buildMonthGrid(
  year: number,
  month: number,
  calendar: CalendarKind,
): GridCell[] {
  const cells: GridCell[] = [];
  const dim = monthLength(year, month, calendar);
  const first =
    calendar === "jalali"
      ? createFromJalali(year, month, 1)
      : createFromGregorian(year, month, 1);

  const firstWeekIndex =
    calendar === "jalali" ? first.weekday : first.weekDayGregorian;

  const prev = addMonths(first, -1, calendar);
  const prevDim = monthLength(
    getYear(prev, calendar),
    getMonth(prev, calendar),
    calendar,
  );

  for (let i = firstWeekIndex - 1; i >= 0; i -= 1) {
    const dayNum = prevDim - i;
    const date =
      calendar === "jalali"
        ? createFromJalali(prev.jy, prev.jm, dayNum)
        : createFromGregorian(prev.gy, prev.gm, dayNum);
    cells.push({ date, isOutside: true, weekNumber: 0 });
  }

  for (let day = 1; day <= dim; day += 1) {
    const date =
      calendar === "jalali"
        ? createFromJalali(year, month, day)
        : createFromGregorian(year, month, day);
    cells.push({ date, isOutside: false, weekNumber: 0 });
  }

  let nextDay = 1;
  const next = addMonths(first, 1, calendar);
  while (cells.length < 42) {
    const date =
      calendar === "jalali"
        ? createFromJalali(next.jy, next.jm, nextDay)
        : createFromGregorian(next.gy, next.gm, nextDay);
    cells.push({ date, isOutside: true, weekNumber: 0 });
    nextDay += 1;
  }

  for (let i = 0; i < 6; i += 1) {
    const wn = getWeekNumber(cells[i * 7].date, calendar);
    for (let j = 0; j < 7; j += 1) {
      cells[i * 7 + j].weekNumber = wn;
    }
  }

  return cells;
}

/** Week 1 contains the first day of the year. Weeks start Saturday (Jalali) or Sunday (Gregorian). */
export function getWeekNumber(d: CalendarDate, calendar: CalendarKind): number {
  const year = getYear(d, calendar);
  const jan1 =
    calendar === "jalali"
      ? createFromJalali(year, 1, 1)
      : createFromGregorian(year, 1, 1);
  const startOffset = calendar === "jalali" ? jan1.weekday : jan1.weekDayGregorian;
  const dayOfYear =
    calendar === "jalali"
      ? jalaliToJulianSafe(d.jy, d.jm, d.jd) -
        jalaliToJulianSafe(year, 1, 1) +
        1
      : Math.floor(
          (Date.UTC(d.gy, d.gm - 1, d.gd) - Date.UTC(year, 0, 1)) / 86400000,
        ) + 1;
  return Math.floor((dayOfYear + startOffset - 1) / 7) + 1;
}

function jalaliToJulianSafe(jy: number, jm: number, jd: number): number {
  const g = toGregorian(jy, jm, jd);
  return Math.floor(Date.UTC(g.gy, g.gm - 1, g.gd) / 86400000);
}

export function dateKey(d: CalendarDate, calendar: CalendarKind = "jalali"): string {
  if (calendar === "gregorian") {
    return `${d.gy}/${pad2(d.gm)}/${pad2(d.gd)}`;
  }
  return `${d.jy}/${pad2(d.jm)}/${pad2(d.jd)}`;
}

export function holidayKey(h: string): string {
  return h.replace(/-/g, "/").replace(/[۰-۹٠-٩]/g, (ch) => {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const ar = "٠١٢٣٤٥٦٧٨٩";
    const fi = fa.indexOf(ch);
    if (fi >= 0) return String(fi);
    const ai = ar.indexOf(ch);
    return ai >= 0 ? String(ai) : ch;
  });
}

export function toPublicDate(
  d: CalendarDate,
  opts: {
    calendar: CalendarKind;
    today: CalendarDate;
    isOutside?: boolean;
    holidays?: Map<string, string>;
  },
): PublicDate {
  const year = getYear(d, opts.calendar);
  const month = getMonth(d, opts.calendar);
  const day = getDay(d, opts.calendar);
  const key = dateKey(d, opts.calendar);
  const jKey = dateKey(d, "jalali");
  const gKey = dateKey(d, "gregorian");
  const holidayTitle =
    opts.holidays?.get(jKey) ??
    opts.holidays?.get(gKey) ??
    opts.holidays?.get(key);
  const weekday = opts.calendar === "jalali" ? d.weekday : d.weekDayGregorian;
  const isWeekend = opts.calendar === "jalali" ? d.weekday === 6 : d.weekDayGregorian === 0;
  return {
    year,
    month,
    day,
    hour: d.hour,
    minute: d.minute,
    second: d.second,
    weekday,
    jalali: { year: d.jy, month: d.jm, day: d.jd },
    gregorian: { year: d.gy, month: d.gm, day: d.gd },
    native: toNativeDate(d),
    isToday: isSameDay(d, opts.today),
    isLeapYear: isLeapYear(year, opts.calendar),
    isWeekend,
    isHoliday: Boolean(holidayTitle),
    holidayTitle,
    isOutside: Boolean(opts.isOutside),
    key,
  };
}

export function clampDate(
  d: CalendarDate,
  min?: CalendarDate | null,
  max?: CalendarDate | null,
): CalendarDate {
  let out = d;
  if (min && compareDate(out, min, "day") < 0) out = min;
  if (max && compareDate(out, max, "day") > 0) out = max;
  return out;
}

function isCalendarDate(v: unknown): v is CalendarDate {
  return Boolean(
    v &&
      typeof v === "object" &&
      "jy" in v &&
      "jm" in v &&
      "jd" in v &&
      "gy" in v,
  );
}

function isDateParts(v: unknown): v is DateParts {
  return Boolean(
    v &&
      typeof v === "object" &&
      "year" in v &&
      "month" in v &&
      "day" in v &&
      !("jy" in v),
  );
}

const DIGIT_MAP: Record<string, string> = {};
"۰۱۲۳۴۵۶۷۸۹".split("").forEach((c, i) => {
  DIGIT_MAP[c] = String(i);
});
"٠١٢٣٤٥٦٧٨٩".split("").forEach((c, i) => {
  DIGIT_MAP[c] = String(i);
});

export function normalizeDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (ch) => DIGIT_MAP[ch] ?? ch);
}

export function parseDateLike(
  value: DateLike,
  calendar: CalendarKind = "jalali",
): CalendarDate | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return createFromGregorian(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
      value.getHours(),
      value.getMinutes(),
      value.getSeconds(),
    );
  }

  if (typeof value === "number") {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return parseDateLike(d, calendar);
  }

  if (isCalendarDate(value)) {
    return createFromJalali(
      value.jy,
      value.jm,
      value.jd,
      value.hour ?? 0,
      value.minute ?? 0,
      value.second ?? 0,
    );
  }

  if (isDateParts(value)) {
    if (value.year > 1700) {
      return createFromGregorian(
        value.year,
        value.month,
        value.day,
        value.hour ?? 0,
        value.minute ?? 0,
        value.second ?? 0,
      );
    }
    return createFromJalali(
      value.year,
      value.month,
      value.day,
      value.hour ?? 0,
      value.minute ?? 0,
      value.second ?? 0,
    );
  }

  if (typeof value === "string") {
    const raw = normalizeDigits(value.trim());
    const iso = raw.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/,
    );
    if (iso) {
      const gy = Number(iso[1]);
      const gm = Number(iso[2]);
      const gd = Number(iso[3]);
      const hour = iso[4] ? Number(iso[4]) : 0;
      const minute = iso[5] ? Number(iso[5]) : 0;
      const second = iso[6] ? Number(iso[6]) : 0;
      if (gy > 1700 && isValidGregorianDate(gy, gm, gd)) {
        return createFromGregorian(gy, gm, gd, hour, minute, second);
      }
      if (isValidJalaliDate(gy, gm, gd)) {
        return createFromJalali(gy, gm, gd, hour, minute, second);
      }
      return null;
    }

    const slash = raw.match(
      /^(\d{4})[/.](\d{1,2})[/.](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
    );
    if (slash) {
      const y = Number(slash[1]);
      const m = Number(slash[2]);
      const d = Number(slash[3]);
      const hour = slash[4] ? Number(slash[4]) : 0;
      const minute = slash[5] ? Number(slash[5]) : 0;
      const second = slash[6] ? Number(slash[6]) : 0;
      if (y > 1700) {
        if (!isValidGregorianDate(y, m, d)) return null;
        return createFromGregorian(y, m, d, hour, minute, second);
      }
      if (!isValidJalaliDate(y, m, d)) return null;
      return createFromJalali(y, m, d, hour, minute, second);
    }

    const timeOnly = raw.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (timeOnly) {
      const today = getToday(calendar);
      return {
        ...today,
        hour: Number(timeOnly[1]),
        minute: Number(timeOnly[2]),
        second: timeOnly[3] ? Number(timeOnly[3]) : 0,
      };
    }

    const yearOnly = raw.match(/^\d{4}$/);
    if (yearOnly) {
      const y = Number(raw);
      if (y > 1700) return createFromGregorian(y, 1, 1);
      if (isValidJalaliDate(y, 1, 1)) return createFromJalali(y, 1, 1);
    }

    const yearMonth = raw.match(/^(\d{4})[/.](\d{1,2})$/);
    if (yearMonth) {
      const y = Number(yearMonth[1]);
      const m = Number(yearMonth[2]);
      if (y > 1700 && isValidGregorianDate(y, m, 1)) {
        return createFromGregorian(y, m, 1);
      }
      if (isValidJalaliDate(y, m, 1)) return createFromJalali(y, m, 1);
    }
  }

  return null;
}

export function isValidRange(
  start: CalendarDate | null,
  end: CalendarDate | null,
  allowSameDay = true,
): boolean {
  if (!start || !end) return false;
  const c = compareDate(start, end, "day");
  if (c < 0) return true;
  if (c === 0) return allowSameDay;
  return false;
}

export function dateInHolidayMap(
  d: CalendarDate,
  holidays: Holiday[] | undefined,
): string | undefined {
  if (!holidays?.length) return undefined;
  const keys = new Set([
    dateKey(d, "jalali"),
    dateKey(d, "gregorian"),
    `${d.jy}/${pad2(d.jm)}/${pad2(d.jd)}`,
  ]);
  for (const h of holidays) {
    const nk = holidayKey(h.date);
    const padded = nk.replace(
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
      (_m, y: string, m: string, dgt: string) =>
        `${y}/${pad2(Number(m))}/${pad2(Number(dgt))}`,
    );
    if (keys.has(nk) || keys.has(padded)) return h.title;
  }
  return undefined;
}

export function buildHolidayMap(holidays?: Holiday[]): Map<string, string> {
  const map = new Map<string, string>();
  if (!holidays) return map;
  for (const h of holidays) {
    const nk = holidayKey(h.date);
    const padded = nk.replace(
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
      (_m, y: string, m: string, dgt: string) =>
        `${y}/${pad2(Number(m))}/${pad2(Number(dgt))}`,
    );
    map.set(nk, h.title);
    map.set(padded, h.title);
  }
  return map;
}

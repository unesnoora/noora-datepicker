import type { CalendarDate, CalendarKind, LocaleCode, NumberSystem } from "../types";
import { getMonthNames, getWeekdayNames, getLocalePack } from "./locale";
import { applyNumberSystem, pad2 } from "./numbers";
import { clockPattern, type TimeColumnsVisibility } from "./timeUnits";

export function formatJalali(
  d: CalendarDate,
  pattern = "jYYYY/jMM/jDD",
  options?: {
    locale?: LocaleCode;
    numberSystem?: NumberSystem;
    calendar?: CalendarKind;
  },
): string {
  const locale = options?.locale ?? "fa";
  const numberSystem = options?.numberSystem ?? (locale === "fa" ? "persian" : "latin");
  const calendar = options?.calendar ?? "jalali";
  const months = getMonthNames(locale, calendar);
  const weekdays = getWeekdayNames(locale, calendar, false);
  const weekday = calendar === "jalali" ? d.weekday : d.weekDayGregorian;
  const monthIndex = (calendar === "jalali" ? d.jm : d.gm) - 1;

  const map: Array<[string, string]> = [
    ["jYYYY", String(d.jy)],
    ["jMMMM", months[calendar === "jalali" ? d.jm - 1 : monthIndex] ?? ""],
    ["jMMM", months[d.jm - 1]?.slice(0, 3) ?? ""],
    ["jMM", pad2(d.jm)],
    ["jM", String(d.jm)],
    ["jDD", pad2(d.jd)],
    ["jD", String(d.jd)],
    ["jddd", weekdays[weekday] ?? ""],
    ["YYYY", String(d.gy)],
    ["MMMM", getMonthNames(locale, "gregorian")[d.gm - 1] ?? ""],
    ["MM", pad2(d.gm)],
    ["M", String(d.gm)],
    ["DD", pad2(d.gd)],
    ["D", String(d.gd)],
    ["HH", pad2(d.hour)],
    ["H", String(d.hour)],
    ["mm", pad2(d.minute)],
    ["m", String(d.minute)],
    ["ss", pad2(d.second)],
    ["s", String(d.second)],
  ];

  const keys = map.map(([k]) => k).join("|");
  const re = new RegExp(keys, "g");
  const tokenMap = new Map(map);
  const formatted = pattern.replace(re, (token) => tokenMap.get(token) ?? token);
  return applyNumberSystem(formatted, numberSystem);
}

export function formatTime(
  d: CalendarDate,
  showHour = true,
  showMinute = true,
  showSecond = false,
  numberSystem: NumberSystem = "persian",
): string {
  const parts: string[] = [];
  if (showHour) parts.push(pad2(d.hour));
  if (showMinute) parts.push(pad2(d.minute));
  if (showSecond) parts.push(pad2(d.second));
  return applyNumberSystem(parts.join(" : "), numberSystem);
}

function resolveClock(showSecond: boolean, parts?: TimeColumnsVisibility): string {
  if (parts) return clockPattern(parts);
  return showSecond ? "HH:mm:ss" : "HH:mm";
}

export function defaultDisplayFormat(
  mode: string,
  showSecond = false,
  calendar: CalendarKind = "jalali",
  parts?: TimeColumnsVisibility,
): string {
  const date = calendar === "jalali" ? "jYYYY/jMM/jDD" : "YYYY/MM/DD";
  const month = calendar === "jalali" ? "jMMMM jYYYY" : "MMMM YYYY";
  const year = calendar === "jalali" ? "jYYYY" : "YYYY";
  const clock = resolveClock(showSecond, parts);
  switch (mode) {
    case "time":
      return clock;
    case "datetime":
    case "datetimerange":
      return `${date} ${clock}`;
    case "month":
      return month;
    case "year":
      return year;
    default:
      return date;
  }
}

export function defaultValueFormat(
  mode: string,
  showSecond = false,
  parts?: TimeColumnsVisibility,
): string {
  const clock = resolveClock(showSecond, parts);
  switch (mode) {
    case "time":
      return clock;
    case "datetime":
    case "datetimerange":
      return `YYYY-MM-DDT${clock}`;
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
    default:
      return "YYYY-MM-DD";
  }
}

export function formatValue(
  d: CalendarDate,
  valueFormat: string,
  options?: {
    locale?: LocaleCode;
    numberSystem?: NumberSystem;
    calendar?: CalendarKind;
  },
): string {
  if (valueFormat === "Date") {
    return d.gy + "-" + pad2(d.gm) + "-" + pad2(d.gd);
  }
  const ns = options?.numberSystem ?? "latin";
  return formatJalali(d, valueFormat, { ...options, numberSystem: ns });
}

export function formatHeaderDate(
  d: CalendarDate | null,
  locale: LocaleCode,
  calendar: CalendarKind,
  numberSystem: NumberSystem,
  mode: string,
): { title: string; subtitle: string; empty: boolean } {
  const labels = getLocalePack(locale);
  if (!d) {
    const title =
      mode === "time"
        ? labels.selectTime
        : mode === "month"
          ? labels.selectMonth
          : mode === "year"
            ? labels.selectYear
            : mode === "range" || mode === "datetimerange"
              ? labels.selectRange
              : mode === "datetime"
                ? labels.selectDateTime
                : labels.selectDate;
    return { title, subtitle: "", empty: true };
  }
  const months = getMonthNames(locale, calendar);
  const weekdays = getWeekdayNames(locale, calendar, false);
  if (mode === "time") {
    return {
      title: formatTime(d, true, true, true, numberSystem),
      subtitle: labels.selectTime,
      empty: false,
    };
  }
  if (mode === "year") {
    const y = calendar === "jalali" ? d.jy : d.gy;
    return {
      title: applyNumberSystem(String(y), numberSystem),
      subtitle: labels.selectYear,
      empty: false,
    };
  }
  if (mode === "month") {
    const y = calendar === "jalali" ? d.jy : d.gy;
    const m = calendar === "jalali" ? d.jm : d.gm;
    return {
      title: months[m - 1],
      subtitle: applyNumberSystem(String(y), numberSystem),
      empty: false,
    };
  }
  const weekday = calendar === "jalali" ? d.weekday : d.weekDayGregorian;
  const y = calendar === "jalali" ? d.jy : d.gy;
  const m = calendar === "jalali" ? d.jm : d.gm;
  const day = calendar === "jalali" ? d.jd : d.gd;
  return {
    title: `${weekdays[weekday]} ${applyNumberSystem(String(day), numberSystem)} ${months[m - 1]}`,
    subtitle: applyNumberSystem(String(y), numberSystem),
    empty: false,
  };
}

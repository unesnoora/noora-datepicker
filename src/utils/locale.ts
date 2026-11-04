import type { LocaleCode, LocaleLabels } from "../types";

export const faIR: LocaleLabels = {
  weekdays: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
  weekdaysShort: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
  months: [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ],
  monthsShort: [
    "فرو",
    "ارد",
    "خرد",
    "تیر",
    "مرد",
    "شهر",
    "مهر",
    "آبا",
    "آذر",
    "دی",
    "بهم",
    "اسف",
  ],
  today: "امروز",
  yesterday: "دیروز",
  tomorrow: "فردا",
  thisWeek: "این هفته",
  lastWeek: "هفته گذشته",
  thisMonth: "این ماه",
  lastMonth: "ماه گذشته",
  nextWeek: "هفته آینده",
  confirm: "تأیید",
  cancel: "انصراف",
  clear: "پاک کردن",
  now: "اکنون",
  selectDate: "انتخاب تاریخ",
  selectTime: "انتخاب زمان",
  selectDateTime: "انتخاب تاریخ و زمان",
  selectMonth: "انتخاب ماه",
  selectYear: "انتخاب سال",
  selectRange: "انتخاب بازه",
  start: "شروع",
  end: "پایان",
  day: "روز",
  month: "ماه",
  year: "سال",
  hour: "ساعت",
  minute: "دقیقه",
  second: "ثانیه",
  date: "تاریخ",
  time: "زمان",
  nextMonth: "ماه بعد",
  prevMonth: "ماه قبل",
  nextYear: "سال بعد",
  prevYear: "سال قبل",
  datesSelected: "تاریخ انتخاب‌شده",
  until: "تا",
  weekNumber: "هفته",
};

export const enUS: LocaleLabels = {
  weekdays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  weekdaysShort: ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"],
  months: [
    "Farvardin",
    "Ordibehesht",
    "Khordad",
    "Tir",
    "Mordad",
    "Shahrivar",
    "Mehr",
    "Aban",
    "Azar",
    "Dey",
    "Bahman",
    "Esfand",
  ],
  monthsShort: [
    "Far",
    "Ord",
    "Kho",
    "Tir",
    "Mor",
    "Sha",
    "Meh",
    "Aba",
    "Aza",
    "Dey",
    "Bah",
    "Esf",
  ],
  today: "Today",
  yesterday: "Yesterday",
  tomorrow: "Tomorrow",
  thisWeek: "This week",
  lastWeek: "Last week",
  thisMonth: "This month",
  lastMonth: "Last month",
  nextWeek: "Next week",
  confirm: "Confirm",
  cancel: "Cancel",
  clear: "Clear",
  now: "Now",
  selectDate: "Select date",
  selectTime: "Select time",
  selectDateTime: "Select date & time",
  selectMonth: "Select month",
  selectYear: "Select year",
  selectRange: "Select range",
  start: "Start",
  end: "End",
  day: "Day",
  month: "Month",
  year: "Year",
  hour: "Hour",
  minute: "Minute",
  second: "Second",
  date: "Date",
  time: "Time",
  nextMonth: "Next month",
  prevMonth: "Previous month",
  nextYear: "Next year",
  prevYear: "Previous year",
  datesSelected: "dates selected",
  until: "to",
  weekNumber: "Wk",
};

export const enGregorianMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const faGregorianMonths = [
  "ژانویه",
  "فوریه",
  "مارس",
  "آوریل",
  "مه",
  "ژوئن",
  "ژوئیه",
  "اوت",
  "سپتامبر",
  "اکتبر",
  "نوامبر",
  "دسامبر",
];

export const enGregorianWeekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const enGregorianWeekdaysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const faGregorianWeekdays = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

export const faGregorianWeekdaysShort = ["ی", "د", "س", "چ", "پ", "ج", "ش"];

export function getLocalePack(locale: LocaleCode): LocaleLabels {
  return locale === "en" ? enUS : faIR;
}

export function getMonthNames(
  locale: LocaleCode,
  calendar: "jalali" | "gregorian",
): string[] {
  if (calendar === "gregorian") {
    return locale === "fa" ? faGregorianMonths : enGregorianMonths;
  }
  return getLocalePack(locale).months;
}

export function getWeekdayNames(
  locale: LocaleCode,
  calendar: "jalali" | "gregorian",
  short = true,
): string[] {
  if (calendar === "gregorian") {
    if (locale === "fa") {
      return short ? faGregorianWeekdaysShort : faGregorianWeekdays;
    }
    return short ? enGregorianWeekdaysShort : enGregorianWeekdays;
  }
  const pack = getLocalePack(locale);
  return short ? pack.weekdaysShort : pack.weekdays;
}

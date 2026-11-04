import {
  isLeapJalaliYear,
  isValidJalaliDate,
  jalaliMonthLength,
  toGregorian,
  toJalali,
} from "./jalali";
import { parseDateLike, isValidRange, createFromJalali } from "./calendar-utils";
import { formatJalali } from "../utils/format";
import { toPersianDigits, toLatinDigits } from "../utils/numbers";
import { parseStartDate } from "../utils/selectionOrder";
import { parseTimeUnits } from "../utils/timeUnits";

export interface TestResult {
  name: string;
  pass: boolean;
  detail?: string;
}

function assert(name: string, cond: boolean, detail?: string): TestResult {
  return { name, pass: cond, detail: cond ? "OK" : detail ?? "failed" };
}

export function runCalendarTests(): TestResult[] {
  const results: TestResult[] = [];

  results.push(assert("۱۳۹۹ is a leap year", isLeapJalaliYear(1399)));
  results.push(assert("۱۴۰۰ is not a leap year", !isLeapJalaliYear(1400)));
  results.push(assert("۱۴۰۳ is a leap year", isLeapJalaliYear(1403)));
  results.push(assert("۱۴۰۴ is not a leap year", !isLeapJalaliYear(1404)));

  results.push(assert("1399/12/30 is valid", isValidJalaliDate(1399, 12, 30)));
  results.push(assert("1400/12/29 is valid", isValidJalaliDate(1400, 12, 29)));
  results.push(assert("1400/12/30 is invalid", !isValidJalaliDate(1400, 12, 30)));
  results.push(assert("1403/12/30 is valid", isValidJalaliDate(1403, 12, 30)));
  results.push(assert("1404/01/01 is valid", isValidJalaliDate(1404, 1, 1)));
  results.push(assert("1404/12/30 is invalid", !isValidJalaliDate(1404, 12, 30)));

  results.push(
    assert("Farvardin has 31 days", jalaliMonthLength(1403, 1) === 31),
  );
  results.push(assert("Shahrivar has 31 days", jalaliMonthLength(1403, 6) === 31));
  results.push(assert("Mehr has 30 days", jalaliMonthLength(1403, 7) === 30));
  results.push(assert("Bahman has 30 days", jalaliMonthLength(1403, 11) === 30));
  results.push(
    assert("Esfand leap has 30 days", jalaliMonthLength(1399, 12) === 30),
  );
  results.push(
    assert("Esfand non-leap has 29 days", jalaliMonthLength(1400, 12) === 29),
  );

  const t1 = toGregorian(1399, 12, 30);
  const back1 = toJalali(t1.gy, t1.gm, t1.gd);
  results.push(
    assert(
      "1399/12/30 round-trip",
      back1.jy === 1399 && back1.jm === 12 && back1.jd === 30,
      JSON.stringify({ t1, back1 }),
    ),
  );

  const t2 = toGregorian(1400, 1, 1);
  const back2 = toJalali(t2.gy, t2.gm, t2.gd);
  results.push(
    assert(
      "1400/01/01 round-trip",
      back2.jy === 1400 && back2.jm === 1 && back2.jd === 1,
      JSON.stringify({ t2, back2 }),
    ),
  );

  const t3 = toGregorian(1403, 12, 30);
  const back3 = toJalali(t3.gy, t3.gm, t3.gd);
  results.push(
    assert(
      "1403/12/30 round-trip",
      back3.jy === 1403 && back3.jm === 12 && back3.jd === 30,
      JSON.stringify({ t3, back3 }),
    ),
  );

  const t4 = toGregorian(1404, 1, 1);
  const back4 = toJalali(t4.gy, t4.gm, t4.gd);
  results.push(
    assert(
      "1404/01/01 round-trip",
      back4.jy === 1404 && back4.jm === 1 && back4.jd === 1,
      JSON.stringify({ t4, back4 }),
    ),
  );

  let roundtrips = 0;
  let failed = 0;
  for (let y = 1390; y <= 1410; y += 1) {
    for (let m = 1; m <= 12; m += 1) {
      const dim = jalaliMonthLength(y, m);
      for (let d = 1; d <= dim; d += 1) {
        const g = toGregorian(y, m, d);
        const j = toJalali(g.gy, g.gm, g.gd);
        roundtrips += 1;
        if (j.jy !== y || j.jm !== m || j.jd !== d) failed += 1;
      }
    }
  }
  results.push(
    assert(
      `Full round-trip 1390–1410 (${roundtrips} dates)`,
      failed === 0,
      `failed=${failed}`,
    ),
  );

  const parsed = parseDateLike("۱۴۰۵/۰۷/۱۹");
  results.push(
    assert(
      "Parse Persian digits ۱۴۰۵/۰۷/۱۹",
      Boolean(parsed && parsed.jy === 1405 && parsed.jm === 7 && parsed.jd === 19),
    ),
  );

  const iso = parseDateLike("2026-03-21");
  results.push(assert("Parse Gregorian ISO", Boolean(iso && iso.gy === 2026)));

  const d = createFromJalali(1403, 1, 1);
  const formatted = formatJalali(d, "jYYYY/jMM/jDD", {
    locale: "fa",
    numberSystem: "persian",
  });
  results.push(
    assert(
      "Format with Persian digits",
      formatted === "۱۴۰۳/۰۱/۰۱",
      formatted,
    ),
  );

  results.push(assert("toPersianDigits", toPersianDigits("1403") === "۱۴۰۳"));
  results.push(assert("toLatinDigits", toLatinDigits("۱۴۰۳") === "1403"));

  const a = createFromJalali(1405, 7, 1);
  const b = createFromJalali(1405, 7, 10);
  results.push(assert("Valid range 1→10", isValidRange(a, b, true)));
  results.push(assert("Invalid range 10→1", !isValidRange(b, a, true)));
  results.push(assert("Same-day range allowed", isValidRange(a, a, true)));
  results.push(assert("Same-day range rejected", !isValidRange(a, a, false)));

  const nowruz1399 = toGregorian(1399, 1, 1);
  results.push(
    assert(
      "Nowruz 1399 is March 2020",
      nowruz1399.gy === 2020 && nowruz1399.gm === 3,
      JSON.stringify(nowruz1399),
    ),
  );

  results.push(
    assert(
      "startDate year,month,day",
      parseStartDate("year,month,day").join(",") === "year,month,day",
    ),
  );
  results.push(
    assert(
      "startDate drops duplicates",
      parseStartDate("day, day, month").join(",") === "day,month",
    ),
  );

  results.push(
    assert(
      "timeUnits hour,minute",
      parseTimeUnits("hour,minute")?.join(",") === "hour,minute",
    ),
  );
  results.push(
    assert(
      "timeUnits keeps seconds optional",
      parseTimeUnits("hour, minute, second")?.join(",") === "hour,minute,second",
    ),
  );

  return results;
}

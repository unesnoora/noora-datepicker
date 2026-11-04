/**
 * Jalaali (Persian) calendar engine.
 * Conversion algorithm based on the well-known 2820-year cycle
 * (Roozbeh Pournader / jalaali-js). Pure functions, SSR-safe.
 */

const breaks = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2324, 2394, 2456, 3178,
];

function div(a: number, b: number): number {
  return ~~(a / b);
}

function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

export interface GregorianYMD {
  gy: number;
  gm: number;
  gd: number;
}

export interface JalaliYMD {
  jy: number;
  jm: number;
  jd: number;
}

interface JalCalResult {
  leap: number;
  gy: number;
  march: number;
}

function jalCalLeap(jy: number): number {
  const bl = breaks.length;
  let jp = breaks[0];
  let jump = 0;
  let n: number;
  let i: number;

  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  for (i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  n = jy - jp;

  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return leap;
}

function jalCal(jy: number, withoutLeap: boolean): JalCalResult {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;
  let n: number;
  let i: number;

  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  for (i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (withoutLeap) {
    return { leap: 0, gy, march };
  }

  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

/** Julian day number from Gregorian */
export function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

/** Gregorian from Julian day number */
export function d2g(jdn: number): GregorianYMD {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy, true);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): JalaliYMD {
  const g = d2g(jdn);
  let jy = g.gy - 621;
  const r = jalCal(jy, false);
  const jdn1f = g2d(g.gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm: number;
  let jd: number;

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export function toJalali(gy: number, gm: number, gd: number): JalaliYMD {
  return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number): GregorianYMD {
  return d2g(j2d(jy, jm, jd));
}

export function isLeapJalaliYear(jy: number): boolean {
  try {
    return jalCalLeap(jy) === 0;
  } catch {
    return false;
  }
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export function isValidJalaliDate(jy: number, jm: number, jd: number): boolean {
  if (!Number.isInteger(jy) || !Number.isInteger(jm) || !Number.isInteger(jd)) {
    return false;
  }
  if (jy < -61 || jy >= 3178) return false;
  if (jm < 1 || jm > 12) return false;
  if (jd < 1) return false;
  try {
    return jd <= jalaliMonthLength(jy, jm);
  } catch {
    return false;
  }
}

export function jalaliToJulian(jy: number, jm: number, jd: number): number {
  return j2d(jy, jm, jd);
}

export function julianToJalali(jdn: number): JalaliYMD {
  return d2j(jdn);
}

/**
 * Jalali weekday: 0 = Saturday, 6 = Friday.
 * Julian day 0 is a Monday; we map via Gregorian Date.UTC.
 */
export function jalaliWeekday(jy: number, jm: number, jd: number): number {
  const g = toGregorian(jy, jm, jd);
  const date = new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
  const jsDay = date.getUTCDay(); // 0 Sun … 6 Sat
  return (jsDay + 1) % 7;
}

export function addJalaliDays(
  jy: number,
  jm: number,
  jd: number,
  days: number,
): JalaliYMD {
  return julianToJalali(jalaliToJulian(jy, jm, jd) + days);
}

export function addJalaliMonths(
  jy: number,
  jm: number,
  jd: number,
  months: number,
): JalaliYMD {
  const total = jy * 12 + (jm - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const dim = jalaliMonthLength(ny, nm);
  return { jy: ny, jm: nm, jd: Math.min(jd, dim) };
}

export function addJalaliYears(
  jy: number,
  jm: number,
  jd: number,
  years: number,
): JalaliYMD {
  const ny = jy + years;
  const dim = jalaliMonthLength(ny, jm);
  return { jy: ny, jm, jd: Math.min(jd, dim) };
}

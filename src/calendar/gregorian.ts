export interface GregorianYMD {
  gy: number;
  gm: number;
  gd: number;
}

export function isLeapGregorianYear(gy: number): boolean {
  return (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
}

export function gregorianMonthLength(gy: number, gm: number): number {
  const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (gm === 2 && isLeapGregorianYear(gy)) return 29;
  return lengths[gm - 1] ?? 0;
}

export function isValidGregorianDate(gy: number, gm: number, gd: number): boolean {
  if (!Number.isInteger(gy) || !Number.isInteger(gm) || !Number.isInteger(gd)) {
    return false;
  }
  if (gm < 1 || gm > 12) return false;
  if (gd < 1) return false;
  return gd <= gregorianMonthLength(gy, gm);
}

/** 0 = Sunday … 6 = Saturday */
export function gregorianWeekday(gy: number, gm: number, gd: number): number {
  const date = new Date(Date.UTC(gy, gm - 1, gd));
  return date.getUTCDay();
}

export function addGregorianDays(
  gy: number,
  gm: number,
  gd: number,
  days: number,
): GregorianYMD {
  const date = new Date(Date.UTC(gy, gm - 1, gd + days));
  return {
    gy: date.getUTCFullYear(),
    gm: date.getUTCMonth() + 1,
    gd: date.getUTCDate(),
  };
}

export function addGregorianMonths(
  gy: number,
  gm: number,
  gd: number,
  months: number,
): GregorianYMD {
  const total = gy * 12 + (gm - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  const dim = gregorianMonthLength(ny, nm);
  return { gy: ny, gm: nm, gd: Math.min(gd, dim) };
}

export function addGregorianYears(
  gy: number,
  gm: number,
  gd: number,
  years: number,
): GregorianYMD {
  const ny = gy + years;
  const dim = gregorianMonthLength(ny, gm);
  return { gy: ny, gm, gd: Math.min(gd, dim) };
}

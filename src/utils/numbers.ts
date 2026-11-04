const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC = "٠١٢٣٤٥٦٧٨٩";
const LATIN = "0123456789";

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN[Number(d)]);
}

export function toLatinDigits(input: string | number): string {
  return String(input)
    .replace(/[۰-۹]/g, (d) => LATIN[PERSIAN.indexOf(d)])
    .replace(/[٠-٩]/g, (d) => LATIN[ARABIC.indexOf(d)]);
}

export function applyNumberSystem(
  input: string | number,
  system: "persian" | "latin",
): string {
  const s = String(input);
  return system === "persian" ? toPersianDigits(s) : toLatinDigits(s);
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

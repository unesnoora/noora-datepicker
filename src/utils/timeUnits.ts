export const TIME_UNITS = ["hour", "minute", "second"] as const;
export type TimeUnit = (typeof TIME_UNITS)[number];

export interface TimeColumnsVisibility {
  hour: boolean;
  minute: boolean;
  second: boolean;
}

/** Parse `timeUnits`, e.g. "hour,minute" or "hour,minute,second". */
export function parseTimeUnits(value?: string): TimeUnit[] | null {
  if (!value?.trim()) return null;
  const allowed = new Set<string>(TIME_UNITS);
  const seen = new Set<string>();
  const out: TimeUnit[] = [];
  for (const raw of value.split(/[,،|/]+/)) {
    const token = raw.trim().toLowerCase();
    if (!allowed.has(token) || seen.has(token)) continue;
    seen.add(token);
    out.push(token as TimeUnit);
  }
  return out.length ? out : null;
}

/** `timeUnits` wins when set. Otherwise the showHour / showMinute / showSecond flags. */
export function resolveTimeColumns(opts: {
  timeUnits?: string;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
}): TimeColumnsVisibility {
  const parsed = parseTimeUnits(opts.timeUnits);
  if (parsed) {
    return {
      hour: parsed.includes("hour"),
      minute: parsed.includes("minute"),
      second: parsed.includes("second"),
    };
  }
  return {
    hour: opts.showHour !== false,
    minute: opts.showMinute !== false,
    second: Boolean(opts.showSecond),
  };
}

export function clockPattern(parts: TimeColumnsVisibility): string {
  const tokens: string[] = [];
  if (parts.hour) tokens.push("HH");
  if (parts.minute) tokens.push("mm");
  if (parts.second) tokens.push("ss");
  return tokens.join(":") || "HH";
}

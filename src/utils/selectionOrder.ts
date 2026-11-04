import type { PanelView } from "../types";

export const DATE_SELECTION_STEPS = ["year", "month", "day"] as const;
export type DateSelectionStep = (typeof DATE_SELECTION_STEPS)[number];

/** Parse `startDate`, e.g. "year,month,day". Unknown tokens are dropped. */
export function parseStartDate(value?: string): DateSelectionStep[] {
  if (!value?.trim()) return [];
  const allowed = new Set<string>(DATE_SELECTION_STEPS);
  const seen = new Set<string>();
  const out: DateSelectionStep[] = [];
  for (const raw of value.split(/[,،|/]+/)) {
    const token = raw.trim().toLowerCase();
    if (!allowed.has(token) || seen.has(token)) continue;
    seen.add(token);
    out.push(token as DateSelectionStep);
  }
  return out;
}

export function viewForSelectionStep(step: DateSelectionStep): PanelView {
  if (step === "year") return "year";
  if (step === "month") return "month";
  return "date";
}

export function initialViewFor(mode: string, steps: DateSelectionStep[]): PanelView {
  if (mode === "time") return "time";
  if (mode === "month") return "month";
  if (mode === "year") return "year";
  if (steps[0]) return viewForSelectionStep(steps[0]);
  return "date";
}

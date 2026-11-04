import { createContext, useContext, useState, type ReactNode } from "react";
import {
  PersianCalendar,
  PersianDatePicker,
  PersianDateTimePicker,
  PersianRangePicker,
  type PersianCalendarProps,
  type PersianDatePickerProps,
} from "../index";
import type { Appearance } from "../types";

export type DocsAppearance = Extract<Appearance, "light" | "dark" | "official">;

const STORAGE_KEY = "noora-docs-appearance";

const OPTIONS: { value: DocsAppearance; label: string; hint: string }[] = [
  { value: "light", label: "پیش‌فرض", hint: "هدر آبی · تب تاریخ/زمان" },
  { value: "official", label: "رسمی", hint: "سبز فروشگاهی · pill تاریخ/زمان" },
  { value: "dark", label: "تیره", hint: "پس‌زمینه تیره" },
];

function readStored(): DocsAppearance {
  if (typeof window === "undefined") return "light";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "official" || raw === "dark" || raw === "light") return raw;
  return "light";
}

const DocsThemeContext = createContext<{
  appearance: DocsAppearance;
  setAppearance: (value: DocsAppearance) => void;
} | null>(null);

export function DocsThemeProvider(props: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<DocsAppearance>(readStored);
  const setAppearance = (value: DocsAppearance) => {
    setAppearanceState(value);
    localStorage.setItem(STORAGE_KEY, value);
  };
  return (
    <DocsThemeContext.Provider value={{ appearance, setAppearance }}>
      {props.children}
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme(): DocsAppearance {
  const ctx = useContext(DocsThemeContext);
  if (!ctx) return "light";
  return ctx.appearance;
}

export function injectAppearance(code: string, appearance: DocsAppearance): string {
  if (/\bappearance=/.test(code)) return code;
  return code.replace(/<(Persian[\w]+)/, `<$1\n  appearance="${appearance}"`);
}

export function ThemeSelector(props: { prominent?: boolean }) {
  const { appearance, setAppearance } = useContext(DocsThemeContext)!;
  return (
    <div className={`docs-theme${props.prominent ? " docs-theme--prominent" : ""}`}>
      <div className="docs-theme-head">
        <strong>پوسته نمونه‌ها</strong>
        <span>همه ورودی‌های زنده در راهنما و نمونه‌ها با همین ظاهر باز می‌شوند.</span>
      </div>
      <div className="docs-theme-options" role="radiogroup" aria-label="انتخاب پوسته">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={appearance === opt.value}
            className={appearance === opt.value ? "is-active" : ""}
            onClick={() => setAppearance(opt.value)}
          >
            <span className="docs-theme-label">{opt.label}</span>
            <span className="docs-theme-hint">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function withTheme<P extends PersianDatePickerProps>(
  Component: typeof PersianDatePicker | typeof PersianDateTimePicker | typeof PersianRangePicker,
) {
  return function DocThemedPicker(props: P) {
    const theme = useDocsTheme();
    return <Component {...props} appearance={props.appearance ?? theme} />;
  };
}

export const DocPicker = withTheme(PersianDatePicker);
export const DocDateTimePicker = withTheme(PersianDateTimePicker);
export const DocRangePicker = withTheme(PersianRangePicker);

export function DocCalendar(props: PersianCalendarProps) {
  const theme = useDocsTheme();
  return <PersianCalendar {...props} appearance={props.appearance ?? theme} />;
}

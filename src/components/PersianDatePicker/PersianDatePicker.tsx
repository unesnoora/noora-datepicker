import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type {
  CalendarDate,
  CalendarKind,
  LocaleCode,
  PersianDatePickerProps,
  PickerMode,
  PickerValue,
  Preset,
  PublicDate,
} from "../../types";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  compareDate,
  createFromGregorian,
  createFromJalali,
  getDay,
  getMonth,
  getToday,
  getYear,
  isSameDay,
  parseDateLike,
} from "../../calendar/calendar-utils";
import { useCalendar } from "../../hooks/useCalendar";
import {
  isMultipleMode,
  isRangeMode,
  normalizeToMode,
  parseIncoming,
  serializeOutgoing,
  snapshotValue,
  useControllableOpen,
  type InternalRange,
  type InternalValue,
} from "../../hooks/useDatePicker";
import { useMediaIsMobile } from "../../hooks/useResponsivePicker";
import {
  defaultDisplayFormat,
  defaultValueFormat,
  formatJalali,
} from "../../utils/format";
import {
  getLocalePack,
  getMonthNames,
  getWeekdayNames,
} from "../../utils/locale";
import { applyNumberSystem } from "../../utils/numbers";
import { parseInputString } from "../../utils/parse";
import {
  initialViewFor,
  parseStartDate,
  viewForSelectionStep,
  type DateSelectionStep,
} from "../../utils/selectionOrder";
import { resolveTimeColumns } from "../../utils/timeUnits";
import { DateInput } from "./DateInput";
import { DesktopPicker } from "./DesktopPicker";
import {
  GOLESTAN_GREEN,
  GolsetanCalendarGlyph,
  GolsetanChevronGlyph,
  GolsetanDayCell,
  GolsetanPanelHeader,
} from "./golsetan";
import { useHolidayContext } from "./HolidayProvider";
import { MobilePicker } from "./MobilePicker";
import { PickerPanel } from "./PickerPanel";
import "../../styles/picker.css";

function emptyValue(mode: PickerMode): InternalValue {
  if (isRangeMode(mode)) return [null, null];
  if (isMultipleMode(mode)) return [];
  return null;
}

function firstDate(mode: PickerMode, v: InternalValue, fallback: CalendarDate): CalendarDate {
  if (!v) return fallback;
  if (isRangeMode(mode)) {
    if (!Array.isArray(v)) return (v as CalendarDate | null) ?? fallback;
    const [a, b] = v as InternalRange;
    return a ?? b ?? fallback;
  }
  if (isMultipleMode(mode)) {
    if (!Array.isArray(v)) return (v as CalendarDate | null) ?? fallback;
    return (v as CalendarDate[])[0] ?? fallback;
  }
  if (Array.isArray(v)) {
    return ((v[0] ?? v[1] ?? null) as CalendarDate | null) ?? fallback;
  }
  return (v as CalendarDate | null) ?? fallback;
}

export const PersianDatePicker = forwardRef<HTMLDivElement, PersianDatePickerProps>(
  function PersianDatePicker(props, ref) {
    const {
      mode = "date",
      value,
      defaultValue,
      onChange,
      onConfirm,
      onCancel,
      onOpen,
      onClose,
      onOpenChange,
      onPanelChange,
      onMonthChange,
      onYearChange,
      locale: localeProp = "fa",
      calendar: calendarProp = "jalali",
      format,
      displayFormat: displayFormatProp,
      valueFormat: valueFormatProp,
      placeholder,
      allowClear = true,
      clearText,
      showToday = true,
      todayButtonText,
      selectTodayOnClick = true,
      autoConfirm = false,
      disabled = false,
      readOnly = false,
      allowInput = false,
      size = "middle",
      status = "",
      prefix,
      suffix,
      className,
      popupClassName,
      style,
      inputStyle,
      id,
      name,
      tabIndex,
      open: openProp,
      defaultOpen = false,
      minDate: minDateProp,
      maxDate: maxDateProp,
      disabledDate,
      holidays: holidaysProp,
      yearRange: yearRangeProp,
      showHour = true,
      showMinute = true,
      showSecond = false,
      timeUnits,
      minuteStep = 1,
      secondStep = 1,
      hourStep = 1,
      allowSameDayRange = true,
      maxSelections,
      minSelections = 0,
      showWeekNumber = false,
      showPresets = false,
      presets: presetsProp,
      numberOfMonths = 1,
      sortDates = false,
      rangeSeparator: rangeSeparatorProp,
      multipleSeparator = "، ",
      hideMonth = false,
      hideYear = false,
      hideWeekdays = false,
      disableMonthPicker = false,
      disableYearPicker = false,
      showOtherDays = true,
      highlightToday = true,
      startDate,
      autoSwitchToTime = false,
      monthNames: monthNamesProp,
      weekdayNames: weekdayNamesProp,
      onFocusedDateChange,
      desktopMode = "modal",
      mobileMode = "sheet",
      mobileBreakpoint = 768,
      forceVariant,
      maskClosable = true,
      appearance = "light",
      theme,
      primaryColor,
      direction,
      renderDay,
      renderMonth,
      renderYear,
      renderHeader,
      renderFooter,
      headerTitle,
      confirmText,
      cancelText,
      getPopupContainer,
      inline = false,
      showCalendarToggle = true,
      onCalendarChange,
    } = props;

    // Blue-header فا/EN switch: فا → Jalali + Persian, EN → Gregorian + English.
    // Kept as a local override so controlled `locale`/`calendar` props keep working.
    const [calendarOverride, setCalendarOverride] = useState<CalendarKind | null>(null);
    const [localeOverride, setLocaleOverride] = useState<LocaleCode | null>(null);
    const calendar = calendarOverride ?? calendarProp;
    const locale = localeOverride ?? localeProp;

    // While the header فا/EN switch is active, digits follow the calendar:
    // Jalali → Persian digits, Gregorian → Latin digits.
    const numberSystem: "persian" | "latin" =
      calendarOverride !== null
        ? (calendar === "jalali" ? "persian" : "latin")
        : (props.numberSystem ?? (locale === "fa" ? "persian" : "latin"));
    const dir = direction ?? (locale === "fa" ? "rtl" : "ltr");
    const labels = useMemo(() => getLocalePack(locale), [locale]);
    // Week mode reuses the whole range machinery internally.
    const panelMode: PickerMode = mode === "week" ? "range" : mode;
    const selectionSteps = useMemo(() => {
      if (panelMode === "time" || panelMode === "month" || panelMode === "year") return [];
      return parseStartDate(startDate);
    }, [startDate, panelMode]);
    const selectionStepsRef = useRef(selectionSteps);
    selectionStepsRef.current = selectionSteps;
    const months = useMemo(
      () => monthNamesProp ?? getMonthNames(locale, calendar),
      [monthNamesProp, locale, calendar],
    );
    const weekdays = useMemo(
      () => weekdayNamesProp ?? getWeekdayNames(locale, calendar, true),
      [weekdayNamesProp, locale, calendar],
    );
    const rangeSeparator = rangeSeparatorProp ?? labels.until;
    const timeCols = useMemo(
      () => resolveTimeColumns({ timeUnits, showHour, showMinute, showSecond }),
      [timeUnits, showHour, showMinute, showSecond],
    );
    const displayFormat =
      displayFormatProp ?? format ?? defaultDisplayFormat(panelMode, timeCols.second, calendar, timeCols);
    const valueFormat = valueFormatProp ?? defaultValueFormat(panelMode, timeCols.second, timeCols);
    const ctxHolidays = useHolidayContext();
    const holidays = holidaysProp ?? ctxHolidays;
    const today = useMemo(() => getToday(calendar), [calendar]);
    const yearRange = yearRangeProp ??
      (calendar === "jalali"
        ? { from: 1300, to: 1500 }
        : { from: 1921, to: 2050 });

    const minDate = useMemo(
      () => parseDateLike(minDateProp, calendar),
      [minDateProp, calendar],
    );
    const maxDate = useMemo(
      () => parseDateLike(maxDateProp, calendar),
      [maxDateProp, calendar],
    );

    const isControlled = value !== undefined;
    const [inner, setInner] = useState<InternalValue>(() =>
      parseIncoming(defaultValue, panelMode, calendar),
    );
    const committed = isControlled ? parseIncoming(value, panelMode, calendar) : inner;

    const setCommitted = useCallback(
      (next: InternalValue, fire = true) => {
        if (!isControlled) setInner(next);
        if (fire) {
          const serialized = serializeOutgoing(next, panelMode, valueFormat, calendar);
          onChange?.(serialized, next as never);
        }
      },
      [isControlled, panelMode, valueFormat, calendar, onChange],
    );

    const { open, setOpen } = useControllableOpen(
      openProp,
      defaultOpen,
      onOpen,
      onClose,
      onOpenChange,
    );

    const [temp, setTemp] = useState<InternalValue>(committed);
    // Never trust the raw draft's shape: a mode switch (or a controlled
    // value of another shape) leaves a stale draft behind, and tuple/array
    // access on it throws mid-render (white screen). All reads go through
    // this normalized draft; writes already produce the current mode's shape.
    const draft = useMemo(() => normalizeToMode(temp, panelMode), [temp, panelMode]);
    const [hoverDate, setHoverDate] = useState<CalendarDate | null>(null);    const [focused, setFocused] = useState<CalendarDate | null>(null);
    const [datetimeTab, setDatetimeTab] = useState<"date" | "time">("date");
    const [text, setText] = useState("");

    const cal = useCalendar({
      calendar,
      initial: firstDate(panelMode, committed, today),
      yearRange,
    });

    const mobileQuery = useMediaIsMobile(mobileBreakpoint);
    const isMobile =
      forceVariant === "mobile" || (forceVariant !== "desktop" && mobileQuery);

    // Extra side-by-side months for the desktop panel (multi-month view).
    const monthsCount = isMobile
      ? 1
      : Math.min(Math.max(Math.floor(numberOfMonths) || 1, 1), 3);
    const extraGrids = useMemo(() => {
      if (monthsCount < 2) return [];
      return Array.from({ length: monthsCount - 1 }, (_, i) => {
        const c = addMonths(cal.cursor, i + 1, calendar);
        const y = getYear(c, calendar);
        const m = getMonth(c, calendar);
        return { key: `${y}-${m}`, year: y, month: m, grid: buildMonthGrid(y, m, calendar) };
      });
    }, [monthsCount, cal.cursor, calendar]);

    // Notify about keyboard/mouse focus moves (RMDP onFocusedDateChange).
    const focusNotified = useRef(false);
    useEffect(() => {
      if (!focusNotified.current) {
        focusNotified.current = true;
        return;
      }
      onFocusedDateChange?.(focused);
    }, [focused, onFocusedDateChange]);

    const wrapRef = useRef<HTMLDivElement>(null);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    useEffect(() => {
      setAnchor(wrapRef.current);
    }, []);

    // Keep the working draft in the current mode's shape: switching modes
    // (e.g. date → range) with a stale draft crashes render on tuple
    // destructuring. Normalize so a picked date carries over as range start.
    useEffect(() => {
      setTemp((prev) => normalizeToMode(prev, panelMode));
      cal.setView(initialViewFor(panelMode, selectionStepsRef.current));
      setDatetimeTab("date");
      // a mode switch starts a new task; seed from the draft only
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelMode]);

    useEffect(() => {
      if (open) {
        const snap = snapshotValue(committed);
        let next = snap;
        if (
          !isRangeMode(panelMode) &&
          !isMultipleMode(panelMode) &&
          !next &&
          (isMobile || panelMode === "time" || panelMode === "month" || panelMode === "year")
        ) {
          next = today;
        }
        setTemp(next);
        const seed = firstDate(panelMode, next, today);
        cal.jumpTo(seed);
        setFocused(seed);
        const initialView = initialViewFor(panelMode, selectionStepsRef.current);
        cal.setView(initialView);
        setDatetimeTab("date");
        onPanelChange?.(initialView, getYear(seed, calendar), getMonth(seed, calendar));
      }
      // snapshot only when opening
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const formatOpts = useMemo(
      () => ({ locale, numberSystem, calendar }),
      [locale, numberSystem, calendar],
    );

    const displayText = useMemo(() => {
      if (isRangeMode(panelMode)) {
        const [a, b] = committed as InternalRange;
        if (!a && !b) return "";
        const fa = a ? formatJalali(a, displayFormat, formatOpts) : "…";
        const fb = b ? formatJalali(b, displayFormat, formatOpts) : "…";
        return `${fa} ${rangeSeparator} ${fb}`;
      }
      if (isMultipleMode(panelMode)) {
        const arr = committed as CalendarDate[];
        if (!arr.length) return "";
        if (arr.length <= 2) {
          return arr
            .map((d) => formatJalali(d, displayFormat, formatOpts))
            .join(multipleSeparator);
        }
        return `${arr.length} ${labels.datesSelected}`;
      }
      const d = committed as CalendarDate | null;
      if (!d) return "";
      return formatJalali(d, displayFormat, formatOpts);
    }, [committed, panelMode, displayFormat, formatOpts, labels, rangeSeparator, multipleSeparator]);

    useEffect(() => {
      setText(displayText);
    }, [displayText]);

    const commit = useCallback(
      (next: InternalValue, close = true) => {
        setCommitted(next, true);
        onConfirm?.(serializeOutgoing(next, panelMode, valueFormat, calendar));
        if (close) setOpen(false);
      },
      [setCommitted, onConfirm, panelMode, valueFormat, calendar, setOpen],
    );

    const dayContinues =
      selectionSteps.includes("day") && selectionSteps[selectionSteps.length - 1] !== "day";

    const openTimeAfterDate = useCallback(() => {
      if (autoSwitchToTime && (panelMode === "datetime" || panelMode === "datetimerange")) {
        setDatetimeTab("time");
      }
    }, [autoSwitchToTime, panelMode]);

    const goToStep = useCallback(
      (step: DateSelectionStep) => {
        const view = viewForSelectionStep(step);
        cal.setView(view);
        onPanelChange?.(view, getYear(cal.cursor, calendar), getMonth(cal.cursor, calendar));
      },
      [cal, calendar, onPanelChange],
    );

    /** Move to the next startDate step. Returns false on the last step. */
    const advanceWizard = useCallback(
      (step: DateSelectionStep) => {
        const idx = selectionSteps.indexOf(step);
        const next = idx >= 0 ? selectionSteps[idx + 1] : undefined;
        if (!next) return false;
        goToStep(next);
        return true;
      },
      [selectionSteps, goToStep],
    );

    const applySingleDate = useCallback(
      (next: CalendarDate) => {
        setTemp(next);
        cal.jumpTo(next);
        openTimeAfterDate();
        if (autoConfirm && (panelMode === "date" || panelMode === "month" || panelMode === "year")) {
          commit(next);
        }
      },
      [cal, openTimeAfterDate, autoConfirm, panelMode, commit],
    );

    const handleSelectDay = useCallback(
      (d: CalendarDate) => {
        if (isMultipleMode(panelMode)) {
          const list = [...((draft as CalendarDate[]) ?? [])];
          const idx = list.findIndex((x) => isSameDay(x, d));
          if (idx >= 0) list.splice(idx, 1);
          else {
            if (maxSelections && list.length >= maxSelections) return;
            list.push(d);
            if (sortDates) {
              list.sort((x, y) => compareDate(x, y, "day"));
            }
          }
          setTemp(list);
          if (dayContinues) {
            advanceWizard("day");
            return;
          }
          if (autoConfirm) commit(list);
          return;
        }
        // Week mode: one click selects the whole week (Saturday-first for
        // jalali, Sunday-first for gregorian) as a range value.
        if (mode === "week") {
          const w = calendar === "jalali" ? d.weekday : d.weekDayGregorian;
          const start = addDays(d, -w);
          const next: InternalRange = [start, addDays(start, 6)];
          setTemp(next);
          cal.jumpTo(next[0] ?? d);
          if (dayContinues) {
            advanceWizard("day");
            return;
          }
          if (autoConfirm) commit(next);
          return;
        }
        if (isRangeMode(panelMode)) {
          const [start, end] = draft as InternalRange;
          if (!start || (start && end)) {
            setTemp([d, null]);
            if (dayContinues) advanceWizard("day");
            return;
          }
          if (compareDate(d, start, "day") < 0) {
            setTemp([d, start]);
          } else if (compareDate(d, start, "day") === 0 && !allowSameDayRange) {
            setTemp([d, null]);
            return;
          } else {
            setTemp([start, d]);
          }
          const next: InternalRange =
            compareDate(d, start, "day") < 0 ? [d, start] : [start, d];
          if (dayContinues) {
            advanceWizard("day");
            return;
          }
          if (autoConfirm && panelMode === "range" && next[0] && next[1]) {
            commit(next);
          }
          if (next[0] && next[1]) openTimeAfterDate();
          return;
        }
        const current = (draft as CalendarDate | null) ?? today;
        const next: CalendarDate = {
          ...d,
          hour: current.hour,
          minute: current.minute,
          second: current.second,
        };
        setTemp(next);
        cal.jumpTo(next);
        if (dayContinues) {
          advanceWizard("day");
          return;
        }
        openTimeAfterDate();
        if (autoConfirm && (panelMode === "date" || panelMode === "month" || panelMode === "year")) {
          commit(next);
        }
      },
      [
        mode,
        panelMode,
        draft,
        maxSelections,
        autoConfirm,
        commit,
        allowSameDayRange,
        today,
        cal,
        calendar,
        sortDates,
        dayContinues,
        advanceWizard,
        openTimeAfterDate,
      ],
    );

    const handleSelectMonth = useCallback(
      (m: number) => {
        const y = cal.year;
        const base = firstDate(panelMode, draft, today);
        const day = Math.min(getDay(base, calendar), 28);
        const next =
          calendar === "gregorian"
            ? createFromGregorian(y, m, day, base.hour, base.minute, base.second)
            : createFromJalali(y, m, day, base.hour, base.minute, base.second);
        cal.setYearMonth(y, m);
        onMonthChange?.(m, y);
        if (panelMode === "month") {
          setTemp(next);
          if (autoConfirm) commit(next);
          return;
        }
        if (advanceWizard("month")) {
          if (!isRangeMode(panelMode) && !isMultipleMode(panelMode) && draft) setTemp(next);
          return;
        }
        const monthIsLast =
          selectionSteps.length > 0 && selectionSteps[selectionSteps.length - 1] === "month";
        if (monthIsLast && !isRangeMode(panelMode) && !isMultipleMode(panelMode) && mode !== "week") {
          applySingleDate(next);
          return;
        }
        cal.setView("date");
        if (!isRangeMode(panelMode) && !isMultipleMode(panelMode) && draft) {
          setTemp(next);
        }
      },
      [
        cal,
        panelMode,
        draft,
        today,
        calendar,
        onMonthChange,
        autoConfirm,
        commit,
        advanceWizard,
        selectionSteps,
        mode,
        applySingleDate,
      ],
    );

    const handleSelectYear = useCallback(
      (y: number) => {
        const m = cal.month;
        const base = firstDate(panelMode, draft, today);
        const next =
          calendar === "gregorian"
            ? createFromGregorian(y, m, 1, base.hour, base.minute, base.second)
            : createFromJalali(y, m, 1, base.hour, base.minute, base.second);
        cal.setYearMonth(y, m);
        onYearChange?.(y);
        if (panelMode === "year") {
          setTemp(next);
          if (autoConfirm) commit(next);
          return;
        }
        if (advanceWizard("year")) return;
        const yearIsLast =
          selectionSteps.length > 0 && selectionSteps[selectionSteps.length - 1] === "year";
        if (yearIsLast && !isRangeMode(panelMode) && !isMultipleMode(panelMode) && mode !== "week") {
          applySingleDate(next);
          return;
        }
        cal.setView(panelMode === "month" ? "month" : "date");
      },
      [
        cal,
        panelMode,
        draft,
        today,
        calendar,
        onYearChange,
        autoConfirm,
        commit,
        advanceWizard,
        selectionSteps,
        mode,
        applySingleDate,
      ],
    );

    const handleTimeChange = useCallback(
      (patch: Partial<Pick<CalendarDate, "hour" | "minute" | "second">>) => {
        if (isRangeMode(panelMode)) {
          const [a, b] = draft as InternalRange;
          const target = b ?? a ?? today;
          const updated = { ...target, ...patch };
          if (b) setTemp([a, updated]);
          else setTemp([updated, b]);
          return;
        }
        if (isMultipleMode(panelMode)) return;
        const cur = (draft as CalendarDate | null) ?? today;
        setTemp({ ...cur, ...patch });
      },
      [panelMode, draft, today],
    );

    const handleConfirm = useCallback(() => {
      commit(draft);
    }, [commit, draft]);

    const handleCancel = useCallback(() => {
      setTemp(snapshotValue(committed));
      onCancel?.();
      setOpen(false);
    }, [committed, onCancel, setOpen]);

    const handleClear = useCallback(() => {
      const empty = emptyValue(panelMode);
      setTemp(empty);
      setCommitted(empty, true);
      if (open && autoConfirm) setOpen(false);
    }, [panelMode, setCommitted, open, autoConfirm, setOpen]);

    const handleToday = useCallback(() => {
      cal.jumpTo(today);
      setFocused(today);
      if (selectTodayOnClick) handleSelectDay(today);
    }, [cal, today, selectTodayOnClick, handleSelectDay]);

    const handleCalendarToggle = useCallback(
      (next: CalendarKind) => {
        if (next === calendar) return;
        setCalendarOverride(next);
        setLocaleOverride(next === "jalali" ? "fa" : "en");
        onCalendarChange?.(next);
        // CalendarDate carries both representations, so the same instant
        // stays selected — just re-seed the visible cursor.
        const seed = firstDate(panelMode, draft, getToday(next));
        cal.jumpTo(seed);
        setFocused(seed);
        setDatetimeTab("date");
      },
      [calendar, panelMode, draft, cal, onCalendarChange],
    );

    const handlePreset = useCallback(
      (p: Preset) => {
        const raw = typeof p.value === "function" ? p.value() : p.value;
        const parsed = parseIncoming(raw as PickerValue, panelMode, calendar);
        setTemp(parsed);
        const seed = firstDate(panelMode, parsed, today);
        cal.jumpTo(seed);
        if (autoConfirm) commit(parsed);
      },
      [panelMode, calendar, today, cal, autoConfirm, commit],
    );

    const defaultPresets: Preset[] = useMemo(() => {
      if (!showPresets) return [];
      if (presetsProp?.length) return presetsProp;
      if (isRangeMode(panelMode)) {
        const weekStart = addDays(today, -(calendar === "jalali" ? today.weekday : today.weekDayGregorian));
        const weekEnd = addDays(weekStart, 6);
        const monthStart =
          calendar === "jalali"
            ? createFromJalali(today.jy, today.jm, 1)
            : createFromGregorian(today.gy, today.gm, 1);
        const prevMonth = addMonths(monthStart, -1, calendar);
        return [
          { label: labels.today, value: () => [today, today] },
          { label: labels.thisWeek, value: () => [weekStart, weekEnd] },
          { label: labels.lastWeek, value: () => [addDays(weekStart, -7), addDays(weekEnd, -7)] },
          { label: labels.thisMonth, value: () => [monthStart, today] },
          { label: labels.lastMonth, value: () => [prevMonth, addDays(monthStart, -1)] },
        ];
      }
      return [
        { label: labels.today, value: () => today },
        { label: labels.yesterday, value: () => addDays(today, -1) },
        { label: labels.tomorrow, value: () => addDays(today, 1) },
        { label: labels.nextWeek, value: () => addDays(today, 7) },
      ];
    }, [showPresets, presetsProp, panelMode, today, calendar, labels]);

    const confirmDisabled = useMemo(() => {
      if (isRangeMode(panelMode)) {
        const [a, b] = draft as InternalRange;
        return !a || !b;
      }
      if (isMultipleMode(panelMode)) {
        return ((draft as CalendarDate[]) ?? []).length < minSelections;
      }
      return false;
    }, [panelMode, draft, minSelections]);

    const selected = !isRangeMode(panelMode) && !isMultipleMode(panelMode) ? (draft as CalendarDate | null) : null;
    const rangeStart = isRangeMode(panelMode) ? (draft as InternalRange)[0] : null;
    const rangeEnd = isRangeMode(panelMode) ? (draft as InternalRange)[1] : null;
    const multiple = isMultipleMode(panelMode) ? (draft as CalendarDate[]) : undefined;
    const wheelDate = firstDate(panelMode, draft, today);

    const dark =
      appearance === "dark" ||
      (appearance === "auto" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const golsetan = appearance === "golsetan" || appearance === "official";
    const effPrimary = primaryColor ?? (golsetan ? GOLESTAN_GREEN : undefined);

    const golsetanWeekdays = useMemo(
      () => getWeekdayNames(locale, calendar, false),
      [locale, calendar],
    );

    const viewedYM = { y: cal.year, m: cal.month };
    const boundYM = (d: CalendarDate | null) =>
      d ? (calendar === "jalali" ? { y: d.jy, m: d.jm } : { y: d.gy, m: d.gm }) : null;
    const loBound = boundYM(minDate);
    const hiBound = boundYM(maxDate);
    const golCanPrev =
      !loBound ||
      viewedYM.y > loBound.y ||
      (viewedYM.y === loBound.y && viewedYM.m > loBound.m);
    const golCanNext =
      !hiBound ||
      viewedYM.y < hiBound.y ||
      (viewedYM.y === hiBound.y && viewedYM.m < hiBound.m);

    const golsetanRenderDay =
      golsetan && !renderDay
        ? (date: PublicDate) => {
            // PublicDate.weekday is Saturday-first for jalali and
            // Sunday-first for gregorian — matching each locale pack order.
            const day = calendar === "jalali" ? date.jalali.day : date.gregorian.day;
            return (
              <GolsetanDayCell
                day={applyNumberSystem(day, numberSystem)}
                weekday={golsetanWeekdays[date.weekday] ?? ""}
                isHoliday={date.isHoliday}
              />
            );
          }
        : undefined;

    // Golsetan gray month bar (image reference): ‹ month year › with clickable
    // month/year jumping to the month/year grids. No year-jump arrows.
    const golsetanRenderHeader =
      golsetan && !renderHeader
        ? () => (
            <GolsetanPanelHeader
              month={months[cal.month - 1] ?? ""}
              year={applyNumberSystem(cal.year, numberSystem)}
              prevLabel={labels.prevMonth}
              nextLabel={labels.nextMonth}
              canPrev={golCanPrev}
              canNext={golCanNext}
              onPrev={() => {
                cal.goMonth(-1);
                onMonthChange?.(cal.month, cal.year);
              }}
              onNext={() => {
                cal.goMonth(1);
                onMonthChange?.(cal.month, cal.year);
              }}
              onMonthClick={() => cal.setView("month")}
              onYearClick={() => cal.setView("year")}
            />
          )
        : undefined;

    const customPrimary = theme?.primaryColor ?? effPrimary;
    const themeStyle: CSSProperties = {
      ...(customPrimary
        ? {
            ["--pdp-primary" as string]: customPrimary,
            ["--pdp-header-bg" as string]:
              theme?.colorBgHeader ?? theme?.primaryColor ?? effPrimary,
            // Keep every primary-derived shade in sync with the chosen color so
            // hover/active/soft states never fall back to another hue.
            ["--pdp-primary-soft" as string]: `color-mix(in srgb, ${customPrimary} 12%, transparent)`,
            ["--pdp-primary-softer" as string]: `color-mix(in srgb, ${customPrimary} 6%, transparent)`,
            ["--pdp-primary-hover" as string]: `color-mix(in srgb, ${customPrimary} 82%, ${golsetan ? "#000" : "#fff"})`,
            ["--pdp-primary-active" as string]: `color-mix(in srgb, ${customPrimary} 70%, #000)`,
            ["--pdp-primary-glow" as string]: `color-mix(in srgb, ${customPrimary} 32%, transparent)`,
          }
        : {}),
      ...(theme?.borderRadius ? { ["--pdp-radius" as string]: `${theme.borderRadius}px` } : {}),
      ...(theme?.fontSize ? { fontSize: theme.fontSize } : {}),
      ...(theme?.colorBgContainer
        ? { ["--pdp-bg" as string]: theme.colorBgContainer, ["--pdp-bg-elevated" as string]: theme.colorBgContainer }
        : {}),
      ...(theme?.colorText ? { ["--pdp-text" as string]: theme.colorText } : {}),
      ...(theme?.colorBorder ? { ["--pdp-border" as string]: theme.colorBorder } : {}),
      ...(theme?.fontFamily ? { ["--pdp-font" as string]: theme.fontFamily } : {}),
      ...(theme?.colorBgHeader ? { ["--pdp-header-bg" as string]: theme.colorBgHeader } : {}),
      ...(theme?.colorTextHeader ? { ["--pdp-header-text" as string]: theme.colorTextHeader } : {}),
    };

    const resolvedPlaceholder =
      placeholder ??
      (panelMode === "time"
        ? labels.selectTime
        : panelMode === "datetime"
          ? labels.selectDateTime
          : panelMode === "month"
            ? labels.selectMonth
            : panelMode === "year"
              ? labels.selectYear
              : panelMode === "range" || panelMode === "datetimerange"
                ? labels.selectRange
                : labels.selectDate);

    const panelProps = {
      mode: panelMode,
      view: cal.view,
      setView: cal.setView,
      calendar,
      locale,
      numberSystem,
      labels,
      rtl: dir === "rtl",
      today,
      cursor: cal.cursor,
      year: cal.year,
      month: cal.month,
      grid: cal.grid,
      goMonth: (d: number) => {
        cal.goMonth(d);
        onMonthChange?.(cal.month, cal.year);
      },
      goYear: (d: number) => {
        cal.goYear(d);
        onYearChange?.(cal.year);
      },
      headerTitle,
      hideFooter: undefined,
      hideRangeTitle: golsetan || undefined,
      hideYearNav: golsetan || undefined,
      canPrevMonth: golCanPrev,
      canNextMonth: golCanNext,
      selected,
      rangeStart,
      rangeEnd,
      hoverDate,
      multiple,
      focused,
      minDate,
      maxDate,
      disabledDate,
      holidays,
      showWeekNumber,
      yearRange,
      months,
      weekdays,
      hideMonth,
      hideYear,
      hideWeekdays,
      disableMonthPicker,
      disableYearPicker,
      showOtherDays,
      highlightToday,
      extraGrids,
      onSelectDay: handleSelectDay,
      onHover: setHoverDate,
      onSelectMonth: handleSelectMonth,
      onSelectYear: handleSelectYear,
      onTimeChange: handleTimeChange,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
      onClear: handleClear,
      onToday: handleToday,
      showToday,
      allowClear,
      confirmDisabled,
      confirmText,
      cancelText,
      clearText,
      todayButtonText,
      showHour: timeCols.hour,
      showMinute: timeCols.minute,
      showSecond: timeCols.second,
      hourStep,
      minuteStep,
      secondStep,
      renderDay: renderDay ?? golsetanRenderDay,
      renderMonth,
      renderYear,
      renderHeader: renderHeader ?? golsetanRenderHeader,
      renderFooter,
      showPresets,
      presets: defaultPresets,
      onPreset: handlePreset,
      displayFormat,
      datetimeTab,
      setDatetimeTab,
      pillToggle: golsetan,
      selectionSteps,
      onSelectStep: goToStep,
      showCalendarToggle,
      calendarToggleValue: calendar,
      onCalendarToggle: handleCalendarToggle,
    };

    const onKeyDown = (e: ReactKeyboardEvent) => {
      if (!open || !focused) return;
      const rtl = dir === "rtl";
      const move = (days: number) => {
        const next = addDays(focused, days);
        setFocused(next);
        cal.jumpTo(next);
      };
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          move(rtl ? 1 : -1);
          break;
        case "ArrowRight":
          e.preventDefault();
          move(rtl ? -1 : 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          move(-7);
          break;
        case "ArrowDown":
          e.preventDefault();
          move(7);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelectDay(focused);
          break;
        case "Escape":
          e.preventDefault();
          handleCancel();
          break;
        case "PageUp":
          e.preventDefault();
          cal.goMonth(-1);
          break;
        case "PageDown":
          e.preventDefault();
          cal.goMonth(1);
          break;
        case "Home": {
          e.preventDefault();
          const w = calendar === "jalali" ? focused.weekday : focused.weekDayGregorian;
          move(-w);
          break;
        }
        case "End": {
          e.preventDefault();
          const w = calendar === "jalali" ? focused.weekday : focused.weekDayGregorian;
          move(6 - w);
          break;
        }
        default:
          break;
      }
    };

    const popupContainer =
      typeof document === "undefined" ? null : getPopupContainer?.() ?? null;

    const openPicker = () => {
      if (disabled || readOnly) return;
      setOpen(true);
    };

    return (
      <div
        ref={(node) => {
          wrapRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={`pdp-input-wrap ${golsetan ? "pdp--golsetan" : ""} ${className ?? ""}`}
        style={style}
      >
        {inline ? (
          <div
            className={`pdp-root ${dark ? "pdp--dark" : ""} ${golsetan ? "pdp--golsetan" : ""} pdp-calendar-embed`}
            dir={dir}
            style={themeStyle}
          >
            <PickerPanel {...panelProps} hideHeader={false} />
          </div>
        ) : (
          <>
            <DateInput
              value={text}
              placeholder={resolvedPlaceholder}
              disabled={disabled}
              readOnly={readOnly}
              allowInput={allowInput}
              allowClear={allowClear}
              size={size}
              status={status}
              prefix={
                prefix ?? (golsetan ? (
                  <span className="pdp-g-pre">
                    <GolsetanCalendarGlyph />
                  </span>
                ) : undefined)
              }
              suffix={
                suffix ?? (golsetan ? (
                  <span className="pdp-g-suf">
                    <GolsetanChevronGlyph />
                  </span>
                ) : undefined)
              }
              id={id}
              name={name}
              tabIndex={tabIndex}
              style={inputStyle}
              onClick={openPicker}
              onClear={handleClear}
              onChangeText={setText}
              onBlurText={(v) => {
                if (!allowInput) return;
                const parsed = parseInputString(v, calendar);
                if (parsed) {
                  setTemp(parsed);
                  setCommitted(parsed, true);
                } else {
                  setText(displayText);
                }
              }}
              ariaLabel={resolvedPlaceholder}
            />
            {isMobile ? (
              <MobilePicker
                {...panelProps}
                open={open}
                onClose={handleCancel}
                maskClosable={maskClosable}
                mobileMode={mobileMode}
                dark={dark}
                dir={dir}
                popupClassName={golsetan ? `pdp--golsetan ${popupClassName ?? ""}` : popupClassName}
                themeStyle={themeStyle}
                onTempDate={(d) => {
                  if (isRangeMode(panelMode) || isMultipleMode(panelMode)) return;
                  setTemp(d);
                  cal.jumpTo(d);
                }}
                wheelDate={wheelDate}
                container={popupContainer}
              />
            ) : (
              <DesktopPicker
                {...panelProps}
                open={open}
                onClose={handleCancel}
                maskClosable={maskClosable}
                desktopMode={desktopMode}
                anchor={anchor}
                rtl={dir === "rtl"}
                dark={dark}
                dir={dir}
                popupClassName={golsetan ? `pdp--golsetan ${popupClassName ?? ""}` : popupClassName}
                themeStyle={themeStyle}
                onKeyDown={onKeyDown}
                wide={showPresets || monthsCount > 1}
                xwide={monthsCount > 2}
                container={popupContainer}
              />
            )}
          </>
        )}
        <span className="pdp-hidden-live" aria-live="polite">
          {displayText}
        </span>
      </div>
    );
  },
);

export default PersianDatePicker;

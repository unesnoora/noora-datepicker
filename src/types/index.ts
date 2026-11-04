import type { CSSProperties, ReactNode } from "react";

export type PickerMode =
  | "date"
  | "time"
  | "datetime"
  | "month"
  | "year"
  | "range"
  | "datetimerange"
  | "multiple"
  | "week";

export type CalendarKind = "jalali" | "gregorian";
export type LocaleCode = "fa" | "en";
export type NumberSystem = "persian" | "latin";
export type PickerSize = "small" | "middle" | "large";
export type InputStatus = "error" | "warning" | "";
export type DesktopMode = "popover" | "modal";
export type MobileMode = "sheet" | "modal" | "fullscreen";
export type PanelView = "date" | "month" | "year" | "time";
export type Appearance = "light" | "dark" | "official" | "golsetan" | "auto";

export interface DateParts {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export interface CalendarDate {
  jy: number;
  jm: number;
  jd: number;
  gy: number;
  gm: number;
  gd: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Saturday … 6 = Friday */
  weekday: number;
  /** 0 = Sunday … 6 = Saturday */
  weekDayGregorian: number;
}

export type DateLike =
  | string
  | number
  | Date
  | DateParts
  | CalendarDate
  | null
  | undefined;

export type SingleValue = DateLike;
export type RangeValue = [DateLike, DateLike] | null;
export type MultipleValue = DateLike[];
export type PickerValue = SingleValue | RangeValue | MultipleValue;

export interface Holiday {
  date: string;
  title: string;
  type?: "official" | "religious" | "custom";
}

export interface Preset {
  label: string;
  value:
    | DateLike
    | [DateLike, DateLike]
    | DateLike[]
    | (() => DateLike | [DateLike, DateLike] | DateLike[]);
}

export interface YearRange {
  from: number;
  to: number;
}

export interface PickerTheme {
  primaryColor?: string;
  borderRadius?: number;
  controlHeight?: number;
  fontSize?: number;
  colorBgContainer?: string;
  colorText?: string;
  colorTextSecondary?: string;
  colorBorder?: string;
  colorBgElevated?: string;
  colorBgHeader?: string;
  colorTextHeader?: string;
  fontFamily?: string;
}

export interface PublicDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
  jalali: { year: number; month: number; day: number };
  gregorian: { year: number; month: number; day: number };
  native: Date;
  isToday: boolean;
  isLeapYear: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayTitle?: string;
  isOutside: boolean;
  key: string;
}

export type DisabledDateFn = (date: PublicDate) => boolean;

export type RenderDay = (date: PublicDate, defaultNode: ReactNode) => ReactNode;
export type RenderMonth = (month: number, year: number, label: string) => ReactNode;
export type RenderYear = (year: number, label: string) => ReactNode;
export type RenderHeader = (info: HeaderRenderInfo) => ReactNode;
export type RenderFooter = (actions: FooterRenderInfo) => ReactNode;

export interface HeaderRenderInfo {
  view: PanelView;
  year: number;
  month: number;
  selected: CalendarDate | null;
  labels: LocaleLabels;
  formatted: string;
  /** Optional month navigation (used by custom headers, e.g. golsetan). */
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  canPrevMonth?: boolean;
  canNextMonth?: boolean;
}

export interface FooterRenderInfo {
  onConfirm: () => void;
  onCancel: () => void;
  onClear: () => void;
  onToday: () => void;
  labels: LocaleLabels;
  confirmDisabled: boolean;
}

export interface LocaleLabels {
  weekdays: string[];
  weekdaysShort: string[];
  months: string[];
  monthsShort: string[];
  today: string;
  yesterday: string;
  tomorrow: string;
  thisWeek: string;
  lastWeek: string;
  thisMonth: string;
  lastMonth: string;
  nextWeek: string;
  confirm: string;
  cancel: string;
  clear: string;
  now: string;
  selectDate: string;
  selectTime: string;
  selectDateTime: string;
  selectMonth: string;
  selectYear: string;
  selectRange: string;
  start: string;
  end: string;
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  date: string;
  time: string;
  nextMonth: string;
  prevMonth: string;
  nextYear: string;
  prevYear: string;
  datesSelected: string;
  until: string;
  weekNumber: string;
}

export interface PersianDatePickerProps {
  mode?: PickerMode;
  value?: PickerValue;
  defaultValue?: PickerValue;
  onChange?: (
    value: PickerValue,
    date: CalendarDate | [CalendarDate, CalendarDate] | CalendarDate[] | null,
  ) => void;
  onConfirm?: (value: PickerValue) => void;
  onCancel?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onPanelChange?: (view: PanelView, year: number, month: number) => void;
  onMonthChange?: (month: number, year: number) => void;
  onYearChange?: (year: number) => void;

  locale?: LocaleCode;
  calendar?: CalendarKind;
  numberSystem?: NumberSystem;
  format?: string;
  displayFormat?: string;
  valueFormat?: string;

  placeholder?: string;
  allowClear?: boolean;
  clearText?: string;
  showToday?: boolean;
  todayButtonText?: string;
  selectTodayOnClick?: boolean;
  autoConfirm?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  allowInput?: boolean;
  size?: PickerSize;
  status?: InputStatus;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  popupClassName?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  id?: string;
  name?: string;
  tabIndex?: number;

  open?: boolean;
  defaultOpen?: boolean;

  minDate?: DateLike;
  maxDate?: DateLike;
  disabledDate?: DisabledDateFn;
  holidays?: Holiday[];

  yearRange?: YearRange;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  /**
   * Which time columns to show. Example: "hour,minute" or "hour,minute,second".
   * When set, it overrides showHour / showMinute / showSecond.
   */
  timeUnits?: string;
  minuteStep?: number;
  secondStep?: number;
  hourStep?: number;

  allowSameDayRange?: boolean;
  maxSelections?: number;
  minSelections?: number;

  showWeekNumber?: boolean;
  showPresets?: boolean;
  presets?: Preset[];

  /** Side-by-side months in the desktop panel (1–3, desktop only). Default 1. */
  numberOfMonths?: number;
  /** Sort dates chronologically in multiple mode. Default false. */
  sortDates?: boolean;
  /** Separator between start/end in range display. Default locale's "until". */
  rangeSeparator?: string;
  /** Separator between dates in multiple display. Default "، ". */
  multipleSeparator?: string;
  /** Hide the month / year / weekday-names header elements. */
  hideMonth?: boolean;
  hideYear?: boolean;
  hideWeekdays?: boolean;
  /** Disable the month / year grid openers (labels stay visible). */
  disableMonthPicker?: boolean;
  disableYearPicker?: boolean;
  /** Show days of adjacent months in the grid. Default true. */
  showOtherDays?: boolean;
  /** Highlight today with a ring. Default true. */
  highlightToday?: boolean;
  /**
   * Order the date is picked in. Example: "year,month,day" opens the year
   * list first, then months, then days. Tokens: year, month, day.
   */
  startDate?: string;
  /**
   * In datetime modes, after the date is chosen open the time step.
   * When omitted, date and time stay on a manual switch.
   */
  autoSwitchToTime?: boolean;
  /** Override month / weekday names (must cover all 12 months / 7 days). */
  monthNames?: string[];
  weekdayNames?: string[];

  onFocusedDateChange?: (date: CalendarDate | null) => void;

  desktopMode?: DesktopMode;
  mobileMode?: MobileMode;
  mobileBreakpoint?: number;
  forceVariant?: "desktop" | "mobile";
  maskClosable?: boolean;
  appearance?: Appearance;
  theme?: PickerTheme;
  primaryColor?: string;
  direction?: "rtl" | "ltr";
  /** Blue-header EN/فا switch: EN → Gregorian calendar, فا → Jalali. Default true. */
  showCalendarToggle?: boolean;
  onCalendarChange?: (calendar: CalendarKind) => void;

  renderDay?: RenderDay;
  renderMonth?: RenderMonth;
  renderYear?: RenderYear;
  renderHeader?: RenderHeader;
  renderFooter?: RenderFooter;

  headerTitle?: string;
  confirmText?: string;
  cancelText?: string;

  getPopupContainer?: () => HTMLElement;
  /** Always-visible calendar without an input (used by PersianCalendar). */
  inline?: boolean;
}

export interface PersianCalendarProps
  extends Omit<
    PersianDatePickerProps,
    | "placeholder"
    | "prefix"
    | "suffix"
    | "size"
    | "status"
    | "open"
    | "defaultOpen"
  > {
  fullscreen?: boolean;
}

import type { CSSProperties } from "react";
import type {
  CalendarDate,
  CalendarKind,
  DisabledDateFn,
  Holiday,
  LocaleLabels,
  NumberSystem,
  PanelView,
  PickerMode,
  Preset,
  RenderDay,
  RenderFooter,
  RenderHeader,
  RenderMonth,
  RenderYear,
} from "../../types";
import type { GridCell } from "../../calendar/calendar-utils";
import type { DateSelectionStep } from "../../utils/selectionOrder";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader, PanelBanner, SegmentToggle } from "./CalendarHeader";
import { FooterActions } from "./FooterActions";
import { MonthPicker } from "./MonthPicker";
import { TimeColumns } from "./TimePicker";
import { YearPicker } from "./YearPicker";
import { formatHeaderDate, formatJalali } from "../../utils/format";
import { applyNumberSystem } from "../../utils/numbers";
import { dateKey } from "../../calendar/calendar-utils";

export interface PickerPanelProps {
  mode: PickerMode;
  view: PanelView;
  setView: (v: PanelView) => void;
  calendar: CalendarKind;
  locale: "fa" | "en";
  numberSystem: NumberSystem;
  labels: LocaleLabels;
  rtl: boolean;
  today: CalendarDate;
  cursor: CalendarDate;
  year: number;
  month: number;
  grid: GridCell[];
  goMonth: (d: number) => void;
  goYear: (d: number) => void;
  headerTitle?: string;
  selected?: CalendarDate | null;
  rangeStart?: CalendarDate | null;
  rangeEnd?: CalendarDate | null;
  hoverDate?: CalendarDate | null;
  multiple?: CalendarDate[];
  focused?: CalendarDate | null;
  minDate?: CalendarDate | null;
  maxDate?: CalendarDate | null;
  disabledDate?: DisabledDateFn;
  holidays?: Holiday[];
  showWeekNumber?: boolean;
  yearRange: { from: number; to: number };
  months: string[];
  weekdays: string[];
  onSelectDay: (d: CalendarDate) => void;
  onHover: (d: CalendarDate | null) => void;
  onSelectMonth: (m: number) => void;
  onSelectYear: (y: number) => void;
  onTimeChange: (patch: Partial<Pick<CalendarDate, "hour" | "minute" | "second">>) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onClear: () => void;
  onToday: () => void;
  showToday?: boolean;
  allowClear?: boolean;
  confirmDisabled?: boolean;
  confirmText?: string;
  cancelText?: string;
  clearText?: string;
  todayButtonText?: string;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  renderDay?: RenderDay;
  renderMonth?: RenderMonth;
  renderYear?: RenderYear;
  renderHeader?: RenderHeader;
  renderFooter?: RenderFooter;
  showPresets?: boolean;
  presets?: Preset[];
  onPreset?: (p: Preset) => void;
  displayFormat: string;
  hideHeader?: boolean;
  /** Official theme: in range mode the banner shows only "انتخاب تاریخ"
   *  instead of echoing the selected range (it is already shown below the grid). */
  hideRangeTitle?: boolean;
  hideFooter?: boolean;
  hideYearNav?: boolean;
  staticYear?: boolean;
  disableMonthPicker?: boolean;
  disableYearPicker?: boolean;
  hideMonth?: boolean;
  hideYear?: boolean;
  hideWeekdays?: boolean;
  showOtherDays?: boolean;
  highlightToday?: boolean;
  extraGrids?: Array<{ key: string; year: number; month: number; grid: GridCell[] }>;
  showCalendarToggle?: boolean;
  calendarToggleValue?: CalendarKind;
  onCalendarToggle?: (c: CalendarKind) => void;  canPrevMonth?: boolean;
  canNextMonth?: boolean;
  datetimeTab?: "date" | "time";
  setDatetimeTab?: (t: "date" | "time") => void;
  /** Official theme: date/time and step switches use the فا/EN pill. */
  pillToggle?: boolean;
  selectionSteps?: DateSelectionStep[];
  onSelectStep?: (step: DateSelectionStep) => void;
  className?: string;
  style?: CSSProperties;
  role?: string;
}

function DateSwitches(props: {
  mode: PickerMode;
  view: PanelView;
  labels: LocaleLabels;
  datetimeTab?: "date" | "time";
  setDatetimeTab?: (t: "date" | "time") => void;
  pill?: boolean;
  steps?: DateSelectionStep[];
  showTime: boolean;
  onSelectStep?: (step: DateSelectionStep) => void;
}) {
  const steps = props.steps ?? [];
  const showDateTime = props.mode === "datetime" || props.mode === "datetimerange";
  const showSteps = steps.length > 1 && !props.showTime;
  if (!showDateTime && !showSteps) return null;

  const dateTime = showDateTime ? (
    <SegmentToggle
      pill={props.pill}
      ariaLabel="date or time"
      value={props.datetimeTab === "time" ? "time" : "date"}
      onChange={(value) => props.setDatetimeTab?.(value === "time" ? "time" : "date")}
      options={[
        { value: "date", label: props.labels.date },
        { value: "time", label: props.labels.time },
      ]}
    />
  ) : null;

  const stepValue: DateSelectionStep =
    props.view === "year" ? "year" : props.view === "month" ? "month" : "day";
  const stepSwitch = showSteps ? (
    <SegmentToggle
      pill={props.pill}
      ariaLabel="date part"
      value={stepValue}
      onChange={(value) => props.onSelectStep?.(value as DateSelectionStep)}
      options={steps.map((step) => ({ value: step, label: props.labels[step] }))}
    />
  ) : null;

  if (props.pill) {
    return (
      <div className="pdp-switch-row">
        {dateTime}
        {stepSwitch}
      </div>
    );
  }
  return (
    <>
      {dateTime}
      {stepSwitch}
    </>
  );
}

export function PickerPanel(props: PickerPanelProps) {
  const header = formatHeaderDate(
    props.mode === "range" || props.mode === "datetimerange"
      ? props.rangeStart ?? null
      : props.mode === "multiple"
        ? props.multiple?.[0] ?? null
        : props.selected ?? null,
    props.locale,
    props.calendar,
    props.numberSystem,
    props.mode,
  );

  let title = header.title;
  let subtitle = header.subtitle;
  if (props.mode === "range" || props.mode === "datetimerange") {
    if (props.hideRangeTitle) {
      title = props.labels.selectDate;
      subtitle = "";
    } else {
      const a = props.rangeStart
        ? formatJalali(props.rangeStart, props.displayFormat, {
            locale: props.locale,
            numberSystem: props.numberSystem,
            calendar: props.calendar,
          })
        : props.labels.start;
      const b = props.rangeEnd
        ? formatJalali(props.rangeEnd, props.displayFormat, {
            locale: props.locale,
            numberSystem: props.numberSystem,
            calendar: props.calendar,
          })
        : props.labels.end;
      title = `${a}  ${props.labels.until}  ${b}`;
      subtitle = props.labels.selectDate;
    }
  }
  if (props.mode === "multiple") {
    const n = props.multiple?.length ?? 0;
    title = n
      ? `${applyNumberSystem(n, props.numberSystem)} ${props.labels.datesSelected}`
      : props.labels.selectDate;
    subtitle = (props.multiple ?? [])
      .slice(0, 3)
      .map((d) => dateKey(d, props.calendar))
      .join("، ");
  }

  const timeValue =
    props.selected ??
    props.rangeEnd ??
    props.rangeStart ??
    props.multiple?.[0] ??
    props.today;

  const showTime =
    props.mode === "time" ||
    ((props.mode === "datetime" || props.mode === "datetimerange") &&
      props.datetimeTab === "time") ||
    props.view === "time";

  const showDateViews =
    props.mode !== "time" &&
    !showTime &&
    props.mode !== "year" &&
    props.mode !== "month";

  const monthNames = props.months;

  return (
    <>
      {props.hideHeader ? null : (
        <PanelBanner
          kicker={props.headerTitle}
          title={title}
          subtitle={subtitle}
          calendarToggle={
            props.showCalendarToggle !== false && props.calendarToggleValue && props.onCalendarToggle
              ? { value: props.calendarToggleValue, onChange: props.onCalendarToggle }
              : undefined
          }
        />
      )}

      <DateSwitches
        mode={props.mode}
        view={props.view}
        labels={props.labels}
        datetimeTab={props.datetimeTab}
        setDatetimeTab={props.setDatetimeTab}
        pill={props.pillToggle}
        steps={props.selectionSteps}
        showTime={showTime}
        onSelectStep={props.onSelectStep}
      />

      <div className="pdp-body-row">
        {props.showPresets && props.presets?.length ? (
          <div className="pdp-presets">
            {props.presets.map((p) => (
              <button
                key={p.label}
                type="button"
                className="pdp-preset"
                onClick={() => props.onPreset?.(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="pdp-body-main">
          {showDateViews && props.view === "date" ? (
            <>
              <CalendarHeader
                monthLabel={monthNames[props.month - 1] ?? ""}
                yearLabel={applyNumberSystem(props.year, props.numberSystem)}
                rtl={props.rtl}
                labels={props.labels}
                onPrevMonth={() => props.goMonth(-1)}
                onNextMonth={() => props.goMonth(1)}
                onPrevYear={() => props.goYear(-1)}
                onNextYear={() => props.goYear(1)}
                onMonthClick={() => props.setView("month")}
                onYearClick={() => props.setView("year")}
                view={props.view}
                renderHeader={props.renderHeader}
                canPrevMonth={props.canPrevMonth}
                canNextMonth={props.canNextMonth}
                hideYearNav={props.hideYearNav}
                staticYear={props.staticYear}
                disableMonthPicker={props.disableMonthPicker}
                disableYearPicker={props.disableYearPicker}
                hideMonth={props.hideMonth}
                hideYear={props.hideYear}
                headerInfo={{
                  view: props.view,
                  year: props.year,
                  month: props.month,
                  selected: props.selected ?? null,
                  labels: props.labels,
                  formatted: title,
                }}
              />
              <div className={`pdp-month-cols${props.extraGrids?.length ? " pdp-month-cols--multi" : ""}`}>
                <div className="pdp-month-col">
                  {props.extraGrids?.length ? (
                    <div className="pdp-month-caption pdp-month-caption--empty" aria-hidden />
                  ) : null}
                  <CalendarGrid
                    grid={props.grid}
                    calendar={props.calendar}
                    today={props.today}
                    numberSystem={props.numberSystem}
                    weekdays={props.weekdays}
                    hideWeekdays={props.hideWeekdays}
                    showWeekNumber={props.showWeekNumber}
                    weekNumberLabel={props.labels.weekNumber}
                    showOtherDays={props.showOtherDays}
                    highlightToday={props.highlightToday}
                    selected={props.selected}
                    rangeStart={props.rangeStart}
                    rangeEnd={props.rangeEnd}
                    hoverDate={props.hoverDate}
                    multiple={props.multiple}
                    focused={props.focused}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                    disabledDate={props.disabledDate}
                    holidays={props.holidays}
                    onSelect={props.onSelectDay}
                    onHover={props.onHover}
                    renderDay={props.renderDay}
                    labels={props.labels}
                  />
                </div>
                {(props.extraGrids ?? []).map((g) => (
                  <div className="pdp-month-col" key={g.key}>
                    <div className="pdp-month-caption" aria-live="polite">
                      {monthNames[g.month - 1] ?? ""}{" "}
                      {applyNumberSystem(g.year, props.numberSystem)}
                    </div>
                    <CalendarGrid
                      grid={g.grid}
                      calendar={props.calendar}
                      today={props.today}
                      numberSystem={props.numberSystem}
                      weekdays={props.weekdays}
                      hideWeekdays={props.hideWeekdays}
                      showWeekNumber={props.showWeekNumber}
                      weekNumberLabel={props.labels.weekNumber}
                      showOtherDays={props.showOtherDays}
                      highlightToday={props.highlightToday}
                      selected={props.selected}
                      rangeStart={props.rangeStart}
                      rangeEnd={props.rangeEnd}
                      hoverDate={props.hoverDate}
                      multiple={props.multiple}
                      focused={props.focused}
                      minDate={props.minDate}
                      maxDate={props.maxDate}
                      disabledDate={props.disabledDate}
                      holidays={props.holidays}
                      onSelect={props.onSelectDay}
                      onHover={props.onHover}
                      renderDay={props.renderDay}
                      labels={props.labels}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {(props.view === "month" || props.mode === "month") && !showTime ? (
            <MonthPicker
              months={props.months}
              month={props.month}
              year={props.year}
              onSelect={props.onSelectMonth}
              renderMonth={props.renderMonth}
            />
          ) : null}

          {(props.view === "year" || props.mode === "year") && !showTime ? (
            <YearPicker
              year={props.year}
              from={props.yearRange.from}
              to={props.yearRange.to}
              numberSystem={props.numberSystem}
              onSelect={props.onSelectYear}
              renderYear={props.renderYear}
            />
          ) : null}

          {showTime ? (
            <TimeColumns
              value={timeValue}
              onChange={props.onTimeChange}
              showHour={props.showHour}
              showMinute={props.showMinute}
              showSecond={props.showSecond}
              hourStep={props.hourStep}
              minuteStep={props.minuteStep}
              secondStep={props.secondStep}
              numberSystem={props.numberSystem}
              labels={props.labels}
            />
          ) : null}

          {props.mode === "range" || props.mode === "datetimerange" ? (
            <div className="pdp-range-caption">
              <span>
                {props.labels.start}:{" "}
                <strong>
                  {props.rangeStart
                    ? formatJalali(props.rangeStart, "jYYYY/jMM/jDD", {
                        locale: props.locale,
                        numberSystem: props.numberSystem,
                        calendar: props.calendar,
                      })
                    : "—"}
                </strong>
              </span>
              <span>
                {props.labels.end}:{" "}
                <strong>
                  {props.rangeEnd
                    ? formatJalali(props.rangeEnd, "jYYYY/jMM/jDD", {
                        locale: props.locale,
                        numberSystem: props.numberSystem,
                        calendar: props.calendar,
                      })
                    : "—"}
                </strong>
              </span>
            </div>
          ) : null}

          {props.mode === "multiple" && props.multiple?.length ? (
            <div className="pdp-multi-chips">
              {props.multiple.map((d) => (
                <span key={dateKey(d)} className="pdp-mini-chip">
                  {formatJalali(d, "jMM/jDD", {
                    locale: props.locale,
                    numberSystem: props.numberSystem,
                    calendar: props.calendar,
                  })}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {props.hideFooter ? null : (
        <FooterActions
          labels={props.labels}
          confirmText={props.confirmText}
          cancelText={props.cancelText}
          clearText={props.clearText}
          todayText={props.todayButtonText}
          showToday={props.showToday}
          allowClear={props.allowClear}
          confirmDisabled={props.confirmDisabled}
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
          onClear={props.onClear}
          onToday={props.onToday}
          renderFooter={props.renderFooter}
        />
      )}
    </>
  );
}

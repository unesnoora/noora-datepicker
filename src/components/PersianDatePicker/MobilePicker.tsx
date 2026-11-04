import { useMemo, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import type { CalendarDate, CalendarKind, NumberSystem } from "../../types";
import {
  createFromGregorian,
  createFromJalali,
  getDay,
  getMonth,
  getYear,
  monthLength,
} from "../../calendar/calendar-utils";
import { applyNumberSystem } from "../../utils/numbers";
import { SegmentToggle } from "./CalendarHeader";
import { Overlay } from "./Overlay";
import { PickerPanel, type PickerPanelProps } from "./PickerPanel";
import { FooterActions } from "./FooterActions";
import { WheelColumn, WheelRow } from "./WheelPicker";
import { TimeColumns } from "./TimePicker";

function rebuild(
  calendar: CalendarKind,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): CalendarDate {
  const dim = monthLength(year, month, calendar);
  const d = Math.min(day, dim);
  if (calendar === "gregorian") {
    return createFromGregorian(year, month, d, hour, minute, second);
  }
  return createFromJalali(year, month, d, hour, minute, second);
}

export function MobilePicker(
  props: PickerPanelProps & {
    open: boolean;
    onClose: () => void;
    maskClosable?: boolean;
    mobileMode?: "sheet" | "modal" | "fullscreen";
    dark: boolean;
    dir: "rtl" | "ltr";
    popupClassName?: string;
    themeStyle?: CSSProperties;
    container?: HTMLElement | null;
    onTempDate: (d: CalendarDate) => void;
    wheelDate: CalendarDate;
  },
) {
  const {
    open,
    onClose,
    maskClosable,
    mobileMode = "sheet",
    dark,
    dir,
    popupClassName,
    themeStyle,
    container,
    onTempDate,
    wheelDate,
    ...panel
  } = props;

  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const dy = useRef(0);
  const [offset, setOffset] = useState(0);

  const year = getYear(wheelDate, panel.calendar);
  const month = getMonth(wheelDate, panel.calendar);
  const day = getDay(wheelDate, panel.calendar);
  const dim = monthLength(year, month, panel.calendar);

  const years = useMemo(() => {
    const items: { value: number; label: string }[] = [];
    for (let y = panel.yearRange.from; y <= panel.yearRange.to; y += 1) {
      items.push({ value: y, label: applyNumberSystem(y, panel.numberSystem) });
    }
    return items;
  }, [panel.yearRange.from, panel.yearRange.to, panel.numberSystem]);

  const months = useMemo(
    () =>
      panel.months.map((label, i) => ({
        value: i + 1,
        label,
      })),
    [panel.months],
  );

  const days = useMemo(() => {
    const items: { value: number; label: string }[] = [];
    for (let d = 1; d <= dim; d += 1) {
      items.push({ value: d, label: applyNumberSystem(d, panel.numberSystem as NumberSystem) });
    }
    return items;
  }, [dim, panel.numberSystem]);

  const useWheels =
    panel.mode === "date" ||
    panel.mode === "datetime" ||
    panel.mode === "month" ||
    panel.mode === "year" ||
    panel.mode === "time";

  const applyYMD = (y: number, m: number, d: number) => {
    onTempDate(
      rebuild(panel.calendar, y, m, d, wheelDate.hour, wheelDate.minute, wheelDate.second),
    );
  };

  const onTouchStart = (e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
    dy.current = 0;
  };
  const onTouchMove = (e: TouchEvent) => {
    dy.current = e.touches[0].clientY - startY.current;
    if (dy.current > 0) setOffset(dy.current);
  };
  const onTouchEnd = () => {
    if (dy.current > 90) onClose();
    setOffset(0);
    dy.current = 0;
  };

  const preferred: Array<"year" | "month" | "day"> = panel.selectionSteps?.length
    ? [...panel.selectionSteps]
    : ["day", "month", "year"];
  const wheelOrder: Array<"year" | "month" | "day"> = [
    ...preferred,
    ...(["day", "month", "year"] as const).filter((step) => !preferred.includes(step)),
  ];
  const showWheel = (step: "day" | "month" | "year") => {
    if (step === "year") return true;
    if (step === "month") return panel.mode !== "year";
    return panel.mode !== "year" && panel.mode !== "month";
  };
  const wheelNodes = {
    day: (
      <WheelColumn
        key="day"
        items={days}
        value={day}
        onChange={(d) => applyYMD(year, month, d)}
        label={panel.labels.day}
      />
    ),
    month: (
      <WheelColumn
        key="month"
        items={months}
        value={month}
        onChange={(m) => applyYMD(year, m, day)}
        label={panel.labels.month}
      />
    ),
    year: (
      <WheelColumn
        key="year"
        items={years}
        value={year}
        onChange={(y) => applyYMD(y, month, day)}
        label={panel.labels.year}
      />
    ),
  };

  const sheet = mobileMode !== "modal";
  const fullscreen = mobileMode === "fullscreen";

  const title =
    panel.mode === "time"
      ? panel.labels.selectTime
      : panel.mode === "datetime"
        ? panel.labels.selectDateTime
        : panel.mode === "month"
          ? panel.labels.selectMonth
          : panel.mode === "year"
            ? panel.labels.selectYear
            : panel.labels.selectDate;

  return (
    <Overlay
      open={open}
      onClose={onClose}
      maskClosable={maskClosable}
      placement={sheet ? "sheet" : "center"}
      container={container}
    >
      <div
        className={`pdp-root ${dark ? "pdp--dark" : ""} ${popupClassName ?? ""}`}
        dir={dir}
        style={themeStyle}
      >
        <div
          ref={sheetRef}
          className={
            sheet
              ? `pdp-sheet${fullscreen ? " pdp-sheet--fullscreen" : ""}`
              : "pdp-panel"
          }
          role="dialog"
          aria-modal="true"
          style={{
            transform: offset ? `translateY(${offset}px)` : undefined,
            transition: offset ? "none" : undefined,
          }}
        >
          {sheet ? (
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="pdp-handle" />
              <div className="pdp-sheet-title">{panel.headerTitle ?? title}</div>
            </div>
          ) : null}

          {panel.mode === "datetime" ? (
            <div className={panel.pillToggle ? "pdp-switch-row" : undefined}>
              <SegmentToggle
                pill={panel.pillToggle}
                ariaLabel="date or time"
                value={panel.datetimeTab === "time" ? "time" : "date"}
                onChange={(value) => panel.setDatetimeTab?.(value === "time" ? "time" : "date")}
                options={[
                  { value: "date", label: panel.labels.date },
                  { value: "time", label: panel.labels.time },
                ]}
              />
            </div>
          ) : null}

          {useWheels && (panel.mode !== "datetime" || panel.datetimeTab !== "time") && panel.mode !== "time" ? (
            <WheelRow>
              {wheelOrder.filter(showWheel).map((step) => wheelNodes[step])}
            </WheelRow>
          ) : null}

          {(panel.mode === "time" ||
            (panel.mode === "datetime" && panel.datetimeTab === "time")) && (
            <TimeColumns
              value={wheelDate}
              onChange={panel.onTimeChange}
              showHour={panel.showHour}
              showMinute={panel.showMinute}
              showSecond={panel.showSecond}
              hourStep={panel.hourStep}
              minuteStep={panel.minuteStep}
              secondStep={panel.secondStep}
              numberSystem={panel.numberSystem}
              labels={panel.labels}
            />
          )}

          {!useWheels ? (
            <div className="pdp-sheet-scroll">
              <PickerPanel {...panel} hideHeader hideFooter />
            </div>
          ) : null}

          <FooterActions
            labels={panel.labels}
            confirmText={panel.confirmText}
            cancelText={panel.cancelText}
            clearText={panel.clearText}
            todayText={panel.todayButtonText}
            showToday={panel.showToday}
            allowClear={panel.allowClear}
            confirmDisabled={panel.confirmDisabled}
            onConfirm={panel.onConfirm}
            onCancel={panel.onCancel}
            onClear={panel.onClear}
            onToday={panel.onToday}
            renderFooter={panel.renderFooter}
          />
        </div>
      </div>
    </Overlay>
  );
}



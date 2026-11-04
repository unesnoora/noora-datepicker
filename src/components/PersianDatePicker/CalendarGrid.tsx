import { memo, useMemo } from "react";
import type {
  CalendarDate,
  CalendarKind,
  DisabledDateFn,
  Holiday,
  LocaleLabels,
  NumberSystem,
  PublicDate,
  RenderDay,
} from "../../types";
import {
  buildHolidayMap,
  compareDate,
  getDay,
  isBetween,
  isSameDay,
  toPublicDate,
  type GridCell,
} from "../../calendar/calendar-utils";
import { isDateDisabled } from "../../utils/validation";
import { applyNumberSystem } from "../../utils/numbers";
import { DayCell } from "./DayCell";

export const CalendarGrid = memo(function CalendarGrid(props: {
  grid: GridCell[];
  calendar: CalendarKind;
  today: CalendarDate;
  numberSystem: NumberSystem;
  weekdays: string[];
  hideWeekdays?: boolean;
  showWeekNumber?: boolean;
  weekNumberLabel?: string;
  showOtherDays?: boolean;
  highlightToday?: boolean;
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
  onSelect: (d: CalendarDate) => void;
  onHover: (d: CalendarDate | null) => void;
  renderDay?: RenderDay;
  labels: LocaleLabels;
}) {
  const holidayMap = useMemo(
    () => buildHolidayMap(props.holidays),
    [props.holidays],
  );

  const hoverRange = props.rangeStart && !props.rangeEnd && props.hoverDate;

  return (
    <div>
      {props.hideWeekdays ? null : (
        <div
          className={`pdp-weekdays${props.showWeekNumber ? " pdp-weekdays--weeks" : ""}`}
        >
          {props.showWeekNumber ? (
            <div className="pdp-weekday">{props.weekNumberLabel ?? ""}</div>
          ) : null}
          {props.weekdays.map((w, i) => (
            <div
              key={w}
              className={`pdp-weekday${i === 6 ? " pdp-weekday--weekend" : ""}`}
            >
              {w}
            </div>
          ))}
        </div>
      )}
      <div
        className={`pdp-grid${props.showWeekNumber ? " pdp-grid--weeks" : ""}`}
        role="grid"
        aria-label={props.labels.selectDate}
      >
        {props.grid.map((cell, idx) => {
          if (props.showOtherDays === false && cell.isOutside) {
            const empty = (
              <span
                key={`empty-${idx}`}
                className="pdp-day pdp-day--empty"
                aria-hidden
              />
            );
            if (props.showWeekNumber && idx % 7 === 0) {
              return (
                <span key={`w-${idx}`} style={{ display: "contents" }}>
                  <div className="pdp-weeknum">
                    {applyNumberSystem(cell.weekNumber, props.numberSystem)}
                  </div>
                  {empty}
                </span>
              );
            }
            return empty;
          }
          const d = cell.date;
          const publicDate: PublicDate = toPublicDate(d, {
            calendar: props.calendar,
            today: props.today,
            isOutside: cell.isOutside,
            holidays: holidayMap,
          });
          const disabled = isDateDisabled(d, {
            minDate: props.minDate,
            maxDate: props.maxDate,
            disabledDate: props.disabledDate,
            calendar: props.calendar,
            holidays: holidayMap,
          });
          const selected = props.multiple
            ? props.multiple.some((x) => isSameDay(x, d))
            : isSameDay(props.selected ?? null, d);
          const rangeStart = Boolean(props.rangeStart && isSameDay(props.rangeStart, d));
          const rangeEnd = Boolean(props.rangeEnd && isSameDay(props.rangeEnd, d));
          const rangeMiddle = Boolean(
            props.rangeStart &&
              props.rangeEnd &&
              isBetween(d, props.rangeStart, props.rangeEnd, false),
          );
          let hover = false;
          if (hoverRange && props.rangeStart && props.hoverDate) {
            const a =
              compareDate(props.rangeStart, props.hoverDate, "day") <= 0
                ? props.rangeStart
                : props.hoverDate;
            const b =
              compareDate(props.rangeStart, props.hoverDate, "day") <= 0
                ? props.hoverDate
                : props.rangeStart;
            hover = isBetween(d, a, b, true) && !rangeStart;
          }
          const focused = isSameDay(props.focused ?? null, d);
          const node = (
            <DayCell
              key={publicDate.key + (cell.isOutside ? "-o" : "")}
              date={d}
              publicDate={publicDate}
              dayNumber={getDay(d, props.calendar)}
              numberSystem={props.numberSystem}
              selected={selected && !rangeStart && !rangeEnd ? selected : selected}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              rangeMiddle={rangeMiddle}
              hoverRange={hover}
              disabled={disabled}
              focused={focused}
              isOutside={cell.isOutside}
              onSelect={props.onSelect}
              onHover={props.onHover}
              renderDay={props.renderDay}
              highlightToday={props.highlightToday}
            />
          );
          if (props.showWeekNumber && idx % 7 === 0) {
            return (
              <span key={`w-${idx}`} style={{ display: "contents" }}>
                <div className="pdp-weeknum">
                  {applyNumberSystem(cell.weekNumber, props.numberSystem)}
                </div>
                {node}
              </span>
            );
          }
          return node;
        })}
      </div>
    </div>
  );
});

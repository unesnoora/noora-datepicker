import { useEffect, useMemo, useRef } from "react";
import type { CalendarDate, NumberSystem } from "../../types";
import { applyNumberSystem, pad2 } from "../../utils/numbers";

const ITEM = 44;

function Column(props: {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  numberSystem: NumberSystem;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const skip = useRef(false);
  const idx = Math.max(0, props.values.indexOf(props.value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    skip.current = true;
    el.scrollTop = idx * ITEM;
    const t = window.setTimeout(() => {
      skip.current = false;
    }, 60);
    return () => window.clearTimeout(t);
  }, [idx, props.values.length]);

  return (
    <div
      className="pdp-time-col"
      ref={ref}
      onScroll={() => {
        if (skip.current || !ref.current) return;
        const nextIdx = Math.round(ref.current.scrollTop / ITEM);
        const clamped = Math.min(Math.max(nextIdx, 0), props.values.length - 1);
        const v = props.values[clamped];
        if (v !== undefined && v !== props.value) props.onChange(v);
      }}
      role="listbox"
      aria-label={props.ariaLabel}
    >
      {props.values.map((v) => (
        <div
          key={v}
          className={`pdp-time-item${v === props.value ? " pdp-time-item--active" : ""}`}
          role="option"
          aria-selected={v === props.value}
          onClick={() => props.onChange(v)}
        >
          {applyNumberSystem(pad2(v), props.numberSystem)}
        </div>
      ))}
      <div className="pdp-time-pad" />
      <div className="pdp-time-pad" />
    </div>
  );
}

function range(max: number, step: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < max; i += step) out.push(i);
  return out;
}

export function TimeColumns(props: {
  value: CalendarDate;
  onChange: (patch: Partial<Pick<CalendarDate, "hour" | "minute" | "second">>) => void;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  numberSystem: NumberSystem;
  labels: { hour: string; minute: string; second: string };
}) {
  const hours = useMemo(() => range(24, props.hourStep ?? 1), [props.hourStep]);
  const minutes = useMemo(() => range(60, props.minuteStep ?? 1), [props.minuteStep]);
  const seconds = useMemo(() => range(60, props.secondStep ?? 1), [props.secondStep]);
  const showHour = props.showHour !== false;
  const showMinute = props.showMinute !== false;
  const showSecond = Boolean(props.showSecond);

  return (
    <div className="pdp-time-wrap">
      <div className="pdp-time-labels">
        {showHour ? <span>{props.labels.hour}</span> : null}
        {showMinute ? <span>{props.labels.minute}</span> : null}
        {showSecond ? <span>{props.labels.second}</span> : null}
      </div>
      <div className="pdp-time">
        {showHour ? (
          <Column
            values={hours}
            value={props.value.hour}
            onChange={(hour) => props.onChange({ hour })}
            numberSystem={props.numberSystem}
            ariaLabel={props.labels.hour}
          />
        ) : null}
        {showMinute ? (
          <Column
            values={minutes}
            value={props.value.minute}
            onChange={(minute) => props.onChange({ minute })}
            numberSystem={props.numberSystem}
            ariaLabel={props.labels.minute}
          />
        ) : null}
        {showSecond ? (
          <Column
            values={seconds}
            value={props.value.second}
            onChange={(second) => props.onChange({ second })}
            numberSystem={props.numberSystem}
            ariaLabel={props.labels.second}
          />
        ) : null}
      </div>
    </div>
  );
}

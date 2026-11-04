import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CalendarDate,
  CalendarKind,
  PickerMode,
  PickerValue,
  DateLike,
} from "../types";
import {
  addDays,
  addMonths,
  compareDate,
  getToday,
  isSameDay,
  parseDateLike,
} from "../calendar/calendar-utils";
import { defaultDisplayFormat, defaultValueFormat, formatJalali } from "../utils/format";
import { getLocalePack } from "../utils/locale";

export type InternalSingle = CalendarDate | null;
export type InternalRange = [CalendarDate | null, CalendarDate | null];
export type InternalMultiple = CalendarDate[];
export type InternalValue = InternalSingle | InternalRange | InternalMultiple;

function isRangeMode(mode: PickerMode): boolean {
  return mode === "range" || mode === "datetimerange";
}

function isMultipleMode(mode: PickerMode): boolean {
  return mode === "multiple";
}

export function parseIncoming(
  value: PickerValue | undefined,
  mode: PickerMode,
  calendar: CalendarKind,
): InternalValue {
  if (value === undefined || value === null || value === "") {
    if (isRangeMode(mode)) return [null, null];
    if (isMultipleMode(mode)) return [];
    return null;
  }
  if (isRangeMode(mode)) {
    if (Array.isArray(value)) {
      return [
        parseDateLike(value[0] as DateLike, calendar),
        parseDateLike(value[1] as DateLike, calendar),
      ];
    }
    return [null, null];
  }
  if (isMultipleMode(mode)) {
    if (Array.isArray(value)) {
      return (value as DateLike[])
        .map((v) => parseDateLike(v, calendar))
        .filter((v): v is CalendarDate => Boolean(v));
    }
    const one = parseDateLike(value as DateLike, calendar);
    return one ? [one] : [];
  }
  return parseDateLike(value as DateLike, calendar);
}

export function serializeOutgoing(
  internal: InternalValue,
  mode: PickerMode,
  valueFormat: string,
  calendar: CalendarKind,
): PickerValue {
  const fmt = (d: CalendarDate | null): string | null => {
    if (!d) return null;
    if (valueFormat === "date") return new Date(d.gy, d.gm - 1, d.gd, d.hour, d.minute, d.second) as unknown as string;
    return formatJalali(d, valueFormat, {
      locale: "en",
      numberSystem: "latin",
      calendar,
    });
  };

  if (isRangeMode(mode)) {
    const [a, b] = internal as InternalRange;
    return [fmt(a), fmt(b)];
  }
  if (isMultipleMode(mode)) {
    return (internal as InternalMultiple).map((d) => fmt(d));
  }
  return fmt(internal as InternalSingle);
}

export function useControllableOpen(
  openProp: boolean | undefined,
  defaultOpen: boolean,
  onOpen?: () => void,
  onClose?: () => void,
  onOpenChange?: (open: boolean) => void,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
      if (next) onOpen?.();
      else onClose?.();
    },
    [isControlled, onOpen, onClose, onOpenChange],
  );

  return { open, setOpen };
}

export function useDatePickerState(params: {
  mode: PickerMode;
  calendar: CalendarKind;
  value?: PickerValue;
  defaultValue?: PickerValue;
  valueFormat: string;
  onChange?: (value: PickerValue, date: InternalValue) => void;
}) {
  const { mode, calendar, value, defaultValue, valueFormat, onChange } = params;
  const isControlled = value !== undefined;
  const [inner, setInner] = useState<InternalValue>(() =>
    parseIncoming(defaultValue, mode, calendar),
  );

  const committed = isControlled ? parseIncoming(value, mode, calendar) : inner;

  const setCommitted = useCallback(
    (next: InternalValue, fire = true) => {
      if (!isControlled) setInner(next);
      if (fire) {
        const serialized = serializeOutgoing(next, mode, valueFormat, calendar);
        onChange?.(serialized, next);
      }
    },
    [isControlled, mode, valueFormat, calendar, onChange],
  );

  return { committed, setCommitted, isControlled };
}

export { isRangeMode, isMultipleMode, getToday, getLocalePack, defaultDisplayFormat, defaultValueFormat, addDays, addMonths, compareDate, isSameDay };

export function snapshotValue(v: InternalValue): InternalValue {
  if (Array.isArray(v)) {
    if (v.length === 2 && (v[0] === null || typeof v[0] === "object")) {
      return [v[0] as CalendarDate | null, v[1] as CalendarDate | null];
    }
    return [...(v as CalendarDate[])];
  }
  return v;
}

/**
 * Coerce a working draft into the current mode's shape. Switching modes with
 * a stale draft (e.g. a single date carried into range mode) crashes render
 * on tuple destructuring — normalize instead of dropping so a picked date
 * carries over (as the range start / first of multiple).
 */
export function normalizeToMode(v: InternalValue, mode: PickerMode): InternalValue {
  if (isRangeMode(mode)) {
    if (Array.isArray(v)) {
      return [
        (v[0] as CalendarDate | null) ?? null,
        (v[1] as CalendarDate | null) ?? null,
      ];
    }
    if (v) return [v as CalendarDate, null];
    return [null, null];
  }
  if (isMultipleMode(mode)) {
    if (Array.isArray(v)) {
      return (v as (CalendarDate | null)[]).filter(
        (d): d is CalendarDate => Boolean(d),
      );
    }
    return v ? [v as CalendarDate] : [];
  }
  if (Array.isArray(v)) {
    return (
      (v[0] as CalendarDate | null) ?? (v[1] as CalendarDate | null) ?? null
    );
  }
  return (v as CalendarDate | null) ?? null;
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

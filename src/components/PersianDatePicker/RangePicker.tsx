import { forwardRef } from "react";
import type { PersianDatePickerProps } from "../../types";
import { PersianDatePicker } from "./PersianDatePicker";

export const PersianRangePicker = forwardRef<HTMLDivElement, Omit<PersianDatePickerProps, "mode">>(
  function PersianRangePicker(props, ref) {
    return <PersianDatePicker ref={ref} {...props} mode="range" />;
  },
);

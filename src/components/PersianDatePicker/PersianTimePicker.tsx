import { forwardRef } from "react";
import type { PersianDatePickerProps } from "../../types";
import { PersianDatePicker } from "./PersianDatePicker";

export const PersianTimePicker = forwardRef<HTMLDivElement, Omit<PersianDatePickerProps, "mode">>(
  function PersianTimePicker(props, ref) {
    return <PersianDatePicker ref={ref} {...props} mode="time" />;
  },
);

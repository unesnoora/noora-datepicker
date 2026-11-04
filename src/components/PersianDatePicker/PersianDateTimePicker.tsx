import { forwardRef } from "react";
import type { PersianDatePickerProps } from "../../types";
import { PersianDatePicker } from "./PersianDatePicker";

export const PersianDateTimePicker = forwardRef<HTMLDivElement, Omit<PersianDatePickerProps, "mode">>(
  function PersianDateTimePicker(props, ref) {
    return <PersianDatePicker ref={ref} {...props} mode="datetime" />;
  },
);

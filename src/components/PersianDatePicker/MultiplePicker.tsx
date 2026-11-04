import { forwardRef } from "react";
import type { PersianDatePickerProps } from "../../types";
import { PersianDatePicker } from "./PersianDatePicker";

export const PersianMultiplePicker = forwardRef<HTMLDivElement, Omit<PersianDatePickerProps, "mode">>(
  function PersianMultiplePicker(props, ref) {
    return <PersianDatePicker ref={ref} {...props} mode="multiple" />;
  },
);

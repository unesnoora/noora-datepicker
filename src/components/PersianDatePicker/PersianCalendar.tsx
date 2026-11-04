import { forwardRef } from "react";
import type { PersianCalendarProps } from "../../types";
import { PersianDatePicker } from "./PersianDatePicker";

export const PersianCalendar = forwardRef<HTMLDivElement, PersianCalendarProps>(
  function PersianCalendar(props, ref) {
    return (
      <PersianDatePicker
        ref={ref}
        {...props}
        autoConfirm={props.autoConfirm ?? true}
        inline
      />
    );
  },
);

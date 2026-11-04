import { createContext, useContext, type ReactNode } from "react";
import type { Holiday } from "../../types";

const HolidayContext = createContext<Holiday[] | undefined>(undefined);

export function HolidayProvider(props: { holidays: Holiday[]; children: ReactNode }) {
  return (
    <HolidayContext.Provider value={props.holidays}>
      {props.children}
    </HolidayContext.Provider>
  );
}

export function useHolidayContext(): Holiday[] | undefined {
  return useContext(HolidayContext);
}

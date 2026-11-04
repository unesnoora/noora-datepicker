import { useEffect, useMemo, useRef } from "react";
import type { RenderYear } from "../../types";
import { applyNumberSystem } from "../../utils/numbers";
import type { NumberSystem } from "../../types";

export function YearPicker(props: {
  year: number;
  from: number;
  to: number;
  numberSystem: NumberSystem;
  onSelect: (year: number) => void;
  renderYear?: RenderYear;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const years = useMemo(() => {
    const out: number[] = [];
    for (let y = props.from; y <= props.to; y += 1) out.push(y);
    return out;
  }, [props.from, props.to]);

  useEffect(() => {
    const el = ref.current?.querySelector('[data-active="true"]');
    if (el && "scrollIntoView" in el) {
      (el as HTMLElement).scrollIntoView({ block: "center", inline: "nearest" });
    }
  }, [props.year]);

  return (
    <div className="pdp-year-list" ref={ref} role="listbox" aria-label="years">
      {years.map((y) => {
        const label = applyNumberSystem(y, props.numberSystem);
        const active = y === props.year;
        return (
          <button
            key={y}
            type="button"
            data-active={active ? "true" : "false"}
            className={`pdp-chip${active ? " pdp-chip--active" : ""}`}
            onClick={() => props.onSelect(y)}
            aria-selected={active}
            role="option"
          >
            {props.renderYear ? props.renderYear(y, label) : label}
          </button>
        );
      })}
    </div>
  );
}

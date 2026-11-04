import type { RenderMonth } from "../../types";

export function MonthPicker(props: {
  months: string[];
  month: number;
  year: number;
  onSelect: (month: number) => void;
  renderMonth?: RenderMonth;
}) {
  return (
    <div className="pdp-month-grid" role="listbox" aria-label="months">
      {props.months.map((label, i) => {
        const m = i + 1;
        const active = m === props.month;
        const content = props.renderMonth
          ? props.renderMonth(m, props.year, label)
          : label;
        return (
          <button
            key={label}
            type="button"
            className={`pdp-chip${active ? " pdp-chip--active" : ""}`}
            onClick={() => props.onSelect(m)}
            aria-selected={active}
            role="option"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

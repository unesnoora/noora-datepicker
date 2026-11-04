import { useEffect, useRef, type ReactNode } from "react";

const ITEM = 44;

export interface WheelItem {
  value: number;
  label: string;
}

export function WheelColumn(props: {
  items: WheelItem[];
  value: number;
  onChange: (value: number) => void;
  label?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const skip = useRef(false);
  const idx = Math.max(
    0,
    props.items.findIndex((i) => i.value === props.value),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    skip.current = true;
    el.scrollTo({ top: idx * ITEM, behavior: "auto" });
    const t = window.setTimeout(() => {
      skip.current = false;
    }, 80);
    return () => window.clearTimeout(t);
  }, [idx, props.items.length]);

  return (
    <div className="pdp-wheel-wrap">
      {props.label ? <div className="pdp-wheel-label">{props.label}</div> : null}
      <div style={{ position: "relative" }}>
        <div className="pdp-wheel-highlight" />
        <div
          className="pdp-wheel"
          ref={ref}
          onScroll={() => {
            if (skip.current || !ref.current) return;
            const nextIdx = Math.round(ref.current.scrollTop / ITEM);
            const clamped = Math.min(Math.max(nextIdx, 0), props.items.length - 1);
            const item = props.items[clamped];
            if (item && item.value !== props.value) props.onChange(item.value);
          }}
          role="listbox"
          aria-label={props.ariaLabel ?? props.label}
        >
          <div style={{ height: ITEM * 2 }} />
          {props.items.map((item) => (
            <div
              key={item.value}
              className={`pdp-wheel-item${item.value === props.value ? " pdp-wheel-item--active" : ""}`}
              role="option"
              aria-selected={item.value === props.value}
              onClick={() => {
                props.onChange(item.value);
                ref.current?.scrollTo({
                  top: props.items.findIndex((i) => i.value === item.value) * ITEM,
                  behavior: "smooth",
                });
              }}
            >
              {item.label}
            </div>
          ))}
          <div style={{ height: ITEM * 2 }} />
        </div>
      </div>
    </div>
  );
}

export function WheelRow(props: { children: ReactNode }) {
  return <div className="pdp-wheels">{props.children}</div>;
}

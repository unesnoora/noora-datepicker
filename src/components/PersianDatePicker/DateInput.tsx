import { Input, type InputRef } from "antd";
import { forwardRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

function ClearGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="7" y="13" width="3" height="3" rx="0.6" fill="currentColor" />
    </svg>
  );
}

export interface DateInputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  allowInput?: boolean;
  allowClear?: boolean;
  size?: "small" | "middle" | "large";
  status?: "" | "error" | "warning";
  prefix?: ReactNode;
  suffix?: ReactNode;
  id?: string;
  name?: string;
  tabIndex?: number;
  style?: CSSProperties;
  onClick?: () => void;
  onClear?: () => void;
  onChangeText?: (text: string) => void;
  onBlurText?: (text: string) => void;
  ariaLabel?: string;
}

export const DateInput = forwardRef<InputRef, DateInputProps>(function DateInput(
  props,
  ref,
) {
  const {
    value,
    placeholder,
    disabled,
    readOnly,
    allowInput,
    allowClear,
    size = "middle",
    status,
    prefix,
    suffix,
    id,
    name,
    tabIndex,
    style,
    onClick,
    onClear,
    onChangeText,
    onBlurText,
    ariaLabel,
  } = props;

  const handleClear = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
  };

  return (
    <Input
      ref={ref}
      id={id}
      name={name}
      tabIndex={tabIndex}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly || !allowInput}
      size={size}
      status={status || undefined}
      style={{ cursor: disabled ? "not-allowed" : "pointer", ...style }}
      prefix={
        prefix ?? (
          <span style={{ display: "inline-flex", opacity: 0.65 }}>
            <CalendarGlyph />
          </span>
        )
      }
      suffix={
        <>
          {allowClear && value && !disabled ? (
            <span
              role="button"
              aria-label="پاک کردن"
              onClick={handleClear}
              style={{ display: "inline-flex", color: "rgba(0,0,0,0.25)", cursor: "pointer" }}
            >
              <ClearGlyph />
            </span>
          ) : null}
          {suffix}
        </>
      }
      onClick={() => {
        if (!disabled) onClick?.();
      }}
      onChange={(e) => onChangeText?.(e.target.value)}
      onBlur={(e) => onBlurText?.(e.target.value)}
      aria-label={ariaLabel}
      autoComplete="off"
    />
  );
});

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

export function Overlay(props: {
  open: boolean;
  onClose: () => void;
  maskClosable?: boolean;
  placement?: "center" | "sheet" | "popover";
  lockScroll?: boolean;
  className?: string;
  children: ReactNode;
  container?: HTMLElement | null;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useBodyScrollLock(props.lockScroll !== false && props.open);

  useEffect(() => {
    if (!props.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.open, props.onClose]);

  if (!mounted || !props.open) return null;

  const node = (
    <div
      className={`pdp-overlay ${
        props.placement === "sheet"
          ? "pdp-overlay--sheet"
          : props.placement === "popover"
            ? "pdp-overlay--popover"
            : "pdp-overlay--center"
      } ${props.className ?? ""}`}
      onMouseDown={(e) => {
        if (props.maskClosable !== false && e.target === e.currentTarget) {
          props.onClose();
        }
      }}
    >
      {props.children}
    </div>
  );

  return createPortal(node, props.container ?? document.body);
}

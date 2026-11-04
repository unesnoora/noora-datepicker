import { useLayoutEffect, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Overlay } from "./Overlay";
import { PickerPanel, type PickerPanelProps } from "./PickerPanel";

export function DesktopPicker(
  props: PickerPanelProps & {
    open: boolean;
    onClose: () => void;
    maskClosable?: boolean;
    desktopMode?: "popover" | "modal";
    anchor: HTMLElement | null;
    rtl: boolean;
    dark: boolean;
    dir: "rtl" | "ltr";
    popupClassName?: string;
    themeStyle?: CSSProperties;
    onKeyDown?: (e: ReactKeyboardEvent) => void;
    container?: HTMLElement | null;
    wide?: boolean;
    xwide?: boolean;
  },
) {
  const {
    open,
    onClose,
    maskClosable,
    desktopMode = "modal",
    anchor,
    rtl,
    dark,
    dir,
    popupClassName,
    themeStyle,
    onKeyDown,
    container,
    wide,
    xwide,
    ...panel
  } = props;

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const panelW = xwide ? 860 : wide ? 600 : 410;

  useLayoutEffect(() => {
    if (!open || desktopMode !== "popover" || !anchor) return;
    const update = () => {
      const r = anchor.getBoundingClientRect();
      const w = panelW;
      const h = 520;
      let top = r.bottom + 8;
      let left = rtl ? r.right - w : r.left;
      if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
      if (left < 8) left = 8;
      if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
      setPos({ top, left });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, desktopMode, anchor, rtl, wide, xwide, panelW]);

  const popover = desktopMode === "popover";

  return (
    <Overlay
      open={open}
      onClose={onClose}
      maskClosable={maskClosable}
      placement={popover ? "popover" : "center"}
      lockScroll={popover ? false : undefined}
      container={container}
    >
      <div
        className={`pdp-root ${dark ? "pdp--dark" : ""} ${popupClassName ?? ""}`}
        dir={dir}
        style={themeStyle}
      >
        <div
          className={`pdp-panel${xwide ? " pdp-panel--xwide" : wide || panel.showPresets ? " pdp-panel--wide" : ""}${
            popover ? " pdp-panel--popover" : ""
          }`}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          style={
            popover
              ? { position: "fixed", top: pos.top, left: pos.left, margin: 0 }
              : undefined
          }
        >
          <PickerPanel {...panel} rtl={rtl} />
        </div>
      </div>
    </Overlay>
  );
}

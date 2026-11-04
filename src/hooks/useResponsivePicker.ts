import { useEffect, useState } from "react";

function getIsMobile(breakpoint: number): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint;
}

export function useResponsivePicker(breakpoint = 768): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    isMobile: width < breakpoint,
    isTablet: width >= breakpoint && width < 1200,
    isDesktop: width >= 1200,
  };
}

export function useMediaIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(() => getIsMobile(breakpoint));
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}

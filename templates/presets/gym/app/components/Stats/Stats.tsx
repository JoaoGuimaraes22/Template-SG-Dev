"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../../i18n-config";

type Dict = {
  area: string;
  areaLabel: string;
  machines: string;
  machinesLabel: string;
  stations: string;
  stationsLabel: string;
  plates: string;
  platesLabel: string;
  rating: string;
  ratingLabel: string;
};

type Props = {
  dict: Dict;
  locale: Locale;
};

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active, target, duration]);
  return value;
}

function StatItem({
  value,
  label,
  target,
  suffix = "",
  locale,
  isLast = false,
}: {
  value: string;
  label: string;
  target: number;
  suffix?: string;
  locale: Locale;
  isLast?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(target, 1800, active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const numberLocale = locale === "pt" ? "pt-PT" : "en-GB";
  const displayValue = active
    ? `${count.toLocaleString(numberLocale)}${suffix}`
    : value;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 py-6 text-center"
      style={!isLast ? { borderRight: "1px solid #2c2c32" } : undefined}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          lineHeight: 1,
          color: "#ef4444",
        }}
      >
        {displayValue}
      </span>
      <span className="text-xs uppercase tracking-widest" style={{ color: "#7a7a88" }}>
        {label}
      </span>
    </div>
  );
}

export function Stats({ dict, locale }: Props) {
  return (
    <section style={{ backgroundColor: "#141416", borderTop: "1px solid #2c2c32", borderBottom: "1px solid #2c2c32" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5">
          <StatItem value={dict.area} label={dict.areaLabel} target={5000} suffix="m²" locale={locale} />
          <StatItem value={dict.machines} label={dict.machinesLabel} target={400} suffix="+" locale={locale} />
          <StatItem value={dict.stations} label={dict.stationsLabel} target={500} suffix="+" locale={locale} />
          <StatItem value={dict.plates} label={dict.platesLabel} target={50000} suffix="kg" locale={locale} />
          <div
            className="col-span-2 md:col-span-1 flex flex-col items-center gap-1 py-6 text-center"
            style={{ borderTop: "1px solid #2c2c32" }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: 1,
                color: "#ef4444",
              }}
            >
              {dict.rating}
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: "#7a7a88" }}>
              {dict.ratingLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";

type Dict = {
  sectionLabel: string;
  headline: string;
  days: string[];
  noClass: string;
  today: string;
};

type Props = {
  dict: Dict;
};

type ClassEntry = {
  time: string;
  name: string;
  day: number; // 0 = Monday
  duration?: string;
  type: "combat" | "weights" | "dance" | "cardio" | "wellness";
};

const schedule: ClassEntry[] = [
  { time: "07:00", name: "Body Pump", day: 0, type: "cardio" },
  { time: "09:30", name: "Yoga", day: 0, type: "wellness" },
  { time: "18:30", name: "Kickboxing", day: 0, type: "combat" },
  { time: "20:00", name: "MMA", day: 0, type: "combat" },
  { time: "07:00", name: "HIIT", day: 1, type: "cardio" },
  { time: "10:00", name: "Pilates", day: 1, type: "wellness" },
  { time: "19:00", name: "Muay Thai", day: 1, type: "combat" },
  { time: "20:30", name: "Boxing", day: 1, type: "combat" },
  { time: "07:00", name: "Spinning", day: 2, type: "cardio" },
  { time: "09:30", name: "Yoga", day: 2, type: "wellness" },
  { time: "18:30", name: "Kickboxing", day: 2, type: "combat" },
  { time: "19:30", name: "Hip Hop", day: 2, type: "dance" },
  { time: "07:00", name: "Body Pump", day: 3, type: "cardio" },
  { time: "10:00", name: "Pilates", day: 3, type: "wellness" },
  { time: "19:00", name: "Jiu Jitsu", day: 3, type: "combat" },
  { time: "20:30", name: "MMA", day: 3, type: "combat" },
  { time: "07:00", name: "HIIT", day: 4, type: "cardio" },
  { time: "09:30", name: "Yoga", day: 4, type: "wellness" },
  { time: "18:30", name: "Muay Thai", day: 4, type: "combat" },
  { time: "20:00", name: "Boxing", day: 4, type: "combat" },
  { time: "09:00", name: "Spinning", day: 5, type: "cardio" },
  { time: "10:30", name: "Body Pump", day: 5, type: "cardio" },
  { time: "11:30", name: "Karate", day: 5, type: "combat" },
  { time: "14:00", name: "Kickboxing", day: 5, type: "combat" },
  { time: "10:00", name: "Yoga", day: 6, type: "wellness" },
  { time: "11:30", name: "Hip Hop", day: 6, type: "dance" },
];

const typeColors: Record<ClassEntry["type"], string> = {
  combat: "#ef4444",
  weights: "#ef4444",
  dance: "#a855f7",
  cardio: "#f97316",
  wellness: "#06b6d4",
};

// JS getDay(): 0=Sun,1=Mon,...,6=Sat → convert to 0=Mon,...,6=Sun
const todayIndex = (new Date().getDay() + 6) % 7;

export function Schedule({ dict }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const els = section.querySelectorAll<HTMLElement>("[data-fade]");
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        els.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * 60);
        });
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      style={{ backgroundColor: "#0c0c0e" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        <div data-fade className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {dict.sectionLabel}
          </p>
        </div>
        <h2
          data-fade
          className="mb-12 text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 1,
          }}
        >
          {dict.headline}
        </h2>

        {/* Desktop grid */}
        <div data-fade className="hidden overflow-x-auto lg:block">
          <div className="grid min-w-[800px] grid-cols-7 gap-px" style={{ backgroundColor: "#2c2c32" }}>
            {dict.days.map((day, d) => (
              <div key={d} style={{ backgroundColor: d === todayIndex ? "#1a1014" : "#141416" }}>
                <div
                  className="px-3 py-3 text-center text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: d === todayIndex ? "#ef4444" : "#7a7a88",
                    borderBottom: `1px solid ${d === todayIndex ? "#ef444433" : "#2c2c32"}`,
                    backgroundColor: d === todayIndex ? "rgba(239,68,68,0.06)" : undefined,
                  }}
                >
                  {day}
                </div>
                <div className="flex flex-col gap-1 p-2">
                  {schedule
                    .filter((c) => c.day === d)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((cls, i) => (
                      <div
                        key={i}
                        className="rounded-sm px-2 py-2"
                        style={{ backgroundColor: "#1e1e22", borderLeft: `3px solid ${typeColors[cls.type]}` }}
                      >
                        <div className="text-xs font-medium" style={{ color: "#7a7a88" }}>
                          {cls.time}
                        </div>
                        <div className="text-xs font-semibold" style={{ color: "#c8c8d4" }}>
                          {cls.name}
                        </div>
                      </div>
                    ))}
                  {schedule.filter((c) => c.day === d).length === 0 && (
                    <div className="py-4 text-center text-xs" style={{ color: "#3a3a42" }}>
                      {dict.noClass}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile list */}
        <div data-fade className="flex flex-col gap-6 lg:hidden">
          {dict.days.map((day, d) => {
            const classes = schedule.filter((c) => c.day === d).sort((a, b) => a.time.localeCompare(b.time));
            if (classes.length === 0) return null;
            return (
              <div key={d}>
                <h3
                  className="mb-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                  style={{ color: "#ef4444" }}
                >
                  {day}
                  {d === todayIndex && (
                    <span
                      className="rounded-sm px-2 py-0.5 font-bold uppercase tracking-widest"
                      style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: "0.6rem" }}
                    >
                      {dict.today}
                    </span>
                  )}
                </h3>
                <div className="flex flex-col gap-2">
                  {classes.map((cls, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-sm px-4 py-3"
                      style={{ backgroundColor: "#1e1e22", borderLeft: `3px solid ${typeColors[cls.type]}` }}
                    >
                      <span className="text-sm font-medium w-12 shrink-0" style={{ color: "#7a7a88" }}>
                        {cls.time}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "#c8c8d4" }}>
                        {cls.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div data-fade className="mt-8 flex flex-wrap gap-4">
          {(Object.entries(typeColors) as [ClassEntry["type"], string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="h-2 w-4 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs capitalize" style={{ color: "#7a7a88" }}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

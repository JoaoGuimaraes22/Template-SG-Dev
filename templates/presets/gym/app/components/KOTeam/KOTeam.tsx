"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Dict = {
  sectionLabel: string;
  headline: string;
  sub: string;
  founded: string;
  foundedYear: string;
  trainers: string;
  trainersCount: string;
  monitors: string;
  monitorsCount: string;
  gyms: string;
  gymsCount: string;
  sports: string[];
  philosophy: string;
  ctaLabel: string;
  phone: string;
  website: string;
};

type Props = {
  dict: Dict;
};

export function KOTeam({ dict }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const els = section.querySelectorAll<HTMLElement>("[data-fade]");
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
    });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        els.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition =
              "opacity 0.7s ease-out, transform 0.7s ease-out";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * 100);
        });
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(section);

    const onScroll = () => {
      const img = imgRef.current;
      if (!img) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = 1 - (rect.top + rect.height) / (viewH + rect.height);
      const offset = (progress - 0.5) * rect.height * 0.2;
      img.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const stats = [
    { label: dict.founded, value: dict.foundedYear },
    { label: dict.trainers, value: dict.trainersCount },
    { label: dict.monitors, value: dict.monitorsCount },
    { label: dict.gyms, value: dict.gymsCount },
  ];

  return (
    <section
      id="koteam"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ borderTop: "1px solid #2c2c32" }}
    >
      {/* Background image — parallax wrapper */}
      <div
        ref={imgRef}
        className="absolute"
        style={{ inset: "-15% 0", willChange: "transform" }}
      >
        <Image
          src="/koteam.jpg"
          alt="KO Team — combat sports training"
          fill
          className="object-cover"
        />
      </div>
      {/* Dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(12,12,14,0.95) 5%, rgba(12,12,14,0.6) 30%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        <div data-fade className="mb-4">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#ef4444" }}
          >
            {dict.sectionLabel}
          </p>
        </div>

        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h2
              data-fade
              className="mb-6 text-white"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                lineHeight: 1,
              }}
            >
              {dict.headline}
            </h2>
            <p
              data-fade
              className="mb-8 text-lg leading-relaxed"
              style={{ color: "#a0a0b0" }}
            >
              {dict.sub}
            </p>

            {/* Sports tags */}
            <div data-fade className="mb-8 flex flex-wrap gap-2">
              {dict.sports.map((sport) => (
                <span
                  key={sport}
                  className="rounded-sm px-3 py-1 text-sm font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.1)",
                    color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  {sport}
                </span>
              ))}
            </div>

            {/* Philosophy */}
            <blockquote
              data-fade
              className="border-l-2 pl-6 text-sm italic leading-relaxed"
              style={{ borderColor: "#ef4444", color: "#7a7a88" }}
            >
              &quot;{dict.philosophy}&quot;
            </blockquote>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            {/* Stats grid */}
            <div data-fade className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-sm border p-6 text-center"
                  style={{
                    backgroundColor: "rgba(30,30,34,0.75)",
                    borderColor: "#2c2c32",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      lineHeight: 1,
                      color: "#ef4444",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-1 text-xs uppercase tracking-widest"
                    style={{ color: "#7a7a88" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              data-fade
              className="rounded-sm border p-6"
              style={{
                backgroundColor: "rgba(30,30,34,0.75)",
                borderColor: "#2c2c32",
                backdropFilter: "blur(4px)",
              }}
            >
              <p
                className="mb-4 text-sm font-medium"
                style={{ color: "#c8c8d4" }}
              >
                {dict.phone}
              </p>
              <a
                href={`tel:${dict.phone.replace(/\s/g, "")}`}
                className="inline-block rounded-sm px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "0.12em",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f87171")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef4444")
                }
              >
                {dict.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

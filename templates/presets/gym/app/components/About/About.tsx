"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Dict = {
  sectionLabel: string;
  headline: string;
  p1: string;
  p2: string;
  p3: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
};

type Props = {
  dict: Dict;
};

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition =
              "opacity 0.7s ease-out, transform 0.7s ease-out";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

export function About({ dict }: Props) {
  const headerRef = useFadeIn(0);
  const textRef = useFadeIn(100);
  const rightRef = useFadeIn(200);
  const imgRef = useRef<HTMLDivElement>(null);
  const sectionElRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionElRef.current;
      const img = imgRef.current;
      if (!section || !img) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = 1 - (rect.top + rect.height) / (viewH + rect.height);
      const offset = (progress - 0.5) * rect.height * 0.4;
      img.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="about" ref={sectionElRef} className="relative overflow-hidden">
      {/* Background image — parallax wrapper */}
      <div
        ref={imgRef}
        className="absolute"
        style={{ inset: "-5% 0", willChange: "transform" }}
      >
        <Image
          src="/about.jpg"
          alt="Mr. Big Evolution — gym floor"
          fill
          className="object-cover"
          style={{ objectPosition: "center top" }}
        />
      </div>
      {/* Dark overlay — heavier on left for text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(12,12,14,0.82) 0%, rgba(12,12,14,0.55) 60%, rgba(12,12,14,0.4) 100%)",
        }}
      />
      {/* Bottom fade into next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #0c0c0e)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        {/* Section label + headline */}
        <div ref={headerRef}>
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "#ef4444" }}
          >
            {dict.sectionLabel}
          </p>
          <h2
            className="mb-16 text-white"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1,
            }}
          >
            {dict.headline}
          </h2>
        </div>

        {/* Text — left column only, image is the background */}
        <div className="mb-16 max-w-xl">
          <div ref={textRef} className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed" style={{ color: "#c8c8d4" }}>
              {dict.p1}
            </p>
            <p className="text-lg leading-relaxed" style={{ color: "#c8c8d4" }}>
              {dict.p2}
            </p>
            <p className="text-xl font-semibold" style={{ color: "#ffffff" }}>
              {dict.p3}
            </p>
          </div>
        </div>

        {/* Stats — side by side */}
        <div ref={rightRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { value: dict.stat1Value, label: dict.stat1Label },
            { value: dict.stat2Value, label: dict.stat2Label },
            { value: dict.stat3Value, label: dict.stat3Label },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-l-2 pl-6"
              style={{ borderColor: "#ef4444" }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    lineHeight: 1,
                    color: "#ffffff",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm uppercase tracking-wider"
                  style={{ color: "#a0a0b0" }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

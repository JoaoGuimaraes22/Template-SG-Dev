"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Dict = {
  sectionLabel: string;
  headline: string;
  sub: string;
  zone1Title: string;
  zone1Desc: string;
  zone2Title: string;
  zone2Desc: string;
  zone3Title: string;
  zone3Desc: string;
  zone4Title: string;
  zone4Desc: string;
  zone5Title: string;
  zone5Desc: string;
  zone6Title: string;
  zone6Desc: string;
};

type Props = {
  dict: Dict;
};

const zoneImages = [
  "/facilities/musculacao.jpg",
  "/facilities/crosstraining.jpg",
  "/facilities/combate.jpg",
  "/facilities/danca.jpg",
  "/facilities/studios.jpg",
  "/facilities/indoor.jpg",
];

const zoneIcons = ["⚡", "🔥", "🥊", "💃", "🏋️", "🏃"];

export function Facilities({ dict }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const container = entry.target as HTMLElement;
        const cards = container.querySelectorAll<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition =
              "opacity 0.6s ease-out, transform 0.6s ease-out";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 80);
        });
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    const header = headerRef.current;
    const grid = gridRef.current;

    if (header) {
      header.style.opacity = "0";
      header.style.transform = "translateY(24px)";
      const hObs = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          header.style.transition =
            "opacity 0.7s ease-out, transform 0.7s ease-out";
          header.style.opacity = "1";
          header.style.transform = "translateY(0)";
          hObs.disconnect();
        },
        { threshold: 0.1 },
      );
      hObs.observe(header);
    }

    if (grid) {
      grid.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(24px)";
      });
      observer.observe(grid);
    }

    return () => observer.disconnect();
  }, []);

  const zones = [
    { title: dict.zone1Title, desc: dict.zone1Desc },
    { title: dict.zone2Title, desc: dict.zone2Desc },
    { title: dict.zone3Title, desc: dict.zone3Desc },
    { title: dict.zone4Title, desc: dict.zone4Desc },
    { title: dict.zone5Title, desc: dict.zone5Desc },
    { title: dict.zone6Title, desc: dict.zone6Desc },
  ];

  return (
    <section id="facilities" style={{ backgroundColor: "#0c0c0e" }}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-10 sm:mb-16">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "#ef4444" }}
          >
            {dict.sectionLabel}
          </p>
          <h2
            className="mb-4 text-white"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1,
            }}
          >
            {dict.headline}
          </h2>
          <p className="max-w-xl text-base" style={{ color: "#7a7a88" }}>
            {dict.sub}
          </p>
        </div>

        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone, i) => (
            <div
              key={i}
              data-card
              className="group rounded-sm border p-6 transition-all duration-300"
              style={{
                backgroundColor: "#1e1e22",
                borderColor: "#2c2c32",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.boxShadow =
                  "0 0 24px rgba(239,68,68,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2c2c32";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {zoneImages[i] ? (
                <div
                  className="relative -mx-6 -mt-6 mb-4 overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={zoneImages[i]!}
                    alt={zone.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="mb-4 text-2xl">{zoneIcons[i]}</div>
              )}
              <h3
                className="mb-3 text-white"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.5rem",
                  letterSpacing: "0.05em",
                }}
              >
                {zone.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#7a7a88" }}
              >
                {zone.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

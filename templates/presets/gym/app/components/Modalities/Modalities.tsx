"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Dict = {
  sectionLabel: string;
  headline: string;
  sub: string;
  cat1Title: string;
  cat1Items: string[];
  cat2Title: string;
  cat2Items: string[];
  cat3Title: string;
  cat3Items: string[];
  cat4Title: string;
  cat4Items: string[];
};

type Props = {
  dict: Dict;
};

const categoryImages = [
  "/facilities/musculacao.jpg",
  "/facilities/crosstraining.jpg",
  "/facilities/combate.jpg",
  "/facilities/danca.jpg",
];

export function Modalities({ dict }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    { title: dict.cat1Title, items: dict.cat1Items },
    { title: dict.cat2Title, items: dict.cat2Items },
    { title: dict.cat3Title, items: dict.cat3Items },
    { title: dict.cat4Title, items: dict.cat4Items },
  ];

  useEffect(() => {
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
      const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
      cards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(32px)";
      });

      const gObs = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.transition =
                "opacity 0.6s ease-out, transform 0.6s ease-out";
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, i * 100);
          });
          gObs.disconnect();
        },
        { threshold: 0.05 },
      );
      gObs.observe(grid);
    }
  }, []);

  return (
    <section id="modalities" style={{ backgroundColor: "#141416" }}>
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

        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <div
              key={i}
              data-card
              className="group relative overflow-hidden rounded-sm cursor-default h-65 sm:h-95"
              style={{
                borderLeft: "3px solid #2c2c32",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(239,68,68,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2c2c32";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Background image */}
              <Image
                src={categoryImages[i]!}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(12,12,14,0.97) 0%, rgba(12,12,14,0.75) 50%, rgba(12,12,14,0.45) 100%)",
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
                <h3
                  className="mb-4 text-white"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                  }}
                >
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, j) => (
                    <span
                      key={j}
                      className="rounded-sm px-3 py-1 text-xs font-medium uppercase tracking-wide"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

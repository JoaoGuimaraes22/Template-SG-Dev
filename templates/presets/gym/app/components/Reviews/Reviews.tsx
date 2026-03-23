"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Dict = {
  sectionLabel: string;
  headline: string;
  sub: string;
  googleLabel: string;
  review1Text: string;
  review1Author: string;
  review1Date: string;
  review2Text: string;
  review2Author: string;
  review2Date: string;
  review3Text: string;
  review3Author: string;
  review3Date: string;
  review4Text: string;
  review4Author: string;
  review4Date: string;
};

type Props = {
  dict: Dict;
};

export function Reviews({ dict }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

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
            el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * 80);
        });
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const reviews = [
    { text: dict.review1Text, author: dict.review1Author, date: dict.review1Date, img: "/reviews/review1.jpg" },
    { text: dict.review2Text, author: dict.review2Author, date: dict.review2Date, img: "/reviews/review2.jpg" },
    { text: dict.review3Text, author: dict.review3Author, date: dict.review3Date, img: "/reviews/review3.jpg" },
    { text: dict.review4Text, author: dict.review4Author, date: dict.review4Date, img: "/reviews/review4.jpg" },
  ];

  return (
    <section id="reviews" ref={sectionRef} style={{ backgroundColor: "#0c0c0e" }}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-fade className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {dict.sectionLabel}
          </p>
        </div>
        <div data-fade className="mb-4 flex flex-wrap items-end gap-6">
          <h2
            className="text-white"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1,
            }}
          >
            {dict.headline}
          </h2>
          {/* Google badge */}
          <div
            className="mb-2 flex items-center gap-3 rounded-sm border px-4 py-2"
            style={{ backgroundColor: "#1e1e22", borderColor: "#2c2c32" }}
          >
            <span className="text-2xl font-bold" style={{ color: "#ef4444", fontFamily: "'Bebas Neue', sans-serif" }}>
              4.7★
            </span>
            <div>
              <div className="text-xs font-bold" style={{ color: "#ffffff" }}>{dict.googleLabel}</div>
              <div className="text-xs" style={{ color: "#7a7a88" }}>778</div>
            </div>
          </div>
        </div>
        <p data-fade className="mb-16 max-w-xl text-base" style={{ color: "#7a7a88" }}>
          {dict.sub}
        </p>

        {/* Reviews grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 justify-items-center sm:justify-items-stretch">
          {reviews.map((review, i) => (
            <div
              key={i}
              data-fade
              className="group relative overflow-hidden rounded-sm w-full max-w-sm sm:max-w-none"
              style={{ aspectRatio: "3/4", minHeight: "420px" }}
            >
              {/* Portrait photo */}
              <Image
                src={review.img}
                alt={review.author}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 30%, rgba(12,12,14,0.6) 55%, rgba(12,12,14,0.95) 100%)",
                }}
              />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} style={{ color: "#ef4444" }}>★</span>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "#e0e0e8" }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                    {review.author}
                  </div>
                  <div className="text-xs" style={{ color: "#7a7a88" }}>
                    {review.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

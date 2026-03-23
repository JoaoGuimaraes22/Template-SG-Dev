"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Dict = {
  headline: string;
  subheadline: string;
  cta: string;
  scroll: string;
};

type Props = {
  dict: Dict;
};

export function HeroContent({ dict }: Props) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [headlineRef.current, subRef.current, ctaRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      setTimeout(
        () => {
          el.style.transition =
            "opacity 0.7s ease-out, transform 0.7s ease-out";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        200 + i * 150,
      );
    });

    const onScroll = () => {
      if (imgRef.current)
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="noise relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0c0c0e" }}
    >
      {/* Hero image — extended wrapper for parallax */}
      <div
        ref={imgRef}
        className="absolute"
        style={{ inset: "-20% 0", willChange: "transform" }}
      >
        <Image
          src="/hero.jpg"
          alt="Mr. Big Evolution gym floor"
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.85, objectPosition: "54% center" }}
        />
      </div>

      {/* Diagonal stripe texture — industrial iron plate feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 41px)",
        }}
      />

      {/* Red radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0.02) 40%, transparent 90%)",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h1
          ref={headlineRef}
          className="text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3.5rem, 12vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            textShadow:
              "0 0 80px rgba(239,68,68,0.2), 0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {dict.headline}
        </h1>

        <p
          ref={subRef}
          className="mx-auto mt-6 max-w-xl text-lg font-light sm:text-xl"
          style={{ color: "#a0a0b0" }}
        >
          {dict.subheadline}
        </p>

        <a
          ref={ctaRef}
          href="#contact"
          className="mt-10 inline-block rounded-sm px-10 py-4 font-bold uppercase tracking-widest transition-all duration-200"
          style={{
            backgroundColor: "#ef4444",
            color: "#ffffff",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.1rem",
            letterSpacing: "0.15em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f87171";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(239,68,68,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {dict.cta}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ color: "#7a7a88" }}
      >
        <span className="text-xs uppercase tracking-widest">{dict.scroll}</span>
        <div
          className="h-8 w-px"
          style={{
            background: "linear-gradient(to bottom, #7a7a88, transparent)",
          }}
        />
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type Dict = {
  sectionLabel: string;
  headline: string;
  q1: string; a1: string;
  q2: string; a2: string;
  q3: string; a3: string;
  q4: string; a4: string;
  q5: string; a5: string;
  q6: string; a6: string;
};

type Props = {
  dict: Dict;
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-fade
      className="border-b"
      style={{ borderColor: "#2c2c32" }}
    >
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-base font-medium"
          style={{ color: open ? "#ef4444" : "#c8c8d4" }}
        >
          {question}
        </span>
        <span
          className="shrink-0 text-xl transition-transform duration-300"
          style={{ color: "#ef4444", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "#7a7a88" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export function FAQ({ dict }: Props) {
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

  const items = [
    { q: dict.q1, a: dict.a1 },
    { q: dict.q2, a: dict.a2 },
    { q: dict.q3, a: dict.a3 },
    { q: dict.q4, a: dict.a4 },
    { q: dict.q5, a: dict.a5 },
    { q: dict.q6, a: dict.a6 },
  ];

  return (
    <section id="faq" ref={sectionRef} style={{ backgroundColor: "#141416" }}>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
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

        <div style={{ borderTop: "1px solid #2c2c32" }}>
          {items.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

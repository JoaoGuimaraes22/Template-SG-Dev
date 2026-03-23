"use client";

import { useEffect, useRef } from "react";

type Dict = {
  sectionLabel: string;
  headline: string;
  sub: string;
  popular: string;
  ctaLabel: string;
  plan1Name: string;
  plan1Price: string;
  plan1Period: string;
  plan1Features: string[];
  plan2Name: string;
  plan2Price: string;
  plan2Period: string;
  plan2Features: string[];
  plan3Name: string;
  plan3Price: string;
  plan3Period: string;
  plan3Features: string[];
  disclaimer: string;
};

type Props = {
  dict: Dict;
};

export function Pricing({ dict }: Props) {
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
          }, i * 100);
        });
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: dict.plan1Name,
      price: dict.plan1Price,
      period: dict.plan1Period,
      features: dict.plan1Features,
      popular: false,
    },
    {
      name: dict.plan2Name,
      price: dict.plan2Price,
      period: dict.plan2Period,
      features: dict.plan2Features,
      popular: true,
    },
    {
      name: dict.plan3Name,
      price: dict.plan3Price,
      period: dict.plan3Period,
      features: dict.plan3Features,
      popular: false,
    },
  ];

  return (
    <section id="pricing" ref={sectionRef} style={{ backgroundColor: "#141416" }}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-24 sm:px-6 lg:px-8">
        <div data-fade className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ef4444" }}>
            {dict.sectionLabel}
          </p>
        </div>
        <h2
          data-fade
          className="mb-4 text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 1,
          }}
        >
          {dict.headline}
        </h2>
        <p data-fade className="mb-16 max-w-xl text-base" style={{ color: "#7a7a88" }}>
          {dict.sub}
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              data-fade
              className="relative flex flex-col rounded-sm border p-8 transition-all duration-300"
              style={{
                backgroundColor: plan.popular ? "#1e1e22" : "#141416",
                borderColor: plan.popular ? "#ef4444" : "#2c2c32",
                boxShadow: plan.popular ? "0 0 40px rgba(239,68,68,0.1)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = "#3a3a42";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(239,68,68,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = "#2c2c32";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-widest"
                  style={{ backgroundColor: "#ef4444", color: "#0c0c0e" }}
                >
                  {dict.popular}
                </span>
              )}
              <div
                className="mb-2 text-sm font-bold uppercase tracking-widest"
                style={{ color: plan.popular ? "#ef4444" : "#7a7a88" }}
              >
                {plan.name}
              </div>
              <div
                className="mb-1"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.5rem",
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                {plan.price}
              </div>
              <div className="mb-8 text-sm" style={{ color: "#7a7a88" }}>
                {plan.period}
              </div>
              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm" style={{ color: "#a0a0b0" }}>
                    <span style={{ color: "#ef4444" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-auto block rounded-sm py-3 text-center text-sm font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  backgroundColor: plan.popular ? "#ef4444" : "transparent",
                  color: plan.popular ? "#ffffff" : "#ef4444",
                  border: plan.popular ? "none" : "1px solid #ef4444",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "0.12em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f87171";
                  e.currentTarget.style.color = "#0c0c0e";
                  e.currentTarget.style.border = "none";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = plan.popular ? "#ef4444" : "transparent";
                  e.currentTarget.style.color = plan.popular ? "#0c0c0e" : "#ef4444";
                  e.currentTarget.style.border = plan.popular ? "none" : "1px solid #ef4444";
                }}
              >
                {dict.ctaLabel}
              </a>
            </div>
          ))}
        </div>

        <p data-fade className="mt-8 text-center text-sm" style={{ color: "#3a3a42" }}>
          {dict.disclaimer}
        </p>
      </div>
    </section>
  );
}

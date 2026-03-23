"use client";

import { useEffect, useState } from "react";

type Dict = {
  text: string;
  cta: string;
};

type Props = {
  dict: Dict;
};

export function TrialBar({ dict }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 sm:hidden"
      style={{
        backgroundColor: "#141416",
        borderTop: "1px solid #2c2c32",
        transform: visible ? "translateY(0)" : "translateY(100%)",
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm font-medium" style={{ color: "#a0a0b0" }}>
          {dict.text}
        </p>
        <a
          href="#contact"
          className="shrink-0 rounded-sm px-5 py-2 text-sm font-bold uppercase tracking-widest"
          style={{
            backgroundColor: "#ef4444",
            color: "#ffffff",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          {dict.cta}
        </a>
      </div>
    </div>
  );
}

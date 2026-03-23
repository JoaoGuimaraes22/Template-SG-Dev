"use client";

import { useEffect, useRef } from "react";

type Dict = {
  sectionLabel: string;
  headline: string;
  sub: string;
  phoneLabel: string;
  phone: string;
  koTeamLabel: string;
  koTeamPhone: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  instagramLabel: string;
  instagram: string;
  facebookLabel: string;
  facebook: string;
  directionsLabel: string;
};

type Props = {
  dict: Dict;
};

export function Contact({ dict }: Props) {
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
            el.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";
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

  const contacts = [
    { label: dict.phoneLabel, value: dict.phone, href: `tel:${dict.phone.replace(/\s/g, "")}` },
    { label: dict.koTeamLabel, value: dict.koTeamPhone, href: `tel:${dict.koTeamPhone.replace(/\s/g, "")}` },
    { label: dict.emailLabel, value: dict.email, href: `mailto:${dict.email}` },
    { label: dict.instagramLabel, value: dict.instagram, href: "https://www.instagram.com/mrbigevolution/" },
    { label: dict.facebookLabel, value: dict.facebook, href: "https://www.facebook.com/mrbigevolution/" },
  ];

  return (
    <section id="contact" ref={sectionRef} style={{ backgroundColor: "#0c0c0e" }}>
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
        <p data-fade className="mb-16 max-w-xl text-lg" style={{ color: "#7a7a88" }}>
          {dict.sub}
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div data-fade className="flex flex-col gap-6">
            {contacts.map((c, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7a7a88" }}>
                  {c.label}
                </span>
                <a
                  href={c.href}
                  className="text-lg font-medium transition-colors duration-200"
                  style={{ color: "#c8c8d4" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#c8c8d4")}
                  target={c.href.startsWith("https") ? "_blank" : undefined}
                  rel={c.href.startsWith("https") ? "noopener noreferrer" : undefined}
                >
                  {c.value}
                </a>
              </div>
            ))}

            {/* Address */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7a7a88" }}>
                {dict.addressLabel}
              </span>
              <address className="not-italic text-lg leading-relaxed" style={{ color: "#c8c8d4" }}>
                {dict.address.split("\n").map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </address>
            </div>

            <a
              href="https://maps.google.com/?q=38.6855,-9.3303"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-sm px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                backgroundColor: "#ef4444",
                color: "#ffffff",
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.12em",
                width: "fit-content",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
            >
              {dict.directionsLabel}
            </a>
          </div>

          {/* Map embed */}
          <div data-fade className="overflow-hidden rounded-sm" style={{ border: "1px solid #2c2c32", minHeight: "360px" }}>
            <iframe
              src="https://maps.google.com/maps?q=Mr.+Big+Evolution,+Rua+Fernando+Lopes+Gra%C3%A7a+401A,+2775-571+Carcavelos,+Portugal&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "360px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mr. Big Evolution — Carcavelos"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

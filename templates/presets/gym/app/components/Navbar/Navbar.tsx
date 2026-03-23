"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../../../i18n-config";

type Dict = {
  cta: string;
  lang: string;
};

type Props = {
  dict: Dict;
  locale: Locale;
};

const links = [
  { href: "#modalities", labelPt: "Modalidades", labelEn: "Modalities" },
  { href: "#facilities", labelPt: "Instalações", labelEn: "Facilities" },
  { href: "#koteam", labelPt: "KO Team", labelEn: "KO Team" },
  { href: "#schedule", labelPt: "Horário", labelEn: "Schedule" },
  { href: "#pricing", labelPt: "Planos", labelEn: "Plans" },
  { href: "#contact", labelPt: "Contacto", labelEn: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/mrbigevolution/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/mrbigevolution/",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export function Navbar({ dict, locale }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const altLocale = locale === "pt" ? "en" : "pt";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "#141416ee" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #2c2c32" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Mr. Big Evolution"
            width={40}
            height={40}
            className="object-contain"
          />
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              lineHeight: 1,
              letterSpacing: "0.05em",
            }}
          >
            <div style={{ fontSize: "1.1rem", color: "#ffffff" }}>MR BIG</div>
            <div style={{ fontSize: "0.8rem", color: "#ef4444" }}>EVOLUTION</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "#a0a0b0" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#a0a0b0")}
              >
                {locale === "pt" ? link.labelPt : link.labelEn}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Social icons — desktop only */}
          <div className="hidden items-center gap-2 lg:flex">
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="transition-colors duration-200"
                style={{ color: "#7a7a88" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a88")}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <Link
            href={`/${altLocale}`}
            className="hidden text-sm font-medium transition-colors duration-200 sm:block"
            style={{ color: "#7a7a88" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c8c8d4")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a88")}
          >
            {dict.lang}
          </Link>
          <a
            href="#contact"
            className="hidden rounded-sm px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 sm:block"
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.95rem",
              letterSpacing: "0.1em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
          >
            {dict.cta}
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex flex-col gap-1.5 p-1 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className="block h-0.5 w-6 transition-all duration-200"
              style={{
                backgroundColor: "#ffffff",
                transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-200"
              style={{
                backgroundColor: "#ffffff",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-6 transition-all duration-200"
              style={{
                backgroundColor: "#ffffff",
                transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="border-t lg:hidden"
          style={{ backgroundColor: "#141416", borderColor: "#2c2c32" }}
        >
          <ul className="flex flex-col px-4 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-3 text-base font-medium"
                  style={{ color: "#a0a0b0" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {locale === "pt" ? link.labelPt : link.labelEn}
                </a>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between pt-3" style={{ borderTop: "1px solid #2c2c32" }}>
              <div className="flex items-center gap-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ color: "#7a7a88" }}
                  >
                    {s.icon}
                  </a>
                ))}
                <Link
                  href={`/${altLocale}`}
                  className="text-sm font-medium"
                  style={{ color: "#7a7a88" }}
                >
                  {dict.lang}
                </Link>
              </div>
              <a
                href="#contact"
                className="rounded-sm px-5 py-2 text-sm font-bold"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "0.1em",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {dict.cta}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../../../i18n-config";

type Dict = {
  tagline: string;
  copyright: string;
  address: string;
  navLabel: string;
  links: {
    about: string;
    modalities: string;
    facilities: string;
    koteam: string;
    pricing: string;
    contact: string;
  };
  socialLabel: string;
};

type Props = {
  dict: Dict;
  locale: Locale;
};

const navLinks = [
  { href: "#about", key: "about" as const },
  { href: "#modalities", key: "modalities" as const },
  { href: "#facilities", key: "facilities" as const },
  { href: "#koteam", key: "koteam" as const },
  { href: "#pricing", key: "pricing" as const },
  { href: "#contact", key: "contact" as const },
];

export function Footer({ dict, locale }: Props) {
  return (
    <footer style={{ backgroundColor: "#0c0c0e", borderTop: "3px solid #ef4444" }}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="mb-6 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Mr. Big Evolution"
                width={48}
                height={48}
                className="object-contain"
              />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1, letterSpacing: "0.05em" }}>
                <div style={{ fontSize: "1.3rem", color: "#ffffff" }}>MR BIG</div>
                <div style={{ fontSize: "0.95rem", color: "#ef4444" }}>EVOLUTION</div>
              </div>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed italic" style={{ color: "#7a7a88" }}>
              "{dict.tagline}"
            </p>
            <p className="text-sm" style={{ color: "#7a7a88" }}>
              {dict.address}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4
              className="mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ color: "#7a7a88" }}
            >
              {dict.navLabel}
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#7a7a88" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a88")}
                  >
                    {dict.links[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4
              className="mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ color: "#7a7a88" }}
            >
              {dict.socialLabel}
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="https://www.instagram.com/mrbigevolution/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: "#7a7a88" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a88")}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/mrbigevolution/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: "#7a7a88" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a88")}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale === "pt" ? "en" : "pt"}`}
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#7a7a88" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a88")}
                >
                  {locale === "pt" ? "English" : "Português"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 text-center text-xs"
          style={{ borderTop: "1px solid #1e1e22", color: "#3a3a42" }}
        >
          {dict.copyright}
        </div>
      </div>
    </footer>
  );
}

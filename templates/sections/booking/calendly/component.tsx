"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// TODO: TEMPLATE — Replace YOUR_CALENDLY_URL with your Calendly scheduling link.
// Example: https://calendly.com/your-name/30min
const CALENDLY_URL = "YOUR_CALENDLY_URL";

interface BookingDict {
  title_line1: string;
  title_line2: string;
  subtitle: string;
}

export default function Booking({ booking }: { booking: BookingDict }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly widget script once
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <section
      id="booking"
      ref={ref}
      className="py-24 px-6"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-none mb-4">
            <span className="text-indigo-600">{booking.title_line1}</span>{" "}
            {booking.title_line2}
          </h2>
          <p className="text-lg opacity-60 max-w-xl mx-auto">{booking.subtitle}</p>
        </motion.div>

        {/* Calendly inline widget */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div
            ref={widgetRef}
            className="calendly-inline-widget rounded-2xl overflow-hidden shadow-lg"
            data-url={CALENDLY_URL}
            style={{ minWidth: "320px", height: "700px" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

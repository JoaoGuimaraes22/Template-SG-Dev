module.exports = {
  name: "restaurant",
  description: "Restaurant — menu, reserve bar, pricing, map, stats, reviews CTA",
  base: "business",
  sections: [
    { name: "contact-form",   variant: "business" },
    { name: "floating-cta",   variant: "default"  }, // whatsapp installed by floating-cta hooks
    { name: "menu",           variant: "tabbed"   },
    { name: "reserve-bar",    variant: "default"  },
    { name: "pricing",        variant: "cards"    },
    { name: "google-reviews", variant: "default"  },
    { name: "contact",        variant: "map"      },
    { name: "stats",          variant: "counters" },
  ],
};

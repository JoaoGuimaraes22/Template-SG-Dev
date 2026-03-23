import type { Metadata } from "next";
import type { Locale } from "../../i18n-config";
import { i18n } from "../../i18n-config";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeProp } = await params;
  const locale = localeProp as Locale;
  const isPt = locale === "pt";

  const title = isPt
    ? "Mr. Big Evolution — Maior Ginásio da Europa | Carcavelos"
    : "Mr. Big Evolution — Europe's Largest Gym | Carcavelos";

  const description = isPt
    ? "5.000m² de treino, 400+ máquinas, 50.000kg de discos. Musculação, powerlifting, kickboxing, MMA. O maior ginásio da Europa em Carcavelos. Avaliação 4.7★."
    : "5,000m² of training space, 400+ machines, 50,000kg of weight plates. Bodybuilding, powerlifting, kickboxing, MMA. Europe's largest gym in Carcavelos. Rated 4.7★.";

  const keywords = isPt
    ? [
        "ginásio carcavelos",
        "maior ginásio europa",
        "ginásio 5000m2",
        "musculação carcavelos",
        "powerlifting cascais",
        "kickboxing carcavelos",
        "muay thai carcavelos",
        "mr big evolution",
        "bodybuilding cascais",
        "ko team carcavelos",
        "ginásio cascais",
        "mma carcavelos",
        "ginásio linha de cascais",
        "ginásio jiu jitsu cascais",
      ]
    : [
        "gym carcavelos",
        "largest gym europe",
        "gym 5000m2 portugal",
        "bodybuilding cascais",
        "powerlifting portugal",
        "kickboxing carcavelos",
        "muay thai carcavelos",
        "mr big evolution",
        "gym cascais",
        "ko team",
        "mma carcavelos",
        "gym lisbon cascais line",
        "jiu jitsu cascais",
      ];

  const baseUrl = "https://mrbig.vercel.app";
  const url = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    authors: [{ name: "Mr. Big Evolution" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "Mr. Big Evolution",
      locale: isPt ? "pt_PT" : "en_GB",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isPt
            ? "Mr. Big Evolution — Maior Ginásio da Europa"
            : "Mr. Big Evolution — Europe's Largest Gym",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        "pt-PT": `${baseUrl}/pt`,
        "en-GB": `${baseUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: "Mr. Big Evolution",
  description:
    "O maior ginásio da Europa com 5.000m² de espaço de treino, 400+ máquinas e 50.000kg de discos.",
  url: "https://mrbig.vercel.app",
  telephone: "+351214538721",
  email: "ambdesportivos@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Fernando Lopes Graça, 401A",
    addressLocality: "Carcavelos",
    addressRegion: "Cascais",
    postalCode: "2775-571",
    addressCountry: "PT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.6855,
    longitude: -9.3303,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "778",
    bestRating: "5",
    worstRating: "1",
  },
  areaServed: [
    "Carcavelos",
    "Parede",
    "Cascais",
    "Estoril",
    "São Domingos de Rana",
    "Oeiras",
  ],
  sameAs: [
    "https://www.instagram.com/mrbigevolution",
    "https://www.facebook.com/mrbigevolution",
  ],
  sport: [
    "Musculação",
    "Powerlifting",
    "Bodybuilding",
    "Kickboxing",
    "Muay Thai",
    "MMA",
    "Boxing",
    "Jiu Jitsu",
    "Karate",
    "Cross Training",
    "Yoga",
    "Pilates",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

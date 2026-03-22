// Projects section hooks — dynamic routes, example images, sitemap regeneration
const fs = require("fs");
const path = require("path");

function regenerateSitemap(ctx, projectsEnabled) {
  const { i18nActive, projectDir, lib } = ctx;
  const sitemapPath = path.join(projectDir, "app/sitemap.ts");

  let content;
  if (i18nActive && projectsEnabled) {
    content = `import type { MetadataRoute } from "next";
import { getDictionary } from "../get-dictionary";

const SITE_URL = "https://your-domain.vercel.app";
const locales = ${lib.LOCALES_TS_LITERAL};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dict = await getDictionary("en");
  const slugs = dict.projects.projects.map((p) => p.slug);

  const homePaths = locales.map((locale) => ({
    url: \`\${SITE_URL}/\${locale}\`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, \`\${SITE_URL}/\${l}\`])),
    },
  }));

  const projectPaths = slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: \`\${SITE_URL}/\${locale}/projects/\${slug}\`,
      lastModified: new Date(),
    })),
  );

  return [...homePaths, ...projectPaths];
}
`;
  } else if (i18nActive && !projectsEnabled) {
    content = `import type { MetadataRoute } from "next";

const SITE_URL = "https://YOUR_DOMAIN";
const locales = ${lib.LOCALES_TS_LITERAL};

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: \`\${SITE_URL}/\${locale}\`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, \`\${SITE_URL}/\${l}\`])),
    },
  }));
}
`;
  } else if (!i18nActive && projectsEnabled) {
    content = `import type { MetadataRoute } from "next";
import dict from "../dictionaries/en.json";

const SITE_URL = "https://YOUR_DOMAIN";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = dict.projects.projects.map((p) => p.slug);
  return [
    { url: SITE_URL, lastModified: new Date() },
    ...slugs.map((slug) => ({ url: \`\${SITE_URL}/projects/\${slug}\`, lastModified: new Date() })),
  ];
}
`;
  } else {
    content = `import type { MetadataRoute } from "next";

const SITE_URL = "https://YOUR_DOMAIN";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date() }];
}
`;
  }
  fs.writeFileSync(sitemapPath, content, "utf8");
  console.log("  [patched] app/sitemap.ts");
}

function afterEnable(ctx) {
  const { i18nActive, lib } = ctx;
  const projectsDest = i18nActive ? "app/[locale]/projects" : "app/projects";

  // Copy [slug]/page.tsx from section routes directory
  lib.copyDir("templates/sections/projects/default/routes", projectsDest);

  // Copy example project images
  lib.copyDir("templates/sections/projects/default/public/projects", "public/projects", { optional: true });

  // Regenerate sitemap with project paths
  regenerateSitemap(ctx, true);
}

function afterDisable(ctx) {
  const { i18nActive, lib } = ctx;
  const projectsDir = i18nActive ? "app/[locale]/projects" : "app/projects";

  // Delete projects directory and example images
  lib.deleteIfExists(projectsDir);
  lib.deleteIfExists("public/projects");

  // Regenerate sitemap without project paths
  regenerateSitemap(ctx, false);
}

module.exports = { afterEnable, afterDisable };

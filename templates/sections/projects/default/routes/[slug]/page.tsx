import { getDictionary } from "../../../../get-dictionary";
import { type Locale } from "../../../../i18n-config";
import Link from "next/link";
import Image from "next/image";

interface Project {
  slug: string;
  title: string;
  description: string;
  long_description: string;
  image: string | null;
  images: string[];
  tags: string[];
  live: string | null;
  github: string | null;
}

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const enDict = await getDictionary("en");
  return enDict.projects.projects.flatMap((project: Project) =>
    ["en", "pt"].map((locale) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as Params & { locale: Locale };
  const dict = await getDictionary(locale);
  const project = dict.projects.projects.find((p: Project) => p.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as Params & { locale: Locale };
  const dict = await getDictionary(locale);
  const project = dict.projects.projects.find((p: Project) => p.slug === slug);

  if (!project) return <div>Project not found</div>;

  return (
    <main className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32 max-w-4xl mx-auto">
      <Link
        href={`/${locale}#projects`}
        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8 inline-flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900 mt-6 mb-3">{project.title}</h1>
      <p className="text-zinc-500 mb-8">{project.description}</p>

      {project.image && (
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image src={project.image} alt={project.title} fill className="object-cover" />
        </div>
      )}

      <div className="mb-8 space-y-4">
        {project.long_description.split("\n\n").map((para, i) => (
          <p key={i} className="text-zinc-600 leading-relaxed">{para}</p>
        ))}
      </div>

      {(project.live || project.github) && (
        <div className="flex gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              View Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-50 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      )}
    </main>
  );
}

import { type Locale } from "../../i18n-config";
import { getDictionary } from "../../get-dictionary";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const dict = await getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {dict.meta.title}
      </h1>
      <p className="mt-4 text-lg text-zinc-500">
        {dict.meta.description}
      </p>
    </main>
  );
}

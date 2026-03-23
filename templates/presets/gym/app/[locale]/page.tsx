import { getDictionary } from "../../get-dictionary";
import type { Locale } from "../../i18n-config";
import { Navbar } from "../components/Navbar/Navbar";
import { HeroContent } from "../components/HeroContent/HeroContent";
import { Stats } from "../components/Stats/Stats";
import { About } from "../components/About/About";
import { Modalities } from "../components/Modalities/Modalities";
import { Facilities } from "../components/Facilities/Facilities";
import { KOTeam } from "../components/KOTeam/KOTeam";
import { Schedule } from "../components/Schedule/Schedule";
import { Pricing } from "../components/Pricing/Pricing";
import { Reviews } from "../components/Reviews/Reviews";
import { FAQ } from "../components/FAQ/FAQ";
import { Contact } from "../components/Contact/Contact";
import { Footer } from "../components/Footer/Footer";
import { TrialBar } from "../components/TrialBar/TrialBar";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeProp } = await params;
  const locale = localeProp as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar dict={dict.navbar} locale={locale} />
      <main className="pb-16 sm:pb-0">
        <HeroContent dict={dict.hero} />
        <Stats dict={dict.stats} locale={locale} />
        <About dict={dict.about} />
        <Reviews dict={dict.reviews} />
        <Modalities dict={dict.modalities} />
        <Facilities dict={dict.facilities} />
        <KOTeam dict={dict.koteam} />
        <Schedule dict={dict.schedule} />
        <Pricing dict={dict.pricing} />
        <FAQ dict={dict.faq} />
        <Contact dict={dict.contact} />
      </main>
      <Footer dict={dict.footer} locale={locale} />
      <TrialBar dict={dict.trialbar} />
    </>
  );
}

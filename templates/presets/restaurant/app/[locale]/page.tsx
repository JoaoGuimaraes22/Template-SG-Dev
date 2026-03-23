import { type Locale } from "../../i18n-config";
import { getDictionary } from "../../get-dictionary";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Reservation from "./components/Reservation";
import ReserveBar from "./components/ReserveBar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import GalleryStrip from "./components/GalleryStrip";
import Pricing from "./components/Pricing";
import GoogleReviews from "./components/GoogleReviews";
import StatsCounters from "./components/StatsCounters";

export default async function BusinessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero hero={dict.hero} />
      <StatsCounters statsCounters={dict.statsCounters} />
      <About about={dict.about} />
      <Menu menu={dict.menu} />
      <GalleryStrip galleryStrip={dict.galleryStrip} />
      <Services services={dict.services} />
      <Reviews reviews={dict.reviews} />
      <GoogleReviews googleReviews={dict.googleReviews} />
      <Pricing pricing={dict.pricing} />
      <FAQ faq={dict.faq} />
      <Contact contact={dict.contact} contactMap={dict.contactMap} orderUrl={dict.reserveBar.order_url} />
      <Reservation reservation={dict.reservation} />
      <Footer footer={dict.footer} logo={dict.navbar.logo} />
      <ReserveBar reserveBar={dict.reserveBar} />
    </>
  );
}

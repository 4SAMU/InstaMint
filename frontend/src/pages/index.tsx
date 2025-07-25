import DefaultLayout from "@/components/layout";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import FeaturedNFTS from "@/components/featured";
import TakeUsToYourNextAdventure from "@/components/takeustoyournextadventure";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <DefaultLayout>
      <HeroSection />
      <HowItWorks />
      <FeaturedNFTS />
      <TakeUsToYourNextAdventure />
      <Footer />
    </DefaultLayout>
  );
}

import { FAQSection } from "@/features/landing/components/FaqSection";
import FeatureLoop from "@/features/landing/components/FeatureLoop";
import { Footer } from "@/features/landing/components/Footer";
import { HeroSection } from "@/features/landing/components/Hero";
import { Navbar } from "@/features/landing/components/Navbar";
import { ReportsSection } from "@/features/landing/components/ReportsSection";

async function page() {
  return (
    <div dir="ltr">
      <Navbar />
      <HeroSection />
      <FeatureLoop />
      <ReportsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

export default page;

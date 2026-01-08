import { getUserSession } from "@/actions/auth/getUserSession";
import { FAQSection } from "./(features)/landing/ui/FaqSection";
import FeatureLoop from "./(features)/landing/ui/FeatureLoop";
import { Footer } from "./(features)/landing/ui/Footer";
import { HeroSection } from "./(features)/landing/ui/Hero";
import { Navbar } from "./(features)/landing/ui/Navbar";
//import { Pricing } from "./(features)/landing/ui/Pricing";
import { ProReportsSection } from "./(features)/landing/ui/ProReportSection";

async function page() {
  //const session = await getUserSession();

  return (
    <div dir="ltr">
      <Navbar />
      <HeroSection />
      <FeatureLoop />
      <ProReportsSection />
      {/* <Pricing userId={session?.user.id} userEmail={session?.user.email} /> */}
      <FAQSection />
      <Footer />
    </div>
  );
}

export default page;

import { Footer } from "@/components/footer";
import About from "./about-section";
import { ContactSection } from "./contact-section";
import { DoctorsSection } from "./doctors-section";
import Hero from "./hero-section";
import { TestimonialsSection } from "./testimonials-section";
import { WhyChooseUsSection } from "./why-choose-us-section";

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main>
        <Hero />
        <About />
        <DoctorsSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

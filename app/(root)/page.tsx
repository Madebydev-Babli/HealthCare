import { Footer } from "@/components/footer";
import About from "./about-section";
import { DoctorsSection } from "./doctors-section";
import Hero from "./hero-section";

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900">
      <main>
        <Hero />
        <About />
        <DoctorsSection />
      </main>
      <Footer />
    </div>
  );
}


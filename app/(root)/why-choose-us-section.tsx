import { features } from "@/lib/site-data";

export function WhyChooseUsSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20 text-white">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold">Why Choose Us</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-blue-100">
          We combine medical excellence, patient comfort, and digital convenience.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-blue-100">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

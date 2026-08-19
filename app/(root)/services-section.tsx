import { services } from "@/lib/site-data";

export function ServicesSection() {
  return (
    <section id="services" className="bg-slate-50 py-20 dark:bg-slate-900/40">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
          Our Services
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">
          Comprehensive care solutions designed for preventive, urgent, and
          long-term health needs.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
            >
              <p className="text-3xl">{service.icon}</p>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

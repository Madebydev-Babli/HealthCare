import { testimonials } from "@/lib/site-data";

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
          What Patients Say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <p className="text-yellow-500">
                {"★".repeat(testimonial.rating)}
                {"☆".repeat(5 - testimonial.rating)}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                &quot;{testimonial.review}&quot;
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                {testimonial.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

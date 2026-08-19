export function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Contact Us
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Reach out for appointments, medical inquiries, or support.
          </p>
          <div className="mt-6 space-y-3 text-slate-700 dark:text-slate-200">
            <p>
              <span className="font-semibold">Address:</span> 12 Health Avenue,
              New Delhi, India
            </p>
            <p>
              <span className="font-semibold">Phone:</span> +91 98765 43210
            </p>
            <p>
              <span className="font-semibold">Email:</span> contact@carebridge.com
            </p>
          </div>
        </div>
        <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

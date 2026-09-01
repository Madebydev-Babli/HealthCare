import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 text-slate-700">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-lg font-bold text-cyan-600">
                H
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">Healthcare</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Modern healthcare management for patients and healthcare
              professionals.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Explore
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/" className="transition hover:text-cyan-600">
                Home
              </Link>
              <Link href="/doctors" className="transition hover:text-cyan-600">
                Doctors
              </Link>
              <Link
                href="/appointments"
                className="transition hover:text-cyan-600"
              >
                Appointments
              </Link>
              <Link href="/#about" className="transition hover:text-cyan-600">
                About
              </Link>
              <Link href="/#contact" className="transition hover:text-cyan-600">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Account
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                href="/auth/login"
                className="transition hover:text-cyan-600"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="transition hover:text-cyan-600"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Healthcare. All rights reserved.</p>
          <p>Healthcare for patients, doctors, and clinics.</p>
        </div>
      </div>
    </footer>
  );
}

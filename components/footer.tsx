export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 text-sm text-slate-600 lg:px-8 dark:text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            CareBridge Clinic
          </p>
          <div className="flex gap-4">
            <a href="#about" className="transition hover:text-blue-600">
              About
            </a>
            <a href="#services" className="transition hover:text-blue-600">
              Services
            </a>
            <a href="#doctors" className="transition hover:text-blue-600">
              Doctors
            </a>
            <a href="#contact" className="transition hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>Follow us: Facebook | Instagram | LinkedIn</p>
          <p>© {new Date().getFullYear()} CareBridge Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

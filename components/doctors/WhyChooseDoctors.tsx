import { ShieldCheck, HeartPulse, CalendarDays, Users } from "lucide-react";

const features = [
  {
    title: "Verified Professionals",
    icon: ShieldCheck,
  },
  {
    title: "Easy Appointment Booking",
    icon: CalendarDays,
  },
  {
    title: "Trusted Medical Care",
    icon: HeartPulse,
  },
  {
    title: "Patient First Approach",
    icon: Users,
  },
];

export default function WhyChooseDoctors() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="mb-16 text-center text-5xl font-bold">
          Why Choose Our Doctors
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[32px] bg-white p-8">
              <feature.icon size={40} className="mb-6" />

              <h3 className="text-xl font-semibold">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

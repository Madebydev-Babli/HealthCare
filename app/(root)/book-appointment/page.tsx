"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock3, ShieldCheck, Star, Stethoscope } from "lucide-react";

type Doctor = {
  _id: string;
  name: string;
  email: string;
  image: string;
  fieldOfMedical: string;
  experience: number;
  appointmentFee: number;
  appointmentDetails: string;
};

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [doctorIdFromUrl, setDoctorIdFromUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setDoctorIdFromUrl(params.get("doctorId"));
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/public/doctors");
        const data = await res.json();

        const list = Array.isArray(data) ? data : data?.doctors || [];
        setDoctors(list);

        if (doctorIdFromUrl) {
          const foundDoctor = list.find((doc: Doctor) => doc._id === doctorIdFromUrl);
          if (foundDoctor) setSelectedDoctor(foundDoctor);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctorIdFromUrl]);

  const selectedDoctorSummary = useMemo(() => {
    if (!selectedDoctor) return null;

    return {
      name: selectedDoctor.name,
      specialty: selectedDoctor.fieldOfMedical,
      fee: selectedDoctor.appointmentFee,
      experience: selectedDoctor.experience,
    };
  }, [selectedDoctor]);

  const handleBook = async () => {
    if (!selectedDoctor || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      setBooking(true);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date,
          time,
          fee: selectedDoctor.appointmentFee,
          status: "pending",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("Appointment booked successfully!");
      setDate("");
      setTime("");
      if (!doctorIdFromUrl) setSelectedDoctor(null);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-lg font-medium text-slate-600">
        Loading doctors...
      </div>
    );
  }

  if (!loading && doctors.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">No doctors available</h2>
          <p className="mt-3 text-slate-600">There are no approved doctors available right now. Please check back later.</p>
          <a href="/" className="mt-6 inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Booking</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Book an Appointment</h1>
          <p className="mt-3 text-slate-600">Choose a doctor, select a date, and confirm your visit in a few simple steps.</p>
        </div>

        {!doctorIdFromUrl && (
          <section className="mt-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Stethoscope size={18} /></div>
              <h2 className="text-2xl font-bold text-slate-900">1. Choose a doctor</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <button
                  key={doctor._id}
                  type="button"
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`overflow-hidden rounded-[28px] border bg-white p-0 text-left shadow-sm transition ${
                    selectedDoctor?._id === doctor._id
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/10"
                      : "border-slate-200 hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  <div className="relative h-52">
                    <img src={doctor.image || "/clinic.jpg"} alt={doctor.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <ShieldCheck size={12} />
                      Verified specialist
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-slate-900">{doctor.name}</h3>
                    <p className="mt-1 text-sm font-medium text-cyan-700">{doctor.fieldOfMedical}</p>

                    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-yellow-500" /> {doctor.experience} yrs</span>
                      <span className="font-semibold text-slate-900">₹{doctor.appointmentFee}</span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{doctor.appointmentDetails || "Consultation available for patient care and follow-up."}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedDoctor && (
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Calendar size={18} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">2. Choose a date</h2>
                </div>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
                />
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><Clock3 size={18} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Choose a time</h2>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                        time === slot
                          ? "border-cyan-500 bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><CheckCircle2 size={18} /></div>
                <h2 className="text-2xl font-bold text-slate-900">4. Confirm</h2>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <img src={selectedDoctor.image || "/clinic.jpg"} alt={selectedDoctor.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <p className="text-xl font-bold text-slate-900">{selectedDoctor.name}</p>
                  <p className="text-sm text-slate-500">{selectedDoctor.fieldOfMedical}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Experience</span><span className="font-semibold text-slate-900">{selectedDoctor.experience} yrs</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Consultation fee</span><span className="font-semibold text-slate-900">₹{selectedDoctor.appointmentFee}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Date</span><span className="font-semibold text-slate-900">{date || "—"}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Time</span><span className="font-semibold text-slate-900">{time || "—"}</span></div>
              </div>

              <button
                type="button"
                onClick={handleBook}
                disabled={booking || !selectedDoctor || !date || !time}
                className="mt-6 w-full rounded-2xl bg-cyan-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {booking ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

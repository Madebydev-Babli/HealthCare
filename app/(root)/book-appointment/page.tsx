"use client";

import { useEffect, useState } from "react";

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

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [doctorIdFromUrl, setDoctorIdFromUrl] = useState<string | null>(null);

  // read query param on client-side only to avoid prerender errors
  
  if (!loading && doctors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-semibold">No doctors available</h2>
          <p className="mt-2 text-slate-600">There are no approved doctors available right now. Please check back later.</p>
          <div className="mt-6">
            <a href="/" className="inline-block rounded-lg border border-slate-200 px-4 py-2">Back to Home</a>
          </div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    setDoctorIdFromUrl(params.get("doctorId"));
  }, []);

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

  // ✅ Fetch approved doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/public/doctors");

        const data = await res.json();

        // API may return an object (error or doctor-specific payload) instead of an array.
        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (data?.doctors && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          console.warn("Unexpected /api/doctor response", data);
          setDoctors([]);
        }

        // Auto select doctor from URL
        if (doctorIdFromUrl) {
          const foundDoctor = data.find(
            (doc: Doctor) => doc._id === doctorIdFromUrl,
          );

          if (foundDoctor) {
            setSelectedDoctor(foundDoctor);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctorIdFromUrl]);

  // ✅ Book appointment
  const handleBook = async () => {
    if (!selectedDoctor || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      setBooking(true);

      const res = await fetch("/api/appointments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

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

      // Reset
      setDate("");
      setTime("");

      if (!doctorIdFromUrl) {
        setSelectedDoctor(null);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading doctors...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">Book Appointment</h1>

          <p className="mt-2 text-gray-600">
            Choose your doctor and schedule your visit
          </p>
        </div>

        {/* Doctor Selection */}
        {!doctorIdFromUrl && (
          <div className="mt-10">
            <h2 className="mb-4 text-2xl font-semibold">Select Doctor</h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`cursor-pointer rounded-2xl bg-white p-5 shadow-md transition ${
                    selectedDoctor?._id === doctor._id
                      ? "border-2 border-blue-600"
                      : "hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-20 w-20 rounded-full object-cover border"
                    />

                    <div>
                      <h3 className="text-xl font-semibold">{doctor.name}</h3>

                      <p className="text-sm text-gray-500">
                        {doctor.fieldOfMedical}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Experience:</span>{" "}
                      {doctor.experience} years
                    </p>

                    <p>
                      <span className="font-semibold">Consultation Fee:</span> ₹
                      {doctor.appointmentFee}
                    </p>

                    <p>
                      <span className="font-semibold">Timings:</span>{" "}
                      {doctor.appointmentDetails}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Doctor */}
        {selectedDoctor && (
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="h-28 w-28 rounded-full object-cover border"
              />

              <div>
                <h2 className="text-3xl font-bold">{selectedDoctor.name}</h2>

                <p className="mt-1 text-gray-500">
                  {selectedDoctor.fieldOfMedical}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                    {selectedDoctor.experience} Years Experience
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                    ₹{selectedDoctor.appointmentFee} Fee
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-semibold">Select Appointment Date</h2>

          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="mt-4 rounded-xl border p-3"
          />
        </div>

        {/* Time Slots */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-2xl font-semibold">Select Time Slot</h2>

          <div className="mt-5 flex flex-wrap gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={`rounded-xl border px-5 py-3 font-medium transition ${
                  time === slot
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Summary */}
        {selectedDoctor && date && time && (
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-2xl font-semibold">Appointment Summary</h2>

            <div className="mt-5 space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {selectedDoctor.name}
              </p>

              <p>
                <span className="font-semibold">Specialization:</span>{" "}
                {selectedDoctor.fieldOfMedical}
              </p>

              <p>
                <span className="font-semibold">Date:</span> {date}
              </p>

              <p>
                <span className="font-semibold">Time:</span> {time}
              </p>

              <p>
                <span className="font-semibold">Fee:</span> ₹
                {selectedDoctor.appointmentFee}
              </p>

              <p>
                <span className="font-semibold">Status:</span> Pending Approval
              </p>
            </div>

            <button
              onClick={handleBook}
              disabled={booking}
              className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {booking ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

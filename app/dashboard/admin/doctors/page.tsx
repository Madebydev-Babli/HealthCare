"use client";

import { useEffect, useState } from "react";

type Doctor = {
  _id: string;
  name: string;
  image: string;
  specialization: string;
  experience: number;
  degree: string;
  consultationFee: number;
  status: string;
  bio: string;
  verified: boolean;
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const fetchDoctors = async () => {
    const res = await fetch("/api/admin/doctors");

    const data = await res.json();

    setDoctors(data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/doctors/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ status }),
    });

    fetchDoctors();
  };

  const deleteDoctor = async (id: string) => {
    const confirmDelete = confirm("Delete doctor?");

    if (!confirmDelete) return;

    await fetch(`/api/admin/doctors/${id}`, {
      method: "DELETE",
    });

    fetchDoctors();
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Doctors Management
          </h1>

          <p className="mt-2 text-gray-500">Manage all registered doctors</p>
        </div>

        <div className="rounded-2xl bg-blue-600 px-6 py-3 text-white">
          Total Doctors: {doctors.length}
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Top */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image || "https://via.placeholder.com/100"}
                  alt={doctor.name}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover"
                />

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Dr. {doctor.name}
                  </h2>

                  <p className="text-blue-100">{doctor.specialization}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold">
                    {doctor.experience} Years
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Degree</span>
                  <span className="font-semibold">{doctor.degree}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-semibold">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      doctor.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : doctor.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Doctor Bio
                </h3>

                <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {doctor.bio || "No bio available"}
                </p>

                {doctor.bio && doctor.bio.length > 120 && (
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Read Full Bio →
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateStatus(doctor._id, "approved")}
                  className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(doctor._id, "rejected")}
                  className="rounded-xl bg-yellow-500 py-3 text-white hover:bg-yellow-600"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={() => deleteDoctor(doctor._id)}
                className="mt-3 w-full rounded-xl bg-red-600 py-3 text-white hover:bg-red-700"
              >
                Delete Doctor
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-5 top-5 text-2xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            <div className="mb-6 flex items-center gap-4">
              <img
                src={selectedDoctor.image || "https://via.placeholder.com/100"}
                alt={selectedDoctor.name}
                className="h-24 w-24 rounded-full border object-cover"
              />

              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Dr. {selectedDoctor.name}
                </h2>

                <p className="text-gray-500">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl bg-gray-50 p-5 text-sm">
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-semibold">
                  {selectedDoctor.experience} Years
                </span>
              </div>

              <div className="flex justify-between">
                <span>Degree</span>
                <span className="font-semibold">{selectedDoctor.degree}</span>
              </div>

              <div className="flex justify-between">
                <span>Consultation Fee</span>
                <span className="font-semibold">
                  ₹{selectedDoctor.consultationFee}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border p-5">
              <h3 className="mb-3 text-lg font-semibold">
                Professional Biography
              </h3>

              <p className="whitespace-pre-line leading-8 text-gray-700">
                {selectedDoctor.bio}
              </p>
            </div>

            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

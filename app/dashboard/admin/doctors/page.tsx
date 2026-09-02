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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Doctors Management
          </h1>

          <p className="mt-2 text-slate-600">Manage all registered doctors</p>
        </div>

        <div className="rounded-2xl bg-cyan-600 px-6 py-3 text-white font-medium shadow-sm">
          Total Doctors: {doctors.length}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-7 md:grid-cols-1 lg:grid-cols-2">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            {/* Top */}
            <div className="bg-linear-to-r from-cyan-500 to-cyan-600 p-6">
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

                  <p className="text-cyan-100">{doctor.specialization}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Experience</span>
                  <span className="font-semibold text-slate-900">
                    {doctor.experience} Years
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Degree</span>
                  <span className="font-semibold text-slate-900">
                    {doctor.degree}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Fee</span>
                  <span className="font-semibold text-slate-900">
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      doctor.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : doctor.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-5 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Doctor Bio
                </h3>

                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {doctor.bio || "No bio available"}
                </p>

                {doctor.bio && doctor.bio.length > 120 && (
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="mt-3 text-sm font-medium text-cyan-600 hover:text-cyan-700"
                  >
                    Read Full Bio →
                  </button>
                )}
              </div>

              {/* Actions */}
              {doctor.status === "pending" ? (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateStatus(doctor._id, "approved")}
                    className="rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(doctor._id, "rejected")}
                    className="rounded-lg bg-amber-600 py-2 text-sm font-medium text-white hover:bg-amber-700 transition"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm font-medium text-slate-600 border border-slate-200">
                  {doctor.status === "approved"
                    ? "Approved"
                    : doctor.status === "rejected"
                      ? "Rejected"
                      : doctor.status}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Delete doctor ${doctor.name}? This action cannot be undone.`,
                  );
                  if (confirmed) deleteDoctor(doctor._id);
                }}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                title="Delete doctor"
                aria-label="Delete doctor"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-5 top-5 text-2xl text-slate-400 hover:text-slate-600 transition"
            >
              ×
            </button>

            <div className="mb-6 flex items-center gap-4">
              <img
                src={selectedDoctor.image || "https://via.placeholder.com/100"}
                alt={selectedDoctor.name}
                className="h-24 w-24 rounded-full border-4 border-cyan-100 object-cover"
              />

              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Dr. {selectedDoctor.name}
                </h2>

                <p className="text-slate-600">
                  {selectedDoctor.specialization}
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-lg bg-slate-50 p-5 text-sm border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Experience</span>
                <span className="font-semibold text-slate-900">
                  {selectedDoctor.experience} Years
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Degree</span>
                <span className="font-semibold text-slate-900">
                  {selectedDoctor.degree}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Consultation Fee</span>
                <span className="font-semibold text-slate-900">
                  ₹{selectedDoctor.consultationFee}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 p-5">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Professional Biography
              </h3>

              <p className="whitespace-pre-line leading-8 text-slate-700">
                {selectedDoctor.bio}
              </p>
            </div>

            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-6 w-full rounded-lg bg-cyan-600 py-3 text-white font-medium transition hover:bg-cyan-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

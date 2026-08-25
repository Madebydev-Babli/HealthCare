"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const dayKeys = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type AvailabilityDay = {
  available: boolean;
  start: string;
  end: string;
};

type FormState = {
  name: string;
  image: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phone: string;
  specialization: string;
  degree: string;
  experience: string;
  licenseNumber: string;
  languages: string;
  consultationFee: string;
  consultationMode: "Clinic" | "Online" | "Both";
  bio: string;
  clinic: {
    name: string;
    images: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    phone: string;
    mapLink: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
  availability: Record<(typeof dayKeys)[number], AvailabilityDay>;
};

const initialForm: FormState = {
  name: "",
  image: "",
  gender: "Male",
  dob: "",
  phone: "",
  specialization: "",
  degree: "",
  experience: "",
  licenseNumber: "",
  languages: "",
  consultationFee: "",
  consultationMode: "Clinic",
  bio: "",
  clinic: {
    name: "",
    images: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    phone: "",
    mapLink: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
  },
  availability: {
    monday: { available: true, start: "09:00", end: "17:00" },
    tuesday: { available: true, start: "09:00", end: "17:00" },
    wednesday: { available: true, start: "09:00", end: "17:00" },
    thursday: { available: true, start: "09:00", end: "17:00" },
    friday: { available: true, start: "09:00", end: "17:00" },
    saturday: { available: false, start: "", end: "" },
    sunday: { available: false, start: "", end: "" },
  },
};

export default function DoctorProfileCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/doctor/profile");
        const data = await res.json();

        if (data?.success && data?.doctor) {
          const doctor = data.doctor;

          setForm({
            name: doctor.name || "",
            image: doctor.image || "",
            gender: doctor.gender || "Male",
            dob: doctor.dob
              ? new Date(doctor.dob).toISOString().split("T")[0]
              : "",
            phone: doctor.phone || "",
            specialization: doctor.specialization || "",
            degree: doctor.degree || "",
            experience: doctor.experience?.toString() || "",
            licenseNumber: doctor.licenseNumber || "",
            languages: Array.isArray(doctor.languages)
              ? doctor.languages.join(", ")
              : "",
            consultationFee: doctor.consultationFee?.toString() || "",
            consultationMode: doctor.consultationMode || "Clinic",
            bio: doctor.bio || "",
            clinic: {
              name: doctor.clinic?.name || "",
              images: Array.isArray(doctor.clinic?.images)
                ? doctor.clinic.images.join(", ")
                : "",
              address: doctor.clinic?.address || "",
              city: doctor.clinic?.city || "",
              state: doctor.clinic?.state || "",
              pincode: doctor.clinic?.pincode || "",
              landmark: doctor.clinic?.landmark || "",
              phone: doctor.clinic?.phone || "",
              mapLink: doctor.clinic?.mapLink || "",
              coordinates: {
                latitude:
                  doctor.clinic?.coordinates?.latitude?.toString() || "",
                longitude:
                  doctor.clinic?.coordinates?.longitude?.toString() || "",
              },
            },
            availability: {
              monday: doctor.availability?.monday || {
                available: true,
                start: "09:00",
                end: "17:00",
              },
              tuesday: doctor.availability?.tuesday || {
                available: true,
                start: "09:00",
                end: "17:00",
              },
              wednesday: doctor.availability?.wednesday || {
                available: true,
                start: "09:00",
                end: "17:00",
              },
              thursday: doctor.availability?.thursday || {
                available: true,
                start: "09:00",
                end: "17:00",
              },
              friday: doctor.availability?.friday || {
                available: true,
                start: "09:00",
                end: "17:00",
              },
              saturday: doctor.availability?.saturday || {
                available: false,
                start: "",
                end: "",
              },
              sunday: doctor.availability?.sunday || {
                available: false,
                start: "",
                end: "",
              },
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateClinicField = (
    field: Exclude<keyof FormState["clinic"], "coordinates">,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      clinic: {
        ...prev.clinic,
        [field]: value,
      },
    }));
  };

  const updateCoordinateField = (
    field: "latitude" | "longitude",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      clinic: {
        ...prev.clinic,
        coordinates: {
          ...prev.clinic.coordinates,
          [field]: value,
        },
      },
    }));
  };

  const updateAvailability = (
    day: (typeof dayKeys)[number],
    field: "available" | "start" | "end",
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        languages: form.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        clinic: {
          ...form.clinic,
          images: form.clinic.images
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          coordinates: {
            latitude: Number(form.clinic.coordinates.latitude || 0),
            longitude: Number(form.clinic.coordinates.longitude || 0),
          },
        },
      };

      const res = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Unable to save profile");
      }

      router.push("/dashboard/doctor");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Loading profile form...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Complete Your Doctor Profile
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Add your personal, professional, clinic, and availability details to
          start accepting patients.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Personal Information
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Full Name
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Profile Image URL
              <input
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                placeholder="https://..."
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Gender
              <select
                value={form.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value as FormState["gender"])
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Date of Birth
              <input
                type="date"
                value={form.dob}
                onChange={(e) => updateField("dob", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              Phone
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Professional Information
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Specialization
              <input
                value={form.specialization}
                onChange={(e) => updateField("specialization", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Degree
              <input
                value={form.degree}
                onChange={(e) => updateField("degree", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Experience (Years)
              <input
                type="number"
                min="0"
                value={form.experience}
                onChange={(e) => updateField("experience", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              License Number
              <input
                value={form.licenseNumber}
                onChange={(e) => updateField("licenseNumber", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Languages
              <input
                value={form.languages}
                onChange={(e) => updateField("languages", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                placeholder="English, Hindi, Tamil"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Consultation Fee
              <input
                type="number"
                min="0"
                value={form.consultationFee}
                onChange={(e) => updateField("consultationFee", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Consultation Mode
              <select
                value={form.consultationMode}
                onChange={(e) =>
                  updateField(
                    "consultationMode",
                    e.target.value as FormState["consultationMode"],
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              >
                <option value="Clinic">Clinic</option>
                <option value="Online">Online</option>
                <option value="Both">Both</option>
              </select>
            </label>

            <div className="md:col-span-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Bio
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                  required
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Clinic Information
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Clinic Name
              <input
                value={form.clinic.name}
                onChange={(e) => updateClinicField("name", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Clinic Images URLs
              <input
                value={form.clinic.images}
                onChange={(e) => updateClinicField("images", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
                placeholder="url1, url2"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              Address
              <input
                value={form.clinic.address}
                onChange={(e) => updateClinicField("address", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              City
              <input
                value={form.clinic.city}
                onChange={(e) => updateClinicField("city", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              State
              <input
                value={form.clinic.state}
                onChange={(e) => updateClinicField("state", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Pincode
              <input
                value={form.clinic.pincode}
                onChange={(e) => updateClinicField("pincode", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Landmark
              <input
                value={form.clinic.landmark}
                onChange={(e) => updateClinicField("landmark", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Clinic Phone
              <input
                value={form.clinic.phone}
                onChange={(e) => updateClinicField("phone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              Map Link
              <input
                value={form.clinic.mapLink}
                onChange={(e) => updateClinicField("mapLink", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Latitude
              <input
                value={form.clinic.coordinates.latitude}
                onChange={(e) =>
                  updateCoordinateField("latitude", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Longitude
              <input
                value={form.clinic.coordinates.longitude}
                onChange={(e) =>
                  updateCoordinateField("longitude", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-cyan-500"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Availability
          </h2>
          <div className="space-y-4">
            {dayKeys.map((day) => (
              <div
                key={day}
                className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[160px_140px_140px_1fr] md:items-center"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium capitalize text-slate-700">
                    {day}
                  </span>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.availability[day].available}
                      onChange={(e) =>
                        updateAvailability(day, "available", e.target.checked)
                      }
                    />
                    Available
                  </label>
                </div>

                <input
                  type="time"
                  value={form.availability[day].start}
                  onChange={(e) =>
                    updateAvailability(day, "start", e.target.value)
                  }
                  disabled={!form.availability[day].available}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 disabled:bg-slate-100"
                />

                <input
                  type="time"
                  value={form.availability[day].end}
                  onChange={(e) =>
                    updateAvailability(day, "end", e.target.value)
                  }
                  disabled={!form.availability[day].available}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 disabled:bg-slate-100"
                />

                {!form.availability[day].available && (
                  <span className="text-sm text-slate-400">Day off</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

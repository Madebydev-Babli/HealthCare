"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  User,
  Calendar,
  HeartPulse,
  MapPin,
  Loader2,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

type PatientProfile = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
};

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  address: "",
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export default function PatientProfilePage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patient/profile");
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404 || data?.message === "Profile not found") {
          setProfile(null);
          setFormData(defaultForm);
          return;
        }
        throw new Error(data.message || "Unable to load profile");
      }

      const patient = data.patient ?? null;
      setProfile(patient);

      if (patient) {
        setFormData({
          name: patient.name || "",
          email: patient.email || "",
          phone: patient.phone || "",
          gender: patient.gender || "",
          dateOfBirth: toDateInputValue(patient.dateOfBirth),
          bloodGroup: patient.bloodGroup || "",
          address: patient.address || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Unable to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      const method = profile ? "PUT" : "POST";
      const res = await fetch("/api/patient/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Profile save failed");
      }

      setProfile(data.patient);
      setIsEditing(false);
      toast.success(
        profile
          ? "Profile updated successfully."
          : "Profile created successfully.",
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Profile save failed",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile && !isEditing) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-cyan-600 to-sky-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Create Profile</h1>
          <p className="mt-2 text-cyan-100">
            Add your personal health information to start managing appointments.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 md:p-8">
          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={saving}
            isEditing={false}
          />
        </div>
      </div>
    );
  }

  if (profile && !isEditing) {
    return (
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100 text-2xl font-bold text-cyan-700">
                {profile.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">
                  Patient profile
                </p>
                <h1 className="text-3xl font-bold text-slate-900">
                  {profile.name}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: profile.name || "",
                  email: profile.email || "",
                  phone: profile.phone || "",
                  gender: profile.gender || "",
                  dateOfBirth: toDateInputValue(profile.dateOfBirth),
                  bloodGroup: profile.bloodGroup || "",
                  address: profile.address || "",
                });
                setIsEditing(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard label="Email" value={profile.email} />
            <InfoCard label="Phone" value={profile.phone} />
            <InfoCard label="Gender" value={profile.gender} />
            <InfoCard
              label="Date of Birth"
              value={
                profile.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN")
                  : "Not provided"
              }
            />
            <InfoCard
              label="Blood Group"
              value={profile.bloodGroup || "Not provided"}
            />
            <InfoCard
              label="Address"
              value={profile.address || "Not provided"}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-700">
            Update profile
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {profile ? "Edit Profile" : "Create Profile"}
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700">
          <ShieldCheck size={16} />
          Saved securely
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 md:p-8">
        <ProfileForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSaving={saving}
          isEditing={profile ? true : false}
        />
      </div>
    </div>
  );
}

function ProfileForm({
  formData,
  onChange,
  onSubmit,
  isSaving,
  isEditing,
}: {
  formData: typeof defaultForm;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSaving: boolean;
  isEditing: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          Personal Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={onChange}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          Health Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={onChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Gender
            </label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={onChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Date Of Birth
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={onChange}
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Blood Group
            </label>
            <div className="relative">
              <HeartPulse
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={onChange}
                placeholder="B+, O+, AB-"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Address
        </label>
        <div className="relative">
          <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
          <textarea
            rows={4}
            name="address"
            required
            value={formData.address}
            onChange={onChange}
            placeholder="Enter your address"
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}

        <button
          disabled={isSaving}
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-70"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Profile"}
        </button>
      </div>
    </form>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Check, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const dayLabels: Record<(typeof days)[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const availabilityDay = z
  .object({
    available: z.boolean(),
    start: z.string(),
    end: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.available && !value.start)
      ctx.addIssue({
        code: "custom",
        path: ["start"],
        message: "Start time is required",
      });
    if (value.available && !value.end)
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: "End time is required",
      });
    if (value.available && value.start && value.end && value.start >= value.end)
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: "End time must be after start time",
      });
  });

const profileSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    image: z.string().url("Upload a valid profile image").or(z.literal("")),
    gender: z.enum(["Male", "Female", "Other"]),
    dob: z.string().min(1, "Date of birth is required"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
    specialization: z.string().trim().min(1, "Specialization is required"),
    degree: z.string().trim().min(1, "Degree is required"),
    experience: z.coerce.number().min(0, "Experience cannot be negative"),
    licenseNumber: z.string().trim().min(1, "License number is required"),
    languages: z
      .array(z.string().trim().min(1))
      .min(1, "Add at least one language"),
    consultationFee: z.coerce.number().min(0, "Fee cannot be negative"),
    consultationMode: z.enum(["Clinic", "Online", "Both"]),
    bio: z.string().trim().min(1, "Bio is required"),
    clinic: z.object({
      name: z.string(),
      images: z.array(z.string().url()),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      landmark: z.string(),
      phone: z.string(),
      mapLink: z.string().url("Enter a valid map link").or(z.literal("")),
      coordinates: z.object({
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
      }),
    }),
    availability: z.object(
      Object.fromEntries(days.map((day) => [day, availabilityDay])) as Record<
        (typeof days)[number],
        typeof availabilityDay
      >,
    ),
  })
  .superRefine((value, ctx) => {
    if (value.consultationMode !== "Online") {
      for (const [field, label] of [
        ["name", "Clinic name"],
        ["address", "Address"],
        ["city", "City"],
        ["state", "State"],
        ["pincode", "Pincode"],
        ["phone", "Clinic phone"],
      ] as const) {
        if (!value.clinic[field].trim())
          ctx.addIssue({
            code: "custom",
            path: ["clinic", field],
            message: `${label} is required`,
          });
      }
    }
  });

type ProfileForm = z.infer<typeof profileSchema>;
type ProfileFormInput = z.input<typeof profileSchema>;
type ExistingDoctor = Partial<ProfileForm> & {
  clinic?: Partial<ProfileForm["clinic"]>;
  availability?: Partial<ProfileForm["availability"]>;
  profileCompleted?: boolean;
  status?: "pending" | "approved" | "rejected";
};

type Props = { mode: "create" | "edit" };

const emptyDay = (available = false) => ({
  available,
  start: available ? "09:00" : "",
  end: available ? "17:00" : "",
});
const defaults: ProfileForm = {
  name: "",
  image: "",
  gender: "Male",
  dob: "",
  phone: "",
  specialization: "",
  degree: "",
  experience: 0,
  licenseNumber: "",
  languages: [],
  consultationFee: 0,
  consultationMode: "Clinic",
  bio: "",
  clinic: {
    name: "",
    images: [],
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    phone: "",
    mapLink: "",
    coordinates: { latitude: 0, longitude: 0 },
  },
  availability: {
    monday: emptyDay(true),
    tuesday: emptyDay(true),
    wednesday: emptyDay(true),
    thursday: emptyDay(true),
    friday: emptyDay(true),
    saturday: emptyDay(),
    sunday: emptyDay(),
  },
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="mb-5 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";

export default function DoctorProfileForm({ mode }: Props) {
  const router = useRouter();
  const [formMode, setFormMode] = useState(mode);
  const [initializing, setInitializing] = useState(true);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [uploading, setUploading] = useState<"image" | "clinic" | null>(null);
  const {
    register,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInput, unknown, ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });
  const image = watch("image");
  const clinicImages = watch("clinic.images");
  const consultationMode = watch("consultationMode");

  useEffect(() => {
    setInitializing(true);
    fetch("/api/doctor/profile")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.doctor)
          throw new Error(data.message || "Unable to load profile");
        const doctor: ExistingDoctor = data.doctor;
        if (doctor.status && doctor.status !== "approved")
          throw new Error("Your doctor account must be approved first");

        const shouldEdit = mode === "edit" || doctor.profileCompleted === true;
        setFormMode(shouldEdit ? "edit" : "create");
        if (shouldEdit) {
          reset({
            ...defaults,
            ...doctor,
            dob: doctor.dob
              ? new Date(doctor.dob).toISOString().slice(0, 10)
              : "",
            languages: doctor.languages || [],
            clinic: {
              ...defaults.clinic,
              ...doctor.clinic,
              images: doctor.clinic?.images || [],
              coordinates: {
                ...defaults.clinic.coordinates,
                ...doctor.clinic?.coordinates,
              },
            },
            availability: {
              ...defaults.availability,
              ...doctor.availability,
            },
          } as ProfileForm);
        }
      })
      .catch((error) =>
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Unable to load profile",
        }),
      )
      .finally(() => setInitializing(false));
  }, [mode, reset]);

  const upload = async (file: File, kind: "image" | "clinic") => {
    setUploading(kind);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/doctor/profile/upload", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Image upload failed");
      if (kind === "image")
        setValue("image", data.url, { shouldValidate: true });
      else
        setValue("clinic.images", [...(clinicImages || []), data.url], {
          shouldValidate: true,
        });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Image upload failed",
      });
    } finally {
      setUploading(null);
    }
  };

  const submit = async (values: ProfileForm) => {
    setMessage(null);
    const response = await fetch("/api/doctor/profile", {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage({
        type: "error",
        text: data.message || "Unable to save profile",
      });
      return;
    }
    setMessage({
      type: "success",
      text: data.message || "Profile saved successfully",
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push("/dashboard/doctor/profile");
    router.refresh();
  };

  if (initializing)
    return (
      <div className="mx-auto max-w-5xl animate-pulse p-6">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-6 h-96 rounded-2xl bg-slate-200" />
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-700">
          Doctor profile
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          {formMode === "create" ? "Complete your profile" : "Edit your profile"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Keep your professional details current so patients know how to reach
          you.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <Section title="1. Personal information">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Profile image
              </label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-cyan-50 text-cyan-700">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera />
                  )}
                </div>
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    {uploading === "image" ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Upload size={16} />
                    )}{" "}
                    Upload image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={!!uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(file, "image");
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {image && (
                    <button
                      type="button"
                      className="ml-3 text-sm text-red-600"
                      onClick={() => setValue("image", "")}
                    >
                      Remove
                    </button>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    JPG, PNG or WebP, up to 5 MB
                  </p>
                </div>
              </div>
              <FieldError message={errors.image?.message} />
            </div>
            <label className="space-y-2 text-sm font-medium">
              Full name
              <input className={inputClass} {...register("name")} />
              <FieldError message={errors.name?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Gender
              <select className={inputClass} {...register("gender")}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Date of birth
              <input type="date" className={inputClass} {...register("dob")} />
              <FieldError message={errors.dob?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Phone number
              <input
                className={inputClass}
                inputMode="numeric"
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </label>
          </div>
        </Section>
        <Section title="2. Professional information">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Specialization
              <input className={inputClass} {...register("specialization")} />
              <FieldError message={errors.specialization?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Degree
              <input className={inputClass} {...register("degree")} />
              <FieldError message={errors.degree?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Years of experience
              <input
                type="number"
                min="0"
                className={inputClass}
                {...register("experience")}
              />
              <FieldError message={errors.experience?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Medical license number
              <input className={inputClass} {...register("licenseNumber")} />
              <FieldError message={errors.licenseNumber?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Languages{" "}
              <span className="font-normal text-slate-500">
                (comma separated)
              </span>
              <input
                className={inputClass}
                value={(watch("languages") || []).join(", ")}
                onChange={(event) =>
                  setValue(
                    "languages",
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                    { shouldValidate: true },
                  )
                }
                placeholder="English, Hindi"
              />
              <FieldError message={errors.languages?.message} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Consultation fee (INR)
              <input
                type="number"
                min="0"
                className={inputClass}
                {...register("consultationFee")}
              />
              <FieldError message={errors.consultationFee?.message} />
            </label>
            <fieldset className="space-y-2 text-sm font-medium md:col-span-2">
              <legend>Consultation mode</legend>
              <div className="flex flex-wrap gap-3">
                {["Clinic", "Online", "Both"].map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2"
                  >
                    <input
                      type="radio"
                      value={option}
                      {...register("consultationMode")}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Professional bio
              <textarea rows={5} className={inputClass} {...register("bio")} />
              <FieldError message={errors.bio?.message} />
            </label>
          </div>
        </Section>
        <Section title="3. Clinic information">
          <div className="grid gap-5 md:grid-cols-2">
            {(
              [
                ["name", "Clinic name"],
                ["address", "Address"],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
                ["phone", "Clinic phone"],
                ["landmark", "Landmark"],
                ["mapLink", "Google Maps link"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="space-y-2 text-sm font-medium">
                <span>
                  {label}
                  {consultationMode === "Online" &&
                  [
                    "name",
                    "address",
                    "city",
                    "state",
                    "pincode",
                    "phone",
                  ].includes(field) ? (
                    <span className="font-normal text-slate-400">
                      {" "}
                      (optional)
                    </span>
                  ) : null}
                </span>
                <input
                  className={inputClass}
                  {...register(`clinic.${field}`)}
                />
                <FieldError message={errors.clinic?.[field]?.message} />
              </label>
            ))}
            <label className="space-y-2 text-sm font-medium">
              Latitude
              <input
                type="number"
                step="any"
                className={inputClass}
                {...register("clinic.coordinates.latitude")}
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Longitude
              <input
                type="number"
                step="any"
                className={inputClass}
                {...register("clinic.coordinates.longitude")}
              />
            </label>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Clinic images
              </label>
              <div className="flex flex-wrap gap-3">
                {(clinicImages || []).map((url, index) => (
                  <div
                    key={url}
                    className="relative h-24 w-24 overflow-hidden rounded-lg"
                  >
                    <img
                      src={url}
                      alt={`Clinic ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove clinic image"
                      className="absolute right-1 top-1 rounded bg-white p-1 text-red-600"
                      onClick={() =>
                        setValue(
                          "clinic.images",
                          (clinicImages || []).filter(
                            (_, imageIndex) => imageIndex !== index,
                          ),
                        )
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-xs text-slate-500">
                  {uploading === "clinic" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus />
                  )}{" "}
                  Add image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={!!uploading}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(file, "clinic");
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </Section>
        <Section title="4. Weekly availability">
          <div className="space-y-3">
            {days.map((day) => {
              const available = watch(`availability.${day}.available`);
              return (
                <div
                  key={day}
                  className="grid items-center gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[9rem_8rem_1fr_1fr]"
                >
                  <span className="font-medium">{dayLabels[day]}</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      {...register(`availability.${day}.available`)}
                    />{" "}
                    Available
                  </label>
                  {available ? (
                    <>
                      <label className="text-sm text-slate-600">
                        Start
                        <input
                          type="time"
                          className={inputClass}
                          {...register(`availability.${day}.start`)}
                        />
                        <FieldError
                          message={errors.availability?.[day]?.start?.message}
                        />
                      </label>
                      <label className="text-sm text-slate-600">
                        End
                        <input
                          type="time"
                          className={inputClass}
                          {...register(`availability.${day}.end`)}
                        />
                        <FieldError
                          message={errors.availability?.[day]?.end?.message}
                        />
                      </label>
                    </>
                  ) : (
                    <span className="text-sm text-slate-500">Day off</span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
        {message && (
          <div
            role="alert"
            className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
          >
            {message.text}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !!uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-6 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={17} />
            ) : (
              <Check size={17} />
            )}
            {isSubmitting
              ? "Saving..."
              : formMode === "create"
                ? "Create profile"
                : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

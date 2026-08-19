import mongoose, { Schema, models } from "mongoose";

const DoctorSchema = new Schema(
  {
    // USER
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // PERSONAL
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dob: {
      type: Date,
    },

    phone: {
      type: String,
      match: /^[6-9]\d{9}$/,
    },

    // ===========================
    // PROFESSIONAL
    // ===========================
    specialization: {
      type: String,
      required: true,
      index: true,
    },

    degree: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    languages: [
      {
        type: String,
      },
    ],

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    consultationMode: {
      type: String,
      enum: ["Clinic", "Online", "Both"],
      default: "Clinic",
    },

    bio: {
      type: String,
      required: true,
    },

    // ===========================
    // CLINIC
    // ===========================
    clinic: {
      name: String,

      images: [
        {
          type: String,
        },
      ],

      address: String,

      city: {
        type: String,
        index: true,
      },

      state: String,

      pincode: String,

      landmark: String,

      phone: String,

      mapLink: String,

      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // ===========================
    // AVAILABILITY
    // ===========================
    availability: {
      monday: {
        available: {
          type: Boolean,
          default: true,
        },
        start: String,
        end: String,
      },

      tuesday: {
        available: {
          type: Boolean,
          default: true,
        },
        start: String,
        end: String,
      },

      wednesday: {
        available: {
          type: Boolean,
          default: true,
        },
        start: String,
        end: String,
      },

      thursday: {
        available: {
          type: Boolean,
          default: true,
        },
        start: String,
        end: String,
      },

      friday: {
        available: {
          type: Boolean,
          default: true,
        },
        start: String,
        end: String,
      },

      saturday: {
        available: {
          type: Boolean,
          default: true,
        },
        start: String,
        end: String,
      },

      sunday: {
        available: {
          type: Boolean,
          default: false,
        },
        start: String,
        end: String,
      },
    },

    // ===========================
    // DASHBOARD STATS
    // ===========================
    totalAppointments: {
      type: Number,
      default: 0,
    },

    totalPatients: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    // ===========================
    // ADMIN
    // ===========================
    verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Doctor || mongoose.model("Doctor", DoctorSchema);

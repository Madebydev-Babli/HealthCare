import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
  },

  // Doctor Profile Fields
  profile: {
    name: String,
    image: String,
    fieldOfMedical: String,
    experience: Number, // years
    licenseNumber: String,
    degree: String,
    appointmentDetails: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  profileStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

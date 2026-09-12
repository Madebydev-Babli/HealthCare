import mongoose, { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      indexed: true,
    },

    recipientRole: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["appointment", "payment", "doctor", "profile", "system"],
      required: true,
    },

    relatedId: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      indexed: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      indexed: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Composite index for efficient queries
NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, createdAt: -1 });

const Notification =
  models.Notification || model("Notification", NotificationSchema);

export default Notification;

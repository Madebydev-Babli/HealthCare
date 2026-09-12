"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle2, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type NotificationType =
  | "appointment"
  | "payment"
  | "doctor"
  | "profile"
  | "system";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<NotificationType | "all">(
    "all",
  );
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=1000");
      const data = await res.json();

      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const typeMatch = selectedType === "all" || n.type === selectedType;
      const readMatch = !unreadOnly || !n.isRead;
      return typeMatch && readMatch;
    });
  }, [notifications, selectedType, unreadOnly]);

  // Mark as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Handle notification click to navigate
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.type === "appointment" && notification.relatedId) {
      if (session?.user.role === "patient") {
        router.push("/dashboard/patient/appointments");
      } else if (session?.user.role === "doctor") {
        router.push("/dashboard/doctor/appointments");
      } else if (session?.user.role === "admin") {
        router.push("/dashboard/admin/appointments");
      }
    } else if (notification.type === "doctor" && notification.relatedId) {
      router.push("/dashboard/admin/doctors");
    } else if (notification.type === "profile") {
      router.push("/dashboard/doctor/profile");
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  // Get icon based on type
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "appointment":
        return "📅";
      case "payment":
        return "💳";
      case "doctor":
        return "👨‍⚕️";
      case "profile":
        return "👤";
      default:
        return "ℹ️";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const typeOptions: (NotificationType | "all")[] = [
    "all",
    "appointment",
    "payment",
    "doctor",
    "profile",
    "system",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href={
                session?.user.role === "admin"
                  ? "/dashboard/admin"
                  : session?.user.role === "doctor"
                    ? "/dashboard/doctor"
                    : "/dashboard/patient"
              }
              className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-600">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "You're all caught up!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedType === type
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Read/Unread Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                unreadOnly
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50"
              }`}
            >
              Unread
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-full px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-all"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="mt-4 text-slate-600">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16">
            <Bell size={48} className="mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-900">
              No notifications
            </p>
            <p className="text-sm text-slate-600">
              {selectedType !== "all"
                ? `No ${selectedType} notifications`
                : unreadOnly
                  ? "All caught up! No unread notifications"
                  : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notif) => (
              <div
                key={notif._id}
                className={`rounded-2xl border transition-all duration-200 ${
                  !notif.isRead
                    ? "border-cyan-200 bg-cyan-50/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className="flex cursor-pointer items-start gap-4 p-6"
                  onClick={() => handleNotificationClick(notif)}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 text-3xl">
                    {getTypeIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900">
                          {notif.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {notif.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>

                      {/* Read indicator */}
                      {!notif.isRead && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-3 w-3 rounded-full bg-cyan-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-slate-100 px-6 py-3">
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif._id);
                      }}
                      className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                    >
                      <CheckCircle2 size={16} />
                      Mark as read
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    className="ml-auto flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

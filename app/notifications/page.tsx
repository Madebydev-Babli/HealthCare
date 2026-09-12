"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";
import Link from "next/link";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "appointment" | "payment" | "doctor" | "profile" | "system";
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "unread" | "appointment" | "payment" | "doctor" | "profile" | "system"
  >("all");

  const filters = [
    { value: "all" as const, label: "All" },
    { value: "unread" as const, label: "Unread" },
    { value: "appointment" as const, label: "Appointment" },
    { value: "payment" as const, label: "Payment" },
    { value: "doctor" as const, label: "Doctor" },
    { value: "profile" as const, label: "Profile" },
    { value: "system" as const, label: "System" },
  ];

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let url = "/api/notifications?limit=100";

      if (selectedFilter === "unread") {
        url += "&unread=true";
      } else if (selectedFilter !== "all") {
        url += `&type=${selectedFilter}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Fetch notifications on mount and filter change
  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session, selectedFilter]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
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

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true })),
      );
      setUnreadCount(0);
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

      const deletedNotif = notifications.find((n) => n._id === notificationId);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setNotifications((prev) =>
        prev.filter((n) => n._id !== notificationId),
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
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
  const getTypeIcon = (type: string) => {
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

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-50 text-blue-700";
      case "payment":
        return "bg-green-50 text-green-700";
      case "doctor":
        return "bg-purple-50 text-purple-700";
      case "profile":
        return "bg-cyan-50 text-cyan-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-slate-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-2">
                <Bell size={24} className="text-cyan-600" />
              </div>
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

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedFilter === filter.value
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-500">
                Loading notifications...
              </div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <Bell size={48} className="mb-3 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900">
              No notifications
            </h3>
            <p className="mt-1 text-slate-600">
              {selectedFilter === "unread"
                ? "No unread notifications yet"
                : `No ${selectedFilter} notifications yet`}
            </p>
            {selectedFilter !== "all" && (
              <button
                onClick={() => setSelectedFilter("all")}
                className="mt-4 text-cyan-600 hover:text-cyan-700 font-medium text-sm"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`rounded-xl border transition-all ${
                  notif.isRead
                    ? "border-slate-200 bg-white"
                    : "border-cyan-200 bg-cyan-50"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0 pt-1">
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {notif.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {notif.message}
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <span
                              className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getTypeBadgeColor(
                                notif.type,
                              )}`}
                            >
                              {notif.type}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatTime(notif.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notif.isRead && (
                            <div className="h-3 w-3 rounded-full bg-cyan-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif._id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700"
                          >
                            <CheckCircle2 size={14} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif._id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

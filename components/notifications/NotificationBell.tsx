"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "appointment" | "payment" | "doctor" | "profile" | "system";
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=10");
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

  // Fetch on mount and set up refresh interval
  useEffect(() => {
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Mark single notification as read
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
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === "appointment" && notification.relatedId) {
      router.push(`/dashboard/appointments`);
    } else if (notification.type === "doctor" && notification.relatedId) {
      router.push(`/dashboard/admin/doctors`);
    } else if (notification.type === "profile" && notification.relatedId) {
      router.push(`/dashboard/doctor/profile`);
    }

    setIsOpen(false);
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-lg p-2 text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/20">
          {/* Header */}
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-slate-500">Loading...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell size={32} className="mb-2 text-slate-300" />
                <p className="text-sm font-medium text-slate-900">
                  No notifications yet
                </p>
                <p className="text-xs text-slate-500">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`border-b border-slate-100 px-4 py-3 transition-colors duration-200 hover:bg-slate-50 ${
                    !notif.isRead ? "bg-cyan-50/30" : ""
                  }`}
                >
                  <div
                    onClick={() => handleNotificationClick(notif)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <span className="text-lg">
                          {getTypeIcon(notif.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {notif.title}
                          </h4>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatTime(notif.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {!notif.isRead && (
                          <div className="h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2">
                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif._id);
                        }}
                        className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-3">
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-sm font-medium text-cyan-600 hover:text-cyan-700"
              >
                View all notifications
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
